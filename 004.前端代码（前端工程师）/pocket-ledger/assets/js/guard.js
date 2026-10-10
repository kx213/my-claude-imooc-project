// Pocket Ledger — 路由守卫
// 业务页（home/statistics/budget/profile）必须登录后才能访问；
// index.html 反向：已登录则跳到 home.html（PRD §5.1）

import { getCurrentOwnerId } from './storage.js';

const PROTECTED = new Set(['home', 'statistics', 'budget', 'profile']);
const PUBLIC_ENTRY = new Set(['index']);

export function guardAuth() {
  const page = document.body.dataset.page;
  const loggedIn = !!getCurrentOwnerId();

  if (PROTECTED.has(page) && !loggedIn) {
    window.location.replace('index.html');
    return false;
  }
  if (PUBLIC_ENTRY.has(page) && loggedIn) {
    window.location.replace('home.html');
    return false;
  }
  return true;
}