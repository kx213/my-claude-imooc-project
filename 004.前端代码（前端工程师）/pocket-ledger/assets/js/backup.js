// Pocket Ledger — 数据导出 / 导入
// 对齐 PRD V1.0 F7 + V1.0.1 §5.3 / §13.2 F12-C / §13.3

import {
  getCurrentOwnerId,
  getUsers,
  getBooks,
  getRecords,
  getCategories,
  getBudgets,
  setCurrentOwnerId,
  upsertUser,
  setLastBackupAt,
  KEYS
} from './storage.js';
import { hashPassword, generateSalt, getIterations } from './crypto.js';
import { initOwnerData } from './seed.js';

const VERSION = '1.0.1';

// ===================== 导出 =====================

/** 导出当前账号的全部数据为 JSON */
export function exportCurrentUserJson() {
  const ownerId = getCurrentOwnerId();
  if (!ownerId) throw new Error('未登录');
  const payload = {
    version: VERSION,
    exportedAt: new Date().toISOString(),
    ownerId,
    users: { [ownerId]: getUsers()[ownerId] },
    books: getBooks().filter(b => b.ownerId === ownerId),
    records: getRecords().filter(r => r.ownerId === ownerId),
    categories: getCategories().filter(c => c.ownerId === ownerId),
    budgets: getBudgets().filter(b => b.ownerId === ownerId)
  };
  downloadFile(
    JSON.stringify(payload, null, 2),
    `pocket-ledger-${ownerId}-${Date.now()}.json`,
    'application/json'
  );
  setLastBackupAt(new Date().toISOString());
}

/** 导出当前账号为 CSV（PRD F7 数据导出） */
export function exportCurrentUserCsv() {
  const ownerId = getCurrentOwnerId();
  if (!ownerId) throw new Error('未登录');
  const cats = getCategories().filter(c => c.ownerId === ownerId);
  const records = getRecords().filter(r => r.ownerId === ownerId);
  const rows = [['时间', '类型', '金额', '分类', '备注']];
  records
    .sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt))
    .forEach(r => {
      const cat = cats.find(c => c.id === r.categoryId);
      rows.push([
        r.occurredAt,
        r.type === 'expense' ? '支出' : '收入',
        r.amount.toFixed(2),
        cat ? cat.name : '未分类',
        (r.note || '').replace(/[\r\n,]/g, ' ')
      ]);
    });
  // BOM 让 Excel 不乱码（PRD F7 验收）
  const csv = '﻿' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  downloadFile(csv, `pocket-ledger-${ownerId}-${Date.now()}.csv`, 'text/csv;charset=utf-8');
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ===================== 导入 / 恢复 =====================

/**
 * 从备份恢复（PRD §13.2 F12-C）
 * @param {File} file
 * @param {'overwrite'|'merge'|'cancel'} strategy
 * @returns {Promise<{ok: boolean, summary?: object, error?: string}>}
 */
export async function restoreFromJsonFile(file, strategy = 'merge') {
  const text = await file.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { ok: false, error: '备份文件无效：JSON 解析失败' };
  }
  if (!data || !data.version || !data.ownerId) {
    return { ok: false, error: '备份文件无效：缺少 version 或 ownerId 字段' };
  }

  const users = getUsers();
  const existingUser = users[data.ownerId];
  const ownerId = data.ownerId;

  // 新用户：自动注册并恢复所有数据 + 自动登录
  if (!existingUser) {
    const salt = generateSalt();
    // 用占位 hash 标记（无密码）—— 实际产品应要求用户设置密码；原型阶段支持「先恢复后改密」
    const hash = await hashPassword('recover_temp', salt);
    upsertUser(ownerId, {
      salt,
      hash,
      iterations: getIterations(),
      displayName: ownerId,
      createdAt: data.exportedAt || new Date().toISOString(),
      lastLoginAt: null,
      _recovered: true
    });

    // 覆盖写入数据
    writeSlice(ownerId, data);
    setCurrentOwnerId(ownerId);

    return {
      ok: true,
      summary: {
        books: (data.books || []).length,
        records: (data.records || []).length,
        categories: (data.categories || []).length
      }
    };
  }

  // 同名账号：按策略处理
  if (strategy === 'cancel') return { ok: false, error: '已取消' };

  if (strategy === 'overwrite') {
    writeSlice(ownerId, data);
    return {
      ok: true,
      summary: {
        books: (data.books || []).length,
        records: (data.records || []).length,
        categories: (data.categories || []).length
      }
    };
  }

  // merge：按 id + updatedAt 去重（PRD §13.2 F12-C 合并去重策略）
  const mergeSummary = mergeSlice(ownerId, data);
  return { ok: true, summary: mergeSummary };
}

