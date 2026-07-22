import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act, useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ContentDetail } from '@jasamkrompir/shared';
import { Reader } from './Reader';
import type { ReadingMode } from '../lib/reading-mode';
import { detailById, TEXT_A, TEXT_B } from '../test/fixtures';

vi.mock('../lib/api', () => ({
  api: { getText: vi.fn(), getTexts: vi.fn() },
}));

import { api } from '../lib/api';
const getText = vi.mocked(api.getText);

// Drives <Reader/> like <App/> does: the mode is held in state (so the
// switcher can change it), while the text id is a prop the test can rerender.
function Harness({ id, initialMode = 'both' }: { id: number; initialMode?: ReadingMode }) {
  const [mode, setMode] = useState<ReadingMode>(initialMode);
  return <Reader id={id} mode={mode} onModeChange={setMode} />;
}

beforeEach(() => {
  getText.mockReset();
  getText.mockImplementation((id: number) => Promise.resolve(detailById(id)));
});

describe('Reader — both mode', () => {
  it('shows the Serbian and Russian paragraphs together, as plain text', async () => {
    render(<Harness id={1} initialMode="both" />);

    expect(await screen.findByText('Srpski A1')).toBeInTheDocument();
    expect(screen.getByText('Перевод A1')).toBeInTheDocument();
    expect(screen.getByText('Srpski A2')).toBeInTheDocument();
    expect(screen.getByText('Перевод A2')).toBeInTheDocument();
    // Paragraphs aren't interactive in this mode.
    expect(screen.queryByRole('button', { name: 'Srpski A1' })).not.toBeInTheDocument();
  });
});

describe('Reader — serbianOnly mode', () => {
  it('shows only Serbian, with no translations and no interactive paragraphs', async () => {
    render(<Harness id={1} initialMode="serbianOnly" />);

    expect(await screen.findByText('Srpski A1')).toBeInTheDocument();
    expect(screen.getByText('Srpski A2')).toBeInTheDocument();
    expect(screen.queryByText('Перевод A1')).not.toBeInTheDocument();
    expect(screen.queryByText('Перевод A2')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Srpski A1' })).not.toBeInTheDocument();
  });
});

describe('Reader — reveal mode', () => {
  it('shows a translation only while the pointer is held, then hides on release', async () => {
    const user = userEvent.setup();
    render(<Harness id={1} initialMode="reveal" />);

    const p1 = await screen.findByRole('button', { name: 'Srpski A1' });
    const p2 = screen.getByRole('button', { name: 'Srpski A2' });
    expect(p1).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Перевод A1')).not.toBeInTheDocument();
    expect(screen.queryByText('Перевод A2')).not.toBeInTheDocument();

    // Press and hold the first paragraph.
    await user.pointer({ keys: '[MouseLeft>]', target: p1 });
    expect(screen.getByText('Перевод A1')).toBeInTheDocument();
    expect(p1).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByText('Перевод A2')).not.toBeInTheDocument();

    // Release — translation disappears.
    await user.pointer({ keys: '[/MouseLeft]' });
    expect(screen.queryByText('Перевод A1')).not.toBeInTheDocument();
    expect(p1).toHaveAttribute('aria-expanded', 'false');

    // Holding the second works the same way, independently.
    await user.pointer({ keys: '[MouseLeft>]', target: p2 });
    expect(screen.getByText('Перевод A2')).toBeInTheDocument();
    expect(screen.queryByText('Перевод A1')).not.toBeInTheDocument();
    await user.pointer({ keys: '[/MouseLeft]' });
    expect(screen.queryByText('Перевод A2')).not.toBeInTheDocument();
  });

  it('shows a translation while Enter/Space is held, hides on release or Esc', async () => {
    const user = userEvent.setup();
    render(<Harness id={1} initialMode="reveal" />);

    const p1 = await screen.findByRole('button', { name: 'Srpski A1' });
    p1.focus();

    await user.keyboard('{Enter>}');
    expect(screen.getByText('Перевод A1')).toBeInTheDocument();
    await user.keyboard('{/Enter}');
    expect(screen.queryByText('Перевод A1')).not.toBeInTheDocument();

    await user.keyboard('[Space>]');
    expect(screen.getByText('Перевод A1')).toBeInTheDocument();
    await user.keyboard('[/Space]');
    expect(screen.queryByText('Перевод A1')).not.toBeInTheDocument();

    // Esc also dismisses while held.
    await user.keyboard('{Enter>}');
    expect(screen.getByText('Перевод A1')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Перевод A1')).not.toBeInTheDocument();
  });

  it('resets revealed translations when the text changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Harness id={1} initialMode="reveal" />);

    const p1 = await screen.findByRole('button', { name: 'Srpski A1' });
    await user.pointer({ keys: '[MouseLeft>]', target: p1 });
    expect(screen.getByText('Перевод A1')).toBeInTheDocument();

    // Switch to another text — the new one loads collapsed.
    rerender(<Harness id={2} initialMode="reveal" />);
    const pB = await screen.findByRole('button', { name: 'Srpski B1' });
    expect(pB).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Перевод A1')).not.toBeInTheDocument();
    expect(screen.queryByText('Перевод B1')).not.toBeInTheDocument();
  });
});

