
# E2E CHECKLIST — MEDICHAIN
**Task:** C-09  
**Phụ trách:** Thành viên C (Lan Anh)  
**Mục đích:** Hướng dẫn từng thành viên tự kiểm tra toàn bộ luồng nghiệp vụ trên Hardhat Local tại mốc H5.

---

## 1. Thông tin môi trường kiểm thử

| Thành phần | Giá trị |
|---|---|
| Network | Hardhat Local |
| RPC | http://127.0.0.1:8545 |
| Chain ID | 31337 |
| Frontend | React + Vite |
| Chế độ | `VITE_USE_MOCK=false` |
| Contract | HealthInsuranceNFT |
| Ví kiểm thử | 4 tài khoản Hardhat mặc định |

### 1.1. Phân công ví

Sử dụng đúng 4 tài khoản mặc định của Hardhat:

| Vai trò | Tài khoản | Địa chỉ |
|---|---|---|
| Công ty bảo hiểm (Admin) | Account #0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| Bệnh viện | Account #1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` |
| Bệnh nhân | Account #2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` |
| Người ngoài | Account #3 | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` |

Lưu ý:
- Các tài khoản trên chỉ dùng cho Hardhat Local.
- Không sử dụng private key của tài khoản thử nghiệm trên Mainnet hoặc mạng thật.
- Không commit private key, khóa riêng RSA, JWT Pinata hoặc `.env.local`.

### 1.2. Dữ liệu kiểm thử chuẩn

| Nội dung | Giá trị |
|---|---|
| Gói bảo hiểm | Gói Cơ bản |
| Giá mua | 0.002 ETH |
| Hạn mức | 0.02 ETH |
| Thời hạn | 30 ngày |
| Quỹ ban đầu | 0.1 ETH |
| Claim hợp lệ | 0.012 ETH |
| Hạn mức còn lại | 0.008 ETH |
| Claim vượt hạn mức | 0.015 ETH |

---

## 2. Chuẩn bị môi trường

Mỗi thành viên tự thực hiện các bước sau trên máy cá nhân.

- [x] Đã checkout nhánh cá nhân và cập nhật code mới nhất từ `main`.
- [x] Đã cài đặt dependencies.
- [x] Đã có MetaMask và 4 tài khoản Hardhat thử nghiệm.
- [x] Đã cấu hình frontend sử dụng contract thật, không dùng Mock.
- [x] Đã chuẩn bị file ABI và địa chỉ contract Local.
- [x] Đã có cấu hình Pinata hợp lệ để kiểm tra upload và retrieve IPFS.
- [x] Đã chuẩn bị dữ liệu y tế giả và hóa đơn mẫu.

Cấu hình frontend:

```env
VITE_USE_MOCK=false
VITE_CHAIN_ID=31337
```

Không sử dụng CID `mock-*` trong quá trình kiểm thử contract và IPFS thật.

---

## 3. Khởi tạo hệ thống

Thực hiện đúng thứ tự quy định tại `docs/00_AI_RULES_AND_CONTRACTS.md`, mục 5.

### Bước 3.1. Khởi động Hardhat Local

**Người thực hiện:** Thành viên đang kiểm thử.

**Ví:** Các tài khoản Hardhat mặc định.

Tại thư mục `contracts-hardhat`, chạy:

```bash
npx hardhat node
```

- [x] Hardhat node khởi động thành công.
- [x] RPC hoạt động tại `http://127.0.0.1:8545/`.
- [x] Hiển thị danh sách 20 tài khoản thử nghiệm.
- [x] Network sử dụng Chain ID 31337.

Giữ terminal này hoạt động trong suốt quá trình kiểm thử.

### Bước 3.2. Deploy smart contract

**Người thực hiện:** Thành viên đang kiểm thử.

**Ví:** Account #0 — Admin.

Mở terminal mới tại `contracts-hardhat`:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

- [x] Deploy `HealthInsuranceNFT` thành công.
- [x] Có địa chỉ contract mới.
- [x] Xuất ABI và địa chỉ contract theo cấu hình của dự án.
- [x] Frontend sử dụng đúng địa chỉ contract Local.
- [x] Trường `insurer` trong `address.json` được ghi nhận đúng.

### Bước 3.3. Seed dữ liệu

**Người thực hiện:** Thành viên đang kiểm thử.

**Ví:** Admin và Hospital theo cấu hình seed.

Chạy:

```bash
npx hardhat run scripts/seed.js --network localhost
```

