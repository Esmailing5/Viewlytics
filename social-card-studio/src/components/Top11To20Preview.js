import '../styles/top-ranking.css';
import { store } from '../state/store.js';
import { createIcons, ChevronUp, ChevronDown, Minus } from 'lucide';

export function renderTop11To20Preview() {
  return `
    <div class="tr-preview" id="tr-preview-11">
      <div class="tr-noise"></div>
      <div class="watermark-overlay">
        ${Array(150).fill(`
          <div class="watermark-item">
            <svg style="width: 28px; height: 28px;" viewBox="0 -5 64 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2 L15 32 C18 38 25 40 30 35 L50 15" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" /><path d="M30 35 L60 5 L45 5 M60 5 L60 20" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" /><circle cx="20" cy="25" r="5" fill="currentColor" /></svg>
            <span>Viewlytics</span>
          </div>
        `).join('')}
      </div>
      
      <div class="safe-zone-wrapper" style="transform: scale(0.92); transform-origin: center center; flex: 1; display: flex; flex-direction: column; width: 100%; height: 100%; z-index: 2;">
        <div class="tr-header">
          <div class="tr-title-group">
            <div class="tr-subtitle" id="prev-tr-subtitle-11"></div>
            <div class="tr-title" id="prev-tr-title-11"></div>
          </div>
          <div class="tr-meta">
            <div class="tr-period" id="prev-tr-period-11"></div>
          </div>
        </div>

        <div class="tr-content">
          <div class="tr-list" id="prev-tr-list-11">
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

export function initTop11To20Preview() {
  const render = (state) => {
    const tr = state.topRanking;
    
    const titleEl = document.getElementById('prev-tr-title-11');
    const subtitleEl = document.getElementById('prev-tr-subtitle-11');
    const periodEl = document.getElementById('prev-tr-period-11');
    
    if (titleEl) titleEl.textContent = tr.title;
    if (subtitleEl) subtitleEl.textContent = tr.subtitle;
    if (periodEl) periodEl.textContent = tr.period;

    const container = document.getElementById('prev-tr-list-11');
    if (!container) return;

    const itemsToRender = tr.items.slice(10, 20);
    const sizeClass = itemsToRender.length <= 7 ? 'size-lg' : itemsToRender.length <= 10 ? 'size-md' : itemsToRender.length <= 15 ? 'size-sm' : 'size-xs';
    container.className = `tr-list ${sizeClass}`;
    
    const previewWrapper = document.getElementById('tr-preview-11');
    if (previewWrapper) previewWrapper.className = `tr-preview ${sizeClass}`;

    // Smart DOM Update: If the number of items hasn't changed, update in-place.
    // This prevents the browser from destroying and recreating <img> tags, 
    // which causes flickering with large Base64 strings.
    if (container.children.length === itemsToRender.length) {
      itemsToRender.forEach((item, index) => {
        const row = container.children[index];
        
        const img = row.querySelector('.tr-avatar');
        if (img && img.src !== item.avatar) {
          img.src = item.avatar;
        }
        
        row.querySelector('.tr-name').textContent = item.name;
        row.querySelector('.tr-cat').textContent = item.cat;
        
        const rankNumber = row.querySelector('.tr-rank-number');
        if (rankNumber) rankNumber.textContent = '#' + (index + 11);
        
        const statVals = row.querySelectorAll('.tr-stat-val');
        if (statVals.length >= 2) {
          statVals[0].textContent = item.views;
          statVals[1].textContent = item.subs;
        }

        const rcDiv = row.querySelector('.tr-rank-change');
        if (rcDiv) {
            const rcIcon = item.rankChange === 'up' ? 'chevron-up' : (item.rankChange === 'down' ? 'chevron-down' : 'minus');
            rcDiv.className = `tr-rank-change ${item.rankChange || 'same'}`;
            rcDiv.innerHTML = `<i data-lucide="${rcIcon}"></i>`;
        }

        row.className = `tr-item cat-${item.cat.toLowerCase()}`;
        row.setAttribute('data-rank', index + 11);
      });
      createIcons({
        icons: { ChevronUp, ChevronDown, Minus },
        nameAttr: 'data-lucide'
      });
      return;
    }

    // Full render if items were added/removed/reordered
    container.innerHTML = itemsToRender.map((item, index) => {
      const rank = index + 11;
      const catClass = `cat-${item.cat.toLowerCase()}`;
      const rcClass = item.rankChange || 'same';
      const rcIcon = rcClass === 'up' ? 'chevron-up' : (rcClass === 'down' ? 'chevron-down' : 'minus');
      return `
        <div class="tr-item ${catClass}" data-rank="${rank}">
          <div class="tr-rank-number">#${rank}</div>
          <div class="tr-rank-change ${rcClass}">
             <i data-lucide="${rcIcon}"></i>
          </div>
          <img src="${item.avatar}" class="tr-avatar">
          <div class="tr-details">
            <div class="tr-name">${item.name}</div>
            <div class="tr-cat">${item.cat}</div>
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
  render(store.getState()); // Render immediately on load
}
