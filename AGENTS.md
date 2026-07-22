# AGENTS.md

Guidance for AI assistants working in this repo. Keep this file current when you
change architecture, workflows, or conventions.

## What this is

**JaSamKrompir** is a single-user desktop app built around a specific idea: a
**rarely-updated desktop shell + automatically delivered content**. The shell is
stable infrastructure shipped as an Electron binary; the actual app (frontend +
backend + migrations) is delivered as **signed content bundles** that update
over-the-air, without re-shipping the binary.

> **Content: a bilingual Serbian reader with interactive quests.** Each sidebar
> entry is one content item discriminated by `kind`:
>
> - **`text`** — a short Serbian passage with its Russian translation, split into
>   **paragraphs** aligned Serbian ↔ Russian.
> - **`quest`** — an interactive decision-based dialogue (scenes → reply choices →
>   other scenes or endings), with optional vocabulary review at the end.
>
> Content lives in the DB (`texts` plus kind-specific tables), is served by
> `GET /api/texts` (list) and `GET /api/texts/:id` (detail as a discriminated
> union), and the seed content ships in the bundle (see "Content model" below).
> Add more items by extending the seed and/or inserting rows — the surrounding
> pipeline does not change.
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

## Content model (texts + quests)

Each sidebar entry is one row in `texts`, discriminated by
`kind: 'text' | 'quest'`. Existing rows default to `text`. The content is wired
**end-to-end** through the same pipeline the shell + OTA updates rely on.

### Linear texts (`kind: 'text'`)

- **Schema** — [`packages/api/src/db/schema.ts`](packages/api/src/db/schema.ts):
  `texts` (`id`, `slug` unique, `kind`, `titleSr`, `titleRu`, `audioUrl` nullable,
  `position`, `createdAt`) and
  `paragraphs` (`id`, `textId` → `texts` cascade, `position`, `sr`, `ru`, unique on
  `(textId, position)`). After any change, `yarn db:generate` produces a migration
  in `packages/api/drizzle/`.
- **Audio (optional per text)** — a text may have a narration track. The bytes are
  **not** in the DB: the file ships as a web asset in
  [`packages/web/public/audio/`](packages/web/public/audio) (Vite serves it in dev,
  and it rides the web build into the content bundle, served over `app://`), and
  `texts.audioUrl` stores its root-relative URL (`/audio/<slug>.mp3`) or NULL. No
  CSP change is needed — `<audio>` falls back to `default-src 'self'`, which covers
  the `app://` origin. To add audio to a text: drop the file in `public/audio/`, set
  `audioUrl` in the seed (fresh installs), **and** add a migration that backfills the
  existing row — the seed is insert-only, so an already-shipped text (e.g. a desktop
  DB getting this as a content update) won't pick up the track from the seed alone
  (see [`drizzle/0002_bizarre_pride.sql`](packages/api/drizzle/0002_bizarre_pride.sql)).
  The player is [`web/src/components/AudioPlayer.tsx`](packages/web/src/components/AudioPlayer.tsx),
  shown by `Reader` when `audioUrl` is set. (The shell's `app://` MIME map now
  includes audio types — a correctness nicety in a future shell build; playback also
  works via media sniffing without it, so the feature ships as a content update.)

### Interactive quests (`kind: 'quest'`)

A quest is a branching dialogue exercise (no typing). The learner reads the
employee's Serbian line (with Russian per reading mode), picks a Serbian reply,
sees quality-tagged feedback (`best` / `acceptable` / `poor`), then Continues to
the choice's `nextSceneId` (another scene or an ending). Endings offer restart
and vocabulary review. Progress is session-only (not persisted).

- **Schema** (normalized, all cascade from `texts`):
  - `quests` — 1:1 metadata (`description*`, `intro*`, `objective*`, `startSceneId`)
  - `quest_scenes` — ordered scenes (`sceneId`, `phase*`, `employee*`, `promptRu`, …)
  - `quest_choices` — ordered replies per scene (`choiceId`, `quality`, `feedback*`,
    `nextSceneId`, …)
  - `quest_endings` — `success` / `partial` endings
  - `quest_vocabulary` — review terms with examples
- **Graph validation** — [`quest-validate.ts`](packages/api/src/content/quest-validate.ts)
  checks that `startSceneId` exists and every `nextSceneId` points at a scene or
  ending. Runs at seed module load and again when serving a quest detail.
- **Seed** — append to `seedQuests` in
  [`seed.ts`](packages/api/src/content/seed.ts) (or add a file under
  `content/quests/` and import it). `ensureSeeded` inserts by slug if missing —
  safe to re-run; does not update existing rows. Quests ship through the normal
  **content bundle** path (build → pack → publish); no shell release needed.
