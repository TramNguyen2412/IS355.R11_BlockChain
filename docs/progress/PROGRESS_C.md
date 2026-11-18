# PROGRESS — Thành viên C (Lan Anh)
Cập nhật lần cuối: 18/11/2026

## Đã xong
- [x] M0 — Khởi tạo repo và quy tắc chung (A thực hiện); nhánh cố định của C: lan-anh.
- [x] C-02 đến C-05 — Khởi tạo frontend React/Vite, ví và điều hướng theo vai trò, Mock service, tiện ích và tích hợp contract service với ethers v6; kiểm thử Hardhat Local. Chi tiết lịch sử được lưu trong các commit trước.
- [X] C-06 — Màn hình Bệnh nhân ở chế độ Mock: đã triển khai các phần chính và kiểm tra phần lớn luồng; còn chờ kiểm thử APPROVED/REJECTED qua giao diện Insurer và xác minh nội dung PDF/gateway. Không sửa phần Insurer thuộc B.
- [x] C-07 — Hoàn thiện README; tạo bản nháp báo cáo 2.7, 3.3 (kèm sơ đồ kiến trúc Mermaid), 4.1; tạo mẫu Word 15pt có trường mục lục tự động và caption đánh số. File: README.md; docs/report/Muc_2_7_C.md; docs/report/Muc_3_3_C.md; docs/report/Muc_4_1_C.md; docs/report/Mau_BaoCao_IS355.docx.
- [X] C-08 — Kiểm thử tích hợp contract và service thật trên Hardhat Local, không sử dụng Mock. Đã hoàn thành kiểm thử chính của luồng Patient; đăng ký encryption key, đọc danh sách gói, mua policy/NFT và đọc policy bằng contract thật; nhập hồ sơ y tế giả qua giao diện Patient, upload hóa đơn và hồ sơ mã hóa lên IPFS, gửi claim và đọc lịch sử claim; bệnh viện xác nhận claim và truy xuất lại PDF/JSON từ IPFS.
- [X] C-09 — Soạn checklist E2E cho luồng chuẩn Local: khởi tạo, đăng ký khóa, mua NFT, gửi claim, xác nhận, duyệt và chi trả; có phân vai, ví thử nghiệm và bảng ghi nhận H5. File: docs/plan/C/E2E_CHECKLIST.md.
- [X] C-10 — Hoàn thiện TxToast: lấy chainId từ useWallet(), chỉ hiển thị link Etherscan khi giao dịch thành công trên Sepolia (chainId 11155111) và có transaction hash. Đã kiểm tra success trên Hardhat Local (không hiện link), success trên Sepolia (hiện hash và link Etherscan đúng), processing và error qua giao diện thực tế. Trường hợp success không có hash đã xác nhận điều kiện code không hiển thị link.
- [x] C-13 — Kiểm thử nghiệp vụ Bệnh nhân trên Sepolia bằng contract và service thật (`VITE_USE_MOCK=false`, `VITE_CHAIN_ID=11155111`). Bệnh nhân đăng ký khóa mã hóa, mua Gói Cơ bản thành công và nhận NFT `tokenId = 2`; kiểm tra giao dịch mua và NFT trên Etherscan. Tiếp tục gửi yêu cầu bồi thường `claimId = 1`, số tiền 0.012 ETH, kèm hóa đơn và hồ sơ mã hóa trên IPFS. Bệnh viện xác nhận claim (`hospitalConfirmed = true`); Phương Anh thực hiện duyệt, giao dịch thành công và contract chuyển 0.012 ETH về ví bệnh nhân. Đọc lại `getClaim(1)` xác nhận `status = 1 (APPROVED)` và `resolvedAt != 0`.  
  - Giao dịch mua bảo hiểm: `0x532d7377998d132a0a9961c6844646e22dc595932ca6292eb33fea9f8d1b59aa`
  - Giao dịch gửi claim: `0x070e3b446455128cf5f79c0ffe8e777f8e894eeb10047128aaf39d1d7021175d`
  - Giao dịch duyệt và chi trả: `0x60306e081520e8079220a68c434872799c8dab844c2aad4fbee662f27f462ba5`
  - Kết quả cuối: `claimId = 1`, `tokenId = 2`, `status = APPROVED`, bệnh nhân nhận 0.012 ETH.

## Đang làm / dừng ở đâu
`Task hiện tại`: C-11

