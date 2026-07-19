import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { detailById, SUMMARIES } from './test/fixtures';

vi.mock('./lib/api', () => ({
  api: { getText: vi.fn(), getTexts: vi.fn() },
}));

import { api } from './lib/api';
const getTexts = vi.mocked(api.getTexts);
const getText = vi.mocked(api.getText);

beforeEach(() => {
  getTexts.mockReset();
  getText.mockReset();
  getTexts.mockResolvedValue({ texts: SUMMARIES });
  getText.mockImplementation((id: number) => Promise.resolve(detailById(id)));
});

describe('App', () => {
  it('lists the texts and opens the first one', async () => {
    render(<App />);

    expect(await screen.findByRole('button', { name: /Naslov A/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Naslov B/ })).toBeInTheDocument();
    // First text opens by default, in the reading pane.
    expect(await screen.findByText('Srpski A1')).toBeInTheDocument();
  });

  it('keeps the chosen reading mode when switching to another text', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('Srpski A1');

    // Pick "Serbian only" while reading the first text.
    await user.click(screen.getByRole('button', { name: 'Только сербский' }));
    expect(screen.queryByText('Перевод A1')).not.toBeInTheDocument();

    // Open the second text.
    await user.click(screen.getByRole('button', { name: /Naslov B/ }));
    await screen.findByText('Srpski B1');

    // The mode carried over: still Serbian only, no translation, no reveal controls.
    expect(screen.getByRole('button', { name: 'Только сербский' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.queryByText('Перевод B1')).not.toBeInTheDocument();
    // Serbian-only paragraphs aren't interactive tap targets.
    expect(screen.queryByRole('button', { name: 'Srpski B1' })).not.toBeInTheDocument();
  });

  it('surfaces an error when the text list fails to load', async () => {
    getTexts.mockRejectedValue(new Error('Boom'));
    render(<App />);

    expect(await screen.findByText('Boom')).toBeInTheDocument();
  });
});
