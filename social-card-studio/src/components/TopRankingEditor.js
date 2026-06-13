import Sortable from 'sortablejs';
import { store } from '../state/store.js';
import { createIcons, GripVertical, Copy, Trash2, Plus } from 'lucide';

// Safe document.getElementById wrapper to prevent crashes in other unmounted preview components
const originalGetElementById = document.getElementById;
document.getElementById = function(id) {
  const element = originalGetElementById.call(document, id);
  if (element) return element;
  
  const scPreviewIds = [
    'prev-name', 'prev-handle', 'prev-rank', 'prev-metric-main-val', 
    'prev-metric-main-lbl', 'prev-subs', 'prev-earn', 'prev-badge', 
    'prev-avatar', 'prev-glow', 'prev-flag-container'
  ];
  if (scPreviewIds.includes(id)) {
    return {
      style: {},
      set textContent(val) {},
      get textContent() { return ''; },
      set innerHTML(val) {},
      get innerHTML() { return ''; },
      set src(val) {},
      get src() { return ''; }
    };
  }
  return null;
};

async function fetchAvatarAsBase64(url) {
  if (!url) return '';
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Failed to fetch avatar as base64', url, err);
    return ''; // fallback to no avatar
  }
}

export function renderTopRankingEditor() {
  const tr = store.getState().topRanking;
  const isTop1To10 = document.getElementById('view-title')?.textContent === 'Top 1-10 Ranking';

  return `
    <h2 class="section-title">Ranking Config</h2>
    
    <div class="form-group">
      <label class="form-label">Main Title</label>
      <input type="text" class="form-input" id="tr-in-title" value="${tr.title}">
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Category</label>
        <input type="text" class="form-input" id="tr-in-subtitle" value="${tr.subtitle}">
      </div>
      <div class="form-group">
        <div style="display: flex; gap: 16px;">
          <div style="flex: 1;">
            <label class="form-label">Period</label>
            <input type="text" class="form-input" id="tr-in-period" value="${tr.period}">
          </div>
          <div style="flex: 1;">
            <label class="form-label">Date</label>
            <input type="text" class="form-input" id="tr-in-date" value="${tr.date || ''}">
          </div>
        </div>
      </div>
    </div>

    ${isTop1To10 ? `
    <div style="margin-top: 24px; margin-bottom: -8px;">
      <button class="btn" id="btn-load-viewlytics" style="width: 100%; background-color: #00E5FF; color: #000000; font-weight: bold; border: none; padding: 10px 16px; border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span id="btn-load-viewlytics-text">⬇ Cargar Top Viewlytics</span>
      </button>
    </div>
    ` : ''}

    <div class="flex items-center justify-between mt-6 mb-4">
      <h2 class="section-title" style="margin:0; border:none; padding:0;">Creators List</h2>
      <button class="btn btn-secondary" style="padding: 6px 12px;" id="btn-add-channel">
        <i data-lucide="plus"></i> Add
      </button>
    </div>
    
    <div class="editor-list" id="ranking-list-editor">
      <!-- Generated via JS -->
    </div>
  `;
}

