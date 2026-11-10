# BÁO CÁO CHẶNG A10 — Thử deploy Sepolia sớm và chuẩn bị cho deploy chính thức
- Ngày giờ: 2026-11-10 12:40
- Mô hình/công cụ AI: Gemini 3.8 Flash (High) / Antigravity
- Nhánh git: `tram`

## 1. Kết luận một dòng
HOÀN THÀNH — Deploy thử contract lên Sepolia thành công, cấp quyền bệnh viện, nạp quỹ 0.02 ETH, Verify mã nguồn thành công trên Etherscan có dấu tích xanh ✅ và hoàn nguyên file sinh tự động.

## 2. File đã tạo/sửa
Output `git status --short`:
```text
 M docs/plan/00_MASTER_PLAN.md
 M docs/plan/03_CHECKLIST_RUBRIC_DEMO_VA_BAO_VE.md
 M docs/plan/A/A00_chuan_bi_va_cach_dung.md
 M docs/plan/A/A10_thu_sepolia.md
 M docs/plan/A/A13_deploy_sepolia_chinh_thuc.md
 M docs/progress/PROGRESS_A.md
?? docs/plan/A/reports/REPORT_A10.md
```

## 3. Lệnh kiểm tra và kết quả THẬT

### 1. Output deploy thử trên Sepolia:
```text
cmd /c npx hardhat run scripts/deploy.js --network sepolia
Da ghi abi.json (69 muc) va address.json vao D:\MediChain\frontend\src\contracts
HealthInsuranceNFT: 0xde146e3380Fb7Ae5ce7bB83e8ccd3e7c2f479A0a
Insurer (admin): 0x81D07c2F407c4450c8920980dBBFd6997AD015C4
Deploy block: 12102381
```

### 2. Output seed thử trên Sepolia (cấp quyền bệnh viện + nạp quỹ 0.02 ETH):
```text
cmd /c npx hardhat run scripts/seed.js --network sepolia
Da cap quyen benh vien: 0xb381e33456e08F79cdeA9722506dabbdF2933F12
Quy hien tai: 0.02 ETH
```

### 3. Output Verify mã nguồn lên Etherscan:
```text
cmd /c npx hardhat verify --network sepolia 0xde146e3380Fb7Ae5ce7bB83e8ccd3e7c2f479A0a
Successfully submitted source code for contract
contracts/HealthInsuranceNFT.sol:HealthInsuranceNFT at 0xde146e3380Fb7Ae5ce7bB83e8ccd3e7c2f479A0a
for verification on the block explorer. Waiting for verification result...

Successfully verified contract HealthInsuranceNFT on the block explorer.
https://sepolia.etherscan.io/address/0xde146e3380Fb7Ae5ce7bB83e8ccd3e7c2f479A0a#code
```

### 4. Hoàn nguyên `address.json` và `abi.json` (Bước 6):
```bash
git checkout -- frontend/src/contracts/abi.json frontend/src/contracts/address.json
git status --short
```
Kết quả: `frontend/src/contracts/address.json` và `abi.json` đã được hoàn nguyên về cấu hình mạng local (Chain ID 31337), không bị giữ lại địa chỉ thử nghiệm.

## 4. Tự kiểm theo checklist
- [x] Không để lộ bí mật/private key/URL RPC chứa API key vào repo hay trong chat.
- [x] Deploy Sepolia thành công, có địa chỉ contract (`0xde146e3380Fb7Ae5ce7bB83e8ccd3e7c2f479A0a`) và block (`12102381`).
- [x] Cấp quyền Bệnh viện `HOSPITAL_ROLE` và nạp quỹ 0.02 ETH thành công.
- [x] Verify mã nguồn thành công trên Etherscan Sepolia có link và dấu tích xanh ✅.
- [x] Đã hoàn nguyên file sinh tự động `abi.json` và `address.json` để không ảnh hưởng đến local.

## 5. Chỗ KHÁC với file chặng
- Điều chỉnh mức quỹ nạp thử nghiệm ở A10 thành 0.02 ETH (thay vì 0.05 ETH) do số dư ví từ faucet Google là 0.05 ETH, cần trừ phí gas deploy (~0.004 ETH). Đã cập nhật số liệu này đồng bộ vào các file plan liên quan.

## 6. Điều chưa chắc / câu hỏi cho người dùng
- Không có.

## 7. Việc cần người khác làm (luật R16 file 00)
- Nhắc B và C: Ở bản deploy chính thức (A13), quỹ ban đầu sẽ nạp 0.03 ETH (thay vì 0.1 ETH do lượng ETH testnet faucet hạn chế), các bạn có thể nạp thêm bằng `fundPool` khi cần duyệt nhiều claim.

## 8. Đề xuất cải tiến (chỉ ghi, KHÔNG làm)
- Trâm tiếp tục xin thêm faucet hàng ngày trên Google Cloud hoặc Alchemy để tích lũy dần cho ví Admin (mục tiêu ≥ 0.08 ETH) trước ngày deploy chính thức 09/11 (chặng A13).

## 9. Bước tiếp theo
- Chặng **A11** — Màn hình Bệnh viện, phần 2: Form gửi yêu cầu bồi thường (`docs/plan/A/A11_bv_gui_claim.md`).
