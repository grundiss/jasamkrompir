import type { LocalizedText, QuestChoiceQuality } from '@jasamkrompir/shared';
import type { ReadingMode } from '../../lib/reading-mode';
import { LocalizedTextView } from './LocalizedTextView';
import { qualityLabel } from './QuestChoice';

export function QuestFeedback({
  feedback,
  quality,
  mode,
}: {
  feedback: LocalizedText;
  quality: QuestChoiceQuality;
  mode: ReadingMode;
}) {
  const tone =
    quality === 'best'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : quality === 'acceptable'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-rose-200 bg-rose-50 text-rose-900';

  return (
    <div role="status" aria-live="polite" className={`rounded-lg border px-4 py-3 ${tone}`}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide">{qualityLabel(quality)}</p>
      <LocalizedTextView text={feedback} mode={mode} revealId="quest-feedback" />
    </div>
  );
}
