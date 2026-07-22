import type { QuestVocabularyItem } from '@jasamkrompir/shared';
import type { ReadingMode } from '../../lib/reading-mode';
import { LocalizedTextView } from './LocalizedTextView';

export function QuestVocabulary({
  items,
  mode,
  onClose,
}: {
  items: QuestVocabularyItem[];
  mode: ReadingMode;
  onClose: () => void;
}) {
  return (
    <section aria-labelledby="quest-vocab-title" className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="quest-vocab-title" className="text-2xl font-bold tracking-tight">
            Словарь
          </h3>
          <p className="mt-1 text-sm text-slate-500">Полезные слова и выражения из квеста</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
        >
          К результату
        </button>
      </div>

      <ul className="space-y-4">
        {items.map((item, i) => (
          <li
            key={`${item.sr}-${i}`}
            className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
          >
            <LocalizedTextView
              text={{ sr: item.sr, ru: item.ru }}
              mode={mode}
              revealId={`vocab-term-${i}`}
              className="font-semibold"
            />
            <div className="mt-2 pl-1">
              <LocalizedTextView
                text={{ sr: item.exampleSr, ru: item.exampleRu }}
                mode={mode}
                revealId={`vocab-ex-${i}`}
                className="text-[15px] text-slate-600 italic"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