function writeSlice(ownerId, data) {
  if (Array.isArray(data.books)) {
    const others = getBooks().filter(b => b.ownerId !== ownerId);
    const normBooks = data.books.map(b => ({ ...b, ownerId }));
    localStorage.setItem(KEYS.books, JSON.stringify([...others, ...normBooks]));
  }
  if (Array.isArray(data.records)) {
    const others = getRecords().filter(r => r.ownerId !== ownerId);
    const normRecords = data.records.map(r => ({ ...r, ownerId }));
    localStorage.setItem(KEYS.records, JSON.stringify([...others, ...normRecords]));
  }
  if (Array.isArray(data.categories)) {
    const others = getCategories().filter(c => c.ownerId !== ownerId);
    const normCats = data.categories.map(c => ({ ...c, ownerId }));
    localStorage.setItem(KEYS.categories, JSON.stringify([...others, ...normCats]));
  }
  if (Array.isArray(data.budgets)) {
    const others = getBudgets().filter(b => b.ownerId !== ownerId);
    const normBudgets = data.budgets.map(b => ({ ...b, ownerId }));
    localStorage.setItem(KEYS.budgets, JSON.stringify([...others, ...normBudgets]));
  }
}

function mergeSlice(ownerId, data) {
  let addedBooks = 0, addedRecords = 0, addedCategories = 0;

  // Books: 按 id + name 去重
  if (Array.isArray(data.books)) {
    const existing = getBooks().filter(b => b.ownerId === ownerId);
    const existingMap = new Map(existing.map(b => [`${b.id}|${b.name}`, b]));
    const merged = getBooks().filter(b => b.ownerId !== ownerId);
    data.books.forEach(b => {
      const key = `${b.id}|${b.name}`;
      if (!existingMap.has(key)) {
        merged.push({ ...b, ownerId });
        addedBooks++;
      }
    });
    localStorage.setItem(KEYS.books, JSON.stringify(merged));
  }

  // Records: 按 id + updatedAt 去重（保留最新）
  if (Array.isArray(data.records)) {
    const existing = getRecords().filter(r => r.ownerId === ownerId);
    const existingMap = new Map(existing.map(r => [r.id, r]));
    const merged = getRecords().filter(r => r.ownerId !== ownerId);
    data.records.forEach(r => {
      const old = existingMap.get(r.id);
      if (!old) {
        merged.push({ ...r, ownerId });
        addedRecords++;
      } else if (new Date(r.updatedAt || r.createdAt) > new Date(old.updatedAt || old.createdAt)) {
        merged.push({ ...r, ownerId });
      } else {
        merged.push(old);
      }
    });
    localStorage.setItem(KEYS.records, JSON.stringify(merged));
  }

  // Categories: 按 id 去重
  if (Array.isArray(data.categories)) {
    const existing = getCategories().filter(c => c.ownerId === ownerId);
    const existingMap = new Set(existing.map(c => c.id));
    const merged = getCategories().filter(c => c.ownerId !== ownerId);
    data.categories.forEach(c => {
      if (!existingMap.has(c.id)) {
        merged.push({ ...c, ownerId });
        addedCategories++;
      }
    });
    localStorage.setItem(KEYS.categories, JSON.stringify(merged));
  }

  // Budgets: 简单按 id 去重
  if (Array.isArray(data.budgets)) {
    const existing = getBudgets().filter(b => b.ownerId === ownerId);
    const existingMap = new Set(existing.map(b => b.id));
    const merged = getBudgets().filter(b => b.ownerId !== ownerId);
    data.budgets.forEach(b => {
      if (!existingMap.has(b.id)) merged.push({ ...b, ownerId });
    });
    localStorage.setItem(KEYS.budgets, JSON.stringify(merged));
  }

  return { books: addedBooks, records: addedRecords, categories: addedCategories };
}