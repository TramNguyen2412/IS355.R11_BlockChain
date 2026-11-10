# BẢNG ĐO LƯỜNG TIÊU THỤ GAS (GAS CONSUMPTION REPORT)
- Hợp đồng: `HealthInsuranceNFT.sol`
- Trình biên dịch: Solidity `0.8.28`, EVM version `cancun`, Optimizer enabled (`runs: 200`)
- Công cụ đo: `hardhat-gas-reporter` (kết quả thực nghiệm qua 34 ca kiểm thử)
- Giới hạn khối (Block limit): 60,000,000 gas

---

## 1. Khởi tạo & Triển khai (Deployments)

| Hợp đồng | Gas triển khai (Deployment Gas) | Tỷ lệ giới hạn khối (% of Block Limit) | Nhận xét |
|---|---|---|---|
| `HealthInsuranceNFT` | **3,176,363** | 5.3% | Khởi tạo ERC-721 ("Health Insurance Card", "HIC"), AccessControl và cấu hình vai trò `DEFAULT_ADMIN_ROLE`. Kích thước bytecode tối ưu, chỉ chiếm 5.3% giới hạn khối. |
| `ReentrancyAttacker` (mock test) | 380,473 | 0.6% | Hợp đồng mô phỏng tấn công phục vụ kiểm thử ca T31. |

---

## 2. Các hàm nghiệp vụ (Methods)

| Phương thức (Method) | Gas tối thiểu (Min) | Gas tối đa (Max) | Gas trung bình (Avg) | Số lần gọi (# calls) | Nhận xét kỹ thuật |
|---|---|---|---|---|---|
| `purchasePolicy` | 263,770 | 312,998 | **304,771** | 6 | Tiêu thụ gas cao nhất do thực hiện mint NFT ERC-721 (`_safeMint`), khởi tạo struct `Policy` trong storage và ghi nhận mapping người sở hữu. |
| `submitClaim` | 229,550 | 328,291 | **281,444** | 9 | Khởi tạo struct `Claim` mới trong storage, lưu trữ IPFS CIDs (`billCID`, `recordCID`), cập nhật mảng claim của bệnh nhân và phát event. |
| `createPlan` | 191,613 | 208,677 | **202,989** | 9 | Khởi tạo và lưu thông tin gói bảo hiểm `Plan` (chuỗi tên, giá, hạn mức, thời hạn, CID điều khoản) vào storage. |
| `approveClaim` | - | - | **117,178** | 4 | Kiểm tra điều kiện (Checks), cập nhật trạng thái `APPROVED`, tăng `usedAmount` (Effects) và chuyển tiền ETH qua lệnh `call{value}` (Interactions) kèm ReentrancyGuard. |
| `confirmClaim` | 98,911 | 98,923 | **98,913** | 7 | Cập nhật viện phí xác nhận `confirmedAmount`, gán địa chỉ bệnh viện xác nhận và phát event `ClaimConfirmed`. |
| `rejectClaim` | - | - | **73,531** | 2 | Cập nhật trạng thái `REJECTED`, ghi nhận thời điểm xử lý và phát event `ClaimRejected`. |
| `authorizeHospital` | 28,649 | 50,634 | **47,493** | 7 | Cấp quyền hoặc thu hồi vai trò `HOSPITAL_ROLE` trong AccessControl (ghi đè slot storage phân quyền). |
| `registerEncryptionKey` | - | - | **46,076** | 2 | Lưu chuỗi khóa công khai RSA-OAEP 2048-bit (PEM) vào storage `encryptionKeyOf`. |
| `setPlanActive` | - | - | **28,003** | 2 | Cập nhật cờ boolean trạng thái hoạt động của gói bảo hiểm trong storage. |
| `fundPool` | - | - | **22,686** | 6 | Hàm `payable` nhận ETH vào quỹ hợp đồng, chỉ tốn gas tối thiểu cho việc nhận tiền và phát event `PoolFunded`. |

---

## 3. Đánh giá hiệu quả kinh tế & Tối ưu hóa
- **Hàm tốn gas nhất:** `purchasePolicy` (~305k gas) và `submitClaim` (~281k gas). Đây là mức tiêu thụ hoàn toàn hợp lý đối với hệ sinh thái Ethereum cho các thao tác ghi nhận NFT Soulbound và lưu trữ dữ liệu phức tạp.
- **Hàm chi trả:** `approveClaim` (~117k gas) được tối ưu hóa tốt theo mô hình Checks-Effects-Interactions, vừa đảm bảo an toàn reentrancy vừa giảm thiểu chi phí giao dịch cho công ty bảo hiểm.
