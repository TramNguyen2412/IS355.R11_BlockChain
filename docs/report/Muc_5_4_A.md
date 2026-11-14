# CHƯƠNG 5. KIỂM THỬ VÀ ĐÁNH GIÁ (PHẦN THÀNH VIÊN A)

---

## 5.4. Phân tích chi phí Gas và hiệu quả kinh tế của Smart Contract

Trong mạng lưới Ethereum, chi phí Gas đóng vai trò quyết định đến tính khả thi về mặt kinh tế và trải nghiệm của người dùng cuối. Một hợp đồng thông minh được thiết kế tối ưu không chỉ đảm bảo tính bảo mật mà còn phải giảm thiểu tối đa lượng gas tiêu thụ trong các thao tác lưu trữ (`SSTORE`) và tính toán trên máy ảo EVM.

---

### 5.4.1. Môi trường và công cụ đo lường thực nghiệm

Toàn bộ số liệu tiêu thụ gas trong phần này được trích xuất từ báo cáo thực nghiệm thông qua plugin chính thức `hardhat-gas-reporter` khi chạy toàn diện bộ 34 ca kiểm thử đơn vị.

- **Phiên bản trình biên dịch:** Solidity `0.8.28`.
- **Cấu hình tối ưu hóa:** Bật trình tối ưu hóa (Optimizer Enabled) với tham số `runs: 200`. Việc thiết lập 200 runs cân bằng hoàn hảo giữa kích thước mã bytecode khi triển khai và lượng gas tiêu thụ khi thực thi các hàm nghiệp vụ lặp đi lặp lại.
- **Phiên bản EVM:** `cancun` (tận dụng các opcode tối ưu mới nhất của mạng Ethereum).
- **Giới hạn khối mạng Sepolia:** 60.000.000 gas.

---

### 5.4.2. Chi phí Gas khởi tạo và Triển khai (Deployment Gas)

Quá trình triển khai hợp đồng `HealthInsuranceNFT` bao gồm việc khởi tạo chuẩn ERC-721 với tên đầy đủ `"Health Insurance Card"`, ký hiệu `"HIC"`, thiết lập hệ thống phân quyền `AccessControl`, cấp quyền quản trị tối cao `DEFAULT_ADMIN_ROLE` cho địa chỉ người tạo và khởi tạo khóa chống tấn công đệ quy `ReentrancyGuard`.

#### Bảng 5.4.1: Chi phí Gas triển khai Smart Contract

| Hợp đồng thông minh | Lượng Gas triển khai (Gas Used) | Tỷ lệ so với giới hạn khối (% of Block Limit) | Nhận xét kỹ thuật |
|---|:---:|:---:|---|
| **`HealthInsuranceNFT`** | **3.176.363** | **5.29%** | Kích thước bytecode tối ưu, chiếm tỷ lệ rất thấp so với giới hạn khối (60M gas), bảo đảm giao dịch triển khai luôn được đóng gói thành công ngay cả khi mạng tắc nghẽn. |
| `ReentrancyAttacker` *(Mock Test)* | 380.473 | 0.63% | Hợp đồng mô phỏng tấn công đệ quy phục vụ kiểm thử ca T31. |

---

### 5.4.3. Chi phí Gas của các hàm nghiệp vụ (Method Gas Consumption)

Dưới đây là bảng thống kê chi tiết lượng gas tiêu thụ thực tế của 10 hàm nghiệp vụ có ghi dữ liệu vào blockchain (`state-modifying functions`):

#### Bảng 5.4.2: Chi tiết mức tiêu thụ Gas của các hàm nghiệp vụ

