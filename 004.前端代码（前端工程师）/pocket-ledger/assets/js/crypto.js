// Pocket Ledger — PBKDF2-SHA256 加密
// 对齐 PRD V1.0.1 §9：PBKDF2-SHA256 + 100000 次迭代 + 随机 16 字节 salt

const ITERATIONS = 100000;
const KEY_LEN_BITS = 256;
const SALT_BYTES = 16;

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function randomSaltHex() {
  const bytes = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

async function importKey(password) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
}

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    out[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return out;
}

export async function hashPassword(password, saltHex) {
  const keyMaterial = await importKey(password);
  const saltBytes = hexToBytes(saltHex);
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    KEY_LEN_BITS
  );
  return bytesToHex(new Uint8Array(derivedBits));
}

export function generateSalt() {
  return randomSaltHex();
}

export function getIterations() {
  return ITERATIONS;
}