// Pocket Ledger — 统一 Toast
// 替代原 5 个 HTML 中各自不同的 showToast 实现
// type: 'success' | 'error' | 'warning' | 'info'

const TYPE_STYLE = {
  success: { bg: 'bg-primary text-on-primary', icon: 'check_circle' },
  error:   { bg: 'bg-error text-on-error', icon: 'error' },
  warning: { bg: 'bg-warm-amber text-on-surface', icon: 'warning' },
  info:    { bg: 'bg-inverse-surface text-inverse-on-surface', icon: 'info' }
};

let container = null;

function getContainer() {
  if (container) return container;
  container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-space-xl right-space-xl z-50 flex flex-col gap-space-sm pointer-events-none';
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(message, type = 'success', duration = 2500) {
  const c = getContainer();
  const cfg = TYPE_STYLE[type] || TYPE_STYLE.success;
  const toast = document.createElement('div');
  toast.className = `flex items-center gap-space-sm px-space-lg py-space-md rounded-xl shadow-lg text-label-md font-medium pointer-events-auto transition-all transform translate-y-2 opacity-0 ${cfg.bg}`;
  toast.innerHTML = `<span class="material-symbols-outlined text-[18px]">${cfg.icon}</span><span>${message}</span>`;
  c.appendChild(toast);
  setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}