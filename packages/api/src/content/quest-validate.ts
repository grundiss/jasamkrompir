import type {
  LocalizedText,
  QuestChoice,
  QuestChoiceQuality,
  QuestEnding,
  QuestScene,
  QuestVocabularyItem,
} from '@jasamkrompir/shared';

// Authoring shape for a seed quest. Matches the content JSON and is validated
// before insert so a broken graph fails loudly at seed time.

export interface SeedQuest {
  slug: string;
  kind: 'quest';
  titleSr: string;
  titleRu: string;
  position: number;
  descriptionSr: string;
  descriptionRu: string;
  intro: LocalizedText;
  objective: LocalizedText;
  startSceneId: string;
  scenes: QuestScene[];
  endings: QuestEnding[];
  vocabulary: QuestVocabularyItem[];
}

const QUALITIES: ReadonlySet<QuestChoiceQuality> = new Set(['best', 'acceptable', 'poor']);
const ENDING_TYPES: ReadonlySet<QuestEnding['type']> = new Set(['success', 'partial']);

export function validateQuestGraph(quest: SeedQuest): void {
  const sceneIds = new Set(quest.scenes.map((s) => s.id));
  const endingIds = new Set(quest.endings.map((e) => e.id));

  if (sceneIds.size !== quest.scenes.length) {
    throw new Error(`Quest "${quest.slug}": duplicate scene ids`);
  }
  if (endingIds.size !== quest.endings.length) {
    throw new Error(`Quest "${quest.slug}": duplicate ending ids`);
  }
  for (const id of sceneIds) {
    if (endingIds.has(id)) {
      throw new Error(`Quest "${quest.slug}": id "${id}" is both a scene and an ending`);
    }
  }

  if (!sceneIds.has(quest.startSceneId)) {
    throw new Error(`Quest "${quest.slug}": startSceneId "${quest.startSceneId}" does not exist`);
  }

  for (const scene of quest.scenes) {
    if (scene.speaker !== 'employee') {
      throw new Error(`Quest "${quest.slug}": scene "${scene.id}" has invalid speaker`);
    }
    if (scene.choices.length === 0) {
      throw new Error(`Quest "${quest.slug}": scene "${scene.id}" has no choices`);
    }
    const choiceIds = new Set(scene.choices.map((c) => c.id));
    if (choiceIds.size !== scene.choices.length) {
      throw new Error(`Quest "${quest.slug}": scene "${scene.id}" has duplicate choice ids`);
    }
    for (const choice of scene.choices) {
      validateChoice(quest.slug, scene.id, choice, sceneIds, endingIds);
    }
  }

  for (const ending of quest.endings) {
    if (!ENDING_TYPES.has(ending.type)) {
      throw new Error(`Quest "${quest.slug}": ending "${ending.id}" has invalid type`);
    }
  }
}

function validateChoice(
  slug: string,
  sceneId: string,
  choice: QuestChoice,
  sceneIds: Set<string>,
  endingIds: Set<string>,
): void {
  if (!QUALITIES.has(choice.quality)) {
    throw new Error(
      `Quest "${slug}": choice "${choice.id}" in scene "${sceneId}" has invalid quality`,
    );
  }
  const next = choice.nextSceneId;
  if (!sceneIds.has(next) && !endingIds.has(next)) {
    throw new Error(
      `Quest "${slug}": choice "${choice.id}" nextSceneId "${next}" is not a scene or ending`,
    );
  }
}

export function assertLocalized(label: string, value: LocalizedText): void {
  if (!value.sr?.trim() || !value.ru?.trim()) {
    throw new Error(`${label} must have non-empty sr and ru`);
  }
}
