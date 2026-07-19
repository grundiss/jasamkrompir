import { useEffect, useState } from 'react';
import type { TextSummary } from '@jasamkrompir/shared';
import { Reader } from './components/Reader';
import { UpdateNotice } from './components/UpdateNotice';
import { api } from './lib/api';

// The reader shell: a sidebar listing every text and a reading pane for the
// selected one. Texts are bilingual Serbian passages with Russian translations,
// fetched from the backend.
export function App() {
  const [texts, setTexts] = useState<TextSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getTexts()
      .then((r) => {
        setTexts(r.texts);
        setSelectedId((cur) => cur ?? r.texts[0]?.id ?? null);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <div className="flex h-screen bg-white text-slate-900">
      <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
        <div className="border-b border-slate-200 px-5 py-4">
          <h1 className="text-lg font-bold tracking-tight">JaSamKrompir</h1>
          <p className="text-xs text-slate-500">Читаем по-сербски</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {texts.map((t) => {
            const active = t.id === selectedId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={`mb-1 w-full rounded-lg px-3 py-2 text-left transition-colors ${
                  active ? 'bg-indigo-100 text-indigo-900' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block font-medium">{t.titleSr}</span>
                <span className="block text-xs text-slate-500">{t.titleRu}</span>
              </button>
            );
          })}
          {texts.length === 0 && !error && (
            <p className="px-3 py-2 text-sm text-slate-400">Загрузка…</p>
          )}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="text-4xl">⚠️</span>
            <p className="text-sm text-slate-500">{error}</p>
          </div>
        ) : (
          selectedId != null && <Reader id={selectedId} />
        )}
      </main>

      <UpdateNotice />
    </div>
  );
}
