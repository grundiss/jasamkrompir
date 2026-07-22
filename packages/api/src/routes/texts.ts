import type {
  ContentDetail,
  ContentKind,
  ContentSummary,
  QuestChoiceQuality,
  QuestDetail,
  QuestEnding,
  TextDetail,
  TextListResponse,
} from '@jasamkrompir/shared';
import { asc, eq, inArray } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { ensureSeeded } from '../content/seed.js';
import { validateQuestGraph, type SeedQuest } from '../content/quest-validate.js';
import {
  paragraphs,
  questChoices,
  questEndings,
  questScenes,
  quests,
  questVocabulary,
  texts,
  type Text,
} from '../db/schema.js';

function asKind(value: string): ContentKind {
  if (value === 'text' || value === 'quest') return value;
  throw new Error(`Unknown content kind: ${value}`);
}

function asQuality(value: string): QuestChoiceQuality {
  if (value === 'best' || value === 'acceptable' || value === 'poor') return value;
  throw new Error(`Unknown choice quality: ${value}`);
}

function asEndingType(value: string): QuestEnding['type'] {
  if (value === 'success' || value === 'partial') return value;
  throw new Error(`Unknown ending type: ${value}`);
}

function toSummary(row: Text): ContentSummary {
  return {
    id: row.id,
    slug: row.slug,
    kind: asKind(row.kind),
    titleSr: row.titleSr,
    titleRu: row.titleRu,
    audioUrl: row.audioUrl,
  };
}

async function loadTextDetail(app: FastifyInstance, row: Text): Promise<TextDetail> {
  const paraRows = await app.db
    .select({ sr: paragraphs.sr, ru: paragraphs.ru })
    .from(paragraphs)
    .where(eq(paragraphs.textId, row.id))
    .orderBy(asc(paragraphs.position));

  return {
    ...toSummary(row),
    kind: 'text',
    createdAt: row.createdAt.toISOString(),
    paragraphs: paraRows,
  };
}

async function loadQuestDetail(app: FastifyInstance, row: Text): Promise<QuestDetail> {
  const [quest] = await app.db.select().from(quests).where(eq(quests.textId, row.id)).limit(1);
  if (!quest) {
    throw new Error(`Quest row missing for text id ${row.id}`);
  }

  const sceneRows = await app.db
    .select()
    .from(questScenes)
    .where(eq(questScenes.textId, row.id))
    .orderBy(asc(questScenes.position), asc(questScenes.id));

  const sceneRowIds = sceneRows.map((s) => s.id);
  const choiceRows =
    sceneRowIds.length === 0
      ? []
      : await app.db
          .select()
          .from(questChoices)
          .where(inArray(questChoices.sceneRowId, sceneRowIds))
          .orderBy(asc(questChoices.position), asc(questChoices.id));

  const choicesByScene = new Map<number, typeof choiceRows>();
  for (const choice of choiceRows) {
    const list = choicesByScene.get(choice.sceneRowId) ?? [];
    list.push(choice);
    choicesByScene.set(choice.sceneRowId, list);
  }

  const endingRows = await app.db
    .select()
    .from(questEndings)
    .where(eq(questEndings.textId, row.id))
    .orderBy(asc(questEndings.position), asc(questEndings.id));

  const vocabRows = await app.db
    .select()
    .from(questVocabulary)
    .where(eq(questVocabulary.textId, row.id))
    .orderBy(asc(questVocabulary.position), asc(questVocabulary.id));

  const detail: QuestDetail = {
    ...toSummary(row),
    kind: 'quest',
    createdAt: row.createdAt.toISOString(),
    description: { sr: quest.descriptionSr, ru: quest.descriptionRu },
    intro: { sr: quest.introSr, ru: quest.introRu },
    objective: { sr: quest.objectiveSr, ru: quest.objectiveRu },
    startSceneId: quest.startSceneId,
    scenes: sceneRows.map((scene) => ({
      id: scene.sceneId,
      speaker: 'employee' as const,
      phase: { sr: scene.phaseSr, ru: scene.phaseRu },
      employee: { sr: scene.employeeSr, ru: scene.employeeRu },
      promptRu: scene.promptRu,
      choices: (choicesByScene.get(scene.id) ?? []).map((choice) => ({
        id: choice.choiceId,
        text: { sr: choice.textSr, ru: choice.textRu },
        quality: asQuality(choice.quality),
        feedback: { sr: choice.feedbackSr, ru: choice.feedbackRu },
        nextSceneId: choice.nextSceneId,
      })),
    })),
    endings: endingRows.map((ending) => ({
      id: ending.endingId,
      type: asEndingType(ending.type),
      titleSr: ending.titleSr,
      titleRu: ending.titleRu,
      text: { sr: ending.textSr, ru: ending.textRu },
    })),
    vocabulary: vocabRows.map((item) => ({
      sr: item.sr,
      ru: item.ru,
      exampleSr: item.exampleSr,
      exampleRu: item.exampleRu,
    })),
  };

  // Fail loudly if the persisted graph drifted (e.g. hand-edited DB).
  const forValidation: SeedQuest = {
    slug: detail.slug,
    kind: 'quest',
    titleSr: detail.titleSr,
    titleRu: detail.titleRu,
    position: 0,
    descriptionSr: detail.description.sr,
    descriptionRu: detail.description.ru,
    intro: detail.intro,
    objective: detail.objective,
    startSceneId: detail.startSceneId,
    scenes: detail.scenes,
    endings: detail.endings,
    vocabulary: detail.vocabulary,
  };
  validateQuestGraph(forValidation);

  return detail;
}

// Content API for the bilingual Serbian reader (texts + quests).
//   GET /api/texts       → the list of content items (titles + kind)
//   GET /api/texts/:id   → one text or quest (discriminated by `kind`)
// The seed content is ensured on list, so a fresh database serves real content
// on first load without a separate seeding step.
export async function textsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/texts', async (): Promise<TextListResponse> => {
    await ensureSeeded(app.db);

    const rows = await app.db.select().from(texts).orderBy(asc(texts.position), asc(texts.id));

    return { texts: rows.map(toSummary) };
  });

  app.get<{ Params: { id: string } }>('/api/texts/:id', async (request, reply) => {
    const id = Number(request.params.id);
    if (!Number.isInteger(id)) {
      reply.code(400);
      return { error: 'BadRequest', message: 'Invalid text id' };
    }

    const [row] = await app.db.select().from(texts).where(eq(texts.id, id)).limit(1);
    if (!row) {
      reply.code(404);
      return { error: 'NotFound', message: 'Text not found' };
    }

    const kind = asKind(row.kind);
    const detail: ContentDetail =
      kind === 'quest' ? await loadQuestDetail(app, row) : await loadTextDetail(app, row);
    return detail;
  });
}
