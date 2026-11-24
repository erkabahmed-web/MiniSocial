import { createInitialState } from './demoData.js';

const STORAGE_KEY = 'minisocial-v1';

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createInitialState();
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object') return createInitialState();
    return {
      ...createInitialState(),
      ...parsed,
      users: Array.isArray(parsed.users) ? parsed.users : [],
      friendships: Array.isArray(parsed.friendships) ? parsed.friendships : [],
      chats: Array.isArray(parsed.chats) ? parsed.chats : [],
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    return false;
  }
  return true;
}

export function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
