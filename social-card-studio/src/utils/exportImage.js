import html2canvas from 'html2canvas';
import { showToast } from './toast.js';

export async function exportImage(containerId, format, type = 'jpeg') {
  const container = document.getElementById(containerId);
  if (!container) return;

  showToast('Rendering high quality image...', 'info');

  // Temporarily reset transform and flex-shrink to get full quality capture
  const originalTransform = container.style.transform;
  const originalFlexShrink = container.style.flexShrink;
  container.style.transform = 'scale(1)';
  container.style.flexShrink = '0';

  try {
    const canvas = await html2canvas(container, {
      scale: 3, // Ultra HD Retina Export (3x DPI)
      width: container.scrollWidth,
      height: container.scrollHeight,
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#0b0e14', // Match Viewlytics bg-main
      logging: false,
      onclone: (clonedDoc) => {
        // 0. Fix watermark rotation clipping (html2canvas applies overflow:hidden before rotation)
        const clonedContainer = clonedDoc.getElementById(containerId);
        if (clonedContainer) clonedContainer.style.overflow = 'visible';
        
        const previews = clonedDoc.querySelectorAll('.tr-preview, .sc-preview');
        previews.forEach(p => p.style.overflow = 'visible');

        // 1. Hide noise overlays (mix-blend-mode causes gray washed-out screens in html2canvas)
        const noises = clonedDoc.querySelectorAll('.tr-noise, .sc-noise');
        noises.forEach(n => n.style.display = 'none');

        // 2. Fix text clipping gradients (they render as black boxes, invisible text, or cut off text)
        const gradientTexts = clonedDoc.querySelectorAll('.tr-title, .sc-name, .sc-metric-val');
        gradientTexts.forEach(node => {
          node.style.background = 'transparent';
          node.style.webkitBackgroundClip = 'initial';
          node.style.webkitTextFillColor = 'initial';
          node.style.color = '#ffffff';
        });

        // 3. Fix glow blur (causes whole canvas to fail sometimes)
        const glow = clonedDoc.getElementById('prev-glow');
        if (glow) glow.style.filter = 'none'; 
      }
    });

    const dataUrl = canvas.toDataURL(`image/${type}`, 0.95); // High quality JPEG
    
    // Create download link
    const link = document.createElement('a');
    link.download = `viewlytics-${format.replace(':', 'x')}-${Date.now()}.${type}`;
    link.href = dataUrl;
    link.click();
    
    showToast('Export successful!', 'success');
  } catch (error) {
    console.error('Error exporting image:', error);
    showToast('Failed to export image. Check console.', 'error');
  } finally {
    // Restore scale and flex-shrink
    container.style.transform = originalTransform;
    container.style.flexShrink = originalFlexShrink;
  }
}

export async function copyImageToClipboard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  showToast('Preparing image for clipboard...', 'info');

  const originalTransform = container.style.transform;
  const originalFlexShrink = container.style.flexShrink;
  container.style.transform = 'scale(1)';
  container.style.flexShrink = '0';

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // Standard HD for clipboard
      width: container.scrollWidth,
      height: container.scrollHeight,
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#0b0e14',
      logging: false
    });

    canvas.toBlob(async (blob) => {
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        showToast('Image copied to clipboard!', 'success');
      } catch (err) {
        console.error('Clipboard error:', err);
        showToast('Failed to copy to clipboard.', 'error');
      }
    }, 'image/png', 1.0);
  } catch (error) {
    console.error('Error capturing image:', error);
    showToast('Failed to render image.', 'error');
  } finally {
    container.style.transform = originalTransform;
    container.style.flexShrink = originalFlexShrink;
  }
}
