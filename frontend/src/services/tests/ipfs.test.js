import { test } from "node:test";
import assert from "node:assert/strict";
process.env.VITE_PINATA_JWT = "test-jwt";
const ipfs = await import("../ipfsService.js");
const mockIpfs = await import("../mock/mockIpfs.js");
const mockCrypto = await import("../mock/mockCrypto.js");
const fx = await import("../mock/fixtures.js");

function fakeFetch(status, body) {
  const calls = [];
  globalThis.fetch = async (url, opts) => { calls.push({ url, opts });
    return { ok: status < 400, status, json: async () => body, blob: async () => new Blob(["x"]) }; };
  return calls;
}
test("uploadFile gọi đúng endpoint, Bearer JWT, network=public, trả cid", async () => {
  const calls = fakeFetch(200, { data: { cid: "bafyTEST" } });
  const r = await ipfs.uploadFile(new File(["abc"], "a.pdf", { type: "application/pdf" }));
  assert.equal(calls[0].url, "https://uploads.pinata.cloud/v3/files");
  assert.equal(calls[0].opts.headers.Authorization, "Bearer test-jwt");
  assert.equal(calls[0].opts.body.get("network"), "public");
  assert.equal(r.cid, "bafyTEST");
  assert.equal(r.url, "https://gateway.pinata.cloud/ipfs/bafyTEST");
});
test("uploadJSON gửi file .json", async () => {
  const calls = fakeFetch(200, { data: { cid: "bafyJ" } });
  await ipfs.uploadJSON({ a: 1 }, "record");
  assert.equal(calls[0].opts.body.get("file").name, "record.json");
});
test("lỗi 401 -> Error tiếng Việt; mất mạng -> Error tiếng Việt", async () => {
  fakeFetch(401, {});
  await assert.rejects(ipfs.uploadFile(new File(["a"], "a.pdf")), /Khóa Pinata/);
  globalThis.fetch = async () => { throw new TypeError("fail"); };
  await assert.rejects(ipfs.fetchJSON("x"), /Không kết nối được/);
});
test("mock: CID bắt đầu bằng mock-, fetchJSON(record01) trả EncryptedRecord mẫu", async () => {
  const r = await mockIpfs.uploadFile(new File(["a"], "a.pdf"));
  assert.ok(r.cid.startsWith("mock-"));
  assert.deepEqual(await mockIpfs.fetchJSON("mock-cid-record-01"), fx.ENCRYPTED_RECORD_01);
});
test("mockCrypto: vòng mã hóa giả vẫn trả đúng hình dạng", async () => {
  const enc = await mockCrypto.buildEncryptedRecord(fx.PLAIN_RECORD, [{ address: fx.WALLETS.PATIENT, publicKeyPem: "x" }]);
  assert.ok(enc.keyWraps[fx.WALLETS.PATIENT.toLowerCase()]);
  assert.deepEqual(await mockCrypto.openEncryptedRecord(enc, fx.WALLETS.PATIENT, "k"), fx.PLAIN_RECORD);
  await assert.rejects(mockCrypto.openEncryptedRecord(enc, fx.WALLETS.OUTSIDER, "k"));
});
test("index.js import được (mặc định bản thật khi không bật mock)", async () => {
  const idx = await import("../index.js");
  assert.equal(typeof idx.ipfsService.uploadFile, "function");
  assert.equal(typeof idx.cryptoService.buildEncryptedRecord, "function");
});
