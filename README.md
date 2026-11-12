# MediChain - Hệ thống quản lý bảo hiểm y tế phi tập trung

**MediChain** là Ứng dụng phi tập trung (DApp) quản lý bảo hiểm y tế tham số, được phát triển nhằm tự động hóa quy trình bồi thường, tăng cường tính minh bạch và bảo vệ quyền riêng tư của bệnh nhân thông qua công nghệ Blockchain và mã hóa. Dự án thuộc **Bài tập 04 - Đồ án môn học IS355**.

> **Lưu ý về trạng thái:** Repository có cả chế độ Mock và tích hợp contract. Mock chỉ phục vụ phát triển/kiểm thử giao diện, không phải dữ liệu on-chain. Việc triển khai và kiểm thử Sepolia cần được xác nhận riêng theo địa chỉ contract và kết quả chạy thực tế; không suy ra trạng thái Sepolia chỉ từ việc frontend build thành công.

## 1. Thành viên và phạm vi

| Họ và tên | MSSV | Vai trò chính |
| :--- | :---: | :--- |
| **Trâm** | *23521615* | Phát triển Smart Contract, Màn hình Bệnh viện |
| **Phương Anh** | 22520070 | Tích hợp IPFS, Mã hóa (AES/RSA), Màn hình Công ty Bảo hiểm |
| **Lan Anh** | 23520052 | Khung ứng dụng React, Kết nối ví Web3, Màn hình Bệnh nhân |

## 2. Công nghệ sử dụng

- **Smart Contract:** Solidity (^0.8.20), OpenZeppelin v5 (ERC-721, AccessControl, ReentrancyGuard)
- **Môi trường & Triển khai:** Hardhat, Ethereum Sepolia Testnet.
- **Frontend (Web3):** ReactJS, Vite, Ethers.js v6, MetaMask.
- **Lưu trữ phi tập trung:** IPFS (Pinata).
- **Bảo mật & Mã hóa:** WebCrypto API (AES-256-GCM, RSA-OAEP 2048) áp dụng mô hình mã hóa phong bì (Envelope Encryption).
- **Ngôn ngữ giao diện:** Tiếng Việt.

Tên smart contract được cố định là **HealthInsuranceNFT**. Không tự ý đổi tên contract, hàm, tham số hoặc cấu trúc dữ liệu đã quy định trong tài liệu hợp đồng chung.

## 3. Nghiệp vụ chính

1. **Thiết lập hệ thống:** Công ty bảo hiểm đăng ký khóa mã hóa, tạo gói bảo hiểm, cấp quyền cho bệnh viện và nạp quỹ.
2. **Mua bảo hiểm:** Bệnh nhân chọn gói, thanh toán bằng ETH và nhận thẻ bảo hiểm NFT.
3. **Khám bệnh và gửi yêu cầu:** Bệnh viện kiểm tra thẻ, lập hồ sơ, tải hóa đơn và dữ liệu đã mã hóa lên IPFS, sau đó gửi hoặc xác nhận yêu cầu bồi thường.
4. **Duyệt và chi trả:** Công ty bảo hiểm khởi tạo thao tác duyệt/từ chối; smart contract kiểm tra các điều kiện nghiệp vụ trước khi chi trả.
5. **Giám sát:** Công ty bảo hiểm xem lịch sử sự kiện và thống kê hoạt động của hệ thống.

## 4. Các tính năng chi tiết theo vai trò

### 4.1. Bệnh nhân (Patient)
- **Khám phá & Mua bảo hiểm:** Xem danh sách các gói bảo hiểm (hạn mức, thời hạn, điều khoản PDF) và thanh toán phí bằng ETH.
- **Ví NFT Thẻ bảo hiểm:** Quản lý thẻ bảo hiểm dưới dạng NFT Soulbound (không thể chuyển nhượng), theo dõi số dư hạn mức bồi thường còn lại theo thời gian thực.
- **Quản lý Khóa bảo mật:** Khởi tạo và lưu trữ cặp khóa RSA-OAEP để mã hóa dữ liệu cá nhân (Mã số bảo hiểm) ngay trên trình duyệt.
- **Yêu cầu bồi thường (Claim):** Tự gửi yêu cầu bồi thường, tải hóa đơn và bệnh án lên IPFS.
- **Theo dõi hồ sơ:** Xem tiến độ xử lý (Chờ xử lý / Đã duyệt / Từ chối), tự giải mã hồ sơ bệnh án cá nhân, và nhận tiền bồi thường trực tiếp về ví.

