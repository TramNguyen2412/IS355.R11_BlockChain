# PROGRESS — Thành viên A (Trâm)
Cập nhật lần cuối: 24/10/2026

## Đã xong
- [x] M0 — Khởi tạo repo MediChain, cây thư mục, luật chung (do A (Trâm) làm). Nhánh làm việc của mình: `tram`
- [x] A01 — Khởi tạo Hardhat v2, OpenZeppelin v5, biên dịch thành công evm cancun. Báo cáo: docs/plan/A/reports/REPORT_A01.md
- [x] A02 — Viết bản khung Smart Contract HealthInsuranceNFT.sol (10 event, 17 hàm, struct, khớp dấu vân tay d453413b0dc38f64). Báo cáo: docs/plan/A/reports/REPORT_A02.md
- [x] A03 — Script xuất ABI và deploy (exportAbi.js, deploy.js, sinh abi.json và address.json, mốc H2). Báo cáo: docs/plan/A/reports/REPORT_A03.md
- [x] A04 — Nghiệp vụ 1: Thiết lập hệ thống (createPlan, setPlanActive, authorizeHospital, fundPool, registerEncryptionKey + 9 test passing). Báo cáo: docs/plan/A/reports/REPORT_A04.md
- [x] A05 — Nghiệp vụ 2: Mua bảo hiểm, thẻ NFT, xác minh thẻ (purchasePolicy, verifyInsurance, tokenURI, soulbound + 18 test passing). Báo cáo: docs/plan/A/reports/REPORT_A05.md

## Bước tiếp theo
- Chặng A06: Nghiệp vụ 3: Yêu cầu bồi thường (`docs/plan/A/A06_nghiep_vu3_claim.md`).

## Đang làm / dừng ở đâu
- Task hiện tại: A05 đã hoàn thành
- Bước tiếp theo (làm ngay): Chặng A06

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `contracts-hardhat/contracts/HealthInsuranceNFT.sol` — sửa (hoàn thiện nghiệp vụ 2, soulbound, verifyInsurance)
- `contracts-hardhat/test/HealthInsuranceNFT.test.js` — sửa (18 test case)
- `docs/plan/A/reports/REPORT_A05.md` — tạo mới
- `docs/progress/PROGRESS_A.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Thẻ NFT bảo hiểm là Soulbound (chặn transferFrom / safeTransferFrom qua _update); mỗi ví chỉ có tối đa 1 thẻ còn hạn; hết hạn được mua gói mới.

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- Không có.

## Cách chạy / kiểm tra phần đã làm
- Lệnh: `cd contracts-hardhat && npx hardhat test`  Kết quả: 18 passing (818ms).
