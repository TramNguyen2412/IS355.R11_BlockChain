// mockCrypto.js — mã hóa giả nhưng ĐÚNG hình dạng dữ liệu của bản thật.
// Không dùng Buffer (trình duyệt không có)
const b64 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const unb64 = (s) => new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0)));
const store = new Map();
export async function generateRsaKeyPair() {
  return { publicKeyPem: "MOCK_RSA_PUBLIC_KEY_PEM", privateKeyPem: "MOCK_RSA_PRIVATE_KEY_PEM" };
}
export function saveKeyPair(a, p) { store.set(a.toLowerCase(), p); }
export function loadKeyPair(a) { return store.get(a.toLowerCase()) ?? null; }
export function exportKeyPair(a) { return JSON.stringify(loadKeyPair(a)); }
export function importKeyPair(a, t) { store.set(a.toLowerCase(), JSON.parse(t)); }
export async function rsaEncrypt(pub, text) {
  if (new TextEncoder().encode(text).length > 190) throw new Error("Ma so bao hiem qua dai");
  return b64("MOCKENC:" + text);
}
export async function rsaDecrypt(priv, base64) { return unb64(base64).replace(/^MOCKENC:/, ""); }
export async function buildEncryptedRecord(record, recipients) {
  const keyWraps = {};
  for (const r of recipients) keyWraps[r.address.toLowerCase()] = "MOCK_WRAP";
  return { version: 1, meta: record.meta,
    cipher: { alg: "AES-256-GCM", iv: "MOCK_IV_BASE64", data: b64(JSON.stringify(record.secret)) }, keyWraps };
}
export async function openEncryptedRecord(enc, myAddress, priv) {
  if (!enc.keyWraps?.[myAddress.toLowerCase()]) throw new Error("Ví của bạn không có quyền xem hồ sơ này.");
  let secret;
  try { secret = JSON.parse(unb64(enc.cipher.data)); } catch { secret = { diagnosis: "(dữ liệu giả lập)" }; }
  return { meta: enc.meta, secret };
}
