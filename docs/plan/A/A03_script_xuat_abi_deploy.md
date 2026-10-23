# CHẶNG A03 — Script xuất ABI và địa chỉ (mốc H2)

> **Mã master:** A-03 · **Hạn:** Thứ 5 22/10 · **Rubric:** 1, 2 · **Nhánh:** `tram` · **Cần trước:** A02 xong.

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Viết hai script: `exportAbi.js` (ghi hai file `abi.json` và `address.json` vào `frontend/src/contracts/` để **C (Lan Anh) và B (Phương Anh) đọc**) và `deploy.js` (triển khai contract rồi tự gọi xuất file). Xong chặng này, bạn đẩy lên Git: đó là **mốc bàn giao H2**. C dùng ABI để làm `contractService.js`, không cần chờ logic contract.
`abi.json`/`address.json` là **file tự sinh**: chỉ script này được ghi, không ai sửa tay (file 00 luật R4).

## 1. Nạp ngữ cảnh (AI phải đọc)
`docs/00_AI_RULES_AND_CONTRACTS.md` mục 1, 2.2, **4.3** (mẫu `address.json`), 3.2 · `docs/plan/A/RULES_A.md` · `docs/progress/PROGRESS_A.md`.

## 2. File được phép tạo/sửa
- `contracts-hardhat/scripts/exportAbi.js` (mới)
- `contracts-hardhat/scripts/deploy.js` (mới)
- `frontend/src/contracts/abi.json`, `frontend/src/contracts/address.json` (**chỉ do script ghi ra**, AI không tự gõ nội dung)
- `docs/plan/A/reports/REPORT_A03.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** viết `seed.js` (để A08); sửa `contractService.js` hay bất kỳ file trong `frontend/src/app/`.

## 3. Kiểm tra trước khi làm
```bash
cd contracts-hardhat && npx hardhat compile   # OK với bản khung A02
```

## 4. Các bước
**Bước 1.** Tạo `contracts-hardhat/scripts/exportAbi.js` (chép nguyên văn):
```js
// Ghi frontend/src/contracts/abi.json va address.json (file sinh tu dong, KHONG sua tay)
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "..", "frontend", "src", "contracts");
const ARTIFACT = path.join(__dirname, "..", "artifacts", "contracts", "HealthInsuranceNFT.sol", "HealthInsuranceNFT.json");

function writeAbi() {
  const abi = JSON.parse(fs.readFileSync(ARTIFACT, "utf8")).abi;
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "abi.json"), JSON.stringify(abi, null, 2));
  return abi.length;
}

// info = { chainId, network, address, insurer, deployBlock }
function exportAbi(info) {
  const n = writeAbi();
  const addressJson = {
    chainId: Number(info.chainId),
    network: info.network,
    HealthInsuranceNFT: info.address,
    insurer: info.insurer,
    deployBlock: Number(info.deployBlock),
  };
  fs.writeFileSync(path.join(OUT_DIR, "address.json"), JSON.stringify(addressJson, null, 2));
  console.log(`Da ghi abi.json (${n} muc) va address.json vao ${OUT_DIR}`);
}

module.exports = { exportAbi, OUT_DIR };

// Chay truc tiep: chi lam moi abi.json (khong dong den address.json)
if (require.main === module) {
  console.log(`Da ghi abi.json (${writeAbi()} muc)`);
}
```

**Bước 2.** Tạo `contracts-hardhat/scripts/deploy.js` (chép nguyên văn):
```js
const hre = require("hardhat");
const { exportAbi } = require("./exportAbi");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const Factory = await hre.ethers.getContractFactory("HealthInsuranceNFT");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  const receipt = await contract.deploymentTransaction().wait();
  const net = await hre.ethers.provider.getNetwork();
  exportAbi({
    chainId: net.chainId,
    network: hre.network.name,
    address,
    insurer: deployer.address,
    deployBlock: receipt.blockNumber,
  });
  console.log("HealthInsuranceNFT:", address);
  console.log("Insurer (admin):", deployer.address);
  console.log("Deploy block:", receipt.blockNumber);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
