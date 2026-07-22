import type { QuestEnding, QuestVocabularyItem } from '@jasamkrompir/shared';
import type { ReadingMode } from '../../lib/reading-mode';
import { LocalizedTextView } from './LocalizedTextView';
import { QuestVocabulary } from './QuestVocabulary';

export function QuestEndingView({
  ending,
  vocabulary,
  mode,
  showVocabulary,
  onToggleVocabulary,
  onRestart,
}: {
  ending: QuestEnding;
  vocabulary: QuestVocabularyItem[];
  mode: ReadingMode;
  showVocabulary: boolean;
  onToggleVocabulary: () => void;
  onRestart: () => void;
}) {
  const badge =
    ending.type === 'success'
      ? { label: 'Успех', className: 'bg-emerald-100 text-emerald-800' }
      : { label: 'Частичный результат', className: 'bg-amber-100 text-amber-800' };

  if (showVocabulary) {
    return <QuestVocabulary items={vocabulary} mode={mode} onClose={onToggleVocabulary} />;
  }

  return (
    <section aria-labelledby="quest-ending-title" className="space-y-6">
      <div>
        <span
          className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${badge.className}`}
        >
          {badge.label}
        </span>
        <h3 id="quest-ending-title" className="mt-3 text-2xl font-bold tracking-tight">
          {ending.titleSr}
        </h3>
        {mode !== 'serbianOnly' && <p className="mt-1 text-lg text-slate-500">{ending.titleRu}</p>}
      </div>

      <LocalizedTextView text={ending.text} mode={mode} revealId="quest-ending-text" />

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
        >
          Начать квест заново
        </button>
        <button
          type="button"
          onClick={onToggleVocabulary}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
        >
          Словарь
        </button>
      </div>
    </section>
  );
}
