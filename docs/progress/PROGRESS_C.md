# PROGRESS — Thành viên C (Lan Anh)
Cập nhật lần cuối: 11/11/2026

## Đã xong
- [x] M0 — Khởi tạo repo MediChain, cây thư mục, luật chung (do A (Trâm) làm). Nhánh làm việc của mình: `lan-anh`
- [x] C-02 — Khởi tạo frontend bằng Vite + React (JavaScript). Cấu hình package.json, vite.config.js, index.html. Tạo src/main.jsx và src/app/App.jsx với các route /patient, /hospital, /insurer. Tạo các component dùng chung: Layout.jsx, Loading.jsx, Address.jsx, ErrorBox.jsx, TxToast.jsx. Tạo src/styles/global.css với nền sáng, chữ tối và cỡ chữ cơ bản 16px. Tạo giao diện khung PatientPage.jsx. Tạo InsurerPage.jsx dạng stub tạm để kiểm tra router; chưa triển khai nghiệp vụ Insurer. Cài dependencies bằng npm.cmd install. Kiểm tra điều hướng ba trang trên trình duyệt. Chạy npm.cmd run build thành công.
- [x] C-03 — Tạo `frontend/src/app/errors.js` để chuyển các lỗi nghiệp vụ và lỗi MetaMask sang thông báo tiếng Việt; tạo `frontend/src/app/format.js` với `formatEth`, `formatDate`, `shortAddress`; tạo `frontend/src/app/WalletProvider.jsx` quản lý context ví, kết nối MetaMask, kiểm tra chain ID và lắng nghe `accountsChanged`/`chainChanged`. Tích hợp `WalletProvider` vào `App.jsx`. Kiểm tra `npm.cmd run build` thành công; chạy frontend với `VITE_USE_MOCK=true`, xác nhận danh sách bốn ví mẫu xuất hiện và địa chỉ thay đổi theo vai trò đã chọn.
- [x] C-04 — Mock service và điều hướng theo vai trò: Tạo `frontend/src/app/contractService.mock.js` với dữ liệu khởi tạo gồm 2 gói bảo hiểm, 1 policy, 3 claim, số dư pool 0.1 ETH và các địa chỉ mẫu ADMIN, HOSPITAL, PATIENT, OUTSIDER; Tạo `frontend/src/app/contractService.js` để chọn mock theo biến môi trường VITE_USE_MOCK; khi chưa sử dụng mock, các hàm tương ứng báo lỗi chưa cài đặt thay vì giả lập giao dịch hợp đồng thật; Tạo `frontend/src/app/roleDetection.js` để xác định vai trò thông qua getRoles; Tích hợp điều hướng theo vai trò trong `frontend/src/app/App.jsx`: insurer → /insurer, hospital → /hospital, patient/outsider → /patient; Cập nhật `README.md` hướng dẫn chạy frontend ở chế độ mock và lưu ý dữ liệu mock chỉ tồn tại trong bộ nhớ, không được lưu bền vững; Kiểm thử các hàm đọc, ghi, phân quyền và dryRun của mock service. Các kiểm tra đã chạy đều đạt: kiểm tra đọc đạt sau khi điều chỉnh cách so sánh chuỗi Unicode; 13 kiểm tra ghi đạt; 15/15 kiểm tra bổ sung về quyền và dryRun đạt; Chạy `npm.cmd run build` thành công với Vite 7.3.7, 200 modules transformed. Build có cảnh báo chunk JavaScript lớn hơn 500 kB sau minify nhưng không thất bại; Phạm vi kiểm thử là frontend và mock service; chưa xác nhận tích hợp nghiệp vụ thực tế với MetaMask hoặc hợp đồng blockchain đã triển khai.
- [x] **C-05 — Tích hợp frontend với smart contract thật:** Triển khai `frontend/src/app/contractService.js` sử dụng ethers v6 và `BrowserProvider`; đọc ABI từ `frontend/src/contracts/abi.json`, địa chỉ và `deployBlock` từ `frontend/src/contracts/address.json`; kiểm tra MetaMask và Chain ID; triển khai các hàm đọc dữ liệu, ghi giao dịch, `dryRun` bằng `.staticCall()`, chuyển đổi dữ liệu Solidity struct sang JavaScript object, xử lý lỗi tiếng Việt bằng `toVietnameseError`, truy vấn sự kiện bằng `queryFilter()` và tổng hợp thống kê từ event. Kiểm thử trên Hardhat Local (Chain ID 31337): 10/10 hàm ghi dữ liệu chạy `dryRun` thành công; kiểm thử giao dịch thật thành công với các luồng đăng ký khóa mã hóa, mua bảo hiểm, gửi claim, xác nhận claim, duyệt claim và từ chối claim. Kiểm tra dữ liệu đọc được gồm 2 gói bảo hiểm, 1 policy, 2 claim; trạng thái claim gồm 1 APPROVED và 1 REJECTED; `getEvents()` truy vấn được 11 sự kiện; `getStats()` trả về số liệu phù hợp với dữ liệu blockchain. Chạy `npm.cmd run build` thành công với Vite 7.3.7, 201 modules transformed. Build có cảnh báo chunk JavaScript lớn hơn 500 kB sau minify nhưng không thất bại. Phạm vi kiểm thử là tích hợp frontend với hợp đồng trên Hardhat Local; chưa xác nhận triển khai và kiểm thử trên Sepolia.
- [x] **C-06 – Patient screen (Mock mode):** Hoàn thành phần giao diện và kiểm thử các luồng tạo khóa RSA, đăng ký khóa, xem gói bảo hiểm, mua hợp đồng, gửi claim, xem lịch sử và giải mã hồ sơ. Đã kiểm tra DryRun và các trường hợp lỗi cơ bản. Còn chờ kiểm thử trạng thái APPROVED/REJECTED qua giao diện Insurer và xác minh nội dung PDF.

