// The three ways to read a bilingual text.
//
//   both        — Serbian and Russian paragraphs shown together, aligned.
//   serbianOnly — Serbian only; no translation column, no reveal controls.
//   reveal      — Serbian only; hold (pointer/Space/Enter) to peek a
//                 translation, release to hide it again.
//
// The chosen mode is app-run state (kept in <App/>) so it carries across texts;
// hold-to-reveal state is local to each line and never carries across.
export type ReadingMode = 'both' | 'serbianOnly' | 'reveal';

export interface ReadingModeOption {
  id: ReadingMode;
  label: string;
}

// Order here is the display order in the switcher.
export const READING_MODES: ReadingModeOption[] = [
  { id: 'both', label: 'Сербский + перевод' },
  { id: 'serbianOnly', label: 'Только сербский' },
  { id: 'reveal', label: 'Перевод по нажатию' },
];

export const DEFAULT_READING_MODE: ReadingMode = 'both';