- [x] Tạo thành công 2 gói bảo hiểm.
- [x] Gói Cơ bản có giá 0.002 ETH, hạn mức 0.02 ETH, thời hạn 30 ngày.
- [x] Gói Nâng cao có giá 0.005 ETH, hạn mức 0.05 ETH, thời hạn 90 ngày.
- [x] Ví Bệnh viện được cấp quyền.
- [x] Quỹ bảo hiểm được nạp 0.1 ETH.
- [x] Các CID điều khoản gói được thiết lập theo cấu hình.

### Bước 3.4. Khởi động frontend

**Người thực hiện:** Thành viên đang kiểm thử.

Tại thư mục `frontend`:

```bash
npm.cmd install
npm.cmd run dev
```

- [x] Frontend khởi động thành công.
- [x] Mở được ứng dụng trên trình duyệt.
- [x] MetaMask kết nối được Hardhat Local.
- [x] Chain ID là 31337.
- [x] Ứng dụng đang sử dụng contract thật, không phải Mock.

---

## 4. Kiểm thử luồng nghiệp vụ chuẩn

### 4.1. Công ty bảo hiểm thiết lập hệ thống

**Người thực hiện:** Admin.

**Ví:** Account #0 — ADMIN.

- [x] Kết nối MetaMask bằng ví Admin.
- [x] Mở màn hình Công ty bảo hiểm.
- [x] Kiểm tra danh sách 2 gói bảo hiểm.
- [x] Kiểm tra thông tin PDF điều khoản bảo hiểm trên IPFS.
- [x] Kiểm tra danh sách bệnh viện được cấp quyền.
- [x] Kiểm tra số dư quỹ bảo hiểm.
- [x] Tạo cặp khóa RSA trên giao diện.
- [x] Đăng ký khóa công khai bằng `registerEncryptionKey`.

**Kết quả mong đợi:**
- Giao diện nhận diện đúng vai trò Admin.
- Hai gói bảo hiểm hiển thị đúng thông tin.
- Đăng ký khóa mã hóa thành công.
- Khóa riêng được lưu an toàn ở phía Admin, không đưa lên Git.

### 4.2. Bệnh nhân và Bệnh viện đăng ký khóa

**Bệnh nhân**

Người thực hiện: Bệnh nhân.

Ví: Account #2 — PATIENT.

- [x] Kết nối MetaMask bằng ví Bệnh nhân.
- [x] Mở màn hình Bệnh nhân.
- [x] Tạo cặp khóa RSA.
- [x] Đăng ký khóa công khai bằng `registerEncryptionKey`.

**Kết quả mong đợi:** Thông báo đăng ký khóa thành công.

**Bệnh viện**

Người thực hiện: Bệnh viện.

Ví: Account #1 — HOSPITAL.

- [x] Kết nối MetaMask bằng ví Bệnh viện.
- [x] Mở màn hình Bệnh viện.
- [x] Tạo cặp khóa RSA.
- [x] Đăng ký khóa công khai bằng `registerEncryptionKey`.

**Kết quả mong đợi:** Thông báo đăng ký khóa thành công.

### 4.3. Bệnh nhân mua bảo hiểm

**Người thực hiện:** Bệnh nhân.

**Ví:** Account #2 — PATIENT.

- [x] Mở danh sách gói bảo hiểm.
- [x] Chọn Gói Cơ bản.
- [x] Kiểm tra giá 0.002 ETH.
- [x] Kiểm tra hạn mức 0.02 ETH.
- [x] Kiểm tra thời hạn 30 ngày.
- [x] Nhập mã số bảo hiểm y tế giả.
- [x] Xác nhận mua bảo hiểm trên MetaMask.

**Hàm contract:** `purchasePolicy`.

**Kết quả mong đợi:**
- Giao dịch thành công.
- Mã số bảo hiểm được mã hóa bằng khóa công khai Admin.
- Bệnh nhân nhận được NFT bảo hiểm.
- Token ID là #1 nếu đây là lượt chạy mới trên contract vừa deploy.
- Thẻ bảo hiểm hiển thị hạn mức 0.02 ETH.
- Thẻ hiển thị thời hạn 30 ngày.

### 4.4. Bệnh viện xác minh thẻ bảo hiểm

**Người thực hiện:** Bệnh viện.

**Ví:** Account #1 — HOSPITAL.