## Đang làm / dừng ở đâu
`Task hiện tại`: C-06 — Màn hình Bệnh nhân ở chế độ Mock.
`Đã triển khai và kiểm thử các chức năng chính`:
- PatientPage tải được, không gặp lỗi giao diện.
- KeySetup: tạo khóa RSA, đăng ký khóa, xuất và nhập khóa.
- PlanList: hiển thị hai gói bảo hiểm và đường dẫn PDF.
- PurchaseForm: nhập mã số bảo hiểm, mã hóa và mua gói bảo hiểm thành công; hiển thị Token ID.
- PolicyCard: hiển thị Token ID, tên gói, địa chỉ chủ thẻ, hạn mức tối đa, hạn mức đã sử dụng, hạn mức còn lại, ngày bắt đầu, ngày hết hạn và hiệu lực.
- ClaimForm: tải hóa đơn, tạo hồ sơ mã hóa, tải JSON và gửi yêu cầu bồi thường thành công.
- ClaimList: hiển thị lịch sử claim và trạng thái PENDING.
- RecordViewer: bệnh nhân giải mã được hồ sơ của chính mình.
- Kiểm tra quyền giải mã: ví OUTSIDER không thể giải mã hồ sơ, nhận thông báo Ví của bạn không có quyền xem hồ sơ này.
- DryRun: kiểm tra thành công; kết quả {hash: null, receipt: null}, không tạo giao dịch mới.

`Kết quả kiểm thử nghiệp vụ`:
- Mua bảo hiểm khi đã có hợp đồng còn hiệu lực: bị chặn với thông báo Bạn đã có gói bảo hiểm còn hiệu lực.
- Gửi claim vượt hạn mức: bị chặn với thông báo Số tiền vượt hạn mức bảo hiểm còn lại.
- Không chọn hóa đơn: trình duyệt chặn gửi biểu mẫu bằng validation bắt buộc.
- Gửi claim #1 thành công với số tiền 0.005 ETH.
- Bệnh viện xác nhận chi phí claim #1 là 0.005 ETH.
- Bệnh nhân xem được lịch sử claim #1 ở trạng thái PENDING, cùng số tiền yêu cầu, số tiền bệnh viện xác nhận, CID và mã giao dịch.

`Chưa hoàn tất toàn bộ tiêu chí C-06`:
- Chưa kiểm thử được trạng thái APPROVED và REJECTED qua giao diện Insurer. InsurerPage.jsx hiện vẫn là stub và thuộc phạm vi phụ trách của thành viên B. C không tự ý sửa file của B.
- Link PDF đã hiển thị nhưng gateway không truy xuất được nội dung, nên chưa xác nhận tải và xem PDF thành công.

`Bước tiếp theo`: phối hợp B để kiểm thử duyệt/từ chối claim sau khi giao diện Insurer được tích hợp; kiểm tra lại PDF khi có CID và gateway hoạt động.

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

`Theo dõi tiến độ`
- docs/progress/PROGRESS_C.md

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Sử dụng React JavaScript với Vite và React Router.
- Giữ ba route /patient, /hospital, /insurer.
- VITE_USE_MOCK=true dùng Mock service; dữ liệu Mock chỉ tồn tại trong bộ nhớ của phiên chạy hiện tại.
- Không xem dữ liệu Mock là dữ liệu blockchain thật.
- Không reset Mock state khi đang cần giữ dữ liệu claim để kiểm thử.
- InsurerPage.jsx thuộc phạm vi thành viên B; C không tự ý sửa hoặc thay thế phần nghiệp vụ của B.
- Không commit frontend/.env.local, JWT Pinata, private key hoặc khóa RSA riêng.

## Vấn đề đang kẹt / cần người khác
- Thành viên B cần hoàn thiện luồng duyệt và từ chối claim trên InsurerPage để C có thể kiểm thử đầy đủ ba trạng thái PENDING, APPROVED và REJECTED qua giao diện.
- Cần kiểm tra lại CID/gateway PDF của hai gói bảo hiểm để xác nhận khả năng truy xuất nội dung.

## Yêu cầu gửi người khác
- [ ] B (Phương Anh): thông báo khi màn hình Insurer có thể duyệt và từ chối claim để C kiểm thử vòng đời claim.
- [ ] B (Phương Anh): xác nhận CID PDF hợp lệ và khả năng truy xuất từ gateway.

## Cách chạy / kiểm tra phần đã làm
Tại thư mục frontend:
- Cài dependencies: npm.cmd install
- Chạy phát triển: npm.cmd run dev
- Build production: npm.cmd run build

Cấu hình mock cục bộ trong frontend/.env.local:
- VITE_USE_MOCK=true
- Có thể dùng VITE_CHAIN_ID=31337 

Khởi động lại Vite sau khi thay đổi biến môi trường. Không commit .env.local.

Kết quả build C-06 gần nhất: npm.cmd run build thành công với Vite 7.3.7, 222 modules transformed in 3.91s.

Giới hạn kiểm thử:
- C-04: đã kiểm thử Mock service.
- C-05: đã kiểm thử tích hợp với smart contract thật trên Hardhat Local, bao gồm các hàm đọc, ghi, phân quyền, dryRun, giao dịch thật, truy vấn event và thống kê.
- C-06: đã kiểm thử phần lớn luồng màn hình Bệnh nhân với VITE_USE_MOCK=true; trạng thái PENDING đã xác nhận. APPROVED/REJECTED qua giao diện và nội dung PDF vẫn đang chờ kiểm tra.
- Chưa xác nhận triển khai và kiểm thử toàn bộ hệ thống trên Sepolia.