- **How to add another quest**: write the authoring JSON (same shape as
  `poziv-dostavnoj-sluzbi`), validate the graph locally, add it to `seedQuests`,
  bump `packages/desktop/package.json` `version`, then `yarn content:release`
  (or test with `yarn content:serve`). Do not delete or rewrite existing seed
  texts/quests in place for already-shipped DBs without a backfill migration.

### Shared plumbing

- **Seed** — [`packages/api/src/content/seed.ts`](packages/api/src/content/seed.ts):
  `seedTexts` + `seedQuests`; `ensureSeeded(db)` inserts any item whose `slug` is
  not present yet (idempotent).
- **API** — [`packages/api/src/routes/texts.ts`](packages/api/src/routes/texts.ts):
  `GET /api/texts` ensures the seed and returns summaries (including `kind`);
  `GET /api/texts/:id` returns `ContentDetail` (`TextDetail | QuestDetail`).
  Registered in [`src/app.ts`](packages/api/src/app.ts) via `app.register(textsRoutes)`.
- **Shared DTOs** — [`packages/shared/src/index.ts`](packages/shared/src/index.ts):
  `ContentKind`, `ContentSummary`, `TextDetail`, `QuestDetail`, `QuestScene`,
  `QuestChoice`, `QuestEnding`, `QuestVocabularyItem`, `LocalizedText`,
  `TextListResponse` (plus `HealthResponse`, `ApiError`). **Dates cross the wire
  as ISO strings.**
- **Web** — [`src/App.tsx`](packages/web/src/App.tsx) is the reader shell (sidebar
  list + reading pane; quests show a subtle «Квест» label).
  [`src/components/Reader.tsx`](packages/web/src/components/Reader.tsx) switches on
  `kind`: linear texts use paragraph views; quests use
  [`QuestPlayer`](packages/web/src/components/quest/QuestPlayer.tsx) and friends.
  Reading modes (`both` / `serbianOnly` / `reveal`) apply to quest copy too; the
  Russian task prompt (`promptRu`) stays visible even in `serbianOnly` because it
  tells the learner what to do. Mode lives in `App`; quest progress resets when
  another content item is selected.
  [`src/components/UpdateNotice.tsx`](packages/web/src/components/UpdateNotice.tsx)
  (fed by the shell bridge in [`src/lib/jasamkrompir.ts`](packages/web/src/lib/jasamkrompir.ts))
  is **shell integration, not content** — keep it.

## HTTP API

Base URL `http://localhost:3000` (dev) or the loopback URL injected by the shell
(desktop). JSON in/out. Errors are `{ error, message }` with an appropriate status.

| Method | Path             | Notes                                                                       |
| ------ | ---------------- | --------------------------------------------------------------------------- |
| GET    | `/health`        | Liveness: `{ status: 'ok', timestamp }`.                                    |
| GET    | `/api/texts`     | List of content summaries (`kind` + titles); ensures the seed on first hit. |
| GET    | `/api/texts/:id` | `TextDetail` or `QuestDetail` (discriminated by `kind`); 404 if absent.     |

## Conventions

- **Types flow through `@jasamkrompir/shared`.** Don't redeclare DTOs in api/web;
  import them. Drizzle row types (`$inferSelect`) stay in the api and are mapped
  to the shared serializable DTOs at the route boundary.
- ESM throughout; intra-package imports use explicit `.js` extensions
  (`./routes/texts.js`) per the TS/ESM setup.
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
yarn workspace @jasamkrompir/web test   # web unit/UI tests (Vitest + Testing Library)
yarn workspace @jasamkrompir/api test   # api route + seed-graph tests (Vitest + PGlite)
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
curl -s localhost:3000/health           # {"status":"ok",...}
curl -s localhost:3000/api/texts         # {"texts":[{"id":1,"slug":"ja-se-zovem-ivan",...}]}
curl -s localhost:3000/api/texts/1       # one text with its aligned paragraphs
```

For UI changes, load http://localhost:5173 and confirm the reader lists the
texts and renders the selected one's Serbian + Russian paragraphs.

To verify the **content updater** end-to-end (no publishing needed), follow the
"Testing update + rollback locally" recipe in
[`packages/desktop/docs/CONTENT_UPDATES.md`](packages/desktop/docs/CONTENT_UPDATES.md):
build the current content as the seed, build+pack a bumped `CONTENT_VERSION`,
`yarn content:serve`, and launch with `JASAMKROMPIR_UPDATE_URL` pointed at it. Watch
`userData/logs/updater.log`.
