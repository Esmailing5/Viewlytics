import { store } from './store.js';
import { showToast } from '../utils/toast.js';

const HISTORY_KEY = 'vl_studio_history';
let history = [];

export function initHistory() {
  const saved = localStorage.getItem(HISTORY_KEY);
  if (saved) {
    try {
      history = JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse history', e);
    }
  }

  // Debounced auto-save
  let timeout;
  store.subscribe((state) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      saveSnapshot(state);
    }, 1500); // Save snapshot after 1.5s of no changes
  });
}

function saveSnapshot(state) {
  // Prevent duplicate consecutive states if nothing changed
  if (history.length > 0) {
    const last = history[history.length - 1];
    if (JSON.stringify(last.state) === JSON.stringify(state)) {
      return;
    }
  }

  const snapshot = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    state: JSON.parse(JSON.stringify(state)) // deep copy
  };

  history.push(snapshot);
  
  // Keep only last 20 snapshots
  if (history.length > 20) {
    history.shift();
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory() {
  return history;
}

export function restoreSnapshot(id) {
  const snap = history.find(h => h.id === id);
  if (snap) {
    store.setState(snap.state);
    showToast('Snapshot restored!', 'success');
  }
}
