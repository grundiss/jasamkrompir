# AGENTS.md

Guidance for AI assistants working in this repo. Keep this file current when you
change architecture, workflows, or conventions.

## What this is

**JaSamKrompir** is a single-user desktop app built around a specific idea: a
**rarely-updated desktop shell + automatically delivered content**. The shell is
stable infrastructure shipped as an Electron binary; the actual app (frontend +
backend + migrations) is delivered as **signed content bundles** that update
over-the-air, without re-shipping the binary.

> **Content status: "Hello World".** The real content model has not been
> designed yet. Today the content is a single placeholder — a `greetings` table,
> a `GET /api/hello` endpoint, and a page that renders "Hello World!". The whole
> data stack is deliberately kept wired end-to-end (see "Content placeholder"
> below) so that when the real content arrives it slots into a proven pipeline.
> There is exactly one user (the owner), so there is **no auth, no
> multi-tenancy, and no security layer** at the application level — do not add
> them unless asked. (This is separate from the content-update _trust_ boundary,
> which is load-bearing and must not be weakened — see Security rules.)

## Stack & layout

TypeScript monorepo (Yarn workspaces). Four packages under `packages/`:

| Package    | Name                    | Role                                                        |
| ---------- | ----------------------- | ----------------------------------------------------------- |
| `shared/`  | `@jasamkrompir/shared`  | DTOs/types shared by api + web. Built to `dist/` (watched). |
| `api/`     | `@jasamkrompir/api`     | Fastify server + Drizzle schema/migrations.                 |
| `web/`     | `@jasamkrompir/web`     | React 19 + Vite + Tailwind v4 frontend.                     |
| `desktop/` | `@jasamkrompir/desktop` | Static Electron **shell** that runs signed content bundles. |

Dev runs in Docker Compose (postgres + shared + api + web) with hot reload. The
**desktop build** is a separate target: a thin, static Electron shell that loads
the active **content bundle** (frontend + backend + migrations) from `userData`,
serves the SPA over a custom `app://` protocol, runs the backend on a loopback
port, and swaps Postgres for **PGlite** (embedded WASM Postgres) under `userData`.
Frontend/backend/migration changes ship as **content updates**, not new app
binaries — see the section below and
[`packages/desktop/docs/CONTENT_UPDATES.md`](packages/desktop/docs/CONTENT_UPDATES.md).

## Two DB drivers, one app

The API is driver-agnostic. `buildApp({ db, ... })`
([`src/app.ts`](packages/api/src/app.ts)) decorates the injected Drizzle db onto
Fastify, so routes use **`app.db`** — never a module singleton. Concrete drivers:
`createPostgresDb` ([`src/db/postgres.ts`](packages/api/src/db/postgres.ts), dev/server)
and `createPgliteDb` ([`src/db/pglite.ts`](packages/api/src/db/pglite.ts), desktop).
Both speak the `pg-core` dialect, so queries and the `drizzle/` migrations are
identical across them. `startServer()` ([`src/server.ts`](packages/api/src/server.ts))
listens and resolves the real bound port (the desktop binds `port: 0`).
[`src/index.ts`](packages/api/src/index.ts) is the standalone (Postgres) entry.

## Desktop shell & content updates (read before touching `desktop/`)

The desktop app is a **static Electron shell** that runs **signed content
bundles**. The shell is stable infrastructure; app features live in bundles and
update independently. There is **no paid dev license, no paid code signing, and
no persistent server** — the updater pulls from a static source (GitHub Releases
by default).

**The shell ↔ content split (this is the load-bearing idea):**

- **Shell** (`packages/desktop/src/main.ts`, `src/shell/*`, `src/preload.ts`,
  bundled into the `.app`): the updater, the `app://` protocol, the PGlite driver
  and the drizzle migration **runner**, the BrowserWindow, and the **bundled
  ed25519 public key** (`src/shell/content-public-key.ts`) — the static trust root.
- **Content bundle** (`web/` + `server/index.mjs` + `drizzle/` + `bundle.json`):
  the React build, the backend code, and the migration **SQL**. Built by
  `scripts/build-content.mjs`; the same files are shipped inside the app as the
  **seed** (`content-seed/`, via electron-builder `extraResources`) to bootstrap
  first launch.

**Runtime wiring** (`src/shell/`):

- `content-store.ts` — on-disk layout under `userData/content/`: `<version>/`
  dirs, the atomically-swapped `current` symlink, `state.json`
  (`active`/`previous`/`knownGood`/`bad`), seed bootstrap, rollback target
  selection, pruning. `state.json` is the authoritative record (written last,
  atomically); the symlink mirrors it.
