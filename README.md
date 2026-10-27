# MediChain - Hệ thống quản lý bảo hiểm y tế phi tập trung

**MediChain** là Ứng dụng phi tập trung (DApp) quản lý bảo hiểm y tế tham số, được phát triển nhằm tự động hóa quy trình bồi thường, tăng cường tính minh bạch và bảo vệ quyền riêng tư của bệnh nhân thông qua công nghệ Blockchain và mã hóa. Dự án thuộc **Bài tập 04 - Đồ án môn học IS355**.

##  Thành viên nhóm

| Họ và tên | MSSV | Vai trò chính |
| :--- | :---: | :--- |
| **Trâm** | *23521615* | Phát triển Smart Contract, Màn hình Bệnh viện |
| **Phương Anh** | 22520070 | Tích hợp IPFS, Mã hóa (AES/RSA), Màn hình Công ty Bảo hiểm |
| **Lan Anh** | 23520052 | Khung ứng dụng React, Kết nối ví Web3, Màn hình Bệnh nhân |

##  Công nghệ sử dụng

- **Smart Contract:** Solidity (^0.8.20), OpenZeppelin v5 (ERC-721, AccessControl, ReentrancyGuard)
- **Môi trường & Triển khai:** Hardhat, Ethereum Sepolia Testnet.
- **Frontend (Web3):** ReactJS, Vite, Ethers.js v6, MetaMask.
- **Lưu trữ phi tập trung:** IPFS (Pinata).
- **Bảo mật & Mã hóa:** WebCrypto API (AES-256-GCM, RSA-OAEP 2048) áp dụng mô hình mã hóa phong bì (Envelope Encryption).

##  Các tính năng chi tiết theo vai trò

### 1. Bệnh nhân (Patient)
- **Khám phá & Mua bảo hiểm:** Xem danh sách các gói bảo hiểm (hạn mức, thời hạn, điều khoản PDF) và thanh toán phí bằng ETH.
- **Ví NFT Thẻ bảo hiểm:** Quản lý thẻ bảo hiểm dưới dạng NFT Soulbound (không thể chuyển nhượng), theo dõi số dư hạn mức bồi thường còn lại theo thời gian thực.
- **Quản lý Khóa bảo mật:** Khởi tạo và lưu trữ cặp khóa RSA-OAEP để mã hóa dữ liệu cá nhân (Mã số bảo hiểm) ngay trên trình duyệt.
- **Yêu cầu bồi thường (Claim):** Tự gửi yêu cầu bồi thường, tải hóa đơn và bệnh án lên IPFS.
- **Theo dõi hồ sơ:** Xem tiến độ xử lý (Chờ xử lý / Đã duyệt / Từ chối), tự giải mã hồ sơ bệnh án cá nhân, và nhận tiền bồi thường trực tiếp về ví.

### 2. Bệnh viện (Hospital)
- **Xác thực quyền hạn (RBAC):** Truy cập hệ thống thông qua danh sách ủy quyền (HOSPITAL_ROLE) được cấp bởi Công ty bảo hiểm.
- **Kiểm tra thẻ bảo hiểm (Verification):** Quét ví bệnh nhân để xác minh thẻ NFT còn hiệu lực và trích xuất thông tin hạn mức chi trả tối đa.
- **Bảo mật dữ liệu Y tế (Envelope Encryption):** Nhập chi phí điều trị, mã hóa bệnh án nhạy cảm bằng AES-256-GCM. Sau đó, bọc khóa AES bằng RSA cho 3 đối tượng (Bệnh nhân, Bệnh viện, Công ty bảo hiểm) trước khi đẩy lên IPFS nhằm bảo vệ quyền riêng tư tuyệt đối.
- **Xác nhận chi phí (Confirm Claim):** Đóng vai trò Oracle xác nhận số tiền điều trị thực tế làm cơ sở minh bạch để hệ thống tiến hành chi trả.

### 3. Công ty bảo hiểm (Insurer / Admin)
- **Quản trị Gói bảo hiểm:** Tạo mới gói bảo hiểm, thiết lập giá phí, thời hạn, hạn mức chi trả và tải file PDF điều khoản hợp đồng lên mạng lưới IPFS.
- **Quản lý Quỹ bồi thường:** Nạp tiền vào quỹ chung (Pool) để Smart Contract tự động trích xuất và xử lý chi trả.
- **Thẩm định hồ sơ (Retrieve & Decrypt):** Lấy mã CID từ Blockchain, tải hồ sơ gốc từ IPFS và giải mã bằng khóa riêng RSA để xem xét bằng chứng y tế.
- **Duyệt bồi thường tự động (Parametric Insurance):** Kích hoạt hệ thống duyệt bồi thường. Smart Contract sẽ tự động đối chiếu các ràng buộc (thẻ còn hạn, số tiền không vượt quá hạn mức, đã được bệnh viện xác nhận, quỹ đủ tiền). Nếu hợp lệ, ETH sẽ được chuyển thẳng cho bệnh nhân mà không cần thao tác chuyển khoản thủ công.
- **Bảng điều khiển Giám sát (Dashboard):** Quản lý toàn bộ sự kiện On-chain, thống kê tổng doanh thu phí, tổng chi phí bồi thường và giám sát số dư quỹ.

##  Hướng dẫn cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js: v24.11.0 (môi trường đã kiểm thử).
- npm: 11.6.1 (môi trường đã kiểm thử).
- Frontend sử dụng Vite 7.3.7.
- Tiện ích mở rộng ví MetaMask trên trình duyệt.
- Mạng Sepolia Testnet và Sepolia ETH nếu chạy với hợp đồng thật.

### Các bước cài đặt
1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/TramNguyen2412/IS355.R11_BlockChain.git MediChain
   cd MediChain

### Chạy frontend bằng dữ liệu giả lập (Mock)

Chế độ mock dùng dữ liệu trong bộ nhớ để phát triển và kiểm thử frontend mà không cần kết nối smart contract thật.

#### 1. Yêu cầu

- Node.js phiên bản LTS từ 18 trở lên.
- npm đi kèm Node.js.

#### 2. Cài đặt frontend

Từ thư mục gốc của repository:

```powershell
cd frontend
npm.cmd install
```

#### 3. Bật chế độ mock

Tạo file `frontend/.env.local` với nội dung:

```dotenv
VITE_USE_MOCK=true
```

Nếu đang ở thư mục `frontend`, chỉ cần tạo `.env.local` ngay tại đó. Không commit các file chứa khóa bí mật hoặc thông tin nhạy cảm.

#### 4. Chạy ứng dụng

Tại thư mục `frontend`:

```powershell
npm.cmd run dev
```

Mở địa chỉ local do Vite hiển thị trong terminal.

#### 5. Kiểm tra điều hướng theo vai trò

Chọn từng ví mẫu trên giao diện và kiểm tra kết quả:

| Ví mẫu | Route mong đợi |
|---|---|
| HOSPITAL | `/hospital` |
| ADMIN | `/insurer` |
| PATIENT | `/patient` |
| OUTSIDER | `/patient` |

#### 6. Kiểm tra build

Tại thư mục `frontend`:

```powershell
npm.cmd run build
```

Build thành công khi Vite kết thúc mà không có lỗi. Cảnh báo kích thước bundle không đồng nghĩa với build thất bại.

#### Lưu ý

- Dữ liệu mock chỉ tồn tại trong bộ nhớ; thay đổi có thể mất khi tải lại ứng dụng.
- Mock không đại diện cho giao dịch blockchain thật.
- Khi `VITE_USE_MOCK=false`, các hàm contract chưa triển khai sẽ báo lỗi `Chưa cài đặt`
