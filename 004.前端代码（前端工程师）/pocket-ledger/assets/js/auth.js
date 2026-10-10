// Pocket Ledger — 注册 / 登录 / 退出 / 账号重置 / 从备份恢复
// 对齐 PRD V1.0.1 F9 / F10 / F11 / F12-A / F12-B / F12-C

import {
  getUsers,
  getUser,
  upsertUser,
  deleteUser,
  setCurrentOwnerId,
  getCurrentOwnerId,
  getRecordsByOwner,
  getBooksByOwner,
  getCategoriesByOwner,
  uid,
  nowIso
} from './storage.js';
import { hashPassword, generateSalt, getIterations } from './crypto.js';
import { initOwnerData } from './seed.js';

// 用户名规则：3-20 位，仅字母数字下划线中文，首字符不能为下划线
const USERNAME_REGEX = /^[A-Za-z0-9一-龥][A-Za-z0-9_一-龥]{2,19}$/;

// PRD §4 F10：连续 5 次失败冷却 30 秒
const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 30 * 1000;
const FAILED_KEY = 'ma_login_failures';
const COOLDOWN_UNTIL_KEY = 'ma_login_cooldown_until';

function getFailures() {
  return parseInt(localStorage.getItem(FAILED_KEY) || '0', 10);
}

function setFailures(n) {
  localStorage.setItem(FAILED_KEY, String(n));
}

function getCooldownUntil() {
  const v = localStorage.getItem(COOLDOWN_UNTIL_KEY);
  return v ? parseInt(v, 10) : 0;
}

function setCooldownUntil(ts) {
  localStorage.setItem(COOLDOWN_UNTIL_KEY, String(ts));
}

function isInCooldown() {
  return Date.now() < getCooldownUntil();
}

export function getCooldownRemainingMs() {
  const remain = getCooldownUntil() - Date.now();
  return remain > 0 ? remain : 0;
}

// ===================== F9：注册 =====================

/**
 * 注册新用户
 * @param {string} username
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {{ok: boolean, error?: string}}
 */
export async function register(username, password, confirmPassword) {
  username = (username || '').trim();
  if (!USERNAME_REGEX.test(username)) {
    return { ok: false, error: '用户名格式不符：3-20 位字母、数字、下划线或中文，首字符不能为下划线' };
  }
  if ((password || '').length < 1 || password.length > 64) {
    return { ok: false, error: '密码长度需在 1-64 位之间' };
  }
  if (password !== confirmPassword) {
    return { ok: false, error: '两次输入的密码不一致' };
  }
  if (getUser(username)) {
    return { ok: false, error: '该用户名已被注册，请更换或直接登录' };
  }

  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  upsertUser(username, {
    salt,
    hash,
    iterations: getIterations(),
    displayName: username,
    createdAt: nowIso(),
    lastLoginAt: null
  });

  // 初始化默认账本 + 预设分类
  initOwnerData(username);
  // 自动登录
  setCurrentOwnerId(username);
  // 更新 lastLoginAt
  const u = getUser(username);
  u.lastLoginAt = nowIso();
  upsertUser(username, u);

  return { ok: true };
}

// ===================== F10：登录 =====================

/**
 * 登录
 * @returns {{ok: boolean, error?: string, cooldownMs?: number}}
 */
export async function login(username, password) {
  username = (username || '').trim();

  if (isInCooldown()) {
    return { ok: false, error: 'cooldown', cooldownMs: getCooldownRemainingMs() };
  }

  const user = getUser(username);
  // 故意走相同分支以防枚举（PRD §9 / §11 安全）
  if (!user) {
    // 仍做一次哈希以对齐耗时、避免时序攻击
    await hashPassword(password || '', generateSalt());
    return recordFailure();
  }

  const hashed = await hashPassword(password, user.salt);
  if (hashed !== user.hash) {
    return recordFailure();
  }

  // 成功
  setFailures(0);
  setCooldownUntil(0);
  setCurrentOwnerId(username);
  user.lastLoginAt = nowIso();
  upsertUser(username, user);
  return { ok: true };
}

function recordFailure() {
  const n = getFailures() + 1;
  setFailures(n);
  if (n >= MAX_ATTEMPTS) {
    setCooldownUntil(Date.now() + COOLDOWN_MS);
    return { ok: false, error: 'cooldown', cooldownMs: COOLDOWN_MS };
  }
  return { ok: false, error: '用户名或密码错误' };
}

// ===================== F11：退出 =====================

export function logout() {
  setCurrentOwnerId(null);
}

// ===================== F12-B：账号重置 =====================

/**
 * 重置账号：保留用户名、清空数据、用新密码重建
 */
export async function resetAccount(username, newPassword, confirmPassword) {
  username = (username || '').trim();
  if (!getUser(username)) {
    return { ok: false, error: '该用户名不存在' };
  }
  if ((newPassword || '').length < 1 || newPassword.length > 64) {
    return { ok: false, error: '密码长度需在 1-64 位之间' };
  }
  if (newPassword !== confirmPassword) {
    return { ok: false, error: '两次输入的密码不一致' };
  }

  // 删除该用户的所有数据（含同名自定义分类，预置分类保留）
  deleteUser(username);

  // 用同名 + 新密码重建
  const salt = generateSalt();
  const hash = await hashPassword(newPassword, salt);
  upsertUser(username, {
    salt,
    hash,
    iterations: getIterations(),
    displayName: username,
    createdAt: nowIso(),
    lastLoginAt: null
  });
  initOwnerData(username);

  return { ok: true };
}

/** 获取某用户名下的数据规模（用于二次确认弹窗 PRD §13.2 F12-B） */
export function getAccountDataSummary(username) {
  return {
    books: getBooksByOwner(username).length,
    records: getRecordsByOwner(username).length,
    customCategories: getCategoriesByOwner(username).filter(c => !c.isPreset).length
  };
}

// ===================== 工具：当前用户信息 =====================

export function getCurrentUser() {
  const username = getCurrentOwnerId();
  if (!username) return null;
  return getUser(username);
}

export function getCurrentDisplayName() {
  const u = getCurrentUser();
  if (!u) return '';
  return u.displayName || u.username || '';
}

export function usernameRegex() {
  return USERNAME_REGEX;
}