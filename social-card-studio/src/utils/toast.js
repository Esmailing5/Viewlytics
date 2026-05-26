import { createIcons, Info, CheckCircle, XCircle } from 'lucide';

export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'error') iconName = 'x-circle';

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  createIcons({
    icons: { Info, CheckCircle, XCircle },
    nameAttr: 'data-lucide'
  });

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Add animation to index.css programmatically if missing or assume it's there
const style = document.createElement('style');
style.innerHTML = `
@keyframes slideDown {
  to {
    transform: translateY(100px);
    opacity: 0;
  }
}
`;
document.head.appendChild(style);
