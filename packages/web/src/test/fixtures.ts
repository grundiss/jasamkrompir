import type { TextDetail, TextSummary } from '@jasamkrompir/shared';

// Two small bilingual texts with unambiguous, easy-to-query paragraph strings.
export const TEXT_A: TextDetail = {
  id: 1,
  slug: 'text-a',
  titleSr: 'Naslov A',
  titleRu: 'Заголовок А',
  createdAt: '2020-01-01T00:00:00.000Z',
  paragraphs: [
    { sr: 'Srpski A1', ru: 'Перевод A1' },
    { sr: 'Srpski A2', ru: 'Перевод A2' },
  ],
};

export const TEXT_B: TextDetail = {
  id: 2,
  slug: 'text-b',
  titleSr: 'Naslov B',
  titleRu: 'Заголовок Б',
  createdAt: '2020-01-02T00:00:00.000Z',
  paragraphs: [{ sr: 'Srpski B1', ru: 'Перевод B1' }],
};

export const SUMMARIES: TextSummary[] = [TEXT_A, TEXT_B].map(({ id, slug, titleSr, titleRu }) => ({
  id,
  slug,
  titleSr,
  titleRu,
}));

export function detailById(id: number): TextDetail {
  return id === TEXT_B.id ? TEXT_B : TEXT_A;
}