- `runtime.ts` — owns the PGlite DB (persists across updates) and the backend.
  The backend's **code** comes from the active bundle, loaded via dynamic
  `import()` — the **only** place the shell runs bundle-provided code, and only
  after verification. DB driver + migrator stay in the shell.
- `protocol.ts` — the privileged `app://jasamkrompir.app` scheme that serves the active
  bundle's `web/` (SPA fallback to `index.html`), with a strict CSP.
- `updater.ts` — the two-phase flow (see CONTENT_UPDATES.md): **acquire** (check
  → download → verify SHA-256 + signature → extract → promote; failures never
  touch the running app) then **activate** (stop → snapshot DB → atomic switch →
  migrate → restart → recreate window; any failure rolls back to the last
  known-good version and restores the DB snapshot).
- `verify.ts` — the trust boundary: ed25519 manifest signature + SHA-256 archive
  hash. `canonicalize()` here MUST match `scripts/pack-content.mjs` byte-for-byte.

**Renderer ↔ shell:** the renderer loads from `app://` and reaches the backend at
the loopback URL injected by the preload as `window.jasamkrompir.apiBaseUrl` (read in
`web/src/lib/api.ts`). CORS on the backend is restricted to the `app://` origin.
Update status reaches the UI via `window.jasamkrompir.onUpdateStatus`
(`web/src/components/UpdateNotice.tsx`). Updates are **automatic**; the UI only
informs.

### Security rules (do not weaken)

- `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`. The
  preload (`src/preload.ts`) is the ONLY renderer↔main bridge — keep it tiny; do
  not expose Node, `fs`, or generic IPC.
- Nothing downloaded runs until BOTH the manifest signature (against the bundled
  public key) AND the archive SHA-256 verify. Never bypass `verify.ts` or relax
  the order in `updater.ts`.
- The public key is the static trust root. Rotating it is a shell change
  (`yarn gen:keys --force` + new app build). The private key
  (`packages/desktop/keys/`) is a secret — gitignored, never committed. In CI it
  lives as the `CONTENT_PRIVATE_KEY_PEM` secret.
- Keep the `app://` CSP strict; the renderer must never load remote code.

### Conventions for changing each layer

- **Frontend / backend / migrations** → these are **content**. Make the change in
  `web/` / `api/` (incl. `schema.ts` + `yarn db:generate`), bump
  `packages/desktop/package.json` `version`, then `yarn content:release` (or test
  locally first, below). You do **not** rebuild the shell for these.
- **The shell itself** (updater, protocol, runtime, preload, Electron version,
  public key) → this is a real app release: rebuild + re-ship the `.app`
  (`yarn desktop:dist`), and bump `minShellVersion` on any future bundle that
  depends on the new shell behaviour.
- **The backend↔shell contract** (`src/content/server-entry.ts` `start()` and
  `BundleMeta`) is versioned by `bundle.json.schemaVersion` + `minShellVersion`.
  Changing it incompatibly means a shell release and a `minShellVersion` bump.
- Migrations are forward-only and must be safe to run against existing user data
  (the updater snapshots the DB before migrating and restores on failure, but a
  destructive migration that "succeeds" is still destructive).

### Desktop commands

```bash
yarn gen:keys                  # one-time: ed25519 keypair (public key -> shell)
yarn desktop:dev               # build shell + seed bundle, launch Electron
yarn desktop:dist              # package the .app/.dmg/.zip (the static shell)
yarn content:build             # assemble a content bundle (+ refresh the seed)
yarn content:pack              # tar + SHA-256 + sign -> content-dist/manifest.json
yarn content:publish           # upload to the `content-latest` GitHub Release
yarn content:release           # build + pack + publish in one shot
yarn content:serve             # serve content-dist/ locally to test updates
```

## Content placeholder (the "Hello World" layer)

The content is intentionally minimal but wired **end-to-end**, so every
technology in the stack is exercised before the real content exists. When you
build the real content, replace these in place — the architecture around them
does not change.

- **Schema** — one table in
  [`packages/api/src/db/schema.ts`](packages/api/src/db/schema.ts): `greetings`
  (`id`, `text`, `createdAt`). Change it, then `yarn db:generate` to produce a
  migration in `packages/api/drizzle/`.
- **API** — [`packages/api/src/routes/hello.ts`](packages/api/src/routes/hello.ts):
  `GET /api/hello` reads the first `greetings` row (seeding `"Hello World!"` on
  first call) and returns `{ message }`. Registered in
  [`src/app.ts`](packages/api/src/app.ts) via `app.register(helloRoutes)`.
- **Shared DTOs** — [`packages/shared/src/index.ts`](packages/shared/src/index.ts):
  `Greeting`, `HelloResponse` (plus `HealthResponse`, `ApiError`). **Dates cross
  the wire as ISO strings.**
