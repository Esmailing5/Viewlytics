import '../styles/single-card.css';
import { store } from '../state/store.js';

export function renderSingleCardPreview() {
  return `
    <div class="sc-preview" id="sc-preview">
      <div class="sc-noise"></div>
      <div class="watermark-overlay">
        ${Array(150).fill(`
          <div class="watermark-item">
            <svg style="width: 28px; height: 28px;" viewBox="0 -5 64 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2 L15 32 C18 38 25 40 30 35 L50 15" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" /><path d="M30 35 L60 5 L45 5 M60 5 L60 20" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" /><circle cx="20" cy="25" r="5" fill="currentColor" /></svg>
            <span>Viewlytics</span>
          </div>
        `).join('')}
      </div>
      <div class="sc-glow" id="prev-glow"></div>
      
      <div class="safe-zone-wrapper" style="transform: scale(0.92); transform-origin: center center; flex: 1; display: flex; flex-direction: column; width: 100%; height: 100%; z-index: 2;">
        <div class="sc-header">
          <div class="sc-logo">
            <svg style="width: 36px; height: auto;" viewBox="0 -5 64 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2 L15 32 C18 38 25 40 30 35 L50 15" stroke="#0072ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" /><path d="M30 35 L60 5 L45 5 M60 5 L60 20" stroke="#00c6ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" /><circle cx="20" cy="25" r="5" fill="#00c6ff" /></svg>
            <span>Viewlytics</span>
          </div>
          <div class="sc-badge" id="prev-badge">
            🔥 TRENDING
          </div>
        </div>

        <div class="sc-content">
          <div class="sc-main-metric-container">
            <div class="sc-metric-main-val" id="prev-metric-main-val">313M</div>
            <div class="sc-metric-main-lbl" id="prev-metric-main-lbl">TOTAL VIEWS</div>
          </div>

          <div class="sc-creator-block">
            <div style="position:relative;">
              <div class="sc-avatar-glow" id="prev-glow"></div>
              <img src="https://i.pravatar.cc/300" class="sc-avatar" id="prev-avatar" crossOrigin="anonymous">
            </div>
            <div class="sc-creator-info">
              <div class="sc-name">
                <span id="prev-name">Alofoke Radio Show</span>
                <div class="sc-rank" id="prev-rank">#1</div>
              </div>
              <div class="sc-handle" id="prev-handle">@alofokeradioshow</div>
            </div>
          </div>

          <div class="sc-metrics-grid">
            <div class="sc-metric-box">
              <div class="sc-metric-value" id="prev-subs">5.2M</div>
              <div class="sc-metric-label">SUBSCRIBERS</div>
            </div>

            <div class="sc-metric-box">
              <div class="sc-metric-value" id="prev-earn">$120K+</div>
              <div class="sc-metric-label">EST. EARNINGS</div>
            </div>
          </div>
        </div>

        <div class="sc-footer">
          <div class="sc-source" style="display:flex; align-items:center; gap: 48px;">
            <span>DATA: SOCIALBLADE &bull; POWERED BY VIEWLYTICS</span>
            <span style="color: var(--accent-cyan); display: flex; align-items: center; gap: 14px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              @viewlyticsrd
            </span>
          </div>
          <div id="prev-flag-container" class="sc-flag">🇩🇴</div>
        </div>
      </div>
    </div>
  `;
}

export function initSingleCardPreview() {
  // Subscribe to store changes to update UI
  store.subscribe((state) => {
    const sc = state.singleCard;

    document.getElementById('prev-name').textContent = sc.name;
    document.getElementById('prev-handle').textContent = sc.handle;
    document.getElementById('prev-rank').textContent = sc.rank;
    document.getElementById('prev-metric-main-val').textContent = sc.metricMainValue;
    document.getElementById('prev-metric-main-lbl').textContent = sc.metricMainLabel;
    document.getElementById('prev-subs').textContent = sc.subs;
    document.getElementById('prev-earn').textContent = sc.earnings;
    
    document.getElementById('prev-badge').innerHTML = sc.badge;

    // Avatar
    document.getElementById('prev-avatar').src = sc.avatar;

    // Category styling (Colors)
    const categoryColors = {
      'podcast': 'var(--cat-podcast)',
      'gaming': 'var(--cat-gaming)',
      'news': 'var(--cat-news)',
      'music': 'var(--cat-music)',
      'entertainment': 'var(--cat-entertainment)'
    };
    
    const catColor = categoryColors[sc.category.toLowerCase()] || 'var(--accent-cyan)';
    
    const glow = document.getElementById('prev-glow');
    if (glow) {
      glow.style.background = `linear-gradient(135deg, ${catColor}, var(--accent-blue))`;
    }

    const lbl = document.getElementById('prev-metric-main-lbl');
    if (lbl) lbl.style.color = catColor;
    
    document.querySelectorAll('.sc-metric-box').forEach(box => {
      box.style.borderLeftColor = catColor;
    });

    // Switches
    document.getElementById('prev-flag-container').style.display = sc.showFlag ? 'block' : 'none';
    if(glow) glow.style.display = sc.showGlow ? 'block' : 'none';

    if(window.lucide) window.lucide.createIcons();
  });
}
