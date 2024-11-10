import type { TimeEntry, Tag } from '../types';

const STORAGE_KEYS = {
  TIME_ENTRIES: 'time_entries',
  TAGS: 'tags'
};

export const storage = {
  getTimeEntries(): TimeEntry[] {
    const entries = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    return entries ? JSON.parse(entries) : [];
  },

  saveTimeEntries(entries: TimeEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(entries));
  },

  getTags(): Tag[] {
    const tags = localStorage.getItem(STORAGE_KEYS.TAGS);
    return tags ? JSON.parse(tags) : [];
  },

  saveTags(tags: Tag[]): void {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  }
};

// Helper function to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
