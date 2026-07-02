import type { LegalAnalysis } from "./legal-ai.functions";

const KEY = "legal-history-v1";
const MAX_ENTRIES = 100;

export interface HistoryEntry {
  id: string;
  createdAt: number;
  question: string;
  workspaceSlug?: string;
  workspaceName?: string;
  detailed?: boolean;
  result: LegalAnalysis;
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadHistory(): HistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: Omit<HistoryEntry, "id" | "createdAt">): HistoryEntry {
  const full: HistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  if (!isBrowser()) return full;
  const list = loadHistory();
  list.unshift(full);
  const trimmed = list.slice(0, MAX_ENTRIES);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // Storage may be full: drop oldest until it fits.
    while (trimmed.length > 1) {
      trimmed.pop();
      try {
        window.localStorage.setItem(KEY, JSON.stringify(trimmed));
        break;
      } catch {
        /* retry */
      }
    }
  }
  return full;
}

export function removeHistoryEntry(id: string) {
  if (!isBrowser()) return;
  const list = loadHistory().filter((e) => e.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function clearHistory() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEY);
}

export function getHistoryEntry(id: string): HistoryEntry | undefined {
  return loadHistory().find((e) => e.id === id);
}
