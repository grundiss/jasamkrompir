import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioPlayer } from './AudioPlayer';

// jsdom has no real media stack: play()/pause() are unimplemented and duration
// is NaN. We stub the two methods and set duration/currentTime on the element
// directly, then fire the media events the component listens to. That exercises
// the UI wiring (labels, time formatting, seeking) without real playback.
let play: ReturnType<typeof vi.spyOn>;
let pause: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
  pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

function getAudio(): HTMLAudioElement {
  const el = document.querySelector('audio');
  if (!el) throw new Error('no <audio> rendered');
  return el as HTMLAudioElement;
}

// Set a read-only-ish media property on the instance, then notify the component.
function setDuration(el: HTMLAudioElement, seconds: number) {
  Object.defineProperty(el, 'duration', { value: seconds, configurable: true });
  fireEvent.durationChange(el);
}
function setCurrentTime(el: HTMLAudioElement, seconds: number) {
  Object.defineProperty(el, 'currentTime', { value: seconds, writable: true, configurable: true });
  fireEvent.timeUpdate(el);
}

describe('AudioPlayer', () => {
  it('renders an audio element pointing at the given src, paused', () => {
    render(<AudioPlayer src="/audio/ja-se-zovem-ivan.mp3" />);

    expect(getAudio().getAttribute('src')).toBe('/audio/ja-se-zovem-ivan.mp3');
    expect(screen.getByRole('button', { name: 'Воспроизвести' })).toBeInTheDocument();
  });

  it('plays on click and reflects the element’s play/pause state', async () => {
    const user = userEvent.setup();
    render(<AudioPlayer src="/audio/x.mp3" />);
    const el = getAudio();

    await user.click(screen.getByRole('button', { name: 'Воспроизвести' }));
    expect(play).toHaveBeenCalledOnce();

    // The button only flips once the element actually reports it is playing.
    fireEvent.play(el);
    const pauseBtn = screen.getByRole('button', { name: 'Пауза' });

    // While playing, clicking pauses.
    Object.defineProperty(el, 'paused', { value: false, configurable: true });
    await user.click(pauseBtn);
    expect(pause).toHaveBeenCalledOnce();

    fireEvent.pause(el);
    expect(screen.getByRole('button', { name: 'Воспроизвести' })).toBeInTheDocument();
  });

  it('shows elapsed / total time once metadata is known and enables the slider', () => {
    render(<AudioPlayer src="/audio/x.mp3" />);
    const el = getAudio();

    // Before metadata: unknown duration, slider disabled.
    const slider = screen.getByRole('slider', { name: 'Перемотка записи' });
    expect(slider).toBeDisabled();
    expect(screen.getByText('0:00 / —:—')).toBeInTheDocument();

    setDuration(el, 125); // 2:05
    setCurrentTime(el, 30); // 0:30

    expect(slider).toBeEnabled();
    expect(screen.getByText('0:30 / 2:05')).toBeInTheDocument();
  });

  it('seeks the audio element when the slider is moved', () => {
    render(<AudioPlayer src="/audio/x.mp3" />);
    const el = getAudio();
    setDuration(el, 200);

    const slider = screen.getByRole('slider', { name: 'Перемотка записи' });
    fireEvent.change(slider, { target: { value: '60' } });

    expect(el.currentTime).toBe(60);
    expect(screen.getByText('1:00 / 3:20')).toBeInTheDocument();
  });

  it('resets to the start, stopped, when the track changes', () => {
    const { rerender } = render(<AudioPlayer src="/audio/a.mp3" />);
    const el = getAudio();
    setDuration(el, 120);
    setCurrentTime(el, 45);
    fireEvent.play(el);
    expect(screen.getByRole('button', { name: 'Пауза' })).toBeInTheDocument();

    rerender(<AudioPlayer src="/audio/b.mp3" />);

    expect(getAudio().getAttribute('src')).toBe('/audio/b.mp3');
    expect(screen.getByRole('button', { name: 'Воспроизвести' })).toBeInTheDocument();
    expect(screen.getByText('0:00 / —:—')).toBeInTheDocument();
  });
});