| STT | Tên hàm nghiệp vụ (Method) | Gas tối thiểu (Min) | Gas tối đa (Max) | Gas trung bình (Avg) | Số lần gọi mẫu (# Calls) | Phân tích cơ chế tiêu thụ Gas |
|:---:|---|:---:|:---:|:---:|:---:|---|
| 1 | `purchasePolicy` | 263.770 | 312.998 | **304.771** | 6 | **Cao nhất:** Khởi tạo token ERC-721 mới (`_safeMint`), ghi nhận cấu trúc dữ liệu `Policy` đầy đủ vào bộ nhớ lưu trữ vĩnh viễn (`storage`), cập nhật mapping `activePolicyOf` và phát sự kiện `PolicyPurchased`. |
| 2 | `submitClaim` | 229.550 | 328.291 | **281.444** | 9 | Khởi tạo cấu trúc `Claim` mới trong storage, ghi nhận chuỗi CID hóa đơn và bệnh án IPFS, cập nhật mảng lịch sử `claimIdsOf` và phát sự kiện. |
| 3 | `createPlan` | 191.613 | 208.677 | **202.989** | 9 | Ghi nhận cấu trúc gói bảo hiểm mới `Plan` (tên gói, giá, hạn mức, thời hạn, CID tài liệu quy định) vào storage và phát sự kiện. |
| 4 | `approveClaim` | 117.178 | 117.178 | **117.178** | 4 | **Tối ưu cao:** Đọc kiểm tra điều kiện (Checks), cập nhật trạng thái `APPROVED`, tăng hạn mức đã dùng `usedAmount` (Effects) và chuyển tiền ETH cho bệnh nhân qua lệnh `call{value}` (Interactions). |
| 5 | `confirmClaim` | 98.911 | 98.923 | **98.913** | 7 | Ghi nhận số tiền viện phí xác nhận `confirmedAmount`, cập nhật địa chỉ bệnh viện, đổi cờ `hospitalConfirmed` và phát sự kiện. |
| 6 | `rejectClaim` | 73.531 | 73.531 | **73.531** | 2 | Cập nhật trạng thái `ClaimStatus.REJECTED`, ghi nhận thời điểm hoàn thành và phát sự kiện `ClaimRejected`. |
| 7 | `authorizeHospital` | 28.649 | 50.634 | **47.493** | 7 | Cấp hoặc thu hồi vai trò `HOSPITAL_ROLE` trong bảng băm phân quyền `AccessControl`. |
| 8 | `registerEncryptionKey`| 46.076 | 46.076 | **46.076** | 2 | Lưu chuỗi khóa công khai RSA-OAEP 2048-bit (chuỗi PEM base64) vào mapping `encryptionKeyOf`. |
| 9 | `setPlanActive` | 28.003 | 28.003 | **28.003** | 2 | Cập nhật cờ boolean trạng thái phát hành gói bảo hiểm trong storage. |
| 10 | `fundPool` | 22.686 | 22.686 | **22.686** | 6 | **Thấp nhất:** Hàm `payable` tiếp nhận ETH nạp vào quỹ hợp đồng, chỉ tiêu tốn gas cơ sở cho việc nhận tiền và phát sự kiện `PoolFunded`. |

---

### 5.4.4. Đánh giá tính khả thi và giải pháp tối ưu hóa

1. **Hiệu quả của kiến trúc lưu trữ lai (Hybrid Storage):**
   Nếu toàn bộ tập tin hóa đơn viện phí (ảnh/PDF) và nội dung hồ sơ bệnh án chi tiết được lưu trực tiếp lên bộ nhớ lưu trữ `storage` của smart contract, chi phí gas cho mỗi thao tác gửi yêu cầu bồi thường có thể lên tới hàng chục triệu gas (vượt quá giới hạn của một khối Ethereum). Bằng cách kết hợp mạng lưu trữ phi tập trung IPFS, hợp đồng thông minh chỉ lưu trữ mã băm định danh nội dung (IPFS CID dài 46–59 ký tự). Giải pháp này giúp cắt giảm hơn **98% chi phí gas**, đưa chi phí nộp hồ sơ bồi thường xuống mức trung bình chỉ **281.444 gas**.

2. **Chi phí kinh tế thực tế theo thời giá:**
   Với mức phí gas trung bình trên mạng Ethereum là 15 Gwei ($1 \text{ Gwei} = 10^{-9} \text{ ETH}$):
   - Thao tác mua bảo hiểm `purchasePolicy`: Tiêu tốn $304.771 \times 15 \times 10^{-9} \approx 0.0045 \text{ ETH}$.
   - Thao tác nộp hồ sơ bồi thường `submitClaim`: Tiêu tốn $281.444 \times 15 \times 10^{-9} \approx 0.0042 \text{ ETH}$.
   - Thao tác phê duyệt tự động `approveClaim`: Tiêu tốn $117.178 \times 15 \times 10^{-9} \approx 0.0017 \text{ ETH}$.
   
   Trên mạng thử nghiệm Sepolia, toàn bộ chi phí gas này được chi trả bằng SepoliaETH miễn phí từ các vòi phát (faucets), đảm bảo môi trường thử nghiệm vận hành trơn tru và hoàn toàn khả thi khi chuyển giao sang các giải pháp mở rộng Layer 2 (như Arbitrum, Optimism hoặc Base) trong tương lai.
