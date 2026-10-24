# PROGRESS — Thành viên A (Trâm)
Cập nhật lần cuối: 24/10/2026

## Đã xong
- [x] M0 — Khởi tạo repo MediChain, cây thư mục, luật chung (do A (Trâm) làm). Nhánh làm việc của mình: `tram`
- [x] A01 — Khởi tạo Hardhat v2, OpenZeppelin v5, biên dịch thành công evm cancun. Báo cáo: docs/plan/A/reports/REPORT_A01.md
- [x] A02 — Viết bản khung Smart Contract HealthInsuranceNFT.sol (10 event, 17 hàm, struct, khớp dấu vân tay d453413b0dc38f64). Báo cáo: docs/plan/A/reports/REPORT_A02.md
- [x] A03 — Script xuất ABI và deploy (exportAbi.js, deploy.js, sinh abi.json và address.json, mốc H2). Báo cáo: docs/plan/A/reports/REPORT_A03.md
- [x] A04 — Nghiệp vụ 1: Thiết lập hệ thống (createPlan, setPlanActive, authorizeHospital, fundPool, registerEncryptionKey + 9 test passing). Báo cáo: docs/plan/A/reports/REPORT_A04.md
- [x] A05 — Nghiệp vụ 2: Mua bảo hiểm, thẻ NFT, xác minh thẻ (purchasePolicy, verifyInsurance, tokenURI, soulbound + 18 test passing). Báo cáo: docs/plan/A/reports/REPORT_A05.md
- [x] A06 — Nghiệp vụ 3: Yêu cầu bồi thường (submitClaim, confirmClaim RBAC HOSPITAL_ROLE + 26 test passing). Báo cáo: docs/plan/A/reports/REPORT_A06.md
- [x] A07 — Nghiệp vụ 4: Duyệt và chi trả tự động (approveClaim, rejectClaim, ràng buộc logic số 2, chống reentrancy + 34 test passing). Báo cáo: docs/plan/A/reports/REPORT_A07.md

## Bước tiếp theo
- Chặng A08: Script nạp dữ liệu mẫu seed.js và xuất ABI cuối (mốc H3) (`docs/plan/A/A08_seed_va_ban_giao_H3.md`).

## Đang làm / dừng ở đâu
- Task hiện tại: A07 đã hoàn thành (toàn bộ 4 nghiệp vụ contract hoàn chỉnh)
- Bước tiếp theo (làm ngay): Chặng A08

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `contracts-hardhat/contracts/HealthInsuranceNFT.sol` — sửa (hoàn thiện toàn bộ contract)
- `contracts-hardhat/contracts/mocks/ReentrancyAttacker.sol` — tạo mới (phục vụ test T31)
- `contracts-hardhat/test/HealthInsuranceNFT.test.js` — sửa (34 test case)
- `docs/plan/A/reports/REPORT_A07.md` — tạo mới
- `docs/progress/PROGRESS_A.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Ràng buộc logic số 2: approveClaim tuân thủ nghiêm ngặt Checks -> Effects -> Interactions, chống reentrancy qua nonReentrant; chi trả tự động đúng số confirmedAmount về ví bệnh nhân.

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- Không có.

## Cách chạy / kiểm tra phần đã làm
- Lệnh: `cd contracts-hardhat && npx hardhat test`  Kết quả: 34 passing (1s).
