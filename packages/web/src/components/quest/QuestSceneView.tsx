import type { QuestChoice as QuestChoiceData, QuestScene } from '@jasamkrompir/shared';
import type { ReadingMode } from '../../lib/reading-mode';
import { LocalizedTextView } from './LocalizedTextView';
import { QuestChoiceButton } from './QuestChoice';
import { QuestFeedback } from './QuestFeedback';

export function QuestSceneView({
  scene,
  mode,
  selectedChoiceId,
  onSelect,
  onContinue,
}: {
  scene: QuestScene;
  mode: ReadingMode;
  selectedChoiceId: string | null;
  onSelect: (choice: QuestChoiceData) => void;
  onContinue: () => void;
}) {
  const selected = scene.choices.find((c) => c.id === selectedChoiceId) ?? null;
  const locked = selectedChoiceId != null;

  return (
    <section aria-labelledby={`scene-${scene.id}-phase`} className="space-y-6">
      <div>
        <p
          id={`scene-${scene.id}-phase`}
          className="text-xs font-semibold tracking-wide text-indigo-600 uppercase"
        >
          {mode === 'serbianOnly' ? scene.phase.sr : `${scene.phase.sr} · ${scene.phase.ru}`}
        </p>
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-slate-400">Оператор</p>
          <LocalizedTextView
            text={scene.employee}
            mode={mode}
            revealId={`scene-${scene.id}-employee`}
          />
        </div>
      </div>

      <p className="font-medium text-slate-700" role="status">
        {scene.promptRu}
      </p>

      <div role="group" aria-label="Варианты ответа" className="flex flex-col gap-3">
        {scene.choices.map((choice) => (
          <QuestChoiceButton
            key={choice.id}
            choice={choice}
            mode={mode}
            selected={choice.id === selectedChoiceId}
            locked={locked}
            onSelect={() => onSelect(choice)}
          />
        ))}
      </div>

      {selected && (
        <div className="space-y-4">
          <QuestFeedback feedback={selected.feedback} quality={selected.quality} mode={mode} />
          <button
            type="button"
            onClick={onContinue}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
          >
            Продолжить
          </button>
        </div>
      )}
    </section>
  );
}
