import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type {
  ContentDetail,
  QuestDetail,
  TextDetail,
  TextListResponse,
} from '@jasamkrompir/shared';
import { buildApp } from '../app.js';
import * as schema from '../db/schema.js';
import { validateQuestGraph } from '../content/quest-validate.js';
import { seedQuests } from '../content/seed.js';

const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../drizzle');

describe('GET /api/texts', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let closeDb: () => Promise<void>;

  beforeAll(async () => {
    const client = new PGlite();
    const db = drizzle(client, { schema });
    await migrate(db, { migrationsFolder });
    closeDb = () => client.close();
    app = await buildApp({ db, logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await closeDb();
  });

  it('lists seeded text and quest with the correct kind', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/texts' });
    expect(res.statusCode).toBe(200);
    const body = res.json() as TextListResponse;
    expect(body.texts.length).toBeGreaterThanOrEqual(2);

    const text = body.texts.find((t) => t.slug === 'ja-se-zovem-ivan');
    const quest = body.texts.find((t) => t.slug === 'poziv-dostavnoj-sluzbi');
    expect(text?.kind).toBe('text');
    expect(quest?.kind).toBe('quest');
    expect(quest?.titleSr).toBe('Paket koji nije stigao do vrata');
    expect(quest?.titleRu).toBe('Посылка, которая не дошла до двери');
  });

  it('does not duplicate content on repeated list calls', async () => {
    const first = (
      await app.inject({ method: 'GET', url: '/api/texts' })
    ).json() as TextListResponse;
    const second = (
      await app.inject({ method: 'GET', url: '/api/texts' })
    ).json() as TextListResponse;
    expect(second.texts.map((t) => t.slug).sort()).toEqual(first.texts.map((t) => t.slug).sort());
    expect(second.texts).toHaveLength(first.texts.length);
  });

  it('returns a linear text detail with paragraphs', async () => {
    const list = (
      await app.inject({ method: 'GET', url: '/api/texts' })
    ).json() as TextListResponse;
    const textSummary = list.texts.find((t) => t.slug === 'ja-se-zovem-ivan')!;
    const res = await app.inject({ method: 'GET', url: `/api/texts/${textSummary.id}` });
    expect(res.statusCode).toBe(200);
    const detail = res.json() as ContentDetail;
    expect(detail.kind).toBe('text');
    if (detail.kind !== 'text') throw new Error('expected text');
    const text: TextDetail = detail;
    expect(text.paragraphs.length).toBeGreaterThan(0);
    expect(text.paragraphs[0]?.sr).toContain('Ivan');
    expect(text.audioUrl).toBe('/audio/ja-se-zovem-ivan.mp3');
  });

  it('returns a quest detail with scenes, choices, endings, and vocabulary', async () => {
    const list = (
      await app.inject({ method: 'GET', url: '/api/texts' })
    ).json() as TextListResponse;
    const questSummary = list.texts.find((t) => t.slug === 'poziv-dostavnoj-sluzbi')!;
    const res = await app.inject({ method: 'GET', url: `/api/texts/${questSummary.id}` });
    expect(res.statusCode).toBe(200);
    const detail = res.json() as ContentDetail;
    expect(detail.kind).toBe('quest');
    if (detail.kind !== 'quest') throw new Error('expected quest');
    const quest: QuestDetail = detail;

    expect(quest.startSceneId).toBe('greeting');
    expect(quest.scenes.length).toBe(seedQuests[0]!.scenes.length);
    expect(quest.endings.map((e) => e.id).sort()).toEqual(['partial-success', 'success']);
    expect(quest.vocabulary.length).toBe(seedQuests[0]!.vocabulary.length);

    const greeting = quest.scenes.find((s) => s.id === 'greeting');
    expect(greeting?.choices.length).toBe(3);
    expect(greeting?.choices[0]?.id).toBe('greeting-polite');
    expect(greeting?.choices.map((c) => c.id)).toEqual([
      'greeting-polite',
      'greeting-vague',
      'greeting-aggressive',
    ]);
  });

  it('persists a valid quest graph (startSceneId and every nextSceneId resolve)', async () => {
    const list = (
      await app.inject({ method: 'GET', url: '/api/texts' })
    ).json() as TextListResponse;
    const questSummary = list.texts.find((t) => t.slug === 'poziv-dostavnoj-sluzbi')!;
    const quest = (
      await app.inject({ method: 'GET', url: `/api/texts/${questSummary.id}` })
    ).json() as QuestDetail;

    expect(() =>
      validateQuestGraph({
        slug: quest.slug,
        kind: 'quest',
        titleSr: quest.titleSr,
        titleRu: quest.titleRu,
        position: 0,
        descriptionSr: quest.description.sr,
        descriptionRu: quest.description.ru,
        intro: quest.intro,
        objective: quest.objective,
        startSceneId: quest.startSceneId,
        scenes: quest.scenes,
        endings: quest.endings,
        vocabulary: quest.vocabulary,
      }),
    ).not.toThrow();
  });
});

describe('validateQuestGraph', () => {
  const base = seedQuests[0]!;

  it('accepts the seed quest', () => {
    expect(() => validateQuestGraph(base)).not.toThrow();
  });

  it('rejects a missing startSceneId', () => {
    expect(() => validateQuestGraph({ ...base, startSceneId: 'nope' })).toThrow(/startSceneId/);
  });

  it('rejects a dangling nextSceneId', () => {
    const broken = {
      ...base,
      scenes: base.scenes.map((s, i) =>
        i === 0
          ? {
              ...s,
              choices: s.choices.map((c, ci) =>
                ci === 0 ? { ...c, nextSceneId: 'missing-node' } : c,
              ),
            }
          : s,
      ),
    };
    expect(() => validateQuestGraph(broken)).toThrow(/nextSceneId/);
  });
});
