# CHẶNG A13 — Deploy Sepolia CHÍNH THỨC (mốc H6)

> **Mã master:** A-17 và A-18 · **Hạn:** Chủ nhật 09/11 sáng (deploy) và 09–10/11 (verify, báo nhóm) · **Rubric:** 1 (triển khai testnet, có link Etherscan) · **Nhánh:** `tram` · **Cần trước:** A10 đã thử thành công; A12 xong; ví Admin ≥ 0.15 ETH Sepolia; file 00 mục 6.1 đã có 4 địa chỉ ví (A-16).

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Deploy contract **bản cuối** lên Sepolia, nạp quỹ 0.1 ETH, cấp quyền bệnh viện, verify mã nguồn trên Etherscan, rồi **commit đúng hai file** `abi.json` và `address.json` để B (Phương Anh) và C (Lan Anh) chuyển sang chạy Sepolia thật. Đây là mốc **H6**. **Sau 12/11 không sửa contract** (sửa = deploy lại = đổi địa chỉ = cả nhóm sửa theo). Như A10: **Trâm gõ mọi lệnh có khóa**, AI chỉ hướng dẫn và viết báo cáo.

## 1. Nạp ngữ cảnh
File 00 mục 1 (R5), 4.3, 5, 6.1, 8.1 · `RULES_A.md` · `PROGRESS_A.md` · `REPORT_A10.md` (các lỗi đã gặp ở bản thử).

