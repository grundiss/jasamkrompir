import type { ContentSummary, QuestDetail, TextDetail } from '@jasamkrompir/shared';

// Two small bilingual texts with unambiguous, easy-to-query paragraph strings.
// TEXT_A ships with a narration track; TEXT_B has none — so tests can exercise
// both the "has audio" and "no audio" paths.
export const TEXT_A: TextDetail = {
  id: 1,
  slug: 'text-a',
  kind: 'text',
  titleSr: 'Naslov A',
  titleRu: 'Заголовок А',
  audioUrl: '/audio/text-a.mp3',
  createdAt: '2020-01-01T00:00:00.000Z',
  paragraphs: [
    { sr: 'Srpski A1', ru: 'Перевод A1' },
    { sr: 'Srpski A2', ru: 'Перевод A2' },
  ],
};

export const TEXT_B: TextDetail = {
  id: 2,
  slug: 'text-b',
  kind: 'text',
  titleSr: 'Naslov B',
  titleRu: 'Заголовок Б',
  audioUrl: null,
  createdAt: '2020-01-02T00:00:00.000Z',
  paragraphs: [{ sr: 'Srpski B1', ru: 'Перевод B1' }],
};

// Minimal two-scene quest used by QuestPlayer / Reader quest tests.
export const QUEST_A: QuestDetail = {
  id: 3,
  slug: 'quest-a',
  kind: 'quest',
  titleSr: 'Quest A Sr',
  titleRu: 'Квест А',
  audioUrl: null,
  createdAt: '2020-01-03T00:00:00.000Z',
  description: { sr: 'Opis A', ru: 'Описание А' },
  intro: { sr: 'Uvod A', ru: 'Введение А' },
  objective: { sr: 'Cilj A', ru: 'Цель А' },
  startSceneId: 's1',
  scenes: [
    {
      id: 's1',
      speaker: 'employee',
      phase: { sr: 'Faza 1', ru: 'Фаза 1' },
      employee: { sr: 'Zdravo od operatera', ru: 'Здравствуйте от оператора' },
      promptRu: 'Как ответить?',
      choices: [
        {
          id: 's1-best',
          text: { sr: 'Ljubazan odgovor', ru: 'Вежливый ответ' },
          quality: 'best',
          feedback: { sr: 'Odlično!', ru: 'Отлично!' },
          nextSceneId: 's2',
        },
        {
          id: 's1-poor',
          text: { sr: 'Grub odgovor', ru: 'Грубый ответ' },
          quality: 'poor',
          feedback: { sr: 'Pregrubo.', ru: 'Слишком грубо.' },
          nextSceneId: 's2',
        },
      ],
    },
    {
      id: 's2',
      speaker: 'employee',
      phase: { sr: 'Faza 2', ru: 'Фаза 2' },
      employee: { sr: 'Šta očekujete?', ru: 'Чего вы ожидаете?' },
      promptRu: 'Сформулируй требование.',
      choices: [
        {
          id: 's2-success',
          text: { sr: 'Tražim rešenje', ru: 'Требую решение' },
          quality: 'best',
          feedback: { sr: 'Dobro.', ru: 'Хорошо.' },
          nextSceneId: 'end-ok',
        },
      ],
    },
  ],
  endings: [
    {
      id: 'end-ok',
      type: 'success',
      titleSr: 'Uspeh',
      titleRu: 'Успех финал',
      text: { sr: 'Sve je u redu.', ru: 'Всё хорошо.' },
    },
  ],
  vocabulary: [
    {
      sr: 'pošiljka',
      ru: 'посылка',
      exampleSr: 'Imam pošiljku.',
      exampleRu: 'У меня посылка.',
    },
  ],
};

export const SUMMARIES: ContentSummary[] = [TEXT_A, TEXT_B, QUEST_A].map(
  ({ id, slug, kind, titleSr, titleRu, audioUrl }) => ({
    id,
    slug,
    kind,
    titleSr,
    titleRu,
    audioUrl,
  }),
);

export function detailById(id: number): TextDetail | QuestDetail {
  if (id === TEXT_B.id) return TEXT_B;
  if (id === QUEST_A.id) return QUEST_A;
  return TEXT_A;
}
