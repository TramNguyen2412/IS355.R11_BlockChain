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

## Bước tiếp theo
- Chặng A13: Deploy Sepolia CHÍNH THỨC (mốc H6) (`docs/plan/A/A13_deploy_sepolia_chinh_thuc.md`) hoặc Chặng A14: Bảng test case, bảng gas và minh chứng (`docs/plan/A/A14_minh_chung_va_bao_cao.md`).

## Đang làm / dừng ở đâu
- Task hiện tại: A12 đã hoàn thành (Màn hình Bệnh viện hoàn chỉnh 4/4 khối, sẵn sàng mốc H5).
- Bước tiếp theo: Chặng A13 hoặc A14.

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `frontend/src/pages/hospital/PendingConfirmList.jsx` — tạo mới
- `frontend/src/pages/hospital/HospitalPage.jsx` — sửa
- `frontend/src/pages/hospital/hospital.css` — sửa
- `docs/plan/A/reports/REPORT_A12.md` — tạo mới
- `docs/progress/PROGRESS_A.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Màn hình Bệnh viện hoàn thành toàn bộ 4 khối nghiệp vụ: Khóa RSA, Kiểm tra thẻ NFT, Form gửi bồi thường, Xác nhận chi phí.
- Lọc đúng claim PENDING và chưa xác nhận bởi bệnh viện, kiểm tra số tiền xác nhận không vượt số tiền yêu cầu.

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- Không có.

## Cách chạy / kiểm tra phần đã làm
- Lệnh: `cd frontend && npm run build`  Kết quả: Vite build thành công trong ~3.5s, bundle HospitalPage gồm đủ 4 khối không lỗi.
