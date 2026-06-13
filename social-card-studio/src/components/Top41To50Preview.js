import '../styles/top-ranking.css';
import { store } from '../state/store.js';
import { createIcons, ChevronUp, ChevronDown, Minus } from 'lucide';

export function renderTop41To50Preview() {
  return `
    <div class="tr-preview" id="tr-preview-41">
      <div class="tr-noise"></div>
      <div class="watermark-overlay">
        ${Array(150).fill(`
          <div class="watermark-item">
            <svg style="width: 28px; height: 28px;" viewBox="0 -5 64 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2 L15 32 C18 38 25 40 30 35 L50 15" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" /><path d="M30 35 L60 5 L45 5 M60 5 L60 20" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" /><circle cx="20" cy="25" r="5" fill="currentColor" /></svg>
            <span>Viewlytics</span>
          </div>
        `).join('')}
      </div>
      
      <div class="safe-zone-wrapper" style="transform: scale(0.99); transform-origin: center center; flex: 1; display: flex; flex-direction: column; width: 100%; height: 100%; z-index: 2;">
        <div class="tr-header">
          <div class="tr-title-group">
            <div class="tr-subtitle" id="prev-tr-subtitle-41"></div>
            <div class="tr-title" id="prev-tr-title-41"></div>
          </div>
          <div class="tr-meta">
            <div class="tr-period" id="prev-tr-period-41"></div>
            <div class="tr-date" id="prev-tr-date-41"></div>
          </div>
        </div>

        <div class="tr-content">
          <div class="tr-list" id="prev-tr-list-41">
            <!-- Items injected via JS -->
          </div>
        </div>

        <div class="tr-footer">
          <div class="tr-source" style="display:flex; align-items:center; gap: 48px;">
            <span>DATA: SOCIALBLADE &bull; POWERED BY VIEWLYTICS</span>
            <span style="color: var(--accent-cyan); display: flex; align-items: center; gap: 14px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              @viewlyticsrd
            </span>
          </div>
          <div class="logo">
            <svg style="width: 36px; height: auto;" viewBox="0 -5 64 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2 L15 32 C18 38 25 40 30 35 L50 15" stroke="#0072ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" /><path d="M30 35 L60 5 L45 5 M60 5 L60 20" stroke="#00c6ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" /><circle cx="20" cy="25" r="5" fill="#00c6ff" /></svg>
            <span style="font-size:1.5rem; font-weight:800; font-family:var(--font-display);">Viewlytics</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initTop41To50Preview() {
  const render = (state) => {
    const tr = state.topRanking;
    
    const titleEl = document.getElementById('prev-tr-title-41');
    const subtitleEl = document.getElementById('prev-tr-subtitle-41');
    const periodEl = document.getElementById('prev-tr-period-41');
    const dateEl = document.getElementById('prev-tr-date-41');
    
    if (titleEl) titleEl.textContent = tr.title;
    if (subtitleEl) subtitleEl.textContent = tr.subtitle;
    if (periodEl) periodEl.textContent = tr.period;
    if (dateEl) {
      dateEl.textContent = tr.date || '';
      dateEl.style.display = tr.date ? 'inline-block' : 'none';
    }

    const container = document.getElementById('prev-tr-list-41');
    if (!container) return;

    const itemsToRender = tr.items.slice(40, 50);
    const sizeClass = itemsToRender.length <= 7 ? 'size-lg' : itemsToRender.length <= 10 ? 'size-md' : itemsToRender.length <= 15 ? 'size-sm' : 'size-xs';
    container.className = `tr-list ${sizeClass}`;
    
    const previewWrapper = document.getElementById('tr-preview-41');
    if (previewWrapper) previewWrapper.className = `tr-preview ${sizeClass}`;

    // Smart DOM Update
    if (container.children.length === itemsToRender.length) {
      itemsToRender.forEach((item, index) => {
        const row = container.children[index];
        
        const img = row.querySelector('.tr-avatar');
        if (img && img.src !== item.avatar) {
          img.src = item.avatar;
        }
        
        row.querySelector('.tr-name').textContent = item.name;
        
        const catEl = row.querySelector('.tr-cat');
        if (catEl) {
          catEl.textContent = item.cat || '';
          catEl.style.display = item.cat ? 'block' : 'none';
        }
        
        const statVals = row.querySelectorAll('.tr-stat-val');
        if (statVals.length >= 2) {
          statVals[0].textContent = item.views;
          statVals[1].textContent = item.subs;
        }

        const rcDiv = row.querySelector('.tr-rank-change');
        if (rcDiv) {
            const rcIcon = item.rankChange === 'up' ? 'chevron-up' : (item.rankChange === 'down' ? 'chevron-down' : 'minus');
            const numHtml = (item.rankChange !== 'same' && item.rankChangeNum) ? `<span style="margin-left: 2px;">${item.rankChangeNum}</span>` : '';
            rcDiv.className = `tr-rank-change ${item.rankChange || 'same'}`;
            rcDiv.innerHTML = `<i data-lucide="${rcIcon}"></i>${numHtml}`;
        }

        row.className = `tr-item`;
        row.setAttribute('data-rank', index + 41);
      });
      createIcons({
        icons: { ChevronUp, ChevronDown, Minus },
        nameAttr: 'data-lucide'
      });
      return;
    }

    // Full render
    container.innerHTML = itemsToRender.map((item, index) => {
      const rank = index + 41;
      const rcClass = item.rankChange || 'same';
      const rcIcon = rcClass === 'up' ? 'chevron-up' : (rcClass === 'down' ? 'chevron-down' : 'minus');
      const numHtml = (rcClass !== 'same' && item.rankChangeNum) ? `<span style="margin-left: 2px;">${item.rankChangeNum}</span>` : '';
      const catHtml = item.cat ? `<div class="tr-cat">${item.cat}</div>` : '';
      return `
        <div class="tr-item" data-rank="${rank}">
          <div class="tr-rank-number">#${rank}</div>
          <div class="tr-rank-change ${rcClass}">
             <i data-lucide="${rcIcon}"></i>${numHtml}
          </div>
          <img src="${item.avatar}" class="tr-avatar" crossOrigin="anonymous">
          <div class="tr-details">
            <div class="tr-name">${item.name}</div>
            ${catHtml}
          </div>
          <div class="tr-stats">
            <div class="tr-stat-block">
              <div class="tr-stat-val">${item.views}</div>
              <div class="tr-stat-lbl">Views</div>
            </div>
            <div class="tr-stat-block">
              <div class="tr-stat-val">${item.subs}</div>
              <div class="tr-stat-lbl">Subs</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    createIcons({
      icons: { ChevronUp, ChevronDown, Minus },
      nameAttr: 'data-lucide'
    });
  };

  store.subscribe(render);
  render(store.getState());
}
