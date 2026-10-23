# CHẶNG A08 — Script nạp dữ liệu mẫu và bàn giao contract hoàn chỉnh (mốc H3)

> **Mã master:** A-08 (+ A-09 tùy chọn) · **Hạn:** CN 01/11 · **Rubric:** 1, 2 · **Nhánh:** `tram` · **Cần trước:** A07 đã merge, 34 test pass.

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Viết `seed.js`: một lệnh để **dựng sẵn môi trường demo** (tạo 2 gói mẫu, cấp quyền cho ví bệnh viện, nạp quỹ). B (Phương Anh) và C (Lan Anh) dùng nó để chạy giao diện với contract thật. Sau đó **deploy lại local** để `abi.json` và `address.json` là **bản cuối** và đẩy lên Git: đó là **mốc bàn giao H3** (cả nhóm chuyển từ mock sang contract thật). Tùy chọn: xuất bảng gas cho báo cáo.

## 1. Nạp ngữ cảnh
File 00 mục 1, 4.3, 5 (thứ tự khởi tạo), **6.1, 6.2** · `RULES_A.md` · `PROGRESS_A.md`.

## 2. File được phép tạo/sửa
- `contracts-hardhat/scripts/seed.js` (mới)
- `frontend/src/contracts/abi.json`, `address.json` (chỉ do `deploy.js` ghi lại)
- `docs/plan/A/reports/REPORT_A08.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** sửa contract (nếu phát hiện lỗi contract: **dừng, báo**, vì đổi contract = đổi ABI của cả nhóm); sửa `.env.example` (đã có sẵn `HOSPITAL_ADDRESS` và `POOL_FUND_ETH` từ lúc dựng repo ở A00, không cần sửa).

## 3. Kiểm tra trước khi làm
`npx hardhat test` → **34 passing**.

## 4. Các bước
**Bước 1.** Tạo `contracts-hardhat/scripts/seed.js` (chép nguyên văn):
```js
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { OUT_DIR } = require("./exportAbi");

// Du lieu mau chuan: file 00 muc 6.2
const PLANS = [
  { name: "Gói Cơ bản", price: "0.002", limit: "0.02", days: 30, cid: "mock-cid-policy-basic" },
  { name: "Gói Nâng cao", price: "0.005", limit: "0.05", days: 90, cid: "mock-cid-policy-premium" },
];

async function main() {
  const { ethers, network } = hre;
  const info = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "address.json"), "utf8"));
  const signers = await ethers.getSigners();
  const admin = signers[0];
  const contract = await ethers.getContractAt("HealthInsuranceNFT", info.HealthInsuranceNFT, admin);
  const isLocal = network.name === "localhost" || network.name === "hardhat";

  let hospital, poolEth;
  if (isLocal) {
    hospital = signers[1].address;               // tai khoan #1 cua Hardhat
    poolEth = "0.1";
    if ((await contract.totalPlans()) === 0n) {  // chay lai khong tao trung goi
      for (const p of PLANS) {
        const tx = await contract.createPlan(p.name, ethers.parseEther(p.price), ethers.parseEther(p.limit), p.days, p.cid);
        await tx.wait();
      }
      console.log("Da tao 2 goi mau");
    } else {
      console.log("Da co goi, bo qua buoc tao goi");
    }
  } else {
    hospital = process.env.HOSPITAL_ADDRESS;     // Sepolia: KHONG tao goi (Admin tao qua Console cua B)
    poolEth = process.env.POOL_FUND_ETH;
    if (!hospital || !poolEth) throw new Error("Thieu HOSPITAL_ADDRESS hoac POOL_FUND_ETH trong .env");
  }

  await (await contract.authorizeHospital(hospital, true)).wait();
  console.log("Da cap quyen benh vien:", hospital);
  if (isLocal && (await contract.poolBalance()) > 0n) {
    console.log("Quy da co tien, bo qua buoc nap quy");
  } else {
    await (await contract.fundPool({ value: ethers.parseEther(poolEth) })).wait();
  }
  console.log("Quy hien tai:", ethers.formatEther(await contract.poolBalance()), "ETH");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
