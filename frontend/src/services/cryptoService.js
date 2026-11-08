// cryptoService.js — WebCrypto thuần (AES-256-GCM + RSA-OAEP 2048 SHA-256). Chủ: B.
const subtle = globalThis.crypto.subtle;
const enc = new TextEncoder();
const dec = new TextDecoder();
const RSA_ALG = { name: "RSA-OAEP", hash: "SHA-256" };
const MAX_RSA_BYTES = 190; // 2048 bit, OAEP SHA-256

// ---------- tiện ích base64 / PEM ----------
function toB64(buf) {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}
function fromB64(b64) {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}
function toPem(buf, label) {
  const lines = toB64(buf).match(/.{1,64}/g).join("\n");
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
}
function fromPem(pem) {
  const body = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  return fromB64(body);
}

// ---------- RSA ----------
export async function generateRsaKeyPair() {
  const kp = await subtle.generateKey(
    { ...RSA_ALG, modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]) },
    true,
    ["encrypt", "decrypt"]
  );
  const spki = await subtle.exportKey("spki", kp.publicKey);
  const pkcs8 = await subtle.exportKey("pkcs8", kp.privateKey);
  return { publicKeyPem: toPem(spki, "PUBLIC KEY"), privateKeyPem: toPem(pkcs8, "PRIVATE KEY") };
}
const importPub = (pem) => subtle.importKey("spki", fromPem(pem), RSA_ALG, false, ["encrypt"]);
const importPriv = (pem) => subtle.importKey("pkcs8", fromPem(pem), RSA_ALG, false, ["decrypt"]);

export async function rsaEncrypt(publicKeyPem, plainText) {
  const data = enc.encode(plainText);
  if (data.length > MAX_RSA_BYTES) throw new Error("Ma so bao hiem qua dai");
  const key = await importPub(publicKeyPem);
  return toB64(await subtle.encrypt({ name: "RSA-OAEP" }, key, data));
}
export async function rsaDecrypt(privateKeyPem, base64) {
  try {
    const key = await importPriv(privateKeyPem);
    return dec.decode(await subtle.decrypt({ name: "RSA-OAEP" }, key, fromB64(base64)));
  } catch {
    throw new Error("Không giải mã được. Hãy kiểm tra đúng ví và đúng khóa riêng.");
  }
}

// ---------- AES-256-GCM (nội bộ) ----------
async function aesEncrypt(rawKey, plainBytes) {
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const key = await subtle.importKey("raw", rawKey, "AES-GCM", false, ["encrypt"]);
  const data = await subtle.encrypt({ name: "AES-GCM", iv }, key, plainBytes);
  return { iv: toB64(iv), data: toB64(data) };
}
async function aesDecrypt(rawKey, ivB64, dataB64) {
  const key = await subtle.importKey("raw", rawKey, "AES-GCM", false, ["decrypt"]);
  return new Uint8Array(await subtle.decrypt({ name: "AES-GCM", iv: fromB64(ivB64) }, key, fromB64(dataB64)));
}

// ---------- Phong bì (envelope) ----------
// record = { meta, secret }; recipients = [{ address, publicKeyPem }]
export async function buildEncryptedRecord(record, recipients) {
  const rawKey = globalThis.crypto.getRandomValues(new Uint8Array(32));
  const { iv, data } = await aesEncrypt(rawKey, enc.encode(JSON.stringify(record.secret)));
  const keyWraps = {};
  for (const r of recipients) {
    const pub = await importPub(r.publicKeyPem);
    const wrapped = await subtle.encrypt({ name: "RSA-OAEP" }, pub, rawKey);
    keyWraps[r.address.toLowerCase()] = toB64(wrapped);
  }
  return { version: 1, meta: record.meta, cipher: { alg: "AES-256-GCM", iv, data }, keyWraps };
}

export async function openEncryptedRecord(encrypted, myAddress, myPrivateKeyPem) {
  const wrap = encrypted.keyWraps?.[myAddress.toLowerCase()];
  if (!wrap) throw new Error("Ví của bạn không có quyền xem hồ sơ này.");
  try {
    const priv = await importPriv(myPrivateKeyPem);
    const rawKey = new Uint8Array(await subtle.decrypt({ name: "RSA-OAEP" }, priv, fromB64(wrap)));
    const plain = await aesDecrypt(rawKey, encrypted.cipher.iv, encrypted.cipher.data);
    return { meta: encrypted.meta, secret: JSON.parse(dec.decode(plain)) };
  } catch {
    throw new Error("Không giải mã được hồ sơ. Khóa sai hoặc dữ liệu đã bị sửa.");
  }
}

// ---------- Lưu khóa (localStorage, khóa theo địa chỉ chữ thường) ----------
const storeKey = (address) => `medichain.rsa.${address.toLowerCase()}`;
export function saveKeyPair(address, pair) {
  localStorage.setItem(storeKey(address), JSON.stringify(pair));
}
export function loadKeyPair(address) {
  const t = localStorage.getItem(storeKey(address));
  return t ? JSON.parse(t) : null;
}
export function exportKeyPair(address) {
  const pair = loadKeyPair(address);
  if (!pair) throw new Error("Chưa có khóa để xuất.");
  return JSON.stringify({ address: address.toLowerCase(), ...pair }, null, 2);
}
export function importKeyPair(address, text) {
  let obj;
  try { obj = JSON.parse(text); } catch { throw new Error("File khóa không hợp lệ."); }
  if (!obj.publicKeyPem || !obj.privateKeyPem) throw new Error("File khóa thiếu dữ liệu.");
  saveKeyPair(address, { publicKeyPem: obj.publicKeyPem, privateKeyPem: obj.privateKeyPem });
}
