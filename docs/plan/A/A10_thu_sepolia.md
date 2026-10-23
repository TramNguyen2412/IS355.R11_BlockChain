# CHẶNG A10 — Thử deploy Sepolia sớm và chuẩn bị cho deploy chính thức

> **Mã master:** A-15 (Thứ 5 05/11) và A-16 (CN 08/11) · **Rubric:** 1 (triển khai testnet) · **Nhánh:** `tram` · **Cần trước:** A08 xong (contract hoàn chỉnh).

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Deploy **thử** contract lên **Sepolia** (mạng thử nghiệm thật) sớm, chỉ để phát hiện trục trặc (RPC, phí gas, faucet, verify Etherscan) **trước ngày deploy chính thức 09/11**. Bản thử **không dùng chính thức** và **không được đẩy lên Git** (nếu đẩy, B (Phương Anh) và C (Lan Anh) sẽ bị trỏ nhầm sang địa chỉ thử). Sau đó (A-16, CN 08/11) kiểm tra ví đủ ETH và gom địa chỉ ví Sepolia của cả nhóm.

**Quan trọng về an toàn:** chặng này cần **khóa riêng ví** và **khóa API**. **Chỉ Trâm gõ các lệnh có khóa.** AI **không** được đọc `.env`, không nhận khóa trong chat, không tự chạy `deploy`/`seed`/`verify` trên Sepolia. Vai trò của AI ở chặng này: **đọc output Trâm dán vào, giúp chẩn đoán lỗi, và viết báo cáo.**

## 1. Nạp ngữ cảnh
File 00 mục 1 (R5), 4.3, 5, 6.1, 8.1 · `RULES_A.md` · `PROGRESS_A.md`.

## 2. File được phép tạo/sửa
- `contracts-hardhat/.env` (**chỉ Trâm điền bằng tay**, không commit)
- `docs/plan/A/reports/REPORT_A10.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** commit `abi.json`/`address.json` sau khi chạy thử Sepolia (xem bước 6); đổi contract.

## 3. Chuẩn bị (Trâm làm, một lần)
1. **RPC Sepolia:** đăng ký tài khoản miễn phí ở một nhà cung cấp RPC (ví dụ Alchemy hoặc Infura), tạo ứng dụng mạng **Sepolia**, lấy URL dạng `https://...`.
2. **Etherscan API key:** tạo tài khoản Etherscan, tạo API key miễn phí.
3. **Ví Admin thử nghiệm** (đã tạo ở M0-ALL, chỉ chứa ETH testnet): xuất khóa riêng từ MetaMask (Account details → Show private key). Cần **≥ 0.15 ETH Sepolia**.
4. Điền `contracts-hardhat/.env` (mở bằng trình soạn thảo, **không dán nội dung vào chat**):
```text
SEPOLIA_RPC_URL=https://...
DEPLOYER_PRIVATE_KEY=0x...(64 ký tự hex, có tiền tố 0x)
ETHERSCAN_API_KEY=...
HOSPITAL_ADDRESS=0x...(địa chỉ ví Bệnh viện Sepolia, địa chỉ công khai)
POOL_FUND_ETH=0.05
```
5. Kiểm tra đã điền đủ mà **không lộ giá trị** (lệnh chỉ in `set`/`EMPTY`):
```bash
cd contracts-hardhat
node -e "require('dotenv').config(); console.log(['SEPOLIA_RPC_URL','DEPLOYER_PRIVATE_KEY','ETHERSCAN_API_KEY','HOSPITAL_ADDRESS','POOL_FUND_ETH'].map(k=>k+': '+(process.env[k]?'set':'EMPTY')).join('\n'))"
```
→ cả 5 dòng phải là `set`.

## 4. Các bước (Trâm chạy)
**Bước 1 — Thử chắc chắn test còn pass:** `npx hardhat test` → 34 passing.

**Bước 2 — Deploy thử:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
→ in địa chỉ contract, `Insurer (admin)` là địa chỉ ví Admin, `Deploy block` là số lớn. Chờ ~15–60 giây. **Chép địa chỉ contract vào PROGRESS_A** (mục "Quyết định": "địa chỉ thử Sepolia: 0x...").

**Bước 3 — Seed thử (chỉ cấp quyền bệnh viện + nạp quỹ, không tạo gói):**
```bash
npx hardhat run scripts/seed.js --network sepolia
```
→ `Da cap quyen benh vien: 0x...` và `Quy hien tai: 0.05 ETH`.

