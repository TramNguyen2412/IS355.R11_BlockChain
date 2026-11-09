# PROGRESS — Thành viên A (Trâm)
Cập nhật lần cuối: 09/11/2026

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

## Bước tiếp theo
- Chặng A10: Thử deploy Sepolia sớm (`docs/plan/A/A10_thu_sepolia.md`) hoặc Chặng A11: Form gửi yêu cầu bồi thường (`docs/plan/A/A11_bv_gui_claim.md`).

## Đang làm / dừng ở đâu
- Task hiện tại: A09 đã hoàn thành (màn hình Bệnh viện khối 1 và 2 sẵn sàng).
- Bước tiếp theo: Chặng A10 hoặc A11.

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `frontend/src/pages/hospital/hospital.css` — tạo mới
- `frontend/src/pages/hospital/KeySetup.jsx` — tạo mới
- `frontend/src/pages/hospital/VerifyCard.jsx` — tạo mới
- `frontend/src/pages/hospital/HospitalPage.jsx` — sửa
- `docs/plan/A/reports/REPORT_A09.md` — tạo mới
- `docs/progress/PROGRESS_A.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Component `KeySetup.jsx` và `VerifyCard.jsx` dùng CSS riêng biệt trong `hospital.css`, không sửa `global.css`.
- Đảm bảo kiểm tra phân quyền `isHospital` và `dryRun` trước mọi thao tác on-chain.

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- [ ] Gửi Lan Anh (C): Bổ sung lại switch `useMock` trong `frontend/src/app/contractService.js` để khi `VITE_USE_MOCK=true` ứng dụng chuyển tiếp sang `contractService.mock.js` mà không đòi hỏi kết nối MetaMask.

## Cách chạy / kiểm tra phần đã làm
- Lệnh: `cd frontend && npm run build`  Kết quả: Vite build thành công trong ~2.3s, không có lỗi module.
