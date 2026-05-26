import { getTemplates, saveTemplate, loadTemplate, deleteTemplate } from '../state/templates.js';
import { getHistory, restoreSnapshot } from '../state/history.js';

export function renderTemplatesEditor() {
  const templates = getTemplates();
  return `
    <h2 class="section-title">Save Current Template</h2>
    <div class="form-row">
      <input type="text" class="form-input" id="in-tpl-name" placeholder="My Awesome Template">
      <button class="btn btn-primary" id="btn-save-tpl">Save</button>
    </div>

    <h2 class="section-title mt-6">Saved Templates</h2>
    <div class="editor-list">
      ${templates.map(t => `
        <div class="editor-list-item" style="flex-direction:row; align-items:center; justify-content:space-between;">
          <div style="font-weight:700;">${t.name}</div>
          <div style="display:flex; gap:8px;">
            <button class="btn-icon btn-load-tpl" data-id="${t.id}" title="Load"><i data-lucide="download"></i></button>
            <button class="btn-icon btn-del-tpl" data-id="${t.id}" title="Delete"><i data-lucide="trash-2"></i></button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

export function initTemplatesEditor() {
  const btnSave = document.getElementById('btn-save-tpl');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const name = document.getElementById('in-tpl-name').value || 'Untitled Template';
      saveTemplate(name);
      // Re-render UI to show new template (quick hack: re-click tab)
      document.querySelector('.nav-item.active').click();
    });
  }

  document.querySelectorAll('.btn-load-tpl').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      loadTemplate(id);
    });
  });

  document.querySelectorAll('.btn-del-tpl').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      deleteTemplate(id);
      document.querySelector('.nav-item.active').click();
    });
  });

  if(window.lucide) window.lucide.createIcons();
}

export function renderHistoryEditor() {
  const history = getHistory();
  // reverse array so newest is at the top
  const historyList = [...history].reverse();

  return `
    <h2 class="section-title">Recent History</h2>
    <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.9rem;">Autosaves happen 1.5s after you stop typing.</p>
    
    <div class="editor-list">
      ${historyList.map(h => {
        const date = new Date(h.timestamp);
        const timeStr = date.toLocaleTimeString();
        return `
        <div class="editor-list-item" style="flex-direction:row; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-weight:700;">Snapshot</div>
            <div style="font-size:0.8rem; color:var(--text-secondary);">${timeStr}</div>
          </div>
          <button class="btn btn-secondary btn-restore-hist" data-id="${h.id}" style="padding:6px 12px;">Restore</button>
        </div>
        `;
      }).join('')}
    </div>
  `;
}

export function initHistoryEditor() {
  document.querySelectorAll('.btn-restore-hist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      restoreSnapshot(id);
    });
  });
}
