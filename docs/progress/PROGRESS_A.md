# PROGRESS — Thành viên A (Trâm)
Cập nhật lần cuối: 10/11/2026

## Đã xong
- [x] M0 — Khởi tạo repo MediChain, cây thư mục, luật chung (do A (Trâm) làm). Nhánh làm việc của mình: `tram`
- [x] A01 — Khởi tạo Hardhat v2, OpenZeppelin v5, biên dịch thành công evm cancun. Báo cáo: docs/plan/A/reports/REPORT_A01.md
- [x] A02 — Viết bản khung Smart Contract HealthInsuranceNFT.sol (10 event, 17 hàm, struct, khớp dấu vân tay d453413b0dc38f64). Báo cáo: docs/plan/A/reports/REPORT_A02.md
- [x] A03 — Script xuất ABI và deploy (exportAbi.js, deploy.js, sinh abi.json và address.json, mốc H2). Báo cáo: docs/plan/A/reports/REPORT_A03.md
- [x] A04 — Nghiệp vụ 1: Thiết lập hệ thống (createPlan, setPlanActive, authorizeHospital, fundPool, registerEncryptionKey + 9 test passing). Báo cáo: docs/plan/A/reports/REPORT_A04.md
- [x] A05 — Nghiệp vụ 2: Mua bảo hiểm, thẻ NFT, xác minh thẻ (purchasePolicy, verifyInsurance, tokenURI, soulbound + 18 test passing). Báo cáo: docs/plan/A/reports/REPORT_A05.md
- [x] A06 — Nghiệp vụ 3: Yêu cầu bồi thường (submitClaim, confirmClaim RBAC HOSPITAL_ROLE + 26 test passing). Báo cáo: docs/plan/A/reports/REPORT_A06.md
- [x] A07 — Nghiệp vụ 4: Duyệt và chi trả tự động (approveClaim, rejectClaim, ràng buộc logic số 2, chống reentrancy + 34 test passing). Báo cáo: docs/plan/A/reports/REPORT_A07.md
- [x] A08 — Script nạp dữ liệu mẫu seed.js, bảng gas và bàn giao H3. Báo cáo: docs/plan/A/reports/REPORT_A08.md
- [x] A09 — Màn hình Bệnh viện phần 1: Thiết lập khóa RSA và kiểm tra thẻ NFT (KeySetup.jsx, VerifyCard.jsx, hospital.css, HospitalPage.jsx; build Vite pass). Báo cáo: docs/plan/A/reports/REPORT_A09.md
- [x] A10 — Thử deploy Sepolia sớm: deploy thành công, cấp quyền bệnh viện, nạp quỹ 0.02 ETH, verify mã nguồn Etherscan có tích xanh, hoàn nguyên address.json local. Báo cáo: docs/plan/A/reports/REPORT_A10.md
- [x] A11 — Màn hình Bệnh viện phần 2: Form gửi yêu cầu bồi thường (SubmitClaimForm.jsx, HospitalPage.jsx, mã hóa phong bì AES+RSA 3 bên, tải IPFS, submitClaim; build Vite pass). Báo cáo: docs/plan/A/reports/REPORT_A11.md
- [x] A12 — Màn hình Bệnh viện phần 3: Xác nhận chi phí, ghép trang, chuyển sang contract thật (PendingConfirmList.jsx, HospitalPage.jsx, hospital.css; build Vite pass, hoàn thiện trọn vẹn màn hình Bệnh viện). Báo cáo: docs/plan/A/reports/REPORT_A12.md
- [x] A13 — Deploy Sepolia CHÍNH THỨC (mốc H6): deploy contract 0x9B5868254c31818320d2DDCBb5B28f15af265b62 (block 12103715), cấp quyền bệnh viện, nạp quỹ 0.03 ETH, verify Etherscan có tích xanh, cập nhật address.json chainId 11155111. Báo cáo: docs/plan/A/reports/REPORT_A13.md

## Bước tiếp theo
- Chặng A14: Bảng test case, bảng gas và minh chứng hoàn thiện (`docs/plan/A/A14_minh_chung_va_bao_cao.md`).

## Đang làm / dừng ở đâu
- Task hiện tại: A13 đã hoàn thành (Deploy Sepolia chính thức, bàn giao mốc H6).
- Bước tiếp theo: Chặng A14.

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `frontend/src/contracts/address.json` — cập nhật địa chỉ Sepolia chính thức và chainId 11155111
- `docs/plan/A/reports/REPORT_A13.md` — tạo mới
- `docs/progress/PROGRESS_A.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Contract chính thức đã deploy tại `0x9B5868254c31818320d2DDCBb5B28f15af265b62`, deployBlock `12103715`.
- Đóng băng toàn bộ code Smart Contract (HealthInsuranceNFT.sol) từ hôm nay (10/11/2026), không sửa đổi hay deploy lại để đảm bảo tính ổn định cho cả nhóm.
- Quỹ ban đầu nạp 0.03 ETH, Bệnh viện `0xb381e33456e08F79cdeA9722506dabbdF2933F12` đã được cấp quyền.

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- Báo mốc H6 cho Phương Anh (B) và Lan Anh (C) chuyển sang mạng Sepolia và cấu hình `.env` (`VITE_USE_MOCK=false`, `VITE_CHAIN_ID=11155111`).
- Nhờ Phương Anh (B) hoặc Lan Anh (C) duyệt và merge PR nhánh `tram` vào `main`.

## Cách chạy / kiểm tra phần đã làm
- Kiểm tra trạng thái contract trên Sepolia: Etherscan https://sepolia.etherscan.io/address/0x9B5868254c31818320d2DDCBb5B28f15af265b62#code (tích xanh ✅, pool 0.03 ETH, bệnh viện đã cấp quyền).