`Việc tiếp theo`: C-11 & c-15
- Sepolia; luồng đã được bệnh viện xác nhận, công ty bảo hiểm duyệt và chuyển tiền thành công.
- Cần tiếp tục chạy luồng chuẩn nhiều lần theo kế hoạch, ghi nhận giao dịch và chuẩn bị ảnh minh chứng.
- P2 `/preflight` không bắt buộc, chưa triển khai.

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

`C-08 - Sửa lỗi`
- contracts-hardhat/hardhat.config.js
- frontend/src/pages/patient/ClaimForm.jsx

`C-09 — Checklist kiểm thử E2E`
- docs/plan/C/E2E_CHECKLIST.md

`C-10 — Hoàn thiện TxToast`
- frontend/src/components/shared/TxToast.jsx — lấy chainId từ WalletProvider; tạo link Etherscan cho giao dịch thành công trên Sepolia khi có hash.

`C-13 — Kiểm thử Sepolia`
- Không phát sinh file code mới trong lần kiểm thử này.

`Theo dõi tiến độ`
- docs/progress/PROGRESS_C.md

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Giữ React JavaScript + Vite, ba route /patient, /hospital, /insurer.
- VITE_USE_MOCK=true chỉ dùng để phát triển/kiểm thử; không xem là giao dịch blockchain thật.
- Tên contract HealthInsuranceNFT và các chữ ký giao tiếp giữ nguyên.
- Không commit .env.local, JWT Pinata, private key hoặc khóa riêng RSA.
- Không sửa file thuộc A/B.

## Vấn đề đang kẹt / cần người khác
- B (Phương Anh): xác nhận CID PDF và khả năng truy xuất từ gateway.

## Yêu cầu gửi người khác
- [ ] B: xác nhận PDF/gateway.

## Cách chạy / kiểm tra phần đã làm
- Tại frontend: npm.cmd install; npm.cmd run dev; npm.cmd run build.
- Mock: VITE_USE_MOCK=true, VITE_CHAIN_ID=31337.
- Local thật: VITE_USE_MOCK=false, VITE_CHAIN_ID=31337; cần Hardhat node và ABI/địa chỉ đã xuất.
- Sepolia: VITE_USE_MOCK=false, VITE_CHAIN_ID=11155111; chỉ kiểm thử khi có địa chỉ contract và cấu hình hợp lệ.
- C-10: Kiểm tra TxToast trên Hardhat Local (chainId 31337) và Sepolia (chainId 11155111). Link Etherscan chỉ xuất hiện khi status là success, có hash và đang kết nối Sepolia. Đã kiểm tra processing và error qua giao diện. Trường hợp success không có hash được xác nhận qua điều kiện render trong TxToast.jsx.


## Check E2E
**Cập nhật:** 18/11/2026

### A. Kiểm thử E2E trên Hardhat Local

**Môi trường:** Hardhat Local (chainId 31337), contract và service thật, không sử dụng Mock.

#### 1. Các bước đã kiểm thử

- [x] Đăng ký encryption key cho Bệnh nhân.
- [x] Đọc danh sách gói bảo hiểm từ contract thật.
- [x] Mua Gói Cơ bản và nhận policy/NFT.
- [x] Đọc thông tin policy sau khi mua.
- [x] Nhập thông tin khám chữa bệnh giả trên giao diện Patient.
- [x] Upload hóa đơn mẫu lên IPFS và nhận CID thật.
- [x] Mã hóa hồ sơ y tế và upload JSON hồ sơ lên IPFS.
- [x] Gửi yêu cầu bồi thường (claim) thành công.
- [x] Đọc lịch sử claim và kiểm tra trạng thái Pending.
- [x] Bệnh viện xác nhận claim.
- [x] Truy xuất lại PDF hóa đơn và JSON hồ sơ từ IPFS.
- [x] Bệnh nhân quay lại giao diện Patient và kiểm tra claim đã chuyển sang trạng thái Approved.
- [x] Bệnh nhân truy xuất và xem được hồ sơ liên quan đến claim.
- [x] Kiểm tra ví OUTSIDER: có thể thực hiện luồng nghiệp vụ Bệnh nhân và xem hồ sơ của chính mình.

#### 2. Các bước chưa xác nhận hoàn thành trên Local

