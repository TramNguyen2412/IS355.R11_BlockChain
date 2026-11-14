# PROGRESS — Thành viên A (Trâm)
Cập nhật lần cuối: 14/11/2026

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
- [x] Soạn thảo toàn bộ các chương báo cáo đồ án Word và Dàn ý Slide thuyết trình cho Thành viên A theo Master Plan và Rubric chấm điểm:
  - Chương 2: `docs/report/Muc_2_A.md` (Mục 2.1, 2.2, 2.3, 2.4)
  - Chương 3: `docs/report/Muc_3_6_A.md` (Mục 3.6 Thiết kế Smart Contract)
  - Chương 4: `docs/report/Muc_4_2_A.md` (Mục 4.2 Hiện thực Smart Contract & Kỹ thuật ràng buộc logic & Soulbound NFT)
  - Chương 4: `docs/report/Muc_4_5_A.md` (Mục 4.5 Hiện thực giao diện DApp - Phân hệ Bệnh viện)
  - Chương 4: `docs/report/Muc_4_6_A.md` (Mục 4.6 Triển khai thực tế trên Ethereum Sepolia Testnet)
  - Chương 5: `docs/report/Muc_5_1_A.md` (Mục 5.1 Kịch bản và kết quả Unit Test)
  - Chương 5: `docs/report/Muc_5_3_A.md` (Mục 5.3 Đánh giá an toàn và bảo mật Smart Contract)
  - Chương 5: `docs/report/Muc_5_4_A.md` (Mục 5.4 Phân tích chi phí Gas)
  - Slide thuyết trình: `docs/slides/slides_A.md` (Dàn ý 6 slide súc tích cho phần của A)

## Bước tiếp theo
- Hỗ trợ Lan Anh (C) ghép các file markdown của A vào file mẫu Word chính thức `docs/report/Mau_BaoCao_IS355.docx`.
- Hỗ trợ nhóm tập dượt thuyết trình dựa trên dàn ý `docs/slides/slides_A.md`.

## Đang làm / dừng ở đâu
- Toàn bộ nội dung báo cáo văn bản Word và dàn ý Slide cho phân hệ của A đã được biên soạn hoàn chỉnh 100%, sẵn sàng để copy-paste trực tiếp.

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `docs/report/Muc_2_A.md` — tạo mới (Chương 2)
- `docs/report/Muc_3_6_A.md` — tạo mới (Chương 3)
- `docs/report/Muc_4_2_A.md` — tạo mới (Chương 4)
- `docs/report/Muc_4_5_A.md` — tạo mới (Chương 4)
- `docs/report/Muc_4_6_A.md` — tạo mới (Chương 4)
- `docs/report/Muc_5_1_A.md` — tạo mới (Chương 5)
- `docs/report/Muc_5_3_A.md` — tạo mới (Chương 5)
- `docs/report/Muc_5_4_A.md` — tạo mới (Chương 5)
- `docs/slides/slides_A.md` — tạo mới (Slide thuyết trình)
- `docs/report/images/A/hospital_ui.jpg` — tạo mới
- `docs/report/images/A/etherscan_overview.jpg` — tạo mới
- `docs/progress/PROGRESS_A.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Định dạng nội dung báo cáo chuẩn văn phong học thuật, sử dụng đại từ khách quan ("Hệ thống...", "Hợp đồng..."), không nhắc đến AI, số liệu bám sát thực nghiệm.
- Cấu trúc các file khớp hoàn toàn với quy ước đặt tên của nhóm (tương tự `Muc_2_7_C.md`, `Muc_3_3_C.md`, `Muc_4_1_C.md` của Lan Anh).

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- C (Lan Anh): Khi ghép file Word tổng `Mau_BaoCao_IS355.docx`, lấy trực tiếp nội dung các mục tương ứng từ các file `Muc_*_A.md` trong thư mục `docs/report/`.
- C (Lan Anh): Lấy dàn ý từ `docs/slides/slides_A.md` để đưa vào slide tổng của nhóm.

## Cách chạy / kiểm tra phần đã làm
- Xem và đọc trực tiếp các file báo cáo trong thư mục `docs/report/` và `docs/slides/`.
- Kiểm tra các liên kết hình ảnh minh chứng trong `docs/report/images/A/`.
