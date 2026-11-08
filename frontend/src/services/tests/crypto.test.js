import { test } from "node:test";
import assert from "node:assert/strict";
const store = new Map();
globalThis.localStorage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
const c = await import("../cryptoService.js");

const A = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
const H = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const I = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const O = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
const record = { meta: { visitDate: "2030-01-02", hospitalName: "Bệnh viện Mẫu", billCID: "mock-cid-bill-01" },
  secret: { healthId: "HS4010123456789", diagnosis: "Viêm ruột thừa cấp" } };

test("RSA: mã hóa rồi giải mã đúng; sai khóa riêng thì lỗi", async () => {
  const k1 = await c.generateRsaKeyPair(), k2 = await c.generateRsaKeyPair();
  const ct = await c.rsaEncrypt(k1.publicKeyPem, "HS4010123456789");
  assert.equal(await c.rsaDecrypt(k1.privateKeyPem, ct), "HS4010123456789");
  await assert.rejects(c.rsaDecrypt(k2.privateKeyPem, ct));
  assert.ok(k1.publicKeyPem.startsWith("-----BEGIN PUBLIC KEY-----"));
  assert.ok(k1.privateKeyPem.startsWith("-----BEGIN PRIVATE KEY-----"));
});
test("RSA: bản rõ > 190 byte bị từ chối", async () => {
  const k = await c.generateRsaKeyPair();
  await assert.rejects(c.rsaEncrypt(k.publicKeyPem, "x".repeat(191)), /Ma so bao hiem qua dai/);
});
test("Phong bì: (1) mã hóa -> giải mã ra đúng record cho cả 3 người nhận", async () => {
  const [kp, kh, ki] = await Promise.all([c.generateRsaKeyPair(), c.generateRsaKeyPair(), c.generateRsaKeyPair()]);
  const enc = await c.buildEncryptedRecord(record, [
    { address: A, publicKeyPem: kp.publicKeyPem }, { address: H, publicKeyPem: kh.publicKeyPem }, { address: I, publicKeyPem: ki.publicKeyPem }]);
  assert.deepEqual(Object.keys(enc.keyWraps).sort(), [A, H, I].map((a) => a.toLowerCase()).sort());
  assert.equal(enc.cipher.alg, "AES-256-GCM");
  assert.equal(enc.version, 1);
  assert.deepEqual(await c.openEncryptedRecord(enc, A, kp.privateKeyPem), record);
  assert.deepEqual(await c.openEncryptedRecord(enc, I.toUpperCase().replace("0X", "0x"), ki.privateKeyPem), record);
});
test("Phong bì: (2) người ngoài danh sách không mở được", async () => {
  const [kp, ko] = await Promise.all([c.generateRsaKeyPair(), c.generateRsaKeyPair()]);
  const enc = await c.buildEncryptedRecord(record, [{ address: A, publicKeyPem: kp.publicKeyPem }]);
  await assert.rejects(c.openEncryptedRecord(enc, O, ko.privateKeyPem), /không có quyền/);
});
test("Phong bì: (3) sửa 1 byte cipher.data thì GCM báo lỗi", async () => {
  const kp = await c.generateRsaKeyPair();
  const enc = await c.buildEncryptedRecord(record, [{ address: A, publicKeyPem: kp.publicKeyPem }]);
  const bytes = Buffer.from(enc.cipher.data, "base64"); bytes[0] ^= 1;
  enc.cipher.data = bytes.toString("base64");
  await assert.rejects(c.openEncryptedRecord(enc, A, kp.privateKeyPem));
});
test("Phong bì: (4) sai khóa riêng thì lỗi", async () => {
  const [kp, kx] = await Promise.all([c.generateRsaKeyPair(), c.generateRsaKeyPair()]);
  const enc = await c.buildEncryptedRecord(record, [{ address: A, publicKeyPem: kp.publicKeyPem }]);
  await assert.rejects(c.openEncryptedRecord(enc, A, kx.privateKeyPem));
});
test("Lưu/xuất/nhập khóa theo địa chỉ chữ thường", async () => {
  const k = await c.generateRsaKeyPair();
  c.saveKeyPair(A, k);
  assert.deepEqual(c.loadKeyPair(A.toLowerCase()), k);
  const text = c.exportKeyPair(A);
  store.clear();
  assert.equal(c.loadKeyPair(A), null);
  c.importKeyPair(A, text);
  assert.deepEqual(c.loadKeyPair(A), k);
  assert.throws(() => c.importKeyPair(A, "khong phai json"));
});