- **Web** — [`src/App.tsx`](packages/web/src/App.tsx) fetches `/api/hello` via the
  typed client in [`src/lib/api.ts`](packages/web/src/lib/api.ts) and renders the
  message. [`src/components/UpdateNotice.tsx`](packages/web/src/components/UpdateNotice.tsx)
  (fed by the shell bridge in [`src/lib/jasamkrompir.ts`](packages/web/src/lib/jasamkrompir.ts))
  is **shell integration, not content** — keep it.

## HTTP API

Base URL `http://localhost:3000` (dev) or the loopback URL injected by the shell
(desktop). JSON in/out. Errors are `{ error, message }` with an appropriate status.

| Method | Path         | Notes                                                       |
| ------ | ------------ | ----------------------------------------------------------- |
| GET    | `/health`    | Liveness: `{ status: 'ok', timestamp }`.                    |
| GET    | `/api/hello` | Placeholder content: `{ message }` (seeds a greeting once). |

## Conventions

- **Types flow through `@jasamkrompir/shared`.** Don't redeclare DTOs in api/web;
  import them. Drizzle row types (`$inferSelect`) stay in the api and are mapped
  to the shared serializable DTOs at the route boundary.
- ESM throughout; intra-package imports use explicit `.js` extensions
  (`./routes/hello.js`) per the TS/ESM setup.
- Desktop-first UI: prefer spacious multi-column layouts, sidebar navigation, and
  scannable tables/lists over mobile-first constraints.
- Formatting is Prettier (Husky pre-commit runs lint-staged). Run
  `yarn format` / `yarn typecheck` before finishing.
- **Desktop changes are content, not shell changes** unless you're touching the
  updater/protocol/runtime/preload itself. See the desktop section above for the
  rules and the release vs. content-update distinction.

## Workflows

```bash
yarn install                       # host deps (Husky, db tooling, typecheck)
yarn dev                           # docker compose up: postgres + shared + api + web
yarn db:generate && yarn db:migrate  # after any schema.ts change
yarn typecheck                     # all workspaces
yarn build                         # shared -> api -> web
yarn build:desktop                 # + shell bundle + content/seed bundle
```

- **API**: http://localhost:3000 (`GET /health`). **Web**: http://localhost:5173.
- `db:*` scripts run on the **host** against the Compose Postgres (port 5432
  published), so the stack must be `up` first.

## Gotchas (read before debugging)

- **Dependency changes need fresh anon volumes.** The dev images bake
  `node_modules`, and Compose masks them with **anonymous volumes** that persist
  across `up`. After editing any `package.json`, run
  `docker compose up -d --build -V` (the `-V` renews anon volumes) — otherwise
  containers keep stale deps and you'll see "Failed to resolve import …".
- **`drizzle.config.ts` uses `process.cwd()`**, not `import.meta.dirname`. The
  latter is empty under drizzle-kit's CJS bundling and breaks `db:generate`.
  drizzle-kit runs from the `api` package dir, so the root `.env` is at `../../`.
- **Schema changes require a migration.** Edit `schema.ts`, then
  `yarn db:generate` (creates a file in `packages/api/drizzle/`) and
  `yarn db:migrate`. Don't hand-edit generated SQL.
- After changing `@jasamkrompir/shared`, the `shared` watcher rebuilds `dist/`; if you
  run pieces outside Docker, build it first (`yarn workspace @jasamkrompir/shared build`).
- **`canonicalize()` must match across the boundary.** The signer
  (`packages/desktop/scripts/pack-content.mjs`) and the verifier
  (`packages/desktop/src/shell/verify.ts`) build the signed bytes the same way; if
  they drift, every manifest fails to verify. Keep them identical.
- **The seed is a build artifact.** `content-seed/` is regenerated by
  `yarn content:build` from the current `web`/`api` builds and shipped via
  `extraResources`. It's gitignored — rebuild it before `yarn desktop:dist`
  (`yarn build:desktop` does this for you).

## Verifying changes

Prefer driving the running app over manual checks. The stack exposes the API on
:3000 and web on :5173. Quick API smoke test:

```bash
curl -s localhost:3000/health          # {"status":"ok",...}
curl -s localhost:3000/api/hello        # {"message":"Hello World!"}
```

For UI changes, load http://localhost:5173 and confirm the page renders the
message from `/api/hello`.

To verify the **content updater** end-to-end (no publishing needed), follow the
"Testing update + rollback locally" recipe in
[`packages/desktop/docs/CONTENT_UPDATES.md`](packages/desktop/docs/CONTENT_UPDATES.md):
build the current content as the seed, build+pack a bumped `CONTENT_VERSION`,
`yarn content:serve`, and launch with `JASAMKROMPIR_UPDATE_URL` pointed at it. Watch
`userData/logs/updater.log`.
