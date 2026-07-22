import { useEffect, useState } from 'react';
import type { TextDetail } from '@jasamkrompir/shared';
import { api } from '../lib/api';
import { useHoldReveal } from '../lib/hold-reveal';
import { AudioPlayer } from './AudioPlayer';
import { ReadingModeSwitcher } from './ReadingModeSwitcher';
import type { ReadingMode } from '../lib/reading-mode';

// The reading pane: one text, shown in the chosen reading mode.
//   both        — Serbian and Russian paragraphs aligned side by side.
//   serbianOnly — Serbian only; no translation column, no reveal controls.
//   reveal      — Serbian only; hold a paragraph to peek its translation.
// `mode` lives in <App/> so it survives switching texts; hold-to-reveal state
// is local to each paragraph and resets when the text or the mode changes.
export function Reader({
  id,
  mode,
  onModeChange,
}: {
  id: number;
  mode: ReadingMode;
  onModeChange: (mode: ReadingMode) => void;
}) {
  const [text, setText] = useState<TextDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    // Drop the previous text immediately so its content can't flash while the
    // next one loads.
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

  return (
    <article className="mx-auto max-w-3xl px-8 py-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="min-w-0">
          {text && (
            <>
              <h2 className="text-3xl font-bold tracking-tight">{text.titleSr}</h2>
              <p className="mt-1 text-lg text-slate-500">{text.titleRu}</p>
            </>
          )}
        </div>
        {/* The switcher stays put while a text loads so the mode never flickers. */}
        <div className="pt-2">
          <ReadingModeSwitcher mode={mode} onChange={onModeChange} />
        </div>
      </header>

      {/* Narration player, shown only for texts that ship with a recording.
          Keyed by src so a different text always starts from a fresh element. */}
      {text?.audioUrl && (
        <div className="mb-8">
          <AudioPlayer key={text.audioUrl} src={text.audioUrl} />
        </div>
      )}

      {error ? (
        <p className="text-sm text-slate-500">{error}</p>
      ) : !text ? (
        <p className="text-sm text-slate-400">Загрузка…</p>
      ) : (
        <div className="space-y-6">
          {text.paragraphs.map((p, i) => (
            <ParagraphView key={i} paragraph={p} mode={mode} textId={id} index={i} />
          ))}
        </div>
      )}
    </article>
  );
}

function ParagraphView({
  paragraph,
  mode,
  textId,
  index,
}: {
  paragraph: TextDetail['paragraphs'][number];
  mode: ReadingMode;
  textId: number;
  index: number;
}) {
  // Reset hold state when the text or mode changes (same index can be reused
  // across texts, so we can't rely on remount alone).
  const hold = useHoldReveal(`${textId}:${mode}`);

  // One shared Serbian-text box so serbianOnly and reveal are pixel-identical:
  // switching between those modes never nudges a single line. In reveal the same
  // box becomes an interactive button.
  const serbianBox =
    'block w-full rounded-md px-2 py-1 text-left font-serif text-[17px] leading-relaxed text-slate-900';

  if (mode === 'both') {
    // Aligned side by side on wide screens; stacked (Serbian first, then its
    // translation) once there isn't room for two columns. The matching `py-1`
    // keeps the vertical rhythm the same as the single-column modes.
    return (
      <div className="grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-2">
        <p className="py-1 font-serif text-[17px] leading-relaxed text-slate-900">{paragraph.sr}</p>
        <p className="py-1 font-serif text-[17px] leading-relaxed text-slate-500">{paragraph.ru}</p>
      </div>
    );
  }

  if (mode === 'serbianOnly') {
    // The same box as reveal (without the interactivity), so toggling the two
    // modes leaves every line exactly where it was.
    return (
      <div className="-mx-2">
        <p className={serbianBox}>{paragraph.sr}</p>
      </div>
    );
  }

  // reveal: holding a paragraph floats its translation just above it, like a
  // tooltip, so the reading flow of the Serbian text below is never pushed
  // around. Release (or blur / Esc) hides it again.
  const translationId = `text-${textId}-p-${index}-translation`;
  const { open, ...holdProps } = hold;
  return (
    <div className="relative -mx-2">
      <button
        type="button"
        {...holdProps}
        aria-expanded={open}
        aria-controls={open ? translationId : undefined}
        className={`${serbianBox} cursor-pointer select-none outline-none transition-colors hover:bg-indigo-50/70 focus-visible:ring-2 focus-visible:ring-indigo-300 ${
          open ? 'bg-indigo-50/70' : ''
        }`}
      >
        {paragraph.sr}
      </button>
      {open && (
        <div
          id={translationId}
          className="pointer-events-none absolute bottom-full left-2 right-2 z-10 mb-2"
        >
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
            <p className="font-serif text-[15px] leading-relaxed text-slate-500 italic">
              {paragraph.ru}
            </p>
          </div>
          {/* little pointer down to the paragraph it belongs to */}
          <span
            aria-hidden="true"
            className="absolute top-full left-6 -mt-1 block h-2 w-2 rotate-45 border-r border-b border-slate-200 bg-white"
          />
        </div>
      )}
    </div>
  );
}