- [ ] Hoàn thành toàn bộ bước thiết lập hệ thống bằng ví Admin, bao gồm đăng ký encryption key và kiểm tra dữ liệu seed.
- [ ] Xác nhận Bệnh viện đăng ký encryption key thành công.
- [ ] Xác nhận đầy đủ bước Bệnh viện xác minh thẻ bảo hiểm bằng `verifyInsurance`.
- [ ] Admin truy xuất và giải mã hồ sơ bằng khóa riêng.
- [ ] Admin duyệt claim bằng `approveClaim`.
- [ ] Xác nhận bệnh nhân nhận khoản chi trả.
- [ ] Bệnh nhân kiểm tra trạng thái Approved và hạn mức còn lại.
- [ ] Kiểm tra claim vượt hạn mức.
- [ ] Kiểm tra các thao tác yêu cầu quyền Admin/Hospital bằng ví OUTSIDER.

### B. Kiểm thử nghiệp vụ trên Sepolia — C-13

**Môi trường:** Sepolia (chainId 11155111), `VITE_USE_MOCK=false`, contract và service thật.

#### 1. Các bước đã kiểm thử

- [x] Kết nối ví Bệnh nhân trên Sepolia.
- [x] Đăng ký encryption key cho Bệnh nhân.
- [x] Đọc danh sách gói bảo hiểm từ contract thật.
- [x] Mua Gói Cơ bản thành công.
- [x] Xác nhận Bệnh nhân nhận NFT `tokenId = 2`.
- [x] Kiểm tra giao dịch mua bảo hiểm trên Etherscan.
- [x] Gửi yêu cầu bồi thường `claimId = 1`.
- [x] Upload hóa đơn và hồ sơ mã hóa lên IPFS, nhận CID.
- [x] Bệnh viện xác nhận claim (`hospitalConfirmed = true`).
- [x] Kiểm tra giao dịch duyệt claim trên Sepolia.
- [x] Xác nhận contract chuyển 0.012 ETH về ví Bệnh nhân.
- [x] Đọc lại `getClaim(1)` và xác nhận `status = 1 (APPROVED)`.
- [x] Xác nhận `resolvedAt != 0`.

#### 2. Giao dịch và kết quả

- Giao dịch mua bảo hiểm: `0x532d7377998d132a0a9961c6844646e22dc595932ca6292eb33fea9f8d1b59aa`
- Giao dịch gửi claim: `0x070e3b446455128cf5f79c0ffe8e777f8e894eeb10047128aaf39d1d7021175d`
- Giao dịch duyệt và chi trả: `0x60306e081520e8079220a68c434872799c8dab844c2aad4fbee662f27f462ba5`

Kết quả cuối:
- `claimId = 1`
- `tokenId = 2`
- `amount = 0.012 ETH`
- `hospitalConfirmed = true`
- `status = APPROVED`
- Bệnh nhân nhận 0.012 ETH.

### C. Kiểm tra TxToast — C-10

- [x] Giao dịch thành công trên Hardhat Local: không hiển thị link Etherscan.
- [x] Giao dịch thành công trên Sepolia: hiển thị transaction hash và link Etherscan.
- [x] Trạng thái processing hiển thị đúng.
- [x] Trạng thái error hiển thị đúng.
- [x] Trường hợp success không có transaction hash: không hiển thị link Etherscan.

### D. Kết luận
- C đã kiểm thử thành công các phần chính của luồng Patient trên Hardhat Local bằng contract và service thật, bao gồm mua bảo hiểm, tạo và gửi claim, upload và truy xuất hồ sơ IPFS.
- Trên Sepolia, C đã kiểm thử thành công luồng nghiệp vụ mua bảo hiểm, nhận NFT, gửi claim, bệnh viện xác nhận, duyệt claim và chi trả. Kết quả `getClaim(1)` trên contract xác nhận claim ở trạng thái APPROVED và giao dịch chi trả 0.012 ETH đã hoàn thành.
- C-10 đã được kiểm tra trên cả Hardhat Local và Sepolia.

**Trạng thái E2E:** Đã kiểm thử thành công các luồng nghiệp vụ chính trên Local và Sepolia. Chưa xác nhận hoàn thành toàn bộ checklist E2E vì vẫn còn các kiểm tra bổ sung về thiết lập Admin, encryption key của Bệnh viện, giải mã hồ sơ, hạn mức và phân quyền OUTSIDER.

**Lưu ý:** Các mục chưa xác nhận không đồng nghĩa chức năng chưa được triển khai; hiện chưa có đủ kết quả kiểm thử để đánh dấu hoàn thành.