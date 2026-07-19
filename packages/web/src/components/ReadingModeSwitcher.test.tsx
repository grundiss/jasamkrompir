import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReadingModeSwitcher } from './ReadingModeSwitcher';

describe('ReadingModeSwitcher', () => {
  it('renders the three modes and marks the active one as pressed', () => {
    render(<ReadingModeSwitcher mode="serbianOnly" onChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Сербский + перевод' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Только сербский' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Перевод по нажатию' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('reports the picked mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ReadingModeSwitcher mode="both" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Перевод по нажатию' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('reveal');
  });
});
