# CHẶNG A01 — Khởi tạo Hardhat

> **Mã master:** A-01 · **Hạn:** Thứ 3 20/10 · **Rubric:** 1 (nền tảng) · **Nhánh:** `tram` · **Đến lúc này phải có:** repo chung đã dựng xong ở A00 (A (Trâm) tự làm M0-A1), có thư mục `contracts-hardhat/` và `docs/progress/PROGRESS_A.md`.

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Dựng "xưởng" để viết smart contract: cài **Hardhat** (công cụ biên dịch, test, triển khai contract) và **OpenZeppelin** (thư viện contract chuẩn có sẵn ERC-721, phân quyền). Cấu hình hai mạng: **local** (máy mình, miễn phí) và **Sepolia** (mạng thử nghiệm thật). Chưa viết nghiệp vụ nào. Xong chặng là gõ `npx hardhat compile` chạy được.

## 1. Nạp ngữ cảnh (AI phải đọc)
`docs/00_AI_RULES_AND_CONTRACTS.md` (mục 1, 2.1 → 2.4, 3.2, 4.3, 8.2, 8.3) · `docs/plan/A/RULES_A.md` · `docs/progress/PROGRESS_A.md`.

## 2. File được phép tạo/sửa
Chỉ các file sau (tất cả trong `contracts-hardhat/` trừ hai file docs):
- `contracts-hardhat/package.json`, `package-lock.json` (do `npm` sinh ra)
- `contracts-hardhat/hardhat.config.js`
- `contracts-hardhat/.gitignore` (mới)
- `contracts-hardhat/.env` (mới, **chỉ tạo khung rỗng**, KHÔNG commit)
- `contracts-hardhat/contracts/HealthInsuranceNFT.sol` (bản tạm để thử biên dịch)
- `docs/plan/A/reports/REPORT_A01.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** mọi thứ khác; đặc biệt cấm `npx hardhat init` (nó tạo file mẫu `Lock.sol` làm rối repo), cấm đụng thư mục `frontend/`.

## 3. Kiểm tra trước khi làm (sai thì dừng, báo người dùng)
```bash
node -v        # phải >= v18
git branch --show-current     # phải in ra: tram
ls contracts-hardhat docs/progress
```

## 4. Các bước

**Bước 1 — Khởi tạo gói npm và cài thư viện (đúng từng lệnh, đúng thứ tự):**
```bash
cd contracts-hardhat
npm init -y
npm install --save-dev hardhat@2 @nomicfoundation/hardhat-toolbox@5
npm install @openzeppelin/contracts@5 dotenv
npx hardhat --version
```
- `hardhat@2` là bắt buộc. **Không** viết `hardhat` trơn (sẽ cài bản 3, dùng cấu hình khác, hỏng toàn bộ hướng dẫn).
- Kết quả `npx hardhat --version` phải bắt đầu bằng `2.`. Nếu là `3.x`: dừng và báo.
- Nếu `npm install` báo xung đột phiên bản (ERESOLVE): **không** thêm `--force` hay `--legacy-peer-deps`. Dán lỗi vào báo cáo và dừng.
- `@nomicfoundation/hardhat-toolbox` đã gồm Hardhat-ethers, Chai matchers, verify Etherscan, gas reporter. **Không cài gói nào khác.**

**Bước 2 — Sửa `package.json`:** chỉ thêm khối `scripts` (giữ nguyên mọi thứ khác):
```json
"scripts": {
  "compile": "hardhat compile",
  "test": "hardhat test",
  "node": "hardhat node"
}
```

**Bước 3 — Tạo `hardhat.config.js` (ghi đè toàn bộ file bằng nội dung này):**
```js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun", // bắt buộc: OpenZeppelin v5 mới dùng lệnh mcopy của cancun
    },
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  etherscan: { apiKey: process.env.ETHERSCAN_API_KEY || "" },
  gasReporter: { enabled: process.env.REPORT_GAS === "true" },
};
```
(Mạng `hardhat` và `localhost` có sẵn, không cần khai báo.)

**Bước 4 — Tạo `contracts-hardhat/.gitignore`:**
```text
node_modules
artifacts
cache
typechain-types
coverage
coverage.json
gas-report.txt
.env
```

**Bước 5 — Tạo `contracts-hardhat/.env`** với đúng 5 dòng sau, **để trống giá trị** (người dùng tự điền sau; AI **không** điền, không hỏi khóa):
```text
SEPOLIA_RPC_URL=
DEPLOYER_PRIVATE_KEY=
ETHERSCAN_API_KEY=
HOSPITAL_ADDRESS=
POOL_FUND_ETH=
```
Sau đó chạy `git check-ignore -v .env` để chắc chắn file `.env` bị Git bỏ qua (phải in ra một dòng, không để trống).

**Bước 6 — Tạo contract tạm** `contracts-hardhat/contracts/HealthInsuranceNFT.sol` (chặng A02 sẽ ghi đè):
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// BAN TAM chang A01: chi de thu bien dich. Chang A02 se thay bang ban khung day du.
contract HealthInsuranceNFT is ERC721, AccessControl, ReentrancyGuard {
    constructor() ERC721("Health Insurance Card", "HIC") {}

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
```

