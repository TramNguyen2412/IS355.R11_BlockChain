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
- [x] A14 — Minh chứng, bảng gas, bảng test case và báo cáo kỹ thuật hoàn thiện: xuất bảng đo gas thực nghiệm (hardhat-gas-reporter), bảng 34 ca kiểm thử chi tiết (100% passing), thuyết minh 2 ràng buộc logic, danh sách minh chứng và báo cáo kỹ thuật hoàn chỉnh tại docs/report/TongHopTrienKhai_A.md. Báo cáo tổng hợp: docs/report/TongHopTrienKhai_A.md

## Bước tiếp theo
- A hoàn tất toàn bộ nhiệm vụ lập trình và báo cáo chuyên trách; sẵn sàng hỗ trợ nhóm ghép slide, báo cáo tổng và quay video demo liên luồng (SUB-1 04/12, SUB-2 08/12).

## Đang làm / dừng ở đâu
- Task hiện tại: A14 đã hoàn thành. Toàn bộ phần việc của Thành viên A (Trâm) đã hoàn tất trọn vẹn.
- Trạng thái: Sẵn sàng demo và nghiệm thu.

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `docs/report/BangGas_A.md` — tạo mới
- `docs/report/BangTestCase_A.md` — tạo mới
- `docs/report/Muc4_2_RangBuoc_A.md` — tạo mới
- `docs/report/DanhSachMinhChung_A.md` — tạo mới
- `docs/report/TongHopTrienKhai_A.md` — tạo mới
- `docs/progress/PROGRESS_A.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Hoàn thành đầy đủ bộ tài liệu kỹ thuật minh chứng phục vụ chấm điểm đồ án IS355 trong thư mục `docs/report/`.
- Hợp đồng `HealthInsuranceNFT` đóng băng vĩnh viễn trên Sepolia tại `0x9B5868254c31818320d2DDCBb5B28f15af265b62`.
- Giao diện Bệnh viện (`/hospital`) hoàn chỉnh 4/4 khối chức năng, build Vite sạch lỗi.

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- B và C tiếp tục hoàn thiện giao diện Quản trị viên và Bệnh nhân theo tiến độ để chuẩn bị ghép luồng demo chung.

## Cách chạy / kiểm tra phần đã làm
- Chạy kiểm thử: `cmd /c "cd contracts-hardhat && npx hardhat test"` (34 passing).
- Kiểm tra hợp đồng on-chain: Etherscan https://sepolia.etherscan.io/address/0x9B5868254c31818320d2DDCBb5B28f15af265b62#code.
- Đọc tài liệu báo cáo: `docs/report/TongHopTrienKhai_A.md`.
