import { createIcons, BarChart2, LayoutTemplate, ListOrdered, Layers, Palette, History, Download, Copy, TrendingUp, TrendingDown, ImagePlus, Plus, Trash2, GripVertical, CheckCircle2, Menu, Info, CheckCircle, XCircle, ChevronUp, ChevronDown, Minus } from 'lucide';
import './styles/index.css';

// Store & State
import { store } from './state/store.js';
import { initHistory } from './state/history.js';
import { saveTemplate } from './state/templates.js';

// Utils
import { exportImage, copyImageToClipboard } from './utils/exportImage.js';
import { showToast } from './utils/toast.js';

// Components
import { renderSingleCardEditor, initSingleCardEditor } from './components/SingleCardEditor.js';
import { renderSingleCardPreview, initSingleCardPreview } from './components/SingleCardPreview.js';
import { renderTopRankingEditor, initTopRankingEditor } from './components/TopRankingEditor.js';
import { renderTopRankingPreview, initTopRankingPreview } from './components/TopRankingPreview.js';
import { renderTop11To20Preview, initTop11To20Preview } from './components/Top11To20Preview.js';
import { renderBrandingEditor, initBrandingEditor, applyBrandingToRoot } from './components/BrandingEditor.js';
import { renderTemplatesEditor, initTemplatesEditor, renderHistoryEditor, initHistoryEditor } from './components/PersistenceEditors.js';

const uiState = {
  currentView: 'single-card',
  format: '4:5',
};

function init() {
  // Load initial state
  store.loadFromLocal();
  initHistory();
  applyBrandingToRoot();

  // Icons
  createIcons({
    icons: {
      BarChart2, LayoutTemplate, ListOrdered, Layers, Palette, History,
      Download, Copy, TrendingUp, TrendingDown, ImagePlus, Plus, Trash2, GripVertical, CheckCircle2, Menu,
      Info, CheckCircle, XCircle, ChevronUp, ChevronDown, Minus
    }
  });

  // Sidebar Routing
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      e.currentTarget.classList.add('active');
      switchView(e.currentTarget.dataset.view);
      
      // Auto close mobile menu on click
      document.getElementById('sidebar').classList.remove('mobile-open');
    });
  });

  // Mobile Menu Toggle
  document.getElementById('btn-mobile-menu').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('mobile-open');
  });

  // Format Selector
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      uiState.format = e.currentTarget.dataset.format;
      updatePreviewFormat();
    });
  });

  // Export buttons
  document.getElementById('btn-export-png').addEventListener('click', () => {
    exportImage('export-container', uiState.format);
  });
  document.getElementById('btn-copy-clipboard').addEventListener('click', () => {
    copyImageToClipboard('export-container');
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          saveTemplate('Quick Save ' + new Date().toLocaleTimeString());
          break;
        case 'e':
          e.preventDefault();
          exportImage('export-container', uiState.format);
          break;
      }
    }
  });

  window.addEventListener('resize', scalePreview);

  // Default view
  switchView(uiState.currentView);
}

function switchView(view) {
  uiState.currentView = view;
  const editorContainer = document.getElementById('editor-container');
  const previewContainer = document.getElementById('export-container');
  const viewTitle = document.getElementById('view-title');

  let keepPreview = false;

  if (view === 'single-card') {
    viewTitle.textContent = 'Single Creator Card';
    editorContainer.innerHTML = renderSingleCardEditor();
    previewContainer.innerHTML = renderSingleCardPreview();
    initSingleCardEditor();
    initSingleCardPreview();
  } 
  else if (view === 'top-ranking') {
    viewTitle.textContent = 'Top 1-10 Ranking';
    editorContainer.innerHTML = renderTopRankingEditor();
    previewContainer.innerHTML = renderTopRankingPreview();
    initTopRankingEditor();
    initTopRankingPreview();
  }
  else if (view === 'top-11-to-20') {
    viewTitle.textContent = 'Top 11-20 Ranking';
    editorContainer.innerHTML = renderTopRankingEditor();
    previewContainer.innerHTML = renderTop11To20Preview();
    initTopRankingEditor();
    initTop11To20Preview();
  }
  else if (view === 'branding') {
    viewTitle.textContent = 'Branding Config';
    editorContainer.innerHTML = renderBrandingEditor();
    initBrandingEditor();
    keepPreview = true;
  }
  else if (view === 'templates') {
    viewTitle.textContent = 'Templates';
    editorContainer.innerHTML = renderTemplatesEditor();
    initTemplatesEditor();
    keepPreview = true;
  }
  else if (view === 'history') {
    viewTitle.textContent = 'History';
    editorContainer.innerHTML = renderHistoryEditor();
    initHistoryEditor();
    keepPreview = true;
  }

  // If view is a settings view, we keep the last preview active to see changes
  if (!keepPreview) {
    // Notify store to re-render preview bindings
    store.notify();
  }

  // Re-init icons
  if(window.lucide) window.lucide.createIcons();
  
  updatePreviewFormat();
}

function updatePreviewFormat() {
  const container = document.getElementById('export-container');
  if(container) {
    container.dataset.aspect = uiState.format;
    scalePreview();
  }
}

function scalePreview() {
  const wrapper = document.getElementById('preview-wrapper');
  const container = document.getElementById('export-container');
  
  if (!wrapper || !container) return;

  const wrapperRect = wrapper.getBoundingClientRect();
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // Use dynamic padding based on viewport for tighter fit
  const padding = window.innerWidth < 800 ? 10 : 40;
  const availableWidth = wrapperRect.width - (padding * 2);
  const availableHeight = wrapperRect.height - (padding * 2);

  const scaleX = availableWidth / containerWidth;
  const scaleY = availableHeight / containerHeight;
  const scale = Math.min(scaleX, scaleY, 1);

  container.style.transform = `scale(${scale})`;
}

document.addEventListener('DOMContentLoaded', init);
