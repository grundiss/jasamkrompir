import { describe, expect, it } from 'vitest';
import { DEFAULT_READING_MODE, READING_MODES } from './reading-mode';

describe('reading-mode', () => {
  it('offers the three modes in order with their Russian labels', () => {
    expect(READING_MODES.map((m) => m.id)).toEqual(['both', 'serbianOnly', 'reveal']);
    expect(READING_MODES.map((m) => m.label)).toEqual([
      'Сербский + перевод',
      'Только сербский',
      'Перевод по нажатию',
    ]);
  });

  it('defaults to showing both languages', () => {
    expect(DEFAULT_READING_MODE).toBe('both');
  });
});