- [x] Kết nối MetaMask bằng ví Bệnh viện.
- [x] Mở chức năng kiểm tra thẻ.
- [x] Nhập địa chỉ ví Bệnh nhân.
- [x] Thực hiện xác minh bằng `verifyInsurance`.

**Kết quả mong đợi:**
- Thẻ bảo hiểm được xác minh hợp lệ.
- Hiển thị Token ID #1.
- Hạn mức còn lại là 0.02 ETH.
- Không hiển thị thẻ hết hạn hoặc không hợp lệ.

### 4.5. Bệnh viện tạo hồ sơ và gửi yêu cầu bồi thường

**Người thực hiện:** Bệnh viện.

**Ví:** Account #1 — HOSPITAL.

- [x] Nhập thông tin khám chữa bệnh giả.
- [x] Nhập chi phí điều trị 0.012 ETH.
- [x] Chọn hóa đơn mẫu.
- [x] Chọn kết quả xét nghiệm mẫu.
- [x] Tạo hồ sơ y tế mã hóa.
- [x] Mã hóa hồ sơ cho các bên được phép truy cập: Bệnh nhân, Bệnh viện và Công ty bảo hiểm.
- [x] Upload hóa đơn lên IPFS.
- [x] Upload JSON hồ sơ đã mã hóa lên IPFS.
- [x] Ghi nhận CID do Pinata trả về.

**Hàm contract:** `submitClaim`.

- [x] Gửi yêu cầu bồi thường.
- [x] Xác nhận giao dịch trên MetaMask.

**Kết quả mong đợi:**
- Upload IPFS thành công.
- Có CID hóa đơn và CID hồ sơ.
- Hồ sơ JSON trên IPFS là bản mã, không phải dữ liệu bệnh án bản rõ.
- Giao dịch gửi claim thành công.
- Claim xuất hiện trong danh sách với trạng thái Pending.
- Số tiền yêu cầu là 0.012 ETH.

### 4.6. Bệnh viện xác nhận chi phí

**Người thực hiện:** Bệnh viện.

**Ví:** Account #1 — HOSPITAL.

- [x] Mở danh sách yêu cầu bồi thường.
- [x] Tìm claim vừa gửi.
- [x] Kiểm tra số tiền yêu cầu 0.012 ETH.
- [x] Thực hiện xác nhận chi phí bằng `confirmClaim`.
- [x] Xác nhận giao dịch trên MetaMask.

**Kết quả mong đợi:**
- Giao dịch xác nhận thành công.
- Số tiền được Bệnh viện xác nhận là 0.012 ETH.
- Claim đã được xác nhận để Công ty bảo hiểm xử lý tiếp.

### 4.7. Công ty bảo hiểm truy xuất hồ sơ và duyệt claim

**Người thực hiện:** Công ty bảo hiểm.

**Ví:** Account #0 — ADMIN.

- [x] Kết nối MetaMask bằng ví Admin.
- [x] Mở danh sách yêu cầu bồi thường.
- [x] Tìm claim vừa được Bệnh viện xác nhận.
- [x] Kiểm tra địa chỉ Bệnh nhân.
- [x] Kiểm tra số tiền 0.012 ETH.
- [x] Chọn chức năng xem hồ sơ IPFS.
- [x] Truy xuất hóa đơn từ IPFS.
- [x] Truy xuất JSON hồ sơ mã hóa từ IPFS.
- [x] Giải mã hồ sơ bằng khóa riêng Admin.
- [x] Kiểm tra thông tin bệnh nhân, chẩn đoán, điều trị và hóa đơn.

**Kết quả mong đợi:**
- Admin truy xuất được hồ sơ từ IPFS.
- Giải mã thành công dữ liệu được cấp quyền.
- Nội dung hồ sơ khớp dữ liệu đã gửi.
- Không làm lộ khóa riêng RSA.

Tiếp tục duyệt yêu cầu:

- [x] Chọn chức năng Duyệt và chi trả.
- [x] Thực hiện `approveClaim`.
- [x] Xác nhận giao dịch trên MetaMask.

**Kết quả mong đợi:**
- Giao dịch thành công.
- Claim chuyển sang trạng thái Approved.
- Bệnh nhân nhận được khoản chi trả 0.012 ETH.
- Số liệu thống kê và số dư quỹ được cập nhật.

### 4.8. Bệnh nhân kiểm tra kết quả

**Người thực hiện:** Bệnh nhân.

**Ví:** Account #2 — PATIENT.