```

**Giải thích hành vi:**
- **Mạng local** (`localhost`): tạo 2 gói đúng file 00 mục 6.2 (nếu chưa có gói), cấp quyền cho ví bệnh viện = **tài khoản #1 của Hardhat** (`0x70997970C51812dc3A010C7d01b50e0d17dc79C8`), nạp quỹ **0.1 ETH** (nếu quỹ đang bằng 0). Chạy lại nhiều lần không tạo trùng.
- **Mạng Sepolia:** **không** tạo gói (gói do Admin tạo qua Console của B (Phương Anh) bằng PDF thật); chỉ cấp quyền cho `HOSPITAL_ADDRESS` và nạp `POOL_FUND_ETH` đọc từ `.env`.
- Thứ tự khởi tạo đúng file 00 mục 5: `deploy.js` → `seed.js` → (Admin đăng ký khóa trên giao diện) → ...

**Bước 2.** Chạy trọn quy trình với **hai terminal**:
- Terminal 1: `cd contracts-hardhat && npx hardhat node` (giữ chạy)
- Terminal 2:
```bash
cd contracts-hardhat
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/seed.js --network localhost
```

**Bước 3 (kiểm tra bằng tay):** chạy lệnh trong mục 6.

**Bước 4 (tùy chọn, P2 — A-09):** bảng gas cho báo cáo: `REPORT_GAS=true npx hardhat test` (terminal 2, **không cần** node). Chép bảng "Methods" vào báo cáo.

## 5. Lỗi hay gặp
| Lỗi | Xử lý |
|---|---|
| `ECONNREFUSED` | Chưa bật `npx hardhat node` |
| `Cannot read ... address.json` | Chưa chạy `deploy.js` trước |
| Sau khi khởi động lại node, `seed.js` báo gói/quyền sai | Node mới = blockchain mới: phải chạy `deploy.js` lại trước `seed.js` |

## 6. Lệnh kiểm tra (người dùng tự chạy) và kết quả mong đợi
Output `seed.js` lần 1: `Da tao 2 goi mau` / `Da cap quyen benh vien: 0x7099...79C8` / `Quy hien tai: 0.1 ETH`.
Chạy `seed.js` **lần 2**: `Da co goi, bo qua buoc tao goi` / `Quy da co tien, bo qua buoc nap quy` / `Quy hien tai: 0.1 ETH` (không thành 0.2).

Kiểm tra trạng thái trên chain (chạy ở `contracts-hardhat/`, khi node vẫn đang chạy):
```bash
node -e "const {ethers}=require('ethers');(async()=>{const p=new ethers.JsonRpcProvider('http://127.0.0.1:8545');const abi=require('../frontend/src/contracts/abi.json');const a=require('../frontend/src/contracts/address.json');const c=new ethers.Contract(a.HealthInsuranceNFT,abi,p);const pl=await c.getPlans();console.log(pl.length,pl[0].name,pl[0].price.toString(),pl[1].price.toString(),ethers.formatEther(await c.poolBalance()),await c.hasRole(await c.HOSPITAL_ROLE(),'0x70997970C51812dc3A010C7d01b50e0d17dc79C8'))})()"
```
→ **`2 Gói Cơ bản 2000000000000000 5000000000000000 0.1 true`**

**Dấu vân tay:** `seed.js` **49** dòng.

## 7. Mục riêng trong báo cáo
Output deploy, seed lần 1 và lần 2, output lệnh `node -e`; (tùy chọn) bảng gas.

## 8. Bàn giao H3 (người dùng làm sau khi mình xác nhận ĐẠT)
```bash
git add contracts-hardhat/scripts/seed.js frontend/src/contracts/abi.json frontend/src/contracts/address.json docs/plan/A docs/progress/PROGRESS_A.md
git commit -m "[M1] seed script, final local abi"
git pull origin main      # gộp main mới nhất, không được có conflict
git push origin tram
```
Mở Pull Request từ `tram` vào `main`, merge, rồi nhắn nhóm: "**H3 xong:** contract hoàn chỉnh trên local + seed.js + ABI cuối. Chạy `npx hardhat node`, `deploy.js`, `seed.js` rồi đổi `VITE_USE_MOCK=false`."

## 9. Gửi mình kiểm
`scripts/seed.js`, báo cáo (kèm output lệnh `node -e`).

**Mình sẽ soi:** gói tạo đúng số liệu file 00 mục 6.2 (giá, hạn mức, 30/90 ngày, CID mock); không tạo gói trên Sepolia; không có khóa/địa chỉ cứng của Sepolia; cấp quyền cho tài khoản #1.

## 10. Prompt dán cho AI
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A08_seed_va_ban_giao_H3.md.
Chỉ làm ĐÚNG chặng A08 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A08.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
