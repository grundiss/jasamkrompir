import { useEffect, useState } from 'react';
import type { TextDetail } from '@jasamkrompir/shared';
import { api } from '../lib/api';

// The reading pane: one text with its paragraphs aligned Serbian ↔ Russian.
// The translation column can be hidden to read the Serbian on its own first.
export function Reader({ id }: { id: number }) {
  const [text, setText] = useState<TextDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);

  useEffect(() => {
    let alive = true;
    setText(null);
    setError(null);
    api
      .getText(id)
      .then((t) => alive && setText(t))
      .catch((e: unknown) => alive && setError(e instanceof Error ? e.message : String(e)));
    return () => {
      alive = false;
    };
  }, [id]);

  if (error) return <p className="p-10 text-sm text-slate-500">{error}</p>;
  if (!text) return <p className="p-10 text-sm text-slate-400">Загрузка…</p>;

  return (
    <article className="mx-auto max-w-3xl px-8 py-10">
      <header className="mb-8 flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{text.titleSr}</h2>
          <p className="mt-1 text-lg text-slate-500">{text.titleRu}</p>
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 pt-2 text-sm text-slate-600 select-none">
          <input
            type="checkbox"
            checked={showTranslation}
            onChange={(e) => setShowTranslation(e.target.checked)}
            className="h-4 w-4 accent-indigo-600"
          />
          Перевод
        </label>
      </header>

      <div className="space-y-6">
        {text.paragraphs.map((p, i) => (
          <div
            key={i}
            className={`grid gap-x-10 gap-y-2 ${showTranslation ? 'md:grid-cols-2' : 'grid-cols-1'}`}
          >
            <p className="font-serif text-[17px] leading-relaxed text-slate-900">{p.sr}</p>
            {showTranslation && (
              <p className="font-serif text-[17px] leading-relaxed text-slate-500">{p.ru}</p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
