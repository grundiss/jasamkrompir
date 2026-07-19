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
// The app is a bilingual Serbian reader: each "page" is one `Text` — a short
// Serbian passage with its Russian translation, split into aligned paragraphs.
// ---------------------------------------------------------------------------

// One passage rendered in both languages, aligned side by side.
export interface Paragraph {
  sr: string;
  ru: string;
}

// A text as it appears in the reader's list (no body).
export interface TextSummary {
  id: number;
  slug: string;
  titleSr: string;
  titleRu: string;
  // Root-relative URL of an optional narration track (e.g. `/audio/<slug>.mp3`),
  // or `null` when the text has no recording. Not every text has audio.
  audioUrl: string | null;
}

// A single text with its full aligned body.
export interface TextDetail extends TextSummary {
  paragraphs: Paragraph[];
  createdAt: string;
}

// Response of `GET /api/texts`.
export interface TextListResponse {
  texts: TextSummary[];
}
