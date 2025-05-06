// src/utils/storage.js
// Storage utility functions
export const STORAGE_KEY = "moodJournalEntries";

export function saveEntry(entry) {
  const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const updated = [...entries.filter((e) => e.date !== entry.date), entry];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getAllEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function getTodayEntry(date) {
  const entries = getAllEntries();
  return entries.find((e) => e.date === date);
}