**Bước 4 — Verify mã nguồn lên Etherscan** (contract **không có tham số constructor**):
```bash
npx hardhat verify --network sepolia <ĐỊA_CHỈ_CONTRACT>
```
→ `Successfully verified contract ... on Etherscan` và một đường link. Nếu báo lỗi cấu hình khóa Etherscan (Etherscan đã đổi API): **dán lỗi cho AI/Claude**; xử lý bằng cách tra tài liệu chính thức của `hardhat-verify` và dán đoạn cấu hình hiện hành (AI không đoán).

**Bước 5 — Kiểm tra bằng mắt:** mở `https://sepolia.etherscan.io/address/<ĐỊA_CHỈ>` → tab **Contract** có dấu ✅, tab **Read Contract** gọi được `totalPlans` (kết quả `0`: đúng, vì gói do Admin tạo qua Console của B).

**Bước 6 — QUAN TRỌNG: hoàn nguyên file sinh tự động** để không lỡ đẩy địa chỉ thử lên Git:
```bash
git checkout -- frontend/src/contracts/abi.json frontend/src/contracts/address.json
git status --short   # KHÔNG được thấy hai file này và KHÔNG thấy .env
```

**Bước 7 — A-16 (CN 08/11), chuẩn bị deploy chính thức:**
- Ví Admin còn **≥ 0.15 ETH Sepolia** (deploy ~0.01–0.03; nạp quỹ 0.1). Thiếu thì xin thêm faucet (có thể mất vài ngày chờ, nên làm sớm).
- Điền cột "Địa chỉ Sepolia" file 00 mục 6.1 qua quy trình mục 8.1: mỗi người nhắn địa chỉ ví công khai của mình trong chat; Trâm gửi yêu cầu đổi theo mẫu:
```text
[YÊU CẦU ĐỔI] A → cả nhóm
Điều khoản muốn đổi: mục 6.1 (cột "Địa chỉ Sepolia")
Nội dung cũ → mới: "0x_DIEN_KHI_CO" → địa chỉ ví thật của ADMIN/HOSPITAL/PATIENT/OUTSIDER (4 địa chỉ)
Lý do: sắp deploy Sepolia chính thức ngày 09/11
Ảnh hưởng tới: seed.js, test tích hợp, tài liệu
```
Sau khi cả ba đồng ý, **C (Lan Anh)** sửa file 00 (không phải A).
- Đặt `HOSPITAL_ADDRESS` trong `.env` = địa chỉ ví Bệnh viện Sepolia; `POOL_FUND_ETH=0.1` cho bản chính thức.

## 5. Lỗi hay gặp
| Lỗi | Nguyên nhân | Xử lý |
|---|---|---|
| `insufficient funds for gas` | Ví Admin thiếu ETH | Xin faucet |
| `Invalid account` / `private key must be 32 bytes` | `DEPLOYER_PRIVATE_KEY` thiếu `0x` hoặc sai độ dài | Sửa `.env` |
| `HH108`/`could not detect network`/timeout | URL RPC sai hoặc nhà cung cấp chặn | Kiểm tra URL, thử nhà cung cấp khác |
| `Contract source code already verified` | Đã verify | Không phải lỗi |
| `nonce too low` hoặc giao dịch kẹt | Giao dịch cũ chưa xong | Chờ vài phút rồi thử lại |

## 6. Lệnh kiểm tra và kết quả mong đợi
- Bước 2–5 chạy thành công như mô tả; contract hiển thị ✅ verified trên Etherscan.
- Bước 6: `git status --short` không còn `address.json`, `abi.json`, `.env`.

## 7. Mục riêng trong báo cáo
Trâm dán (đã **xóa mọi khóa/URL RPC có chứa API key**): output deploy (địa chỉ + block), output seed, output verify, link Etherscan, `git status --short` sau bước 6, các vấn đề gặp và cách xử lý, số dư ví Admin còn lại, ghi nhận bước A-16 đã làm.

## 8. Gửi mình kiểm
Báo cáo. **Nhớ che URL RPC (chứa khóa API) và không bao giờ dán khóa riêng.**

**Mình sẽ soi:** có hoàn nguyên `address.json` chưa; verify thành công chưa; số dư đủ chưa; các vấn đề đã biết cách xử lý trước ngày 09/11.

## 9. Prompt dán cho AI (chế độ chỉ-hướng-dẫn)
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A10_thu_sepolia.md.
Chỉ làm ĐÚNG chặng A10 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A10.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
Thêm câu này vào cuối prompt: **"Chặng này bạn KHÔNG chạy lệnh nào cần khóa. Bạn chỉ hướng dẫn, đọc output tôi dán, chẩn đoán lỗi và soạn báo cáo."**
