// Pocket Ledger — 记录操作（首页记账 / 今日明细）
// 对齐 PRD V1.0 F1 快速记账 + F3 收支明细

import {
  addRecord,
  getRecordsByOwner,
  getCategoriesByOwner,
  getDefaultBook,
  uid,
  nowIso,
  getCurrentOwnerId
} from './storage.js';

function fmtTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function fmtDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** 添加一条记录并返回新记录 */
export function createRecord({ type, amount, categoryId, note, occurredAt }) {
  const ownerId = getCurrentOwnerId();
  if (!ownerId) throw new Error('未登录，无法记账');
  const book = getDefaultBook(ownerId);
  if (!book) throw new Error('未找到默认账本');
  const record = {
    id: uid('rec'),
    ownerId,
    bookId: book.id,
    type,
    amount: Number(amount),
    categoryId,
    note: (note || '').slice(0, 50),
    occurredAt: occurredAt || nowIso(),
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  addRecord(record);
  return record;
}

/** 获取今日记录（按时间倒序） */
export function getTodayRecords() {
  const ownerId = getCurrentOwnerId();
  if (!ownerId) return [];
  const today = fmtDate(new Date());
  return getRecordsByOwner(ownerId)
    .filter(r => fmtDate(new Date(r.occurredAt)) === today)
    .sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
}

/** 当月汇总：用于顶部数据卡 */
export function getMonthSummary() {
  const ownerId = getCurrentOwnerId();
  if (!ownerId) return { income: 0, expense: 0, balance: 0, count: 0 };
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const records = getRecordsByOwner(ownerId).filter(r => r.occurredAt.slice(0, 7) === ym);
  let income = 0, expense = 0;
  records.forEach(r => {
    if (r.type === 'income') income += r.amount;
    else expense += r.amount;
  });
  return { income, expense, balance: income - expense, count: records.length };
}

/** 把分类 ID 解析成 {name, icon} */
export function resolveCategory(catId) {
  const ownerId = getCurrentOwnerId();
  const cats = getCategoriesByOwner(ownerId || '');
  return cats.find(c => c.id === catId) || { name: '其他', icon: 'more_horiz', type: 'expense' };
}

/** 渲染一条记录到列表的 HTML 片段（首页今日明细 + 详情弹窗复用） */
export function renderRecordRow(rec, opts = {}) {
  const cat = resolveCategory(rec.categoryId);
  const dt = new Date(rec.occurredAt);
  const timeStr = opts.fullDateTime
    ? `${fmtDate(dt)} ${fmtTime(dt)}`
    : fmtTime(dt);
  const sign = rec.type === 'expense' ? '-' : '+';
  const color = rec.type === 'expense' ? 'text-soft-rose' : 'text-primary';
  const iconBg = rec.type === 'expense' ? 'bg-tertiary-container/30 text-tertiary' : 'bg-primary-fixed text-on-primary-fixed';

  return `
    <div class="group flex items-center justify-between p-space-md bg-surface-container-lowest rounded-xl hover:shadow-md transition-all">
      <div class="flex items-center gap-space-md">
        <div class="w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center">
          <span class="material-symbols-outlined">${cat.icon}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-label-md text-on-surface font-semibold">${rec.note || cat.name}</span>
          <span class="text-body-sm text-on-surface-variant">${cat.name} · ${timeStr}</span>
        </div>
      </div>
      <div class="flex items-center gap-space-md">
        <span class="text-label-md ${color} font-bold">${sign}¥${rec.amount.toFixed(2)}</span>
        <button class="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-error transition-all" data-action="delete-record" data-id="${rec.id}">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </div>
  `;
}

export { fmtTime, fmtDate };