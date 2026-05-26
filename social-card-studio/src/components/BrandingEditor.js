import { store } from '../state/store.js';

export function renderBrandingEditor() {
  const b = store.getState().branding;
  
  return `
    <h2 class="section-title">Brand Colors</h2>
    
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Primary Accent (Cyan)</label>
        <div style="display:flex; gap:8px;">
          <input type="color" id="in-br-cyan" value="${b.accentCyan}" style="width:40px; height:40px; padding:0; border:none; border-radius:4px;">
          <input type="text" class="form-input" id="in-br-cyan-text" value="${b.accentCyan}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Secondary Accent (Blue)</label>
        <div style="display:flex; gap:8px;">
          <input type="color" id="in-br-blue" value="${b.accentBlue}" style="width:40px; height:40px; padding:0; border:none; border-radius:4px;">
          <input type="text" class="form-input" id="in-br-blue-text" value="${b.accentBlue}">
        </div>
      </div>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Tertiary Accent (Purple)</label>
        <div style="display:flex; gap:8px;">
          <input type="color" id="in-br-purple" value="${b.accentPurple}" style="width:40px; height:40px; padding:0; border:none; border-radius:4px;">
          <input type="text" class="form-input" id="in-br-purple-text" value="${b.accentPurple}">
        </div>
      </div>
    </div>

    <h2 class="section-title mt-6">Background Colors</h2>
    
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Background Main</label>
        <div style="display:flex; gap:8px;">
          <input type="color" id="in-br-bgmain" value="${b.bgMain}" style="width:40px; height:40px; padding:0; border:none; border-radius:4px;">
          <input type="text" class="form-input" id="in-br-bgmain-text" value="${b.bgMain}">
        </div>
      </div>
    </div>
  `;
}

export function initBrandingEditor() {
  const updateStore = (key, value) => {
    store.setState(state => ({
      branding: {
        ...state.branding,
        [key]: value
      }
    }));
  };

  const bindColor = (idColor, idText, key) => {
    const elColor = document.getElementById(idColor);
    const elText = document.getElementById(idText);
    
    if (elColor && elText) {
      elColor.addEventListener('input', (e) => {
        elText.value = e.target.value;
        updateStore(key, e.target.value);
      });
      elText.addEventListener('input', (e) => {
        elColor.value = e.target.value;
        updateStore(key, e.target.value);
      });
    }
  };

  bindColor('in-br-cyan', 'in-br-cyan-text', 'accentCyan');
  bindColor('in-br-blue', 'in-br-blue-text', 'accentBlue');
  bindColor('in-br-purple', 'in-br-purple-text', 'accentPurple');
  bindColor('in-br-bgmain', 'in-br-bgmain-text', 'bgMain');
}

// Global listener for branding changes to apply CSS vars
export function applyBrandingToRoot() {
  store.subscribe((state) => {
    const root = document.documentElement;
    const b = state.branding;
    root.style.setProperty('--accent-cyan', b.accentCyan);
    root.style.setProperty('--accent-blue', b.accentBlue);
    root.style.setProperty('--accent-purple', b.accentPurple);
    root.style.setProperty('--bg-main', b.bgMain);
  });
}