export function renderListEditorItems(items) {
  if (!items) return '';
  
  return items.map((item, index) => `
    <div class="editor-list-item" data-id="${item.id}">
      <div class="editor-row-top">
        <i data-lucide="grip-vertical" class="drag-handle"></i>
        <div style="flex:1; font-weight:700; font-size:1.1rem; color: var(--accent-cyan);">#${index + 1}</div>
        <button class="btn-icon btn-dup-item" title="Duplicate"><i data-lucide="copy"></i></button>
        <button class="btn-icon btn-del-item" title="Delete Creator" style="color: var(--danger-red);"><i data-lucide="trash-2"></i></button>
      </div>
      
      <div class="editor-row-inputs">
        <div style="grid-column: span 2;">
          <label class="form-label">Avatar (Upload)</label>
          <input type="file" class="form-input row-input-avatar" accept="image/*">
        </div>
        <div>
          <label class="form-label">Name</label>
          <input type="text" class="form-input row-input-name" value="${item.name}">
        </div>
        <div>
          <label class="form-label">Tag / Label</label>
          <input type="text" class="form-input row-input-cat" value="${item.cat}" placeholder="@username o Tag">
        </div>
        <div>
          <label class="form-label">Main Metric (Views)</label>
          <input type="text" class="form-input row-input-views" value="${item.views}">
        </div>
        <div>
          <label class="form-label">Sub Metric (Subs)</label>
          <input type="text" class="form-input row-input-subs" value="${item.subs}">
        </div>
        <div>
          <label class="form-label">Position Change</label>
          <div style="display: flex; gap: 8px;">
            <select class="form-input row-input-rankchange" style="flex: 2;">
              <option value="same" ${item.rankChange === 'same' ? 'selected' : ''}>Maintained (—)</option>
              <option value="up" ${item.rankChange === 'up' ? 'selected' : ''}>Moved Up (▲)</option>
              <option value="down" ${item.rankChange === 'down' ? 'selected' : ''}>Moved Down (▼)</option>
            </select>
            <input type="number" class="form-input row-input-ranknum" style="flex: 1;" value="${item.rankChangeNum || ''}" min="1" placeholder="#">
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function formatMetric(num) {
  const val = Number(num);
  if (isNaN(val) || val === null || val === undefined) return '';
  if (val >= 1000000000) {
    return parseFloat((val / 1000000000).toFixed(2)) + 'B';
  }
  if (val >= 1000000) {
    return parseFloat((val / 1000000).toFixed(2)) + 'M';
  }
  if (val >= 1000) {
    return parseFloat((val / 1000).toFixed(2)) + 'K';
  }
  return val.toString();
}

export function initTopRankingEditor() {
  const updateStore = (key, value) => {
    store.setState(state => ({
      ...state,
      topRanking: {
        ...state.topRanking,
        [key]: value
      }
    }));
  };

  const titleIn = document.getElementById('tr-in-title');
  if (titleIn) titleIn.addEventListener('input', e => updateStore('title', e.target.value));

  const subtitleIn = document.getElementById('tr-in-subtitle');
  if (subtitleIn) subtitleIn.addEventListener('input', e => updateStore('subtitle', e.target.value));

  const periodIn = document.getElementById('tr-in-period');
  if (periodIn) periodIn.addEventListener('input', e => updateStore('period', e.target.value));

  const dateIn = document.getElementById('tr-in-date');
  if (dateIn) dateIn.addEventListener('input', e => updateStore('date', e.target.value));

  const el = document.getElementById('ranking-list-editor');
  let sortableInstance = null;

  function initSortable() {
    if (sortableInstance) sortableInstance.destroy();
    if (el) {
      sortableInstance = Sortable.create(el, {
        handle: '.drag-handle',
        animation: 150,
        onEnd: function (evt) {
          const items = [...store.getState().topRanking.items];
          const movedItem = items[evt.oldIndex];
          items.splice(evt.oldIndex, 1);
          items.splice(evt.newIndex, 0, movedItem);
          
          updateStore('items', items);
          if (el) {
            el.innerHTML = renderListEditorItems(items);
            initSortable();
            createIcons({ icons: { GripVertical, Copy, Trash2, Plus }, nameAttr: 'data-lucide' });
          }
        },
      });
    }
  }

  if (el) {
    el.innerHTML = renderListEditorItems(store.getState().topRanking.items);
    initSortable();
    createIcons({ icons: { GripVertical, Copy, Trash2, Plus }, nameAttr: 'data-lucide' });
  }

  // Delegated events for list inputs
  el?.addEventListener('change', (e) => {
    if (e.target.classList.contains('row-input-avatar')) {
      const row = e.target.closest('.editor-list-item');
      if (!row) return;
      
      const id = parseInt(row.dataset.id);
      const items = [...store.getState().topRanking.items];
      const index = items.findIndex(i => i.id === id);
      if (index === -1) return;

      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          items[index].avatar = ev.target.result;
          updateStore('items', items);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const handleItemUpdate = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
      if (e.target.type === 'file') return;
      
      const row = e.target.closest('.editor-list-item');
      if (!row) return;
      
      const id = parseInt(row.dataset.id);
      const items = [...store.getState().topRanking.items];
      const index = items.findIndex(i => i.id === id);
      if (index === -1) return;

      const newItem = { ...items[index] };

      if (e.target.classList.contains('row-input-name')) newItem.name = e.target.value;
      if (e.target.classList.contains('row-input-cat')) newItem.cat = e.target.value;
      if (e.target.classList.contains('row-input-views')) newItem.views = e.target.value;
      if (e.target.classList.contains('row-input-subs')) newItem.subs = e.target.value;
      if (e.target.classList.contains('row-input-rankchange')) newItem.rankChange = e.target.value;
      if (e.target.classList.contains('row-input-ranknum')) newItem.rankChangeNum = e.target.value;

      items[index] = newItem;
      updateStore('items', items);
    }
  };

  el?.addEventListener('input', handleItemUpdate);
  el?.addEventListener('change', handleItemUpdate);

  // Delegated buttons
  document.getElementById('btn-add-channel')?.addEventListener('click', () => {
    const items = [...store.getState().topRanking.items];
    items.push({
      id: Date.now(),
      name: 'New Creator',
      cat: '@username',
      views: '0M',
      subs: '0K',
      rankChange: 'same',
      rankChangeNum: '',
      avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
    });
    updateStore('items', items);
    if (el) {
      el.innerHTML = renderListEditorItems(items);
      initSortable();
      createIcons({ icons: { GripVertical, Copy, Trash2, Plus }, nameAttr: 'data-lucide' });
    }
  });

  // Load Viewlytics button integration
  const loadBtn = document.getElementById('btn-load-viewlytics');
  if (loadBtn) {
    loadBtn.addEventListener('click', async () => {
      const textSpan = document.getElementById('btn-load-viewlytics-text');
      const originalText = textSpan.innerHTML;
      try {
        loadBtn.disabled = true;
        textSpan.innerHTML = `<span class="spinner" style="display:inline-block; width:12px; height:12px; border:2px solid #000; border-radius:50%; border-top-color:transparent; animation:spin 1s linear infinite; margin-right:8px; vertical-align: middle;"></span> Cargando...`;
        
        if (!document.getElementById('viewlytics-spinner-styles')) {
          const style = document.createElement('style');
          style.id = 'viewlytics-spinner-styles';
          style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
          document.head.appendChild(style);
        }

        const response = await fetch('https://viewlytics-production.up.railway.app/api/rankings/impact-total?limit=50');
        if (!response.ok) {
          throw new Error(`Error de servidor: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!data || !Array.isArray(data.results)) {
          throw new Error('Respuesta del servidor inválida (sin results)');
        }

        // Fetch avatars in parallel and map creator properties
        const creators = await Promise.all(data.results.map(async (result, index) => {
          const slug = result.slug;
          const displayName = result.displayName || 'Creator';
          const cat = slug ? `@${slug}` : `@${displayName.toLowerCase().replace(/\s+/g, '')}`;
          const avatarBase64 = await fetchAvatarAsBase64(result.avatarUrl);
          
          return {
            id: Date.now() + index,
            name: displayName,
            cat: cat,
            views: formatMetric(result.impactTotal30d),
            subs: formatMetric(result.subscribers),
            rankChange: 'same',
            rankChangeNum: '',
            avatar: avatarBase64
          };
        }));

        updateStore('items', creators);
        if (el) {
          el.innerHTML = renderListEditorItems(creators);
          initSortable();
          createIcons({ icons: { GripVertical, Copy, Trash2, Plus }, nameAttr: 'data-lucide' });
        }
      } catch (err) {
        console.error(err);
        alert(`Error al cargar el ranking: ${err.message}`);
      } finally {
        loadBtn.disabled = false;
        textSpan.innerHTML = originalText;
      }
    });
  }

  el?.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.btn-del-item');
    if (delBtn) {
      const row = delBtn.closest('.editor-list-item');
      const id = parseInt(row.dataset.id);
      let items = [...store.getState().topRanking.items];
      items = items.filter(i => i.id !== id);
      updateStore('items', items);
      if (el) {
        el.innerHTML = renderListEditorItems(items);
        initSortable();
        createIcons({ icons: { GripVertical, Copy, Trash2, Plus }, nameAttr: 'data-lucide' });
      }
    }

    const dupBtn = e.target.closest('.btn-dup-item');
    if (dupBtn) {
      const row = dupBtn.closest('.editor-list-item');
      const id = parseInt(row.dataset.id);
      const items = [...store.getState().topRanking.items];
      const index = items.findIndex(i => i.id === id);
      if (index > -1) {
        const copy = JSON.parse(JSON.stringify(items[index]));
        copy.id = Date.now();
        items.splice(index + 1, 0, copy);
        updateStore('items', items);
        if (el) {
          el.innerHTML = renderListEditorItems(items);
          initSortable();
          createIcons({ icons: { GripVertical, Copy, Trash2, Plus }, nameAttr: 'data-lucide' });
        }
      }
    }
  });
}
