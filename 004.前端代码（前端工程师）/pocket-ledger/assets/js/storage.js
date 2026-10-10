// Pocket Ledger — localStorage 封装
// 对齐 PRD V1.0.1 §6.3 localStorage Key 变化：
//   ma_users / ma_current_userId / ma_books / ma_records / ma_categories / ma_budgets
//   ma_lastBackupAt / ma_lastBackupDismiss
// 所有业务接口均按 ownerId 过滤以实现 F9 数据隔离

const KEYS = {
  users: 'ma_users',                 // { username: { salt, hash, iterations, displayName, createdAt, lastLoginAt } }
  currentUser: 'ma_current_userId',  // 当前登录用户名
  books: 'ma_books',                 // [ { id, ownerId, name, type, createdAt } ]
  records: 'ma_records',             // [ { id, ownerId, bookId, type, amount, categoryId, note, occurredAt, createdAt, updatedAt } ]
  categories: 'ma_categories',       // [ { id, ownerId, name, icon, type, isPreset, sortOrder } ]
  budgets: 'ma_budgets',             // [ { id, ownerId, bookId, scope, categoryId, amount, period, startDate } ]
  lastBackupAt: 'ma_lastBackupAt',   // ISO datetime
  lastBackupDismiss: 'ma_lastBackupDismiss' // ISO datetime
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    console.error('[storage] read failed', key, e);
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('[storage] write failed', key, e);
  }
}

function remove(key) {
  localStorage.removeItem(key);
}

export function getCurrentOwnerId() {
  return localStorage.getItem(KEYS.currentUser) || null;
}

export function setCurrentOwnerId(username) {
  if (username === null) {
    localStorage.removeItem(KEYS.currentUser);
  } else {
    localStorage.setItem(KEYS.currentUser, username);
  }
  window.dispatchEvent(new CustomEvent(username ? 'auth:login' : 'auth:logout', { detail: { username } }));
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

// ---------- Users ----------

export function getUsers() {
  return read(KEYS.users, {});
}

export function setUsers(users) {
  write(KEYS.users, users);
}

export function getUser(username) {
  const users = getUsers();
  return users[username] || null;
}

export function upsertUser(username, user) {
  const users = getUsers();
  users[username] = user;
  setUsers(users);
}

export function deleteUser(username) {
  const users = getUsers();
  delete users[username];
  setUsers(users);
  // 同步删除该用户的所有业务数据（PRD §13.2 F12-B 删除范围）
  const ownerId = username;
  write(KEYS.books, getBooks().filter(b => b.ownerId !== ownerId));
  write(KEYS.records, getRecords().filter(r => r.ownerId !== ownerId));
  write(KEYS.budgets, getBudgets().filter(b => b.ownerId !== ownerId));
  write(
    KEYS.categories,
    getCategories().filter(c => c.ownerId !== ownerId || c.isPreset)
  );
}

// ---------- Books ----------

export function getBooks() {
  return read(KEYS.books, []);
}

export function getBooksByOwner(ownerId) {
  return getBooks().filter(b => b.ownerId === ownerId);
}

export function addBook(book) {
  const books = getBooks();
  books.push(book);
  write(KEYS.books, books);
  return book;
}

export function getDefaultBook(ownerId) {
  return getBooksByOwner(ownerId).find(b => b.name === '个人账本') || getBooksByOwner(ownerId)[0] || null;
}

// ---------- Records ----------

export function getRecords() {
  return read(KEYS.records, []);
}

export function getRecordsByOwner(ownerId) {
  return getRecords().filter(r => r.ownerId === ownerId);
}

export function addRecord(record) {
  const records = getRecords();
  records.push(record);
  write(KEYS.records, records);
  return record;
}

export function deleteRecord(id) {
  write(KEYS.records, getRecords().filter(r => r.id !== id));
}

// ---------- Categories ----------

export function getCategories() {
  return read(KEYS.categories, []);
}

export function getCategoriesByOwner(ownerId) {
  return getCategories().filter(c => c.ownerId === ownerId);
}

export function addCategories(list) {
  const all = getCategories();
  all.push(...list);
  write(KEYS.categories, all);
}

// ---------- Budgets ----------

export function getBudgets() {
  return read(KEYS.budgets, []);
}

export function getBudgetsByOwner(ownerId) {
  return getBudgets().filter(b => b.ownerId === ownerId);
}

export function addBudget(budget) {
  const all = getBudgets();
  all.push(budget);
  write(KEYS.budgets, all);
  return budget;
}

export function deleteBudget(id) {
  write(KEYS.budgets, getBudgets().filter(b => b.id !== id));
}

// ---------- Backup metadata ----------

export function getLastBackupAt() {
  return localStorage.getItem(KEYS.lastBackupAt);
}

export function setLastBackupAt(iso) {
  if (iso === null) {
    localStorage.removeItem(KEYS.lastBackupAt);
  } else {
    localStorage.setItem(KEYS.lastBackupAt, iso);
  }
}

export function getLastBackupDismiss() {
  return localStorage.getItem(KEYS.lastBackupDismiss);
}

export function setLastBackupDismiss(iso) {
  if (iso === null) {
    localStorage.removeItem(KEYS.lastBackupDismiss);
  } else {
    localStorage.setItem(KEYS.lastBackupDismiss, iso);
  }
}

// ---------- Migration helper (V1.0 -> V1.0.1, PRD §5.2) ----------

/** 检测是否存在 ownerId 缺失的旧 V1.0 数据；返回这些数据的计数 */
export function detectLegacyData() {
  const records = getRecords();
  const books = getBooks();
  return {
    legacyRecords: records.filter(r => !r.ownerId).length,
    legacyBooks: books.filter(b => !b.ownerId).length
  };
}

/** 把所有 ownerId=null 的旧数据打上指定 ownerId（迁移到当前账号） */
export function migrateLegacyDataToOwner(ownerId) {
  const records = getRecords().map(r => (r.ownerId ? r : { ...r, ownerId }));
  const books = getBooks().map(b => (b.ownerId ? b : { ...b, ownerId }));
  write(KEYS.records, records);
  write(KEYS.books, books);
}

export { KEYS };