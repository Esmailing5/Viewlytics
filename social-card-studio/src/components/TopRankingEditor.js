import Sortable from 'sortablejs';
import { store } from '../state/store.js';
import { createIcons, GripVertical, Copy, Trash2, Plus } from 'lucide';

export function renderTopRankingEditor() {
  const tr = store.getState().topRanking;

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
