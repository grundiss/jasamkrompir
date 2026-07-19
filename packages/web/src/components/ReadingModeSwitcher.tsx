import { READING_MODES, type ReadingMode } from '../lib/reading-mode';

// A compact segmented control for the three reading modes. Plain buttons (not a
// <select>) so the active mode stays visible at a glance; each is reachable by
// Tab and toggled with Enter/Space, and the pressed one is marked for assistive
// tech via aria-pressed.
export function ReadingModeSwitcher({
  mode,
  onChange,
}: {
  mode: ReadingMode;
  onChange: (mode: ReadingMode) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Режим чтения"
      className="inline-flex shrink-0 flex-wrap gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-sm"
    >
      {READING_MODES.map((m) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(m.id)}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              active ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
