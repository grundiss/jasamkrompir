// Typed accessor for the desktop shell bridge exposed by the Electron preload as
// `window.jasamkrompir`. Absent in the browser dev app — callers must handle undefined.

// Mirrors src/shell/types.ts UpdateStatus in @jasamkrompir/desktop. Kept as a local
// copy because web cannot import from the desktop package.
export interface UpdateStatusLogEntry {
  at: string;
  status: UpdateStatus;
}

export type UpdateStatus =
  | { phase: 'idle' }
  | { phase: 'checking' }
  | { phase: 'up-to-date'; version: string }
  | { phase: 'available'; version: string; notes?: string }
  | { phase: 'downloading'; version: string; receivedBytes: number; totalBytes: number }
  | { phase: 'verifying'; version: string }
  | { phase: 'applying'; version: string }
  | { phase: 'installed'; version: string }
  | { phase: 'rolled-back'; failedVersion: string; activeVersion: string | null; error: string }
  | { phase: 'error'; error: string; version?: string };

export interface JaSamKrompirBridge {
  apiBaseUrl: string;
  appVersion: string;
  contentVersion: string;
  updatedTo: string | null;
  onUpdateStatus(cb: (status: UpdateStatus) => void): () => void;
  checkForUpdates(): Promise<void>;
  getUpdateStatusLog(): Promise<UpdateStatusLogEntry[]>;
}

declare global {
  interface Window {
    jasamkrompir?: JaSamKrompirBridge;
  }
}

export function getJaSamKrompir(): JaSamKrompirBridge | undefined {
  return typeof window !== 'undefined' ? window.jasamkrompir : undefined;
}
