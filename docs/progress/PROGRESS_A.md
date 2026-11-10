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

## Bước tiếp theo
- Chặng A12: Màn hình Bệnh viện, phần 3: Xác nhận chi phí, ghép trang, chuyển sang contract thật (`docs/plan/A/A12_bv_xac_nhan_va_ghep.md`).

## Đang làm / dừng ở đâu
- Task hiện tại: A11 đã hoàn thành (form gửi claim tích hợp IPFS và mã hóa 3 bên hoàn chỉnh).
- Bước tiếp theo: Chặng A12.

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `frontend/src/pages/hospital/SubmitClaimForm.jsx` — tạo mới
- `frontend/src/pages/hospital/HospitalPage.jsx` — sửa
- `docs/plan/A/reports/REPORT_A11.md` — tạo mới
- `docs/progress/PROGRESS_A.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Quy trình gửi claim luôn chạy `dryRun: true` trước khi tải hóa đơn lên IPFS và mã hóa hồ sơ bệnh án.
- Hồ sơ bệnh án mã hóa tuân thủ cấu trúc phong bì lai với 3 người nhận (Bệnh nhân, Bệnh viện, Bảo hiểm) với địa chỉ chữ thường.

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- Không có.

## Cách chạy / kiểm tra phần đã làm
- Lệnh: `cd frontend && npm run build`  Kết quả: Vite build thành công trong ~3.3s, bundle SubmitClaimForm tích hợp mượt mà không lỗi.
