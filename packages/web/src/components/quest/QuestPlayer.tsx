import { useEffect, useMemo, useState } from 'react';
import type { QuestChoice, QuestDetail } from '@jasamkrompir/shared';
import type { ReadingMode } from '../../lib/reading-mode';
import { LocalizedTextView } from './LocalizedTextView';
import { QuestEndingView } from './QuestEndingView';
import { QuestSceneView } from './QuestSceneView';

type Phase =
  | { type: 'scene'; sceneId: string; selectedChoiceId: string | null }
  | { type: 'ending'; endingId: string; showVocabulary: boolean };

function initialPhase(startSceneId: string): Phase {
  return { type: 'scene', sceneId: startSceneId, selectedChoiceId: null };
}

export function QuestPlayer({ quest, mode }: { quest: QuestDetail; mode: ReadingMode }) {
  const [phase, setPhase] = useState<Phase>(() => initialPhase(quest.startSceneId));

  // Reset progress whenever a different quest is selected.
  useEffect(() => {
    setPhase(initialPhase(quest.startSceneId));
  }, [quest.id, quest.startSceneId]);

  const scenesById = useMemo(() => {
    const map = new Map(quest.scenes.map((s) => [s.id, s]));
    return map;
  }, [quest.scenes]);

  const endingsById = useMemo(() => {
    const map = new Map(quest.endings.map((e) => [e.id, e]));
    return map;
  }, [quest.endings]);

  const restart = () => setPhase(initialPhase(quest.startSceneId));

  const selectChoice = (choice: QuestChoice) => {
    setPhase((prev) => {
      if (prev.type !== 'scene' || prev.selectedChoiceId != null) return prev;
      return { ...prev, selectedChoiceId: choice.id };
    });
  };

  const continueFromScene = () => {
    setPhase((prev) => {
      if (prev.type !== 'scene' || prev.selectedChoiceId == null) return prev;
      const scene = scenesById.get(prev.sceneId);
      const choice = scene?.choices.find((c) => c.id === prev.selectedChoiceId);
      if (!choice) return prev;
      if (endingsById.has(choice.nextSceneId)) {
        return { type: 'ending', endingId: choice.nextSceneId, showVocabulary: false };
      }
      return { type: 'scene', sceneId: choice.nextSceneId, selectedChoiceId: null };
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 px-5 py-4">
        <LocalizedTextView text={quest.description} mode={mode} revealId="quest-desc" />
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Ситуация
          </p>
          <LocalizedTextView text={quest.intro} mode={mode} revealId="quest-intro" />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">Цель</p>
          <LocalizedTextView text={quest.objective} mode={mode} revealId="quest-objective" />
        </div>
      </div>

      {phase.type === 'scene' &&
        (() => {
          const scene = scenesById.get(phase.sceneId);
          if (!scene) {
            return <p className="text-sm text-rose-600">Сцена не найдена: {phase.sceneId}</p>;
          }
          return (
            <QuestSceneView
              scene={scene}
              mode={mode}
              selectedChoiceId={phase.selectedChoiceId}
              onSelect={selectChoice}
              onContinue={continueFromScene}
            />
          );
        })()}

      {phase.type === 'ending' &&
        (() => {
          const ending = endingsById.get(phase.endingId);
          if (!ending) {
            return <p className="text-sm text-rose-600">Финал не найден: {phase.endingId}</p>;
          }
          return (
            <QuestEndingView
              ending={ending}
              vocabulary={quest.vocabulary}
              mode={mode}
              showVocabulary={phase.showVocabulary}
              onToggleVocabulary={() =>
                setPhase((prev) =>
                  prev.type === 'ending' ? { ...prev, showVocabulary: !prev.showVocabulary } : prev,
                )
              }
              onRestart={restart}
            />
          );
        })()}
    </div>
  );
}
