// Pocket Ledger — 统计页数据聚合
// 对齐 PRD V1.0 F4：日/周/月/年四个 Tab + 收入/支出/结余 + 分类占比 + 每日趋势 + Top 5

import { getRecordsByOwner, getCategoriesByOwner, getCurrentOwnerId } from './storage.js';

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d) {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7; // 周一为 0
  x.setDate(x.getDate() - day);
  return x;
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function startOfYear(d) {
  return new Date(d.getFullYear(), 0, 1);
}

function inRange(date, from, to) {
  const t = date.getTime();
  return t >= from.getTime() && t <= to.getTime();
}

function rangeOf(period, refDate = new Date()) {
  const from = ({ day: startOfDay, week: startOfWeek, month: startOfMonth, year: startOfYear })[period](refDate);
  const to = new Date(refDate);
  return { from, to };
}

export { rangeOf };

/** 顶部三卡 + 趋势数据 */
export function getOverview(period) {
  const ownerId = getCurrentOwnerId();
  const all = getRecordsByOwner(ownerId);
  const { from, to } = rangeOf(period);
  const inPeriod = all.filter(r => inRange(new Date(r.occurredAt), from, to));
  let income = 0, expense = 0;
  inPeriod.forEach(r => {
    if (r.type === 'income') income += r.amount;
    else expense += r.amount;
  });
  return { income, expense, balance: income - expense };
}

/** 分类占比：返回 [{ name, icon, amount, percent }] */
export function getExpenseByCategory(period) {
  const ownerId = getCurrentOwnerId();
  const cats = getCategoriesByOwner(ownerId);
  const { from, to } = rangeOf(period);
  const records = getRecordsByOwner(ownerId).filter(
    r => r.type === 'expense' && inRange(new Date(r.occurredAt), from, to)
  );
  const total = records.reduce((s, r) => s + r.amount, 0);
  const map = new Map();
  records.forEach(r => {
    map.set(r.categoryId, (map.get(r.categoryId) || 0) + r.amount);
  });
  const rows = Array.from(map.entries()).map(([catId, amount]) => {
    const c = cats.find(x => x.id === catId) || { name: '其他', icon: 'more_horiz' };
    return { name: c.name, icon: c.icon, amount, percent: total ? (amount * 100) / total : 0 };
  });
  rows.sort((a, b) => b.amount - a.amount);
  return { total, rows };
}

/** 每日趋势（柱状图）：返回 [{ dateLabel, income, expense }] */
export function getDailyTrend(period) {
  const ownerId = getCurrentOwnerId();
  const all = getRecordsByOwner(ownerId);
  const { from, to } = rangeOf(period);
  // 桶：天
  const buckets = new Map();
  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { dateLabel: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, income: 0, expense: 0 });
  }
  all.filter(r => inRange(new Date(r.occurredAt), from, to)).forEach(r => {
    const key = r.occurredAt.slice(0, 10);
    const b = buckets.get(key);
    if (!b) return;
    if (r.type === 'income') b.income += r.amount;
    else b.expense += r.amount;
  });
  // 每周/月/年：均匀采样 7 个点
  const arr = Array.from(buckets.values());
  if (arr.length > 7) {
    const step = Math.ceil(arr.length / 7);
    return arr.filter((_, i) => i % step === 0).slice(0, 7);
  }
  return arr;
}

/** 按分类筛选明细 */
export function filterRecordsByCategory(categoryName, period) {
  const ownerId = getCurrentOwnerId();
  const cats = getCategoriesByOwner(ownerId);
  const cat = cats.find(c => c.name === categoryName);
  if (!cat) return [];
  const { from, to } = rangeOf(period);
  return getRecordsByOwner(ownerId)
    .filter(r => r.categoryId === cat.id && inRange(new Date(r.occurredAt), from, to))
    .sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
}