import { store } from '../state/store.js';

export function renderSingleCardEditor() {
  const sc = store.getState().singleCard;
  
  return `
    <h2 class="section-title">Creator Info</h2>
    
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Creator Name</label>
        <input type="text" class="form-input" id="in-name" value="${sc.name}">
      </div>
      <div class="form-group">
        <label class="form-label">Handle</label>
        <input type="text" class="form-input" id="in-handle" value="${sc.handle}">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-input" id="in-category">
          <option value="Podcast" ${sc.category === 'Podcast' ? 'selected' : ''}>Podcast</option>
          <option value="Gaming" ${sc.category === 'Gaming' ? 'selected' : ''}>Gaming</option>
          <option value="News" ${sc.category === 'News' ? 'selected' : ''}>News</option>
          <option value="Entertainment" ${sc.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
          <option value="Music" ${sc.category === 'Music' ? 'selected' : ''}>Music</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Ranking Position</label>
        <input type="text" class="form-input" id="in-rank" value="${sc.rank}">
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Avatar (Upload)</label>
      <input type="file" class="form-input" id="in-avatar" accept="image/*">
    </div>

    <h2 class="section-title mt-6">Metrics</h2>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Main Metric (Large)</label>
        <input type="text" class="form-input" id="in-metric-main-val" value="${sc.metricMainValue}">
      </div>
      <div class="form-group">
        <label class="form-label">Main Metric Label</label>
        <input type="text" class="form-input" id="in-metric-main-lbl" value="${sc.metricMainLabel}">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Subscribers</label>
        <input type="text" class="form-input" id="in-subs" value="${sc.subs}">
      </div>
      <div class="form-group">
        <label class="form-label">Earnings</label>
        <input type="text" class="form-input" id="in-earn" value="${sc.earnings}">
      </div>
    </div>

    <h2 class="section-title mt-6">Badge</h2>

    <div class="form-group">
      <label class="form-label">Trending Badge (e.g., 🔥 TRENDING)</label>
      <input type="text" class="form-input" id="in-badge" value="${sc.badge}">
    </div>

    <h2 class="section-title mt-6">Toggles</h2>
    
    <div class="switch-wrapper">
      <span class="switch-label">Dominican Flag</span>
      <label class="switch">
        <input type="checkbox" id="sw-flag" ${sc.showFlag ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </div>

    <div class="switch-wrapper">
      <span class="switch-label">Neon Glow Effect</span>
      <label class="switch">
        <input type="checkbox" id="sw-glow" ${sc.showGlow ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </div>
  `;
}

export function initSingleCardEditor() {
  const updateStore = (key, value) => {
    store.setState(state => ({
      ...state,
      singleCard: {
        ...state.singleCard,
        [key]: value
      }
    }));
  };

  const bindings = [
    { id: 'in-name', key: 'name', type: 'value' },
    { id: 'in-handle', key: 'handle', type: 'value' },
    { id: 'in-category', key: 'category', type: 'value' },
    { id: 'in-rank', key: 'rank', type: 'value' },
    { id: 'in-metric-main-val', key: 'metricMainValue', type: 'value' },
    { id: 'in-metric-main-lbl', key: 'metricMainLabel', type: 'value' },
    { id: 'in-subs', key: 'subs', type: 'value' },
    { id: 'in-earn', key: 'earnings', type: 'value' },
    { id: 'in-badge', key: 'badge', type: 'value' },
    { id: 'sw-flag', key: 'showFlag', type: 'checked' },
    { id: 'sw-glow', key: 'showGlow', type: 'checked' },
  ];

  bindings.forEach(b => {
    const el = document.getElementById(b.id);
    if (el) {
      el.addEventListener('input', (e) => {
        updateStore(b.key, e.target[b.type]);
      });
    }
  });

  // Handle avatar file upload to Base64 (needed for export without CORS issues)
  const avatarInput = document.getElementById('in-avatar');
  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          updateStore('avatar', ev.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }
}
