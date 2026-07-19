import { useEffect, useRef, useState } from 'react';

// A compact narration player for a text. Renders a native <audio> element for
// the actual playback (kept off-screen) and drives it through a small themed UI:
// a play/pause button, a seekable progress bar, and elapsed / total time.
//
// The <audio> element is the source of truth — the play/pause state, current
// time and duration all come from its events, so the UI stays correct even if
// playback ends on its own or is driven elsewhere. Changing `src` (a different
// text) reloads it and resets the UI to the start, stopped.
export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // A new track loads paused at 0:00. `src` is set on the element below (so the
  // browser fetches it); resetting the derived UI state here keeps the two in
  // sync when switching from a track that was mid-play.
  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  const seek = (value: number) => {
    const el = audioRef.current;
    if (el) el.currentTime = value;
    setCurrentTime(value);
  };

  // Before metadata loads (or for a stream of unknown length) duration is NaN /
  // Infinity; treat that as "not yet known" so the slider and time stay sane.
  const known = Number.isFinite(duration) && duration > 0;
  const progressLabel = `${formatTime(currentTime)} / ${known ? formatTime(duration) : '—:—'}`;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Пауза' : 'Воспроизвести'}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="shrink-0 text-xs font-medium tracking-wide text-slate-500 uppercase">
          Аудио
        </span>
        <input
          type="range"
          min={0}
          max={known ? duration : 0}
          step="any"
          value={currentTime}
          disabled={!known}
          onChange={(e) => seek(Number(e.currentTarget.value))}
          aria-label="Перемотка записи"
          aria-valuetext={progressLabel}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 disabled:cursor-default"
        />
        <span className="shrink-0 font-mono text-xs tabular-nums text-slate-500">
          {progressLabel}
        </span>
      </div>
    </div>
  );
}

// Whole seconds as m:ss (audio clips here are minutes long, so no hours).
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.5-6.86a1 1 0 0 0 0-1.7L9.53 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M7 4.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-13a1 1 0 0 0-1-1H7Zm8 0a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-13a1 1 0 0 0-1-1h-2Z" />
    </svg>
  );
}
