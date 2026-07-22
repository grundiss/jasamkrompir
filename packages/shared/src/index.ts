// Types and utilities shared between the API and the web frontend.

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Content DTOs (dates are ISO strings over the wire)
//
// The app is a bilingual Serbian reader with two content kinds:
//   - `text`  — a short Serbian passage with its Russian translation, split
//               into aligned paragraphs.
//   - `quest` — an interactive decision-based dialogue exercise (scenes with
//               reply choices that branch to other scenes or endings).
// ---------------------------------------------------------------------------

export type ContentKind = 'text' | 'quest';

// One passage rendered in both languages, aligned side by side.
export interface Paragraph {
  sr: string;
  ru: string;
}

export interface LocalizedText {
  sr: string;
  ru: string;
}

// Shared list-row fields for every content item (text or quest).
export interface ContentSummary {
  id: number;
  slug: string;
  kind: ContentKind;
  titleSr: string;
  titleRu: string;
  // Root-relative URL of an optional narration track (e.g. `/audio/<slug>.mp3`),
  // or `null` when the item has no recording. Quests typically have none.
  audioUrl: string | null;
}

/** @deprecated Prefer ContentSummary; kept as an alias for call-site clarity. */
export type TextSummary = ContentSummary;

// A linear bilingual text with its full aligned body.
export interface TextDetail extends ContentSummary {
  kind: 'text';
  paragraphs: Paragraph[];
  createdAt: string;
}

export type QuestChoiceQuality = 'best' | 'acceptable' | 'poor';

export interface QuestChoice {
  id: string;
  text: LocalizedText;
  quality: QuestChoiceQuality;
  feedback: LocalizedText;
  nextSceneId: string;
}

export interface QuestScene {
  id: string;
  speaker: 'employee';
  phase: LocalizedText;
  employee: LocalizedText;
  promptRu: string;
  choices: QuestChoice[];
}

export interface QuestEnding {
  id: string;
  type: 'success' | 'partial';
  titleSr: string;
  titleRu: string;
  text: LocalizedText;
}

export interface QuestVocabularyItem {
  sr: string;
  ru: string;
  exampleSr: string;
  exampleRu: string;
}

// An interactive dialogue quest with its full graph.
export interface QuestDetail extends ContentSummary {
  kind: 'quest';
  description: LocalizedText;
  intro: LocalizedText;
  objective: LocalizedText;
  startSceneId: string;
  scenes: QuestScene[];
  endings: QuestEnding[];
  vocabulary: QuestVocabularyItem[];
  createdAt: string;
}

export type ContentDetail = TextDetail | QuestDetail;

// Response of `GET /api/texts`.
export interface TextListResponse {
  texts: ContentSummary[];
}