**Bước 7 — Biên dịch:** `npx hardhat compile`.

**Bước 8 — Ghi phiên bản vào `PROGRESS_A.md`**, mục "Quyết định đã chốt trong phiên": chạy `npm ls --depth=0` và `node -v`, chép các dòng: `hardhat`, `@nomicfoundation/hardhat-toolbox`, `@openzeppelin/contracts`, `dotenv`, Solidity `0.8.28`, `evmVersion cancun`, phiên bản Node. (C (Lan Anh) sẽ chép vào README.)

## 5. Lỗi hay gặp (đừng mắc)
| Lỗi | Nguyên nhân | Xử lý |
|---|---|---|
| `HH19` / `must be an ES module` / cú pháp `import` trong config | Đã cài Hardhat 3 | Gỡ, cài lại đúng `hardhat@2`. Báo người dùng nếu không tự gỡ được |
| `The "mcopy" instruction is only available for Cancun-compatible VMs` | Thiếu `evmVersion: "cancun"` | Kiểm tra lại `hardhat.config.js` |
| `Source "@openzeppelin/contracts/..." not found` | Chưa cài OpenZeppelin | Chạy lại bước 1 |
| `Invalid account` / `HH8` khi chạy mạng Sepolia | `DEPLOYER_PRIVATE_KEY` rỗng/sai định dạng (cần `0x` + 64 ký tự hex) | Chỉ ảnh hưởng chặng Sepolia; chặng này bỏ qua |
| Tải compiler `0.8.28` lỗi mạng | Mạng chặn | Báo người dùng thử lại với mạng khác; **không** đổi phiên bản compiler |

## 6. Lệnh kiểm tra (người dùng tự chạy) và kết quả mong đợi
```bash
cd contracts-hardhat
npx hardhat --version        # bắt đầu bằng 2.
npx hardhat compile          # "Compiled N Solidity files successfully (evm target: cancun)."
git check-ignore -v .env     # in ra 1 dòng chứa ".gitignore"
git status --short           # KHÔNG thấy .env, node_modules, artifacts
```

## 7. Mục riêng trong báo cáo
Dán: output `npx hardhat --version`, `npm ls --depth=0`, `npx hardhat compile`, `git status --short`, `git check-ignore -v .env`. Ghi rõ có dùng Hardhat 2 không.

## 8. Gửi mình kiểm
`contracts-hardhat/hardhat.config.js`, `contracts-hardhat/package.json`, file báo cáo.

**Mình sẽ soi:** Hardhat là `2.x`; có `evmVersion: "cancun"`; không có gói lạ trong `package.json`; `.env` không bị commit; không có `Lock.sol`.

## 9. Prompt dán cho AI
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A01_khoi_tao_hardhat.md.
Chỉ làm ĐÚNG chặng A01 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A01.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
