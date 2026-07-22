import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { QuestPlayer } from './QuestPlayer';
import { QUEST_A } from '../../test/fixtures';

describe('QuestPlayer', () => {
  it('starts at the first scene with employee message and choices', () => {
    render(<QuestPlayer quest={QUEST_A} mode="both" />);

    expect(screen.getByText('Zdravo od operatera')).toBeInTheDocument();
    expect(screen.getByText('Здравствуйте от оператора')).toBeInTheDocument();
    expect(screen.getByText('Как ответить?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ljubazan odgovor/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Grub odgovor/ })).toBeInTheDocument();
  });

  it('shows feedback, locks further selection, and continues to the next scene', async () => {
    const user = userEvent.setup();
    render(<QuestPlayer quest={QUEST_A} mode="both" />);

    const best = screen.getByRole('button', { name: /Ljubazan odgovor/ });
    const poor = screen.getByRole('button', { name: /Grub odgovor/ });

    await user.click(best);

    expect(screen.getByText('Odlično!')).toBeInTheDocument();
    expect(screen.getAllByText('Лучший ответ').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument();

    // Locked: clicking the other choice does nothing.
    await user.click(poor);
    expect(screen.queryByText('Pregrubo.')).not.toBeInTheDocument();
    expect(best).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Продолжить' }));
    expect(screen.getByText('Šta očekujete?')).toBeInTheDocument();
    expect(screen.getByText('Сформулируй требование.')).toBeInTheDocument();
  });

  it('reaches the success ending along the best path and can restart', async () => {
    const user = userEvent.setup();
    render(<QuestPlayer quest={QUEST_A} mode="both" />);

    await user.click(screen.getByRole('button', { name: /Ljubazan odgovor/ }));
    await user.click(screen.getByRole('button', { name: 'Продолжить' }));
    await user.click(screen.getByRole('button', { name: /Tražim rešenje/ }));
    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    expect(screen.getByText('Uspeh')).toBeInTheDocument();
    expect(screen.getByText('Успех')).toBeInTheDocument();
    expect(screen.getByText('Sve je u redu.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Начать квест заново' }));
    expect(screen.getByText('Zdravo od operatera')).toBeInTheDocument();
    expect(screen.queryByText('Uspeh')).not.toBeInTheDocument();
  });

  it('opens and closes vocabulary from the ending', async () => {
    const user = userEvent.setup();
    render(<QuestPlayer quest={QUEST_A} mode="both" />);

    await user.click(screen.getByRole('button', { name: /Ljubazan odgovor/ }));
    await user.click(screen.getByRole('button', { name: 'Продолжить' }));
    await user.click(screen.getByRole('button', { name: /Tražim rešenje/ }));
    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    await user.click(screen.getByRole('button', { name: 'Словарь' }));
    expect(screen.getByRole('heading', { name: 'Словарь' })).toBeInTheDocument();
    expect(screen.getByText('pošiljka')).toBeInTheDocument();
    expect(screen.getByText('посылка')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'К результату' }));
    expect(screen.getByText('Uspeh')).toBeInTheDocument();
  });

  it('supports keyboard selection of a choice', async () => {
    const user = userEvent.setup();
    render(<QuestPlayer quest={QUEST_A} mode="both" />);

    const best = screen.getByRole('button', { name: /Ljubazan odgovor/ });
    best.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Odlično!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument();
  });

  it('keeps the Russian prompt visible in serbianOnly mode', () => {
    render(<QuestPlayer quest={QUEST_A} mode="serbianOnly" />);

    expect(screen.getByText('Zdravo od operatera')).toBeInTheDocument();
    expect(screen.queryByText('Здравствуйте от оператора')).not.toBeInTheDocument();
    expect(screen.getByText('Как ответить?')).toBeInTheDocument();
  });

  it('peeks a choice translation on hover in reveal mode without selecting', async () => {
    const user = userEvent.setup();
    render(<QuestPlayer quest={QUEST_A} mode="reveal" />);

    const best = screen.getByRole('button', { name: /Ljubazan odgovor/ });
    expect(screen.queryByText('Вежливый ответ')).not.toBeInTheDocument();

    await user.hover(best);
    expect(screen.getByText('Вежливый ответ')).toBeInTheDocument();
    // Hover only peeks — does not lock in a choice.
    expect(best).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByText('Odlično!')).not.toBeInTheDocument();

    await user.unhover(best);
    expect(screen.queryByText('Вежливый ответ')).not.toBeInTheDocument();
  });

  it('resets progress when a different quest id is passed', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<QuestPlayer quest={QUEST_A} mode="both" />);

    await user.click(screen.getByRole('button', { name: /Ljubazan odgovor/ }));
    expect(screen.getByText('Odlično!')).toBeInTheDocument();

    const other = {
      ...QUEST_A,
      id: 99,
      titleSr: 'Other',
      startSceneId: 's1',
    };
    rerender(<QuestPlayer quest={other} mode="both" />);

    expect(screen.queryByText('Odlično!')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ljubazan odgovor/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('exposes an accessible group label for reply choices', () => {
    render(<QuestPlayer quest={QUEST_A} mode="both" />);
    const group = screen.getByRole('group', { name: 'Варианты ответа' });
    expect(within(group).getAllByRole('button')).toHaveLength(2);
  });
});
