import { STORAGE_KEYS } from "../storage/keys";
import { readJSON, writeJSON } from "../storage/jsonStorage";

export type HistoryItem = { name: string; image: string; visits: number };
export type LastVisited = {
  name: string;
  image: string;
  visitId: number;
  visitedAt: number;
};

function readHistory(): HistoryItem[] {
  return readJSON<HistoryItem[]>(STORAGE_KEYS.history, []);
}

function writeHistory(items: HistoryItem[]) {
  writeJSON(STORAGE_KEYS.history, items);
}

function readLastVisited(): LastVisited | null {
  return readJSON<LastVisited | null>(STORAGE_KEYS.lastVisited, null);
}

function writeLastVisited(v: LastVisited) {
  writeJSON(STORAGE_KEYS.lastVisited, v);
}

export const historyService = {
  list(): HistoryItem[] {
    return readHistory();
  },

  clear(): void {
    writeHistory([]);
  },

  registerVisit(payload: { name: string; image: string }): LastVisited {
    const items = readHistory();
    const idx = items.findIndex((i) => i.name === payload.name);

    if (idx >= 0) {
      items[idx] = { ...items[idx], visits: items[idx].visits + 1 };
      if (idx > 0) {
        const [moved] = items.splice(idx, 1);
        items.unshift(moved);
      }
    } else {
      items.unshift({ name: payload.name, image: payload.image, visits: 1 });
    }

    writeHistory(items);

    const prev = readLastVisited();
    const next: LastVisited = {
      name: payload.name,
      image: payload.image,
      visitId: (prev?.visitId ?? 0) + 1,
      visitedAt: Date.now(),
    };

    writeLastVisited(next);
    return next;
  },

  getLastVisited(): LastVisited | null {
    return readLastVisited();
  },

  getToastDismissedVisitId(): number | null {
    return readJSON<number | null>(STORAGE_KEYS.toastDismissedVisitId, null);
  },

  dismissToastForVisitId(visitId: number): void {
    writeJSON(STORAGE_KEYS.toastDismissedVisitId, visitId);
  },
};
