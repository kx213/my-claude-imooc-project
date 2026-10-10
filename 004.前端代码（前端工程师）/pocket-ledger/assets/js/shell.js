// Pocket Ledger — 公共侧边栏 + 顶栏
// 每个页面调用 mountShell(currentPageKey) 即渲染壳层并高亮当前菜单

import { getCurrentUser, logout } from './auth.js';
import { showToast } from './toast.js';

const NAV_ITEMS = [
  { key: 'home',       href: 'home.html',       icon: 'home',                     label: '首页' },
  { key: 'statistics', href: 'statistics.html', icon: 'bar_chart',                label: '统计' },
  { key: 'budget',     href: 'budget.html',     icon: 'account_balance_wallet',   label: '预算' },
  { key: 'profile',    href: 'profile.html',    icon: 'person',                   label: '我的' }
];

const ACTIVE_CLASS = 'flex items-center px-space-md py-space-md transition-all bg-primary text-on-primary font-bold rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]';
const HOVER_CLASS  = 'flex items-center px-space-md py-space-md rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all';

function renderSidebar(currentKey) {
  const nav = NAV_ITEMS.map(item => {
    const cls = item.key === currentKey ? ACTIVE_CLASS : HOVER_CLASS;
    return `<a class="${cls}" data-path="${item.key}" href="${item.href}"><span class="material-symbols-outlined mr-space-md">${item.icon}</span>${item.label}</a>`;
  }).join('');

  return `
    <aside class="fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col pt-space-xl pb-space-xl">
      <div class="px-space-lg mb-space-xl flex items-center gap-space-sm">
        <img alt="口袋账本 Logo" class="h-8 w-auto object-contain" src="assets/img/logo.svg"/>
        <span class="text-headline-sm font-bold tracking-tight text-on-surface">口袋账本</span>
      </div>
      <nav class="flex-1 px-space-md space-y-space-xs">${nav}</nav>
      <div class="px-space-md pt-space-md border-t border-surface-container-high/40 text-body-xs text-outline">
        v1.0.1 · 本地加密存储
      </div>
    </aside>
  `;
}

function renderHeader(currentKey, currentUser) {
  const display = (currentUser && (currentUser.displayName || currentUser.username)) || '未登录';
  const initial = display.slice(0, 1).toUpperCase();
  return `
    <header class="fixed top-0 left-64 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-xl">
      <div class="flex items-center gap-space-md">
        <div class="flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-xs rounded-lg text-label-md cursor-pointer text-on-surface">
          <span class="material-symbols-outlined text-[18px]">book</span>
          <span>个人账本</span>
          <span class="material-symbols-outlined text-[18px]">arrow_drop_down</span>
        </div>
      </div>
      <div class="flex items-center gap-space-lg">
        <div class="flex items-center gap-space-sm">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-label-md font-bold text-on-primary">${initial}</div>
          <span class="text-label-md text-on-surface font-medium">${display}</span>
        </div>
        <a class="flex items-center text-error hover:text-on-error-container text-label-md cursor-pointer" data-action="logout" href="index.html" onclick="return false;">
          <span class="material-symbols-outlined text-[18px] mr-space-xs">logout</span>退出
        </a>
      </div>
    </header>
  `;
}

export function mountShell(currentKey) {
  const sidebarEl = document.getElementById('app-sidebar');
  const headerEl = document.getElementById('app-header');
  if (!sidebarEl || !headerEl) {
    console.warn('[shell] missing #app-sidebar / #app-header on page', currentKey);
    return;
  }
  const user = getCurrentUser();
  sidebarEl.outerHTML = renderSidebar(currentKey);
  headerEl.outerHTML = renderHeader(currentKey, user);

  // 退出按钮：先二次确认，再执行 logout + 跳转
  const logoutBtn = document.querySelector('[data-action="logout"]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      if (confirm('确认退出登录？退出后当前账本数据仍保留在本机。')) {
        logout();
        showToast('已安全退出登录', 'success');
        setTimeout(() => (window.location.href = 'index.html'), 600);
      }
    });
  }
}