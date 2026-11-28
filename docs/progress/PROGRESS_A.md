# PROGRESS — Thành viên A (Trâm)
Cập nhật lần cuối: 26/11/2026

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
- [x] Hỗ trợ kiểm thử liên vai trò trên Sepolia: Dùng ví Admin gọi `createPlan()` tạo thành công 2 gói bảo hiểm mẫu chuẩn (Plan #1: Gói Cơ bản 0.002 ETH; Plan #2: Gói Nâng cao 0.005 ETH) trên Sepolia tại contract `0x9B5868254c31818320d2DDCBb5B28f15af265b62`. Cấp quyền DEFAULT_ADMIN_ROLE cho ví Phương Anh `0x3FBBa628dC4C30DCE74Eb38d015D409125750639`.
- [x] Hỗ trợ Bệnh viện xác nhận claim (`confirmClaim(1, 0.012 ETH)`) trên Sepolia theo yêu cầu của Lan Anh (C), giúp hoàn tất chu trình bồi thường E2E thực tế trên Sepolia.
- [x] Đồng bộ code mới nhất từ `origin/main` (bao gồm PR #22 của Phương Anh `feat(insurer): đồng bộ giao diện`), kiểm tra toàn diện chất lượng đồ án:
  - Smart Contract: 34/34 tests pass 100%.
  - Frontend: `npm run build` thành công không lỗi (230 modules transformed), đầy đủ 3 phân hệ `/patient`, `/hospital`, `/insurer`.

## Bước tiếp theo
- Cùng Lan Anh (C) và Phương Anh (B) rà soát kịch bản quay video demo và slide báo cáo tổng thể.

## Đang làm / dừng ở đâu
- Toàn bộ công việc kỹ thuật, tài liệu báo cáo và slide thuyết trình của Thành viên A đã hoàn thành 100%. Toàn bộ dự án cả 3 vai trò đã tích hợp hoàn chỉnh và sẵn sàng demo bảo vệ đồ án.

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `README.md` — sửa (bổ sung đầy đủ phần tổng quan tiến độ của Thành viên C và cập nhật kết quả E2E Sepolia của nhóm)
- `docs/progress/PROGRESS_A.md` — sửa (cập nhật trạng thái sau khi tích hợp PR #22 và hoàn thiện kịch bản thuyết trình)
- `docs/slides/KICH_BAN_THUYET_TRINH_TRAM.md` — tạo/cập nhật nội dung slide gọn rõ và lời thoại thuyết trình cho Thành viên A (local, không push)
- `docs/report/Muc_*_A.md` — xóa toàn bộ đường kẻ ngang (`---`) và khoảng trắng thừa để copy sang Word không bị vạch xám
- `docs/report/TaiLieuThamKhao_A.md` — tạo bảng danh mục Tài liệu tham khảo chuẩn IEEE và hướng dẫn gắn trích dẫn `[1]..[9]` vào báo cáo Word
- `docs/report/LoiCamOn_Va_TomTatDeTai_A.md` — soạn lại Lời cảm ơn (ThS. Hà Lê Hoài Trung, môn Blockchain) và Tóm tắt báo cáo tiếng Việt tự nhiên, súc tích chuẩn 1 trang A4
- `docs/report/images/A/fig_2_4_dual_trigger.png`, `fig_3_6_claim_state_machine.png`, `fig_4_5_hospital_ui_arch.png` — render 3 ảnh PNG chất lượng cao từ các sơ đồ trong báo cáo để dán trực tiếp vào Word
- `docs/report/Muc_4_2_A.md`, `docs/report/Muc4_2_RangBuoc_A.md` — xóa bỏ 100% số thứ tự dòng code (201:, 202:...) trong tất cả các đoạn mã Solidity trích dẫn, giúp Trâm copy code vào Word gọn gàng, sạch đẹp và đúng chuẩn code snippet

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Đồng bộ nhánh `tram` bắt kịp `main` mới nhất (commit `5fe4baf` merge PR #22 của Phương Anh).
- Ghi nhận cả 3 phân hệ frontend (`/patient`, `/hospital`, `/insurer`) đã được tích hợp đầy đủ và build thành công không lỗi.
- Toàn bộ đồ án sẵn sàng cho việc ghi hình video demo và chuẩn bị slide báo cáo.

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- Không có. Nhóm đã hoàn tất 100% việc ghép mã nguồn trên nhánh main.
