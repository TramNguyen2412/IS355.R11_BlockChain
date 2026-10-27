# PROGRESS — Thành viên C (Lan Anh)
Cập nhật lần cuối: 27/10/2026

## Đã xong
- [x] M0 — Khởi tạo repo MediChain, cây thư mục, luật chung (do A (Trâm) làm). Nhánh làm việc của mình: `lan-anh`
- [x] C-02 — Khởi tạo frontend bằng Vite + React (JavaScript). Cấu hình package.json, vite.config.js, index.html. Tạo src/main.jsx và src/app/App.jsx với các route /patient, /hospital, /insurer. Tạo các component dùng chung: Layout.jsx, Loading.jsx, Address.jsx, ErrorBox.jsx, TxToast.jsx. Tạo src/styles/global.css với nền sáng, chữ tối và cỡ chữ cơ bản 16px. Tạo giao diện khung PatientPage.jsx. Tạo InsurerPage.jsx dạng stub tạm để kiểm tra router; chưa triển khai nghiệp vụ Insurer. Cài dependencies bằng npm.cmd install. Kiểm tra điều hướng ba trang trên trình duyệt. Chạy npm.cmd run build thành công.
- [x] C-03 — Tạo `frontend/src/app/errors.js` để chuyển các lỗi nghiệp vụ và lỗi MetaMask sang thông báo tiếng Việt; tạo `frontend/src/app/format.js` với `formatEth`, `formatDate`, `shortAddress`; tạo `frontend/src/app/WalletProvider.jsx` quản lý context ví, kết nối MetaMask, kiểm tra chain ID và lắng nghe `accountsChanged`/`chainChanged`. Tích hợp `WalletProvider` vào `App.jsx`. Kiểm tra `npm.cmd run build` thành công; chạy frontend với `VITE_USE_MOCK=true`, xác nhận danh sách bốn ví mẫu xuất hiện và địa chỉ thay đổi theo vai trò đã chọn.
- [x] C-04 — Mock service và điều hướng theo vai trò: Tạo `frontend/src/app/contractService.mock.js` với dữ liệu khởi tạo gồm 2 gói bảo hiểm, 1 policy, 3 claim, số dư pool 0.1 ETH và các địa chỉ mẫu ADMIN, HOSPITAL, PATIENT, OUTSIDER; Tạo `frontend/src/app/contractService.js` để chọn mock theo biến môi trường VITE_USE_MOCK; khi chưa sử dụng mock, các hàm tương ứng báo lỗi chưa cài đặt thay vì giả lập giao dịch hợp đồng thật; Tạo `frontend/src/app/roleDetection.js` để xác định vai trò thông qua getRoles; Tích hợp điều hướng theo vai trò trong `frontend/src/app/App.jsx`: insurer → /insurer, hospital → /hospital, patient/outsider → /patient; Cập nhật `README.md` hướng dẫn chạy frontend ở chế độ mock và lưu ý dữ liệu mock chỉ tồn tại trong bộ nhớ, không được lưu bền vững; Kiểm thử các hàm đọc, ghi, phân quyền và dryRun của mock service. Các kiểm tra đã chạy đều đạt: kiểm tra đọc đạt sau khi điều chỉnh cách so sánh chuỗi Unicode; 13 kiểm tra ghi đạt; 15/15 kiểm tra bổ sung về quyền và dryRun đạt; Chạy `npm.cmd run build` thành công với Vite 7.3.7, 200 modules transformed. Build có cảnh báo chunk JavaScript lớn hơn 500 kB sau minify nhưng không thất bại; Phạm vi kiểm thử là frontend và mock service; chưa xác nhận tích hợp nghiệp vụ thực tế với MetaMask hoặc hợp đồng blockchain đã triển khai.


## Đang làm / dừng ở đâu
- Task hiện tại: Hoàn tất C-04 về mặt triển khai và kiểm thử mock; đang rà soát staged diff để chuẩn bị commit riêng cho C-04.

Đã xác nhận: git --no-pager diff --check không báo lỗi; tại lần kiểm tra gần nhất, chỉ có docs/progress/PROGRESS_C.md xuất hiện là file đã sửa trong git status --short.

- Bước tiếp theo: Xác nhận các nội dung trên, stage đúng các file thuộc C-04, kiểm tra staged diff rồi mới commit và push nhánh lan-anh.

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

`Theo dõi tiến độ`
- docs/progress/PROGRESS_C.md

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Sử dụng React JavaScript với Vite và React Router.
- Giữ ba route /patient, /hospital, /insurer.
- InsurerPage.jsx hiện là stub tạm; cần phối hợp với thành viên B khi tích hợp trang nghiệp vụ chính thức.
- PatientPage.jsx hiện vẫn sử dụng dữ liệu tĩnh; tích hợp nghiệp vụ Patient không thuộc phạm vi C-04.
- Mock service chỉ dùng cho phát triển và kiểm thử frontend; không xem dữ liệu mock là dữ liệu blockchain thật.
- Không commit frontend/.env.local; file này dùng cho cấu hình cục bộ. Nếu cần chia sẻ cấu hình mẫu, sử dụng .env.example và không đưa thông tin bí mật vào đó. 
- Không tự ý sửa các file nghiệp vụ thuộc thành viên A/B.

## Vấn đề đang kẹt / cần người khác
- Thành viên B cần được thông báo rằng frontend/src/pages/insurer/InsurerPage.jsx hiện là stub tạm do C tạo để kiểm tra router.
- Chưa xác nhận tích hợp nghiệp vụ thực tế của Patient, Hospital và Insurer.
- Cần phối hợp với các thành viên phụ trách hợp đồng khi sẵn sàng chuyển từ mock service sang triển khai thật.

## Yêu cầu gửi người khác
- Báo thành viên B phối hợp thay thế hoặc hợp nhất stub Insurer với trang nghiệp vụ chính thức, tránh ghi đè công việc của nhau.
- Cần phối hợp với các thành viên phụ trách hợp đồng khi sẵn sàng chuyển từ mock service sang triển khai thật.

## Cách chạy / kiểm tra phần đã làm
Tại thư mục frontend:
- Cài dependencies: npm.cmd install
- Chạy phát triển: npm.cmd run dev
- Build production: npm.cmd run build

Cấu hình mock cục bộ trong frontend/.env.local:
- VITE_USE_MOCK=true
- Có thể dùng VITE_CHAIN_ID=31337 cho cấu hình mạng phát triển tương ứng. Không cần commit .env.local.

Kết quả build gần nhất: thành công; Vite 7.3.7, 200 modules transformed, thời gian 5.08 giây. Có cảnh báo chunk JavaScript lớn hơn 500 kB sau minify; đây là cảnh báo tối ưu bundle, không phải lỗi build.

Giới hạn kiểm thử: Đã kiểm tra các hàm đọc, ghi, phân quyền và dryRun của mock service; các kiểm tra đã chạy đều đạt. Build production thành công và đã kiểm tra thủ công điều hướng bốn địa chỉ mock ADMIN, HOSPITAL, PATIENT, OUTSIDER đến các route dự kiến. Dữ liệu mock chỉ tồn tại trong bộ nhớ. Chưa kiểm thử giao dịch với hợp đồng blockchain thật, chưa xác nhận tích hợp nghiệp vụ thực tế với hợp đồng đã triển khai. Build có cảnh báo chunk JavaScript lớn hơn 500 kB sau minify nhưng không thất bại.