### 4.2. Bệnh viện (Hospital)
- **Xác thực quyền hạn (RBAC):** Truy cập hệ thống thông qua danh sách ủy quyền (HOSPITAL_ROLE) được cấp bởi Công ty bảo hiểm.
- **Kiểm tra thẻ bảo hiểm (Verification):** Quét ví bệnh nhân để xác minh thẻ NFT còn hiệu lực và trích xuất thông tin hạn mức chi trả tối đa.
- **Bảo mật dữ liệu Y tế (Envelope Encryption):** Nhập chi phí điều trị, mã hóa bệnh án nhạy cảm bằng AES-256-GCM. Sau đó, bọc khóa AES bằng RSA cho 3 đối tượng (Bệnh nhân, Bệnh viện, Công ty bảo hiểm) trước khi đẩy lên IPFS nhằm bảo vệ quyền riêng tư tuyệt đối.
- **Xác nhận chi phí (Confirm Claim):** Đóng vai trò Oracle xác nhận số tiền điều trị thực tế làm cơ sở minh bạch để hệ thống tiến hành chi trả.

### 4.3. Công ty bảo hiểm (Insurer / Admin)
- **Quản trị Gói bảo hiểm:** Tạo mới gói bảo hiểm, thiết lập giá phí, thời hạn, hạn mức chi trả và tải file PDF điều khoản hợp đồng lên mạng lưới IPFS.
- **Quản lý Quỹ bồi thường:** Nạp tiền vào quỹ chung (Pool) để Smart Contract tự động trích xuất và xử lý chi trả.
- **Thẩm định hồ sơ (Retrieve & Decrypt):** Lấy mã CID từ Blockchain, tải hồ sơ gốc từ IPFS và giải mã bằng khóa riêng RSA để xem xét bằng chứng y tế.
- **Duyệt bồi thường tự động (Parametric Insurance):** Kích hoạt hệ thống duyệt bồi thường. Smart Contract sẽ tự động đối chiếu các ràng buộc (thẻ còn hạn, số tiền không vượt quá hạn mức, đã được bệnh viện xác nhận, quỹ đủ tiền). Nếu hợp lệ, ETH sẽ được chuyển thẳng cho bệnh nhân mà không cần thao tác chuyển khoản thủ công.
- **Bảng điều khiển Giám sát (Dashboard):** Quản lý toàn bộ sự kiện On-chain, thống kê tổng doanh thu phí, tổng chi phí bồi thường và giám sát số dư quỹ.

## 5. Kiến trúc thư mục

