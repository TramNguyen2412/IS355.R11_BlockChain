// ipfsService.js — gọi Pinata bằng fetch thuần. Chủ: B. Chỉ file này được gọi Pinata.
const env = import.meta.env ?? {};
const JWT = () => env.VITE_PINATA_JWT || globalThis.process?.env?.VITE_PINATA_JWT || "";
const GATEWAY = () =>
  env.VITE_PINATA_GATEWAY || globalThis.process?.env?.VITE_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/";
const UPLOAD_URL = "https://uploads.pinata.cloud/v3/files";
const MAX_BYTES = 25 * 1024 * 1024;

export function gatewayUrl(cid) {
  const base = GATEWAY();
  return base.endsWith("/") ? base + cid : `${base}/${cid}`;
}

async function pinFile(file, name) {
  if (!JWT()) throw new Error("Chưa cấu hình khóa Pinata (VITE_PINATA_JWT).");
  if (file.size > MAX_BYTES) throw new Error("File quá lớn (tối đa 25 MB).");
  const form = new FormData();
  form.append("file", file);
  form.append("network", "public");
  if (name) form.append("name", name);
  let res;
  try {
    res = await fetch(UPLOAD_URL, { method: "POST", headers: { Authorization: `Bearer ${JWT()}` }, body: form });
  } catch {
    throw new Error("Không kết nối được tới IPFS. Hãy kiểm tra mạng.");
  }
  if (res.status === 401 || res.status === 403) throw new Error("Khóa Pinata không hợp lệ hoặc đã hết hạn.");
  if (!res.ok) throw new Error(`Tải lên IPFS thất bại (mã ${res.status}).`);
  const json = await res.json();
  const cid = json?.data?.cid;
  if (!cid) throw new Error("IPFS không trả về mã CID.");
  return { cid, url: gatewayUrl(cid) };
}

export const uploadFile = (file) => pinFile(file, file.name);

export function uploadJSON(obj, name) {
  const fileName = name?.endsWith(".json") ? name : `${name || "data"}.json`;
  const file = new File([JSON.stringify(obj)], fileName, { type: "application/json" });
  return pinFile(file, fileName);
}

async function getFromGateway(cid) {
  let res;
  try {
    res = await fetch(gatewayUrl(cid));
  } catch {
    throw new Error("Không kết nối được tới IPFS. Hãy kiểm tra mạng.");
  }
  if (!res.ok) throw new Error(`Không tải được dữ liệu từ IPFS (mã ${res.status}).`);
  return res;
}
export async function fetchJSON(cid) {
  const res = await getFromGateway(cid);
  try { return await res.json(); } catch { throw new Error("Dữ liệu trên IPFS không phải JSON hợp lệ."); }
}
export async function fetchBlob(cid) {
  return (await getFromGateway(cid)).blob();
}
