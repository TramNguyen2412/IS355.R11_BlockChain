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

## Bước tiếp theo
- Chặng A11: Màn hình Bệnh viện, phần 2: Form gửi yêu cầu bồi thường (`docs/plan/A/A11_bv_gui_claim.md`).

## Đang làm / dừng ở đâu
- Task hiện tại: A10 đã hoàn thành (Sepolia deploy thử nghiệm và verify thành công 100%).
- Bước tiếp theo: Chặng A11.

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `docs/plan/A/reports/REPORT_A10.md` — tạo mới
- `docs/progress/PROGRESS_A.md` — sửa
- `docs/plan/A/A10_thu_sepolia.md` — sửa
- `docs/plan/A/A13_deploy_sepolia_chinh_thuc.md` — sửa
- `docs/plan/00_MASTER_PLAN.md` — sửa
- `docs/plan/03_CHECKLIST_RUBRIC_DEMO_VA_BAO_VE.md` — sửa
- `docs/plan/A/A00_chuan_bi_va_cach_dung.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Địa chỉ thử Sepolia (A10): `0xde146e3380Fb7Ae5ce7bB83e8ccd3e7c2f479A0a` (block 12102381), quỹ thử 0.02 ETH.
- Thống nhất cập nhật quỹ Sepolia bản chính thức (A13) thành 0.03 ETH (ví Admin mục tiêu ≥ 0.08 ETH). Đã hoàn nguyên `address.json` về localhost.

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- Nhắn B và C: Khi deploy chính thức mốc H6 (A13), quỹ ban đầu sẽ nạp 0.03 ETH (thay vì 0.1 ETH do faucet hạn chế), các bạn có thể nạp thêm bằng `fundPool` khi cần duyệt nhiều claim.

## Cách chạy / kiểm tra phần đã làm
- Xem contract đã verify trên Etherscan Sepolia: `https://sepolia.etherscan.io/address/0xde146e3380Fb7Ae5ce7bB83e8ccd3e7c2f479A0a#code` (đã có dấu tích xanh Verified).
