import { useEffect, useState } from 'react';
import type { ContentSummary } from '@jasamkrompir/shared';
import { Reader } from './components/Reader';
import { UpdateNotice } from './components/UpdateNotice';
import { api } from './lib/api';
import { DEFAULT_READING_MODE, type ReadingMode } from './lib/reading-mode';

// The reader shell: a sidebar listing every content item (linear texts and
// interactive quests) and a reading pane for the selected one.
export function App() {
  const [texts, setTexts] = useState<ContentSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  // The reading mode is held here (not in <Reader/>) so the choice persists
  // across texts for the whole run of the app.
  const [mode, setMode] = useState<ReadingMode>(DEFAULT_READING_MODE);

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
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="truncate">{t.titleSr}</span>
                  {t.kind === 'quest' && (
                    <span
                      className={`shrink-0 rounded px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        active ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      Квест
                    </span>
                  )}
                  {t.audioUrl && (
                    <AudioBadge className={active ? 'text-indigo-500' : 'text-slate-400'} />
                  )}
                </span>
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
          selectedId != null && <Reader id={selectedId} mode={mode} onModeChange={setMode} />
        )}
      </main>

      <UpdateNotice />
    </div>
  );
}

// A small speaker glyph marking texts that ship with a narration track.
function AudioBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 shrink-0 ${className ?? ''}`}
      fill="currentColor"
      role="img"
      aria-label="есть аудио"
    >
      <path d="M11 4.5a1 1 0 0 0-1.62-.78L5.65 6.7H3a1 1 0 0 0-1 1v3.6a1 1 0 0 0 1 1h2.65l3.73 2.98A1 1 0 0 0 11 14.5v-10Z" />
      <path d="M14.5 8.2a1 1 0 0 1 1.4.2 4.6 4.6 0 0 1 0 5.2 1 1 0 1 1-1.6-1.2 2.6 2.6 0 0 0 0-2.8 1 1 0 0 1 .2-1.4Z" />
      <path d="M16.8 5.5a1 1 0 0 1 1.38.28 8 8 0 0 1 0 8.44 1 1 0 1 1-1.66-1.1 6 6 0 0 0 0-6.24 1 1 0 0 1 .28-1.38Z" />
    </svg>
  );
}
