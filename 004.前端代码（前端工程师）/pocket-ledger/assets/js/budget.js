// Pocket Ledger — 预算 CRUD + 80%/100% 提醒
// 对齐 PRD V1.0 F5：总预算 + 分类预算 + 超支提醒

import {
  addBudget,
  deleteBudget,
  getBudgetsByOwner,
  getRecordsByOwner,
  getCategoriesByOwner,
  getCurrentOwnerId,
  uid,
  nowIso,
  getDefaultBook
} from './storage.js';

const WARN_RATIO = 0.8; // PRD F5：达到 80% 提示一次

export function getCurrentBudgetSummary() {
  const ownerId = getCurrentOwnerId();
  if (!ownerId) return { total: { amount: 0, used: 0, percent: 0 }, categories: [] };
  const budgets = getBudgetsByOwner(ownerId);
  const cats = getCategoriesByOwner(ownerId);
  const records = getRecordsByOwner(ownerId);
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthly = records.filter(r => r.occurredAt.slice(0, 7) === ym && r.type === 'expense');

  const totalBudget = budgets.find(b => b.scope === 'total');
  const used = monthly.reduce((s, r) => s + r.amount, 0);

  const total = totalBudget
    ? { amount: totalBudget.amount, used, percent: totalBudget.amount ? used / totalBudget.amount : 0 }
    : { amount: 0, used, percent: 0 };

  const categoryBudgets = budgets
    .filter(b => b.scope === 'category')
    .map(b => {
      const cat = cats.find(c => c.id === b.categoryId) || { name: '未知', icon: 'category' };
      const catUsed = monthly.filter(r => r.categoryId === b.categoryId).reduce((s, r) => s + r.amount, 0);
      return {
        id: b.id,
        name: cat.name,
        icon: cat.icon,
        amount: b.amount,
        used: catUsed,
        percent: b.amount ? catUsed / b.amount : 0,
        overspent: catUsed > b.amount
      };
    });

  return { total, categories: categoryBudgets };
}

export function createBudget({ scope, amount, categoryId }) {
  const ownerId = getCurrentOwnerId();
  if (!ownerId) return null;
  const book = getDefaultBook(ownerId);
  const b = {
    id: uid('bud'),
    ownerId,
    bookId: book ? book.id : null,
    scope,
    categoryId: scope === 'category' ? categoryId : null,
    amount: Number(amount),
    period: 'monthly',
    startDate: new Date().toISOString().slice(0, 10)
  };
  addBudget(b);
  return b;
}

export function removeBudget(id) {
  deleteBudget(id);
}

/** 当某分类或总预算接近 / 超过阈值时返回建议触发的提示文案（不直接触发，由调用方决定） */
export function checkAlerts() {
  const { total, categories } = getCurrentBudgetSummary();
  const alerts = [];
  if (total.amount > 0) {
    if (total.percent >= 1) alerts.push({ level: 'error', message: `【超支警示】总预算已达 ${(total.percent * 100).toFixed(0)}% 并产生超支！` });
    else if (total.percent >= WARN_RATIO) alerts.push({ level: 'warning', message: `【预算预警】总预算已达 ${(total.percent * 100).toFixed(0)}%，请注意合理控制开支！` });
  }
  categories.forEach(c => {
    if (c.percent >= 1) alerts.push({ level: 'error', message: `【超支警示】「${c.name}」分类已达 ${(c.percent * 100).toFixed(0)}% 预算上限！` });
    else if (c.percent >= WARN_RATIO) alerts.push({ level: 'warning', message: `【预算预警】「${c.name}」分类已消耗达 ${(c.percent * 100).toFixed(0)}%！` });
  });
  return alerts;
}

export { WARN_RATIO };