describe('Reader — switching modes', () => {
  it('resets reveals: both shows all, reveal starts hidden again', async () => {
    const user = userEvent.setup();
    render(<Harness id={1} initialMode="reveal" />);

    const p1 = await screen.findByRole('button', { name: 'Srpski A1' });
    await user.pointer({ keys: '[MouseLeft>]', target: p1 });
    expect(screen.getByText('Перевод A1')).toBeInTheDocument();
    await user.pointer({ keys: '[/MouseLeft]' });

    // → both: every translation is shown.
    await user.click(screen.getByRole('button', { name: 'Сербский + перевод' }));
    expect(screen.getByText('Перевод A1')).toBeInTheDocument();
    expect(screen.getByText('Перевод A2')).toBeInTheDocument();

    // → reveal again: back to all-hidden.
    await user.click(screen.getByRole('button', { name: 'Перевод по нажатию' }));
    expect(screen.queryByText('Перевод A1')).not.toBeInTheDocument();
    expect(screen.queryByText('Перевод A2')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Srpski A1' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});

describe('Reader — audio', () => {
  it('shows the narration player for a text that has a recording', async () => {
    render(<Harness id={1} initialMode="both" />); // TEXT_A has audioUrl
    await screen.findByText('Srpski A1');

    expect(screen.getByRole('button', { name: 'Воспроизвести' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Перемотка записи' })).toBeInTheDocument();
  });

  it('shows no player for a text without a recording', async () => {
    render(<Harness id={2} initialMode="both" />); // TEXT_B has audioUrl: null
    await screen.findByText('Srpski B1');

    expect(screen.queryByRole('button', { name: 'Воспроизвести' })).not.toBeInTheDocument();
  });
});

describe('Reader — loading', () => {
  it('does not show the previous text while the next one loads, and keeps the mode', async () => {
    let resolveB: ((t: ContentDetail) => void) | undefined;
    getText.mockImplementation((id: number) => {
      if (id === TEXT_B.id) return new Promise<ContentDetail>((res) => (resolveB = res));
      return Promise.resolve(TEXT_A);
    });

    const { rerender } = render(<Harness id={1} initialMode="serbianOnly" />);
    await screen.findByText('Srpski A1');

    // Begin loading the second text.
    rerender(<Harness id={2} initialMode="serbianOnly" />);

    // Old content is gone immediately; a loading placeholder is shown instead.
    expect(screen.queryByText('Srpski A1')).not.toBeInTheDocument();
    expect(screen.getByText('Загрузка…')).toBeInTheDocument();
    // The mode switcher stays put so the chosen mode never flickers.
    expect(screen.getByRole('button', { name: 'Только сербский' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await act(async () => {
      resolveB?.(TEXT_B);
    });
    expect(await screen.findByText('Srpski B1')).toBeInTheDocument();
  });
});
