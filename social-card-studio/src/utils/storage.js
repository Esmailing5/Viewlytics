const STORAGE_KEY = 'viewlytics_studio_state';

export function saveState(key, data) {
  try {
    const currentState = loadAllState();
    currentState[key] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  } catch (err) {
    console.error('Failed to save state', err);
  }
}

export function loadState(key) {
  try {
    const currentState = loadAllState();
    return currentState[key] || null;
  } catch (err) {
    console.error('Failed to load state', err);
    return null;
  }
}

function loadAllState() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}