```

**Bước 3.** Chạy thử (cần **hai cửa sổ terminal**):
- Terminal 1 (giữ chạy, không tắt): `cd contracts-hardhat && npx hardhat node`
- Terminal 2: `cd contracts-hardhat && npx hardhat run scripts/deploy.js --network localhost`

Kết quả terminal 2 phải có dòng `HealthInsuranceNFT: 0x5FbDB2315678afecb367f032d93F642f64180aa3` (địa chỉ này cố định khi node mới khởi động; trùng địa chỉ giả trong file 00 mục 6.1).

**Bước 4.** Kiểm tra hai file sinh ra có nội dung đúng (xem mục 6). Rồi tắt node (Ctrl+C (Lan Anh) ở terminal 1).

**Giải thích:**
- `deployBlock` là số khối lúc deploy: `contractService.getEvents` dùng để chỉ quét sự kiện từ đó (nhanh).
- `insurer` là ví deploy = Admin = công ty bảo hiểm: C (Lan Anh) dùng để lấy khóa mã hóa của công ty bảo hiểm.
- Script ghi ra `../frontend/src/contracts` (tính từ `contracts-hardhat/scripts`); nếu chưa có thư mục thì tự tạo.

## 5. Lỗi hay gặp
| Lỗi | Xử lý |
|---|---|
| `ECONNREFUSED 127.0.0.1:8545` | Chưa bật `npx hardhat node` ở terminal 1 |
| Địa chỉ in ra khác `0x5FbDB...` | Node đã chạy lâu/đã deploy trước đó; tắt node, bật lại rồi deploy lại. Không phải lỗi code |
| Không thấy file ở `frontend/src/contracts` | Kiểm tra đường dẫn; **không** tự tạo file bằng tay |
| `Cannot find module './exportAbi'` | Hai file phải cùng thư mục `scripts/` |

## 6. Lệnh kiểm tra (người dùng tự chạy) và kết quả mong đợi
```bash
cat frontend/src/contracts/address.json
```
→ có đủ 5 khóa: `chainId` (31337), `network` (`localhost`), `HealthInsuranceNFT` (địa chỉ `0x...`), `insurer` (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`), `deployBlock` (số, thường 1).

```bash
node -e "const a=require('./frontend/src/contracts/abi.json'); console.log(Array.isArray(a), a.filter(x=>x.type==='function').length>0, a.some(x=>x.name==='createPlan'), a.some(x=>x.name==='approveClaim'))"
```
→ `true true true true` (chạy từ thư mục gốc repo).

**Dấu vân tay:** `exportAbi.js` **34** dòng, `deploy.js` **24** dòng (`wc -l`).

## 7. Mục riêng trong báo cáo
Dán: output deploy, nội dung `address.json`, output lệnh `node -e`, `git status --short`.

## 8. Sau khi mình xác nhận ĐẠT → bàn giao H2 (người dùng làm)
```bash
git add contracts-hardhat/scripts/exportAbi.js contracts-hardhat/scripts/deploy.js contracts-hardhat/contracts/HealthInsuranceNFT.sol frontend/src/contracts/abi.json frontend/src/contracts/address.json docs/plan/A docs/progress/PROGRESS_A.md
git commit -m "[M1] contract skeleton, export abi, deploy script"
git pull origin main      # gộp main mới nhất, không được có conflict
git push -u origin tram
```
Mở Pull Request từ `tram` vào `main`, merge, rồi nhắn nhóm: "**H2 xong:** contract khung + abi.json + address.json (local), git pull nhé".
(`git add docs/plan/A` là ngoại lệ được phép vì chỉ thêm file trong lãnh địa A.)

## 9. Gửi mình kiểm
`scripts/exportAbi.js`, `scripts/deploy.js`, nội dung `address.json`, báo cáo.

**Mình sẽ soi:** `address.json` đủ 5 khóa đúng tên (`HealthInsuranceNFT`, `insurer`, `deployBlock`); `chainId` là số không phải chuỗi; script không chứa khóa bí mật; `insurer` lấy từ `deployer.address`.

## 10. Prompt dán cho AI
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A03_script_xuat_abi_deploy.md.
Chỉ làm ĐÚNG chặng A03 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A03.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
