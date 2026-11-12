# PROGRESS — Thành viên C (Lan Anh)
Cập nhật lần cuối: 12/11/2026

## Đã xong
- [x] M0 — Khởi tạo repo và quy tắc chung (A thực hiện); nhánh cố định của C: lan-anh.
- [x] C-02 đến C-05 — Khởi tạo frontend React/Vite, ví và điều hướng theo vai trò, Mock service, tiện ích và tích hợp contract service với ethers v6; kiểm thử Hardhat Local. Chi tiết lịch sử được lưu trong các commit trước.
- [ ] C-06 — Màn hình Bệnh nhân ở chế độ Mock: đã triển khai các phần chính và kiểm tra phần lớn luồng; còn chờ kiểm thử APPROVED/REJECTED qua giao diện Insurer và xác minh nội dung PDF/gateway. Không sửa phần Insurer thuộc B.
- [x] C-07 — Hoàn thiện README; tạo bản nháp báo cáo 2.7, 3.3 (kèm sơ đồ kiến trúc Mermaid), 4.1; tạo mẫu Word 15pt có trường mục lục tự động và caption đánh số. File: README.md; docs/report/Muc_2_7_C.md; docs/report/Muc_3_3_C.md; docs/report/Muc_4_1_C.md; docs/report/Mau_BaoCao_IS355.docx.

## Đang làm / dừng ở đâu
`Task hiện tại`: C-07 đã hoàn thành bản nháp và mẫu định dạng.
- `Việc tiếp theo`: của C theo dõi C-06: phối hợp B kiểm tra các trạng thái claim qua Insurer và xác minh PDF/gateway; không sửa file thuộc B.
- Chưa có xác nhận C về kiểm thử toàn hệ thống trên Sepolia.

## File đã tạo / sửa (liệt kê theo đường dẫn)
`C-02 — Khởi tạo frontend`
- frontend/package.json
- frontend/package-lock.json
- frontend/vite.config.js
- frontend/index.html
- frontend/src/main.jsx
- frontend/src/app/App.jsx
- frontend/src/components/shared/Layout.jsx
- frontend/src/components/shared/Loading.jsx
- frontend/src/components/shared/Address.jsx
- frontend/src/components/shared/ErrorBox.jsx
- frontend/src/components/shared/TxToast.jsx
- frontend/src/styles/global.css
- frontend/src/pages/patient/PatientPage.jsx
- frontend/src/pages/insurer/InsurerPage.jsx — stub tạm phục vụ kiểm thử router.

`C-03 — Ví và tiện ích frontend`
- frontend/src/app/errors.js
- frontend/src/app/format.js
- frontend/src/app/WalletProvider.jsx
- frontend/src/app/App.jsx

`C-04 — Mock service và điều hướng`
- frontend/src/app/contractService.mock.js
- frontend/src/app/contractService.js
- frontend/src/app/roleDetection.js
- frontend/src/app/App.jsx
- README.md

`C-05 — Tích hợp smart contract thật`
- frontend/src/app/contractService.js — triển khai ethers v6, các hàm đọc/ghi contract, dryRun, xử lý lỗi, truy vấn event và thống kê.

`C-06 — Màn hình Bệnh nhân`
- frontend/src/pages/patient/ — các component thuộc luồng Patient, gồm KeySetup, PlanList, PurchaseForm, PolicyCard, ClaimForm, ClaimList và RecordViewer.
- frontend/src/app/contractService.js — bổ sung hỗ trợ chuyển đổi giữa Mock và service thật.

`C-07 — Hoàn thiện Readme, mẫu báo cáo`
- README.md — viết lại hướng dẫn dự án, cấu hình Mock/Local/Sepolia, quy trình sử dụng và lưu ý an toàn dữ liệu.
- docs/report/Muc_2_7_C.md 
- docs/report/Muc_3_3_C.md 
- docs/report/Muc_4_1_C.md
- docs/report/Mau_BaoCao_IS355.docx

`Theo dõi tiến độ`
- docs/progress/PROGRESS_C.md

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Giữ React JavaScript + Vite, ba route /patient, /hospital, /insurer.
- VITE_USE_MOCK=true chỉ dùng để phát triển/kiểm thử; không xem là giao dịch blockchain thật.
- Tên contract HealthInsuranceNFT và các chữ ký giao tiếp giữ nguyên.
- Không commit .env.local, JWT Pinata, private key hoặc khóa riêng RSA.
- Không sửa file thuộc A/B.

## Vấn đề đang kẹt / cần người khác
- B (Phương Anh): thông báo khi Insurer hỗ trợ duyệt/từ chối claim để C kiểm thử vòng đời claim.
- B (Phương Anh): xác nhận CID PDF và khả năng truy xuất từ gateway.

## Yêu cầu gửi người khác
- [ ] B: phối hợp kiểm tra APPROVED/REJECTED qua giao diện Insurer.
- [ ] B: xác nhận PDF/gateway.

## Cách chạy / kiểm tra phần đã làm
- Tại frontend: npm.cmd install; npm.cmd run dev; npm.cmd run build.
- Mock: VITE_USE_MOCK=true, VITE_CHAIN_ID=31337.
- Local thật: VITE_USE_MOCK=false, VITE_CHAIN_ID=31337; cần Hardhat node và ABI/địa chỉ đã xuất.
- Sepolia: VITE_USE_MOCK=false, VITE_CHAIN_ID=11155111; chỉ kiểm thử khi có địa chỉ contract và cấu hình hợp lệ.
- Kết quả build gần nhất được ghi nhận trước đó: Vite build thành công; không chạy lại build trong task tài liệu C-07.
