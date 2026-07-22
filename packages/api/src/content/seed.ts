import { eq } from 'drizzle-orm';
import type { AppDb } from '../db/index.js';
import {
  paragraphs,
  questChoices,
  questEndings,
  questScenes,
  quests,
  questVocabulary,
  texts,
} from '../db/schema.js';
import { type SeedQuest, validateQuestGraph } from './quest-validate.js';
import { pozivDostavnojSluzbi } from './quests/poziv-dostavnoj-sluzbi.js';

// The seed content shipped with the app. Each entry is either a bilingual text
// (aligned paragraphs) or an interactive quest. `ensureSeeded` inserts any
// item whose slug is not yet present, so it is safe to run on every start and
// to extend with more content over time.

interface SeedText {
  kind?: 'text';
  slug: string;
  titleSr: string;
  titleRu: string;
  position: number;
  // Root-relative URL of the narration track shipped as a web asset, if any.
  audioUrl?: string;
  paragraphs: { sr: string; ru: string }[];
}

export const seedTexts: SeedText[] = [
  {
    slug: 'ja-se-zovem-ivan',
    titleSr: 'Ja se zovem Ivan',
    titleRu: 'Меня зовут Иван',
    position: 1,
    audioUrl: '/audio/ja-se-zovem-ivan.mp3',
    paragraphs: [
      {
        sr: 'Ja se zovem Ivan. Ja sam iz Rusije. Imam dvadeset jednu godinu. Sada živim u Beogradu jer studiram na univerzitetu.',
        ru: 'Меня зовут Иван. Я из России. Мне двадцать один год. Сейчас я живу в Белграде, потому что учусь в университете.',
      },
      {
        sr: 'Svaki dan idem na predavanja. Učim srpski jezik i upoznajem nove prijatelje. Profesori su ljubazni, a studenti mi često pomažu.',
        ru: 'Каждый день я хожу на занятия. Я изучаю сербский язык и знакомлюсь с новыми друзьями. Преподаватели добрые, а студенты часто мне помогают.',
      },
      {
        sr: 'Posle nastave pijem kafu sa kolegama. Ponekad šetamo pored Save i Dunava ili idemo u centar grada. Beograd mi se mnogo sviđa. Grad je lep, ljudi su prijatni, a hrana je veoma ukusna.',
        ru: 'После занятий я пью кофе с одногруппниками. Иногда мы гуляем вдоль Савы и Дуная или идём в центр города. Белград мне очень нравится. Город красивый, люди приветливые, а еда очень вкусная.',
      },
      {
        sr: 'Nedostaje mi porodica u Rusiji, ali sam srećan što imam priliku da studiram u Srbiji. Nadam se da ću uskoro govoriti srpski mnogo bolje.',
        ru: 'Я скучаю по семье в России, но рад, что у меня есть возможность учиться в Сербии. Надеюсь, что скоро буду говорить по-сербски намного лучше.',
      },
    ],
  },
];

export const seedQuests: SeedQuest[] = [pozivDostavnojSluzbi];

// Validate every seed quest at module load so a broken graph fails immediately
// rather than after install.
for (const quest of seedQuests) {
  validateQuestGraph(quest);
}

// Idempotently insert any seed item not already present (matched by slug).
export async function ensureSeeded(db: AppDb): Promise<void> {
  for (const seed of seedTexts) {
    const [existing] = await db
      .select({ id: texts.id })
      .from(texts)
      .where(eq(texts.slug, seed.slug))
      .limit(1);
    if (existing) continue;

    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(texts)
        .values({
          slug: seed.slug,
          kind: 'text',
          titleSr: seed.titleSr,
          titleRu: seed.titleRu,
          audioUrl: seed.audioUrl ?? null,
          position: seed.position,
        })
        .returning({ id: texts.id });

      await tx.insert(paragraphs).values(
        seed.paragraphs.map((p, index) => ({
          textId: created!.id,
          position: index,
          sr: p.sr,
          ru: p.ru,
        })),
      );
    });
  }

  for (const seed of seedQuests) {
    const [existing] = await db
      .select({ id: texts.id })
      .from(texts)
      .where(eq(texts.slug, seed.slug))
      .limit(1);
    if (existing) continue;

    validateQuestGraph(seed);

    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(texts)
        .values({
          slug: seed.slug,
          kind: 'quest',
          titleSr: seed.titleSr,
          titleRu: seed.titleRu,
          audioUrl: null,
          position: seed.position,
        })
        .returning({ id: texts.id });

      const textId = created!.id;

      await tx.insert(quests).values({
        textId,
        descriptionSr: seed.descriptionSr,
        descriptionRu: seed.descriptionRu,
        introSr: seed.intro.sr,
        introRu: seed.intro.ru,
        objectiveSr: seed.objective.sr,
        objectiveRu: seed.objective.ru,
        startSceneId: seed.startSceneId,
      });

      for (let si = 0; si < seed.scenes.length; si++) {
        const scene = seed.scenes[si]!;
        const [sceneRow] = await tx
          .insert(questScenes)
          .values({
            textId,
            sceneId: scene.id,
            speaker: scene.speaker,
            phaseSr: scene.phase.sr,
            phaseRu: scene.phase.ru,
            employeeSr: scene.employee.sr,
            employeeRu: scene.employee.ru,
            promptRu: scene.promptRu,
            position: si,
          })
          .returning({ id: questScenes.id });

        await tx.insert(questChoices).values(
          scene.choices.map((choice, ci) => ({
            sceneRowId: sceneRow!.id,
            choiceId: choice.id,
            textSr: choice.text.sr,
            textRu: choice.text.ru,
            quality: choice.quality,
            feedbackSr: choice.feedback.sr,
            feedbackRu: choice.feedback.ru,
            nextSceneId: choice.nextSceneId,
            position: ci,
          })),
        );
      }

      await tx.insert(questEndings).values(
        seed.endings.map((ending, ei) => ({
          textId,
          endingId: ending.id,
          type: ending.type,
          titleSr: ending.titleSr,
          titleRu: ending.titleRu,
          textSr: ending.text.sr,
          textRu: ending.text.ru,
          position: ei,
        })),
      );

      await tx.insert(questVocabulary).values(
        seed.vocabulary.map((item, vi) => ({
          textId,
          sr: item.sr,
          ru: item.ru,
          exampleSr: item.exampleSr,
          exampleRu: item.exampleRu,
          position: vi,
        })),
      );
    });
  }
}
