import * as htmlToImage from 'html-to-image';
import { showToast } from './toast.js';

// Bulletproof utility to preload and inline all images to base64 Data URLs.
// This prevents CORS taint issues and blank images during SVG serialization.
async function inlineAllImages(container) {
  const images = container.querySelectorAll('img');
  const originalSources = [];

  const promises = Array.from(images).map(async (img) => {
    const originalSrc = img.src;
    originalSources.push({ img, src: originalSrc });

    // Skip if it's already a base64 Data URL or empty
    if (!originalSrc || originalSrc.startsWith('data:')) return;

    try {
      // Add crossOrigin attribute to ensure browser requests CORS headers
      img.setAttribute('crossOrigin', 'anonymous');
      
      const response = await fetch(originalSrc, { 
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache'
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const blob = await response.blob();
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      img.src = dataUrl;
    } catch (e) {
      console.warn(`Failed to inline image ${originalSrc}:`, e);
      // Fallback: Attempt to use a canvas to draw and extract base64 if permitted
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 150;
        canvas.height = img.naturalHeight || img.height || 150;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        img.src = canvas.toDataURL('image/png');
      } catch (canvasErr) {
        console.warn(`Fallback canvas conversion failed for ${originalSrc}:`, canvasErr);
      }
    }
  });

  await Promise.all(promises);
  return originalSources;
}

function restoreAllImages(originalSources) {
  originalSources.forEach(({ img, src }) => {
    img.src = src;
  });
}

export async function exportImage(containerId, format, type = 'jpeg') {
  const container = document.getElementById(containerId);
  if (!container) return;

  showToast('Rendering high quality image...', 'info');

  // Wait for document fonts to load completely
  await document.fonts.ready;
  
  // Give CSS and layout a short window to settle
  await new Promise(r => setTimeout(r, 150));

  // Temporarily reset transform and flex-shrink to get full quality capture
  const originalTransform = container.style.transform;
  const originalFlexShrink = container.style.flexShrink;
  container.style.transform = 'scale(1)';
  container.style.flexShrink = '0';

  let originalSources = [];
  try {
    // Inline all image elements inside the container to avoid CORS blanks
    originalSources = await inlineAllImages(container);
    
    // Give rendering thread a moment to update layout with inlined base64 images
    await new Promise(r => setTimeout(r, 100));

    const options = {
      quality: 0.98,
      pixelRatio: 3, // Ultra HD Retina Export (3x scale)
      backgroundColor: '#0b0e14',
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      },
      cacheBust: true
    };

    let dataUrl;
    if (type === 'png') {
      dataUrl = await htmlToImage.toPng(container, options);
    } else {
      dataUrl = await htmlToImage.toJpeg(container, options);
    }
    
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
    // Restore original image sources
    restoreAllImages(originalSources);
    // Restore scale and flex-shrink
    container.style.transform = originalTransform;
    container.style.flexShrink = originalFlexShrink;
  }
}

export async function copyImageToClipboard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  showToast('Preparing image for clipboard...', 'info');

  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 150));

  const originalTransform = container.style.transform;
  const originalFlexShrink = container.style.flexShrink;
  container.style.transform = 'scale(1)';
  container.style.flexShrink = '0';

  let originalSources = [];
  try {
    originalSources = await inlineAllImages(container);
    await new Promise(r => setTimeout(r, 100));

    const blob = await htmlToImage.toBlob(container, {
      pixelRatio: 2.2, // standard HD for clipboard
      backgroundColor: '#0b0e14',
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      },
      cacheBust: true
    });

    try {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      showToast('Image copied to clipboard!', 'success');
    } catch (err) {
      console.error('Clipboard error:', err);
      showToast('Failed to copy to clipboard.', 'error');
    }
  } catch (error) {
    console.error('Error capturing image:', error);
    showToast('Failed to render image.', 'error');
  } finally {
    restoreAllImages(originalSources);
    container.style.transform = originalTransform;
    container.style.flexShrink = originalFlexShrink;
  }
}
