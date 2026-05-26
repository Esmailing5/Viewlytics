import { store } from './store.js';
import { showToast } from '../utils/toast.js';

const TEMPLATES_KEY = 'vl_studio_templates';

export function getTemplates() {
  const saved = localStorage.getItem(TEMPLATES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse templates', e);
    }
  }
  
  // Default Templates
  return [
    {
      id: 1,
      name: 'Default Entertainment',
      state: store.getState() // initial state is a good default
    }
  ];
}

export function saveTemplate(name) {
  const templates = getTemplates();
  templates.push({
    id: Date.now(),
    name,
    state: JSON.parse(JSON.stringify(store.getState()))
  });
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  showToast(`Template "${name}" saved!`, 'success');
}

export function loadTemplate(id) {
  const templates = getTemplates();
  const template = templates.find(t => t.id === id);
  if (template) {
    store.setState(template.state);
    showToast(`Template "${template.name}" loaded!`, 'success');
  }
}

export function deleteTemplate(id) {
  let templates = getTemplates();
  templates = templates.filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  showToast('Template deleted', 'info');
}
