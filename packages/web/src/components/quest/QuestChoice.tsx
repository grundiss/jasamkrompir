import type { QuestChoice as QuestChoiceData, QuestChoiceQuality } from '@jasamkrompir/shared';
import { useHoverReveal } from '../../lib/hover-reveal';
import type { ReadingMode } from '../../lib/reading-mode';
import { LocalizedTextView } from './LocalizedTextView';

const QUALITY_LABEL: Record<QuestChoiceQuality, string> = {
  best: 'Лучший ответ',
  acceptable: 'Приемлемо',
  poor: 'Слабый ответ',
};

const QUALITY_MARK: Record<QuestChoiceQuality, string> = {
  best: '✓',
  acceptable: '~',
  poor: '✗',
};

export function qualityLabel(quality: QuestChoiceQuality): string {
  return QUALITY_LABEL[quality];
}

export function QuestChoiceButton({
  choice,
  mode,
  selected,
  locked,
  onSelect,
}: {
  choice: QuestChoiceData;
  mode: ReadingMode;
  selected: boolean;
  locked: boolean;
  onSelect: () => void;
}) {
  const disabled = locked && !selected;
  const selectedRing = selected
    ? choice.quality === 'best'
      ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200'
      : choice.quality === 'acceptable'
        ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-200'
        : 'border-rose-400 bg-rose-50 ring-2 ring-rose-200'
    : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40';

  // Click selects the answer, so reveal mode peeks on hover/focus of this
  // button (not hold) — and LocalizedTextView must not nest another <button>.
  const peek = useHoverReveal(mode);
  const revealOpen = mode === 'reveal' ? peek.open : false;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={locked}
      aria-pressed={selected}
      aria-disabled={disabled}
      onMouseEnter={mode === 'reveal' ? peek.onMouseEnter : undefined}
      onMouseLeave={mode === 'reveal' ? peek.onMouseLeave : undefined}
      onFocus={mode === 'reveal' ? peek.onFocus : undefined}
      onBlur={mode === 'reveal' ? peek.onBlur : undefined}
      className={`w-full rounded-lg border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:cursor-default ${selectedRing} ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      {selected && (
        <span
          className={`mb-2 inline-flex items-center gap-1.5 text-xs font-semibold ${
            choice.quality === 'best'
              ? 'text-emerald-700'
              : choice.quality === 'acceptable'
                ? 'text-amber-700'
                : 'text-rose-700'
          }`}
        >
          <span aria-hidden="true">{QUALITY_MARK[choice.quality]}</span>
          {QUALITY_LABEL[choice.quality]}
        </span>
      )}
      <LocalizedTextView
        text={choice.text}
        mode={mode}
        revealId={`choice-${choice.id}`}
        revealStrategy="hover"
        revealOpen={revealOpen}
      />
    </button>
  );
}
