import type { PortalEntry } from './chat-portals';

type Listener = () => void;

const portalEntries = new Map<string, PortalEntry>();
const listeners = new Set<Listener>();

let snapshot: PortalEntry[] = [];
let snapshotDirty = true;
let notifyQueued = false;

function markDirty() {
  snapshotDirty = true;
}

function rebuildSnapshot() {
  snapshot = [...portalEntries.values()];
  snapshotDirty = false;
}

function notify() {
  if (notifyQueued) {
    return;
  }
  notifyQueued = true;
  requestAnimationFrame(() => {
    notifyQueued = false;
    for (const listener of listeners) {
      listener();
    }
  });
}

export function subscribeToChatPortals(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getChatPortalsSnapshot() {
  if (snapshotDirty) {
    rebuildSnapshot();
  }
  return snapshot;
}

export function upsertChatPortals(entries: PortalEntry[]) {
  if (entries.length === 0) {
    return;
  }
  let changed = false;
  for (const entry of entries) {
    const prev = portalEntries.get(entry.key);
    if (prev !== entry) {
      portalEntries.set(entry.key, entry);
      changed = true;
    }
  }
  if (changed) {
    markDirty();
    notify();
  }
}

export function deleteChatPortals(keys: string[] | undefined) {
  if (!keys || keys.length === 0) {
    return;
  }
  let changed = false;
  for (const key of keys) {
    if (portalEntries.delete(key)) {
      changed = true;
    }
  }
  if (changed) {
    markDirty();
    notify();
  }
}

export function clearChatPortals() {
  if (portalEntries.size === 0) {
    return;
  }
  portalEntries.clear();
  markDirty();
  notify();
}