## 2. File được phép tạo/sửa
- `contracts-hardhat/.env` (Trâm điền tay, không commit)
- `frontend/src/contracts/abi.json`, `frontend/src/contracts/address.json` (**do script sinh**, được commit lần này)
- `docs/plan/A/reports/REPORT_A13.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** sửa contract/test/script; commit file nào khác ngoài hai file trên + PROGRESS/REPORT; `git add .`.

## 3. Kiểm tra trước khi làm (Trâm chạy)
```bash
git checkout tram && git pull origin main      # gộp main mới nhất vào tram; có conflict thì DỪNG, báo Trâm
git status --short          # phải rỗng
cd contracts-hardhat
npx hardhat compile --force && npx hardhat test
```
→ **34 passing**. Kiểm tra `.env` bằng lệnh chỉ in `set`/`EMPTY` như A10 mục 3 bước 5 (cả 5 dòng `set`), với `HOSPITAL_ADDRESS` = ví Bệnh viện đã chốt ở file 00 mục 6.1 và **`POOL_FUND_ETH=0.1`**.
Kiểm tra số dư ví Admin ≥ 0.15 ETH:
```bash
npx hardhat console --network sepolia
> (await ethers.provider.getBalance((await ethers.getSigners())[0].address)).toString()
```
→ số lớn hơn `150000000000000000`. Gõ `.exit` để thoát.

## 4. Các bước (Trâm chạy)
**Bước 1 — Deploy:** `npx hardhat run scripts/deploy.js --network sepolia`. Chép **địa chỉ contract** và **deploy block**.

**Bước 2 — Seed:** `npx hardhat run scripts/seed.js --network sepolia` → in `Da cap quyen benh vien: 0x...` và `Quy hien tai: 0.1 ETH`. (Gói bảo hiểm **không** tạo ở bước này: Admin tạo qua Console của B (Phương Anh), đúng bảng file 00 mục 6.2.)

**Bước 3 — Verify:** `npx hardhat verify --network sepolia <ĐỊA_CHỈ>` → `Successfully verified`. Chụp ảnh trang Contract trên Etherscan có dấu ✅ (minh chứng Tiêu chí 1).

**Bước 4 — Kiểm tra sau deploy** (Etherscan → Read Contract, hoặc console):
| Kiểm tra | Kết quả mong đợi |
|---|---|
| `totalPlans()` | `0` |
| `hasRole(HOSPITAL_ROLE, <ví Bệnh viện>)` (`HOSPITAL_ROLE` = `keccak256("HOSPITAL_ROLE")`) | `true` |
| `poolBalance()` | `100000000000000000` (0.1 ETH) |
| `insurer()` | địa chỉ ví Admin |

**Bước 5 — Commit hai file sinh tự động:**
```bash
cd ..
git status --short     # CHỈ thấy abi.json, address.json (không .env, không file lạ)
cat frontend/src/contracts/address.json
```
→ `chainId` = `11155111`, `HealthInsuranceNFT` = địa chỉ vừa deploy. Rồi:
```bash
git add frontend/src/contracts/abi.json frontend/src/contracts/address.json docs/progress/PROGRESS_A.md docs/plan/A/reports/REPORT_A13.md
git commit -m "[M1] Deploy Sepolia chinh thuc: abi.json + address.json"
git pull origin main      # gộp main mới nhất, không được có conflict
git push -u origin tram
```
Mở Pull Request, nhờ B (Phương Anh) hoặc C (Lan Anh) xem rồi merge vào `main`; sau đó `git checkout main && git pull origin main && git tag v1-sepolia && git push origin v1-sepolia`, rồi `git checkout tram && git pull origin main` để nhánh `tram` bắt kịp `main`.

**Bước 6 — Báo nhóm (H6)** trong chat:
```text
[H6] Deploy Sepolia xong.
Contract: 0x...   Deploy block: ...   Etherscan: https://sepolia.etherscan.io/address/0x...
Pool: 0.1 ETH. Bệnh viện đã được cấp quyền. CHƯA có gói nào: Admin tạo 2 gói qua Console (file 00 mục 6.2).
B, C: git pull main, đặt VITE_USE_MOCK=false và VITE_CHAIN_ID=11155111.
Từ giờ KHÔNG đổi contract (đóng băng 12/11).
```
**Bước 7 — Cập nhật file 00 mục 6.1/ghi chú địa chỉ contract:** dùng mẫu mục 8.1 (như A10), để **C (Lan Anh)** sửa file.

## 5. Lỗi hay gặp
Như A10 mục 5, thêm:
| Lỗi | Xử lý |
|---|---|
| Deploy nhầm khi `git status` chưa sạch | Dừng, báo mình trước khi commit |
| Địa chỉ trong `address.json` khác Etherscan | Chạy lại `deploy.js` chỉ khi contract **chưa** ai dùng; nếu không, dừng và hỏi mình |
| Verify lỗi "Unable to verify" ngay sau deploy | Chờ 1–2 phút (Etherscan chưa kịp index) rồi chạy lại |
| `git status` thấy `.env` | Dừng, `.env` phải nằm trong `.gitignore`; **không** commit |

## 6. Lệnh kiểm tra và kết quả mong đợi
```bash
git diff --stat main -- frontend/src/contracts
git log -1 --stat
```
→ chỉ hai file `abi.json`, `address.json` (cộng PROGRESS/REPORT). `address.json` có `chainId: 11155111`.

## 7. Mục riêng trong báo cáo
Output deploy, seed, verify (che URL RPC có khóa); link Etherscan; ảnh dấu ✅; bảng kiểm tra bước 4 (4 dòng); `cat address.json`; `git log -1 --stat`; xác nhận đã nhắn H6 và đã gắn tag `v1-sepolia`; số dư Admin sau deploy.

## 8. Gửi mình kiểm
Báo cáo (không bao giờ gửi khóa riêng hoặc URL RPC đầy đủ).

**Mình sẽ soi:** `chainId` 11155111; commit chỉ có hai file; verify ✅; pool 0.1; không tạo gói ở seed; đã báo H6; tag.

## 9. Prompt dán cho AI (chế độ chỉ-hướng-dẫn)
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A13_deploy_sepolia_chinh_thuc.md.
Chỉ làm ĐÚNG chặng A13 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A13.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
Thêm câu này vào cuối prompt: **"Chặng này bạn KHÔNG chạy lệnh nào cần khóa (deploy, seed, verify). Bạn chỉ hướng dẫn, đọc output tôi dán, chẩn đoán lỗi và soạn báo cáo."**