- **contracts-hardhat/**: smart contract, test và script triển khai (A).
- **frontend/src/app/**: kết nối ví, điều hướng, contract service và xử lý lỗi (C).
- **frontend/src/pages/patient/**: màn hình Bệnh nhân (C).
- **frontend/src/pages/hospital/**: màn hình Bệnh viện (A).
- **frontend/src/pages/insurer/**: màn hình Công ty bảo hiểm (B).
- **frontend/src/services/**: dịch vụ IPFS và mã hóa (B).
- **frontend/src/components/shared/**, **frontend/src/styles/**: thành phần và kiểu dùng chung do C quản lý.
- **docs/**: luật dự án, kế hoạch, tiến độ và tài liệu báo cáo.

Quyền sở hữu thư mục được quy định trong docs/00_AI_RULES_AND_CONTRACTS.md. Không sửa file thuộc thành viên khác.

## 6. Hướng dẫn cài đặt và chạy dự án

### 6.1. Yêu cầu hệ thống
- Node.js: v24.11.0 (môi trường đã kiểm thử).
- npm: 11.6.1 (môi trường đã kiểm thử).
- Frontend sử dụng Vite 7.3.7.
- Tiện ích mở rộng ví MetaMask trên trình duyệt.
- Mạng Sepolia Testnet và Sepolia ETH nếu chạy với hợp đồng thật.

Phiên bản Node/npm trên máy khác có thể khác. Khi gặp lỗi tương thích, đối chiếu cấu hình và lockfile của repository trước khi nâng cấp công cụ hoặc package.

### 6.2. Các bước cài đặt
1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/TramNguyen2412/IS355.R11_BlockChain.git MediChain
   cd MediChain

### 6.3. Chạy frontend bằng dữ liệu giả lập (Mock)

Chế độ Mock phù hợp để phát triển giao diện mà không cần contract đang chạy. Dữ liệu Mock tồn tại trong bộ nhớ của ứng dụng và có thể mất khi tải lại trang hoặc khởi động lại Vite.

Từ thư mục gốc repository:

```powershell
cd frontend
npm.cmd install
```

Tạo file frontend/.env.local (không commit) với cấu hình:

```dotenv
VITE_USE_MOCK=true
VITE_CHAIN_ID=31337
```

Khởi động frontend:

```powershell
npm.cmd run dev
```

Mở URL local được Vite in trong terminal. Kiểm tra điều hướng theo vai trò:

| Ví mẫu | Route |
|---|---|
| HOSPITAL | /hospital |
| ADMIN | /insurer |
| PATIENT | /patient |
| OUTSIDER | /patient |

Kiểm tra build production:

```powershell
npm.cmd run build
```

Build thành công khi Vite kết thúc mà không có lỗi. Cảnh báo bundle lớn không đồng nghĩa với build thất bại.

#### Lưu ý

- Dữ liệu mock chỉ tồn tại trong bộ nhớ; thay đổi có thể mất khi tải lại ứng dụng.
- Mock không đại diện cho giao dịch blockchain thật.
- Khi `VITE_USE_MOCK=false`, các hàm contract chưa triển khai sẽ báo lỗi `Chưa cài đặt`

## 7. Chạy với contract local

Phần contract được quản lý trong contracts-hardhat/. Thực hiện theo thứ tự và script đã được nhóm thống nhất; không tự thay đổi script hoặc dữ liệu seed.

Terminal 1 — khởi động Hardhat node:

```powershell
cd contracts-hardhat
npm.cmd install
npx hardhat node
```

Terminal 2 — triển khai contract và nạp dữ liệu mẫu:

```powershell
cd contracts-hardhat
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/seed.js --network localhost
```

Sau khi script của A xuất ABI và địa chỉ contract, cấu hình frontend trong frontend/.env.local:

```dotenv
VITE_USE_MOCK=false
VITE_CHAIN_ID=31337
```

Khởi động lại Vite sau khi thay đổi biến môi trường. Chọn đúng mạng local và tài khoản thử nghiệm trong MetaMask. Không dùng cấu hình Mock để kết luận giao dịch đã được ghi lên blockchain.

## 8. Chạy với Sepolia

Chỉ thực hiện khi đã có contract được triển khai trên Sepolia, ABI/địa chỉ mới nhất được xuất vào frontend/src/contracts/, và các dịch vụ IPFS/mã hóa bản thật đã sẵn sàng.

Cấu hình local trong frontend/.env.local:

```dotenv
VITE_USE_MOCK=false
VITE_CHAIN_ID=11155111
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
VITE_PINATA_JWT=
```

- Điền JWT Pinata thử nghiệm do người phụ trách B cung cấp trực tiếp vào máy chạy; không đưa JWT vào Git, ảnh chụp, log hoặc tài liệu công khai.
- Chỉ sử dụng ví thử nghiệm Sepolia. Không dùng private key của ví cá nhân hoặc ví có tài sản thật.
- Kiểm tra frontend/src/contracts/address.json có Chain ID 11155111 và địa chỉ contract đúng với lần triển khai cần thử.
- MetaMask phải ở mạng Sepolia và ví phải có Sepolia ETH.
- Khởi động lại frontend sau khi cập nhật .env.local.

Không tự điền địa chỉ contract, CID hoặc thông tin ví nếu chưa có dữ liệu xác nhận từ người phụ trách. Sau khi kết thúc giai đoạn demo, xử lý JWT theo quy định của nhóm.

## 9. Luồng sử dụng tổng quát

1. Admin kết nối ví, tạo và đăng ký khóa mã hóa, tạo gói bảo hiểm, cấp quyền bệnh viện và nạp quỹ.
2. Bệnh nhân tạo/đăng ký khóa, chọn gói, nhập mã số bảo hiểm và mua gói.
3. Bệnh nhân theo dõi thẻ NFT, hạn mức còn lại và gửi yêu cầu kèm hóa đơn/hồ sơ.
4. Bệnh viện kiểm tra hiệu lực thẻ, xem hồ sơ theo quyền được cấp và xác nhận chi phí.
5. Admin thẩm định, duyệt hoặc từ chối yêu cầu.
6. Khi điều kiện trong contract thỏa mãn, contract thực hiện chi trả cho bệnh nhân; các sự kiện được dùng để theo dõi và thống kê.

Các thao tác ghi trên giao diện cần thực hiện dryRun trước khi gửi giao dịch thật theo hợp đồng service. Tiền trong JavaScript được xử lý bằng bigint theo đơn vị wei; chỉ định dạng ETH khi hiển thị.

## 10. An toàn dữ liệu

- Không commit .env, .env.local, JWT Pinata, private key ví hoặc khóa riêng RSA.
- Khóa riêng RSA phải được người dùng bảo quản và xuất/nhập qua chức năng của ứng dụng; không gửi vào repository.
- Hồ sơ y tế nhạy cảm phải được mã hóa trước khi tải lên IPFS. CID không đồng nghĩa với quyền giải mã.
- Mock data là dữ liệu hư cấu, chỉ dùng cho kiểm thử.
- Không đưa dữ liệu bệnh nhân thật vào môi trường demo hoặc tài liệu minh họa.

## 11. Tài liệu dự án

- docs/00_AI_RULES_AND_CONTRACTS.md: quy tắc chung và hợp đồng giao tiếp đã đóng băng.
- docs/plan/00_MASTER_PLAN.md: kế hoạch tổng và mô tả task.
- docs/progress/PROGRESS_A.md, PROGRESS_B.md, PROGRESS_C.md: nhật ký tiến độ từng thành viên.
- docs/report/: bản nháp báo cáo và tài liệu minh chứng.

## 12. Trạng thái kiểm thử cần lưu ý

Theo nhật ký C tại thời điểm cập nhật README.md:
- Frontend đã build thành công trong các lần kiểm tra được ghi ở PROGRESS_C.md.
- C-05 đã được kiểm thử tích hợp contract trên Hardhat Local.
- C-06 đã kiểm tra phần lớn luồng Bệnh nhân ở chế độ Mock; trạng thái PENDING đã được xác nhận.
- Kiểm thử trạng thái APPROVED/REJECTED qua giao diện Insurer và xác minh nội dung PDF vẫn cần phối hợp với B.
- Chưa có xác nhận trong nhật ký C rằng toàn bộ hệ thống đã được kiểm thử hoàn chỉnh trên Sepolia.

Thông tin được tổng hợp tại thời điểm cập nhật README.md (12/11/2026).
Đây là bản tổng quan tiến độ nhóm, không thay thế nhật ký tiến độ riêng của từng thành viên.

### Thành viên A – Trâm
- Đã hoàn thành toàn bộ nhiệm vụ A01–A14 theo `PROGRESS_A.md`.
- Hoàn thiện Smart Contract `HealthInsuranceNFT` và các nghiệp vụ
  thiết lập hệ thống, mua bảo hiểm, yêu cầu bồi thường, duyệt và chi trả.
- Hoàn thành 34 ca kiểm thử Hardhat theo báo cáo của A.
- Hoàn thiện giao diện Bệnh viện với 4/4 khối chức năng.
- Đã triển khai contract chính thức trên Sepolia, cấp quyền bệnh viện,
  nạp quỹ và xác minh mã nguồn trên Etherscan.
- Hoàn thiện báo cáo kỹ thuật, bảng gas, bảng test case và minh chứng
  tại `docs/report/TongHopTrienKhai_A.md`.
- Trạng thái theo nhật ký A: hoàn thành, sẵn sàng demo và nghiệm thu.


### Thành viên B – Phương Anh
- Phạm vi công việc của B liên quan đến Pinata, mã hóa/giải mã AES-RSA và các chức năng phía Công ty bảo hiểm (Insurer).
- Tại thời điểm cập nhật, nhật ký của C chưa có đủ thông tin xác nhận trạng thái hoàn thành và kết quả kiểm thử toàn bộ các phần việc của B.
- Việc kiểm thử luồng APPROVED/REJECTED qua giao diện Insurer và xác minh nội dung PDF vẫn cần phối hợp với B.

### Lưu ý
- Trạng thái của từng thành viên cần được xác nhận bằng nhật ký tiến độ, commit hoặc kết quả kiểm thử tương ứng.
- Không xem việc một chức năng đã được triển khai là bằng chứng cho thấy chức năng đó đã được kiểm thử hoàn chỉnh.
- Khi có cập nhật mới, bổ sung trạng thái và bằng chứng tương ứng thay vì suy đoán tiến độ.

Khi có kết quả mới, cập nhật nhật ký tiến độ và bằng chứng tương ứng thay vì sửa README thành một tuyên bố chưa được kiểm chứng.
