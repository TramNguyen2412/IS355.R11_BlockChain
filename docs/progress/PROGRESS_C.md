# PROGRESS — Thành viên C (Lan Anh)
Cập nhật lần cuối: 27/10/2026

## Đã xong
- [x] M0 — Khởi tạo repo MediChain, cây thư mục, luật chung (do A (Trâm) làm). Nhánh làm việc của mình: `lan-anh`
- [x] C-02 — Khởi tạo frontend bằng Vite + React (JavaScript). Cấu hình package.json, vite.config.js, index.html. Tạo src/main.jsx và src/app/App.jsx với các route /patient, /hospital, /insurer. Tạo các component dùng chung: Layout.jsx, Loading.jsx, Address.jsx, ErrorBox.jsx, TxToast.jsx. Tạo src/styles/global.css với nền sáng, chữ tối và cỡ chữ cơ bản 16px. Tạo giao diện khung PatientPage.jsx. Tạo InsurerPage.jsx dạng stub tạm để kiểm tra router; chưa triển khai nghiệp vụ Insurer. Cài dependencies bằng npm.cmd install. Kiểm tra điều hướng ba trang trên trình duyệt. Chạy npm.cmd run build thành công.
- [x] C-03 — Tạo `src/app/errors.js` để chuyển các lỗi nghiệp vụ và lỗi MetaMask sang thông báo tiếng Việt; tạo `src/app/format.js` với `formatEth`, `formatDate`, `shortAddress`; tạo `src/app/WalletProvider.jsx` quản lý context ví, kết nối MetaMask, kiểm tra chain ID và lắng nghe `accountsChanged`/`chainChanged`. Tích hợp `WalletProvider` vào `App.jsx`. Kiểm tra `npm.cmd run build` thành công; chạy frontend với `VITE_USE_MOCK=true`, xác nhận danh sách bốn ví mẫu xuất hiện và địa chỉ thay đổi theo vai trò đã chọn.

## Đang làm / dừng ở đâu
- Task hiện tại: rà soát diff, kiểm tra các file mới và chuẩn bị commit riêng cho C-03.
- Chế độ mock đã được kiểm tra thủ công; chưa xác nhận kiểm thử MetaMask thật trên mạng blockchain.

- Bước tiếp theo (làm ngay): Kiểm tra phạm vi thay đổi, cập nhật trạng thái Git và xác nhận không sửa nhầm file thuộc thành viên A/B.

## File đã tạo / sửa (liệt kê theo đường dẫn)
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

- frontend/src/app/errors.js
- frontend/src/app/format.js
- frontend/src/app/WalletProvider.jsx
- frontend/src/app/App.jsx

- docs/progress/PROGRESS_C.md

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Sử dụng React JavaScript với Vite và React Router.
- Giữ ba route /patient, /hospital, /insurer.
- InsurerPage.jsx hiện là stub tạm; cần phối hợp với thành viên B khi tích hợp trang nghiệp vụ chính thức.
- Không tự ý sửa các file nghiệp vụ thuộc thành viên A/B.

## Vấn đề đang kẹt / cần người khác
- Thành viên B cần được thông báo rằng frontend/src/pages/insurer/InsurerPage.jsx hiện là stub tạm do C tạo để kiểm tra router.
- Chưa xác nhận tích hợp nghiệp vụ thực tế của Patient, Hospital và Insurer.

## Yêu cầu gửi người khác
- Báo thành viên B phối hợp thay thế hoặc hợp nhất stub Insurer với trang nghiệp vụ chính thức, tránh ghi đè công việc của nhau.

## Cách chạy / kiểm tra phần đã làm
Tại thư mục frontend:
- Cài dependencies: npm.cmd install
- Chạy phát triển: npm.cmd run dev
- Build production: npm.cmd run build

Kết quả build gần nhất: thành công; Vite 7.3.7, 48 modules transformed.
