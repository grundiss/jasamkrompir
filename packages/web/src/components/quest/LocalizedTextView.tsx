import { useId } from 'react';
import type { LocalizedText } from '@jasamkrompir/shared';
import { useHoldReveal } from '../../lib/hold-reveal';
import type { ReadingMode } from '../../lib/reading-mode';

// Renders a Serbian/Russian pair according to the active reading mode.
// In `reveal`, the translation floats above the Serbian line (same pattern as
// paragraph reveal) so revealing never shifts unrelated content below.
export function LocalizedTextView({
  text,
  mode,
  as = 'p',
  className = '',
  revealId,
}: {
  text: LocalizedText;
  mode: ReadingMode;
  as?: 'p' | 'span';
  className?: string;
  /** Stable id stem for aria-controls when in reveal mode. */
  revealId?: string;
}) {
  const autoId = useId();
  const translationId = revealId ?? `loc-${autoId}`;
  const { open, ...holdProps } = useHoldReveal(mode);

  const srClass = `font-serif text-[17px] leading-relaxed text-slate-900 ${className}`;
  const ruClass = `font-serif text-[17px] leading-relaxed text-slate-500 ${className}`;
  const Tag = as;

  if (mode === 'both') {
    return (
      <div className="grid grid-cols-1 gap-x-10 gap-y-1 md:grid-cols-2">
        <Tag className={srClass}>{text.sr}</Tag>
        <Tag className={ruClass}>{text.ru}</Tag>
      </div>
    );
  }

  if (mode === 'serbianOnly') {
    return <Tag className={srClass}>{text.sr}</Tag>;
  }

  // reveal: hold to peek, release to hide
  return (
    <div className="relative">
      <button
        type="button"
        {...holdProps}
        aria-expanded={open}
        aria-controls={open ? translationId : undefined}
        className={`block w-full rounded-md px-2 py-1 text-left outline-none transition-colors hover:bg-indigo-50/70 focus-visible:ring-2 focus-visible:ring-indigo-300 select-none ${srClass} ${
          open ? 'bg-indigo-50/70' : ''
        }`}
      >
        {text.sr}
      </button>
      {open && (
        <div
          id={translationId}
          className="pointer-events-none absolute bottom-full left-2 right-2 z-10 mb-2"
        >
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
            <p className="font-serif text-[15px] leading-relaxed text-slate-500 italic">
              {text.ru}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="absolute top-full left-6 -mt-1 block h-2 w-2 rotate-45 border-r border-b border-slate-200 bg-white"
          />
        </div>
      )}
    </div>
  );
}
