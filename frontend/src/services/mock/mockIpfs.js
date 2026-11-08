// mockIpfs.js — cùng chữ ký ipfsService, chạy trong bộ nhớ. CID giả bắt đầu bằng "mock-".
import { ENCRYPTED_RECORD_01, CIDS } from "./fixtures.js";
const delay = (ms = 50) => new Promise((r) => setTimeout(r, ms));
const jsonStore = new Map([[CIDS.record01, ENCRYPTED_RECORD_01], [CIDS.record02, ENCRYPTED_RECORD_01]]);
const blobStore = new Map();
let counter = 0;
export const gatewayUrl = (cid) => `https://gateway.pinata.cloud/ipfs/${cid}`;
export async function uploadFile(file) {
  await delay(); const cid = `mock-cid-file-${++counter}`;
  blobStore.set(cid, file); return { cid, url: gatewayUrl(cid) };
}
export async function uploadJSON(obj, name) {
  await delay(); const cid = `mock-cid-json-${++counter}`;
  jsonStore.set(cid, obj); return { cid, url: gatewayUrl(cid) };
}
export async function fetchJSON(cid) {
  await delay(); if (!jsonStore.has(cid)) throw new Error("Không tìm thấy dữ liệu trên IPFS giả lập.");
  return jsonStore.get(cid);
}
export async function fetchBlob(cid) {
  await delay(); return blobStore.get(cid) ?? new Blob([`DU LIEU GIA ${cid}`], { type: "text/plain" });
}
