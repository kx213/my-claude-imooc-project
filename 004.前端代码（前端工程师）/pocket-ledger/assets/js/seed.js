// Pocket Ledger — 默认数据初始化（PRD §4 F9 注册时初始化）
// 预设分类与默认账本在此集中维护

import { addBook, addCategories, uid, nowIso } from './storage.js';

// PRD §4 F2 预设分类
export const PRESET_EXPENSE = [
  { name: '餐饮美食', icon: 'restaurant' },
  { name: '交通出行', icon: 'directions_subway' },
  { name: '购物', icon: 'shopping_bag' },
  { name: '娱乐', icon: 'sports_esports' },
  { name: '居家', icon: 'home' },
  { name: '通讯', icon: 'call' },
  { name: '医疗', icon: 'medical_services' },
  { name: '学习', icon: 'school' },
  { name: '社交', icon: 'groups' },
  { name: '服饰', icon: 'checkroom' },
  { name: '其他', icon: 'more_horiz' }
];

export const PRESET_INCOME = [
  { name: '工资', icon: 'payments' },
  { name: '奖金', icon: 'redeem' },
  { name: '报销', icon: 'receipt_long' },
  { name: '转账', icon: 'swap_horiz' },
  { name: '投资', icon: 'trending_up' },
  { name: '其他', icon: 'account_balance_wallet' }
];

export const EXPENSE_CATEGORIES = PRESET_EXPENSE;
export const INCOME_CATEGORIES = PRESET_INCOME;

/** 给指定 ownerId 初始化默认账本 + 预设分类 */
export function initOwnerData(ownerId) {
  // 默认账本
  const book = {
    id: uid('book'),
    ownerId,
    name: '个人账本',
    type: 'personal',
    createdAt: nowIso()
  };
  addBook(book);

  // 预设分类（按用户隔离拷贝，PRD §6.2 Category 行）
  const cats = [];
  PRESET_EXPENSE.forEach((c, i) => {
    cats.push({
      id: uid('cat'),
      ownerId,
      name: c.name,
      icon: c.icon,
      type: 'expense',
      isPreset: true,
      sortOrder: i
    });
  });
  PRESET_INCOME.forEach((c, i) => {
    cats.push({
      id: uid('cat'),
      ownerId,
      name: c.name,
      icon: c.icon,
      type: 'income',
      isPreset: true,
      sortOrder: i
    });
  });
  addCategories(cats);
  return book;
}