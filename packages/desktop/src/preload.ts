// The ONLY bridge between the sandboxed renderer and the shell. Deliberately
// tiny: it exposes the loopback API base URL (so the SPA knows where to fetch),
// a little version/update metadata, and a subscription to update-status events.
// No Node, no fs, no arbitrary IPC — just these named, typed channels.
import { contextBridge, ipcRenderer } from 'electron';

function argValue(prefix: string): string | null {
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

// Injected via webPreferences.additionalArguments at (re)create time (window.ts).
const apiBaseUrl = argValue('--jasamkrompir-api-url=') ?? '';
const appVersion = argValue('--jasamkrompir-app-version=') ?? '';
const contentVersion = argValue('--jasamkrompir-content-version=') ?? '';
const updatedTo = argValue('--jasamkrompir-updated-to='); // null unless just updated

export interface JaSamKrompirBridge {
  apiBaseUrl: string;
  appVersion: string;
  contentVersion: string;
  // Set once on the window created right after a successful update; lets the UI
  // show a single "Updated to vX" confirmation, then it's gone on next launch.
  updatedTo: string | null;
  // Subscribe to update lifecycle notifications. Returns an unsubscribe fn.
  onUpdateStatus(cb: (status: unknown) => void): () => void;
  // Optional manual "check now"; updates are automatic regardless.
  checkForUpdates(): Promise<void>;
  // Snapshot of recent update lifecycle events for diagnostics.
  getUpdateStatusLog(): Promise<unknown[]>;
}

const bridge: JaSamKrompirBridge = {
  apiBaseUrl,
  appVersion,
  contentVersion,
  updatedTo,
  onUpdateStatus(cb) {
    const listener = (_e: unknown, status: unknown): void => cb(status);
    ipcRenderer.on('jasamkrompir:update-status', listener);
    return () => ipcRenderer.removeListener('jasamkrompir:update-status', listener);
  },
  checkForUpdates() {
    return ipcRenderer.invoke('jasamkrompir:check-for-updates') as Promise<void>;
  },
  getUpdateStatusLog() {
    return ipcRenderer.invoke('jasamkrompir:get-update-status-log') as Promise<unknown[]>;
  },
};

contextBridge.exposeInMainWorld('jasamkrompir', bridge);
