// Chạy tay: VITE_PINATA_JWT=... node src/services/tests/ipfs.manual.mjs <pdf> <png> <json>
import { readFileSync } from "node:fs";
import { basename } from "node:path";
const ipfs = await import("../ipfsService.js");
const [pdf, png, json] = process.argv.slice(2);
if (!pdf || !png || !json) { console.error("Cách dùng: node ipfs.manual.mjs <file.pdf> <file.png> <file.json>"); process.exit(1); }
const mk = (p, type) => new File([readFileSync(p)], basename(p), { type });
const a = await ipfs.uploadFile(mk(pdf, "application/pdf"));
const b = await ipfs.uploadFile(mk(png, "image/png"));
const c = await ipfs.uploadJSON(JSON.parse(readFileSync(json, "utf8")), basename(json));
console.table([{ loai: "PDF", ...a }, { loai: "PNG", ...b }, { loai: "JSON", ...c }]);
const back = await ipfs.fetchJSON(c.cid);
console.log("Lấy lại JSON OK:", Object.keys(back));