- [x] Kết nối MetaMask bằng ví Bệnh nhân.
- [x] Mở lịch sử yêu cầu bồi thường.
- [x] Tìm claim vừa được duyệt.
- [x] Kiểm tra trạng thái Approved.
- [x] Kiểm tra số tiền đã được duyệt.
- [x] Kiểm tra hạn mức bảo hiểm còn lại.

**Kết quả mong đợi:**

| Nội dung | Giá trị |
|---|---:|
| Hạn mức ban đầu | 0.02 ETH |
| Số tiền đã duyệt | 0.012 ETH |
| Hạn mức còn lại | 0.008 ETH |
| Trạng thái claim | Approved |

Số dư ví Bệnh nhân tăng tương ứng khoản chi trả, không tính phí gas.

---

## 5. Kiểm tra ràng buộc bổ sung

### 5.1. Kiểm tra vượt hạn mức

**Người thực hiện:** Công ty bảo hiểm.

**Ví:** Account #0 — ADMIN.

- [x] Tạo tình huống kiểm tra claim có số tiền 0.015 ETH khi hạn mức còn lại chỉ 0.008 ETH.
- [x] Thực hiện kiểm tra trước giao dịch bằng chức năng dryRun nếu được hỗ trợ.
- [x] Kiểm tra thông báo lỗi.

**Kết quả mong đợi:**
- Giao dịch duyệt bị chặn.
- Hiển thị lỗi `Vuot qua han muc bao hiem`.
- Không phát sinh giao dịch thất bại không cần thiết trên blockchain.

### 5.2. Kiểm tra quyền truy cập hồ sơ

**Người thực hiện:** Người kiểm thử.

**Ví:** Account #3 — OUTSIDER.

- [x] Kết nối MetaMask bằng ví OUTSIDER.
- [x] Thử truy cập hồ sơ mã hóa không được cấp quyền.

**Kết quả mong đợi:**
- Người ngoài không có khóa giải mã phù hợp.
- Không thể giải mã nội dung hồ sơ.
- Không làm lộ dữ liệu y tế bản rõ.

---

## 6. Bảng tổng hợp kết quả kiểm thử H5

Mỗi thành viên tự ghi nhận kết quả sau khi chạy checklist trên máy cá nhân.

| Thành viên | Ngày kiểm thử | Môi trường | Kết quả |
|---|---|---|---|
| Trâm (A) | 17/11/2026 | Local / 31337 & Sepolia / 11155111 | Đạt (100% Pass) |
| Phương Anh (B) |  | Local / 31337 | Chưa xác nhận |
| Lan Anh (C) | 12/11/2026 | Local / 31337 & Sepolia / 11155111 | Đạt (Pass) |

### Ghi nhận lỗi

Khi gặp lỗi, ghi lại:

- Bước kiểm thử xảy ra lỗi.
- Vai trò và ví đang sử dụng.
- Nội dung thông báo lỗi.
- Transaction hash nếu có.
- Người phụ trách file hoặc chức năng gặp lỗi.

Không tự sửa file thuộc phạm vi của thành viên khác.

Không ghi private key, khóa riêng RSA, JWT Pinata hoặc dữ liệu y tế bản rõ vào file tiến độ.

---

## 7. Điều kiện hoàn thành H5

- [x] Deploy contract Local thành công.
- [x] Seed dữ liệu thành công.
- [x] Admin đăng ký khóa mã hóa thành công.
- [x] Bệnh nhân đăng ký khóa mã hóa thành công.
- [x] Bệnh viện đăng ký khóa mã hóa thành công.
- [x] Bệnh nhân mua được Gói Cơ bản và nhận NFT.
- [x] Bệnh viện xác minh được thẻ bảo hiểm.
- [x] Bệnh viện gửi claim và upload dữ liệu lên IPFS thành công.
- [x] Bệnh viện xác nhận chi phí.
- [x] Admin truy xuất và giải mã được hồ sơ.
- [x] Admin duyệt claim và chi trả thành công.
- [x] Bệnh nhân kiểm tra được trạng thái Approved.
- [x] Mỗi thành viên tự chạy toàn bộ luồng trên Local và báo kết quả trong chat nhóm.

**Lưu ý:** Chỉ xác nhận hoàn thành H5 khi cả ba thành viên đã tự chạy trọn luồng chuẩn trên Hardhat Local. Không lấy kết quả test unit hoặc kết quả chạy trên Mock để thay thế kiểm thử E2E.