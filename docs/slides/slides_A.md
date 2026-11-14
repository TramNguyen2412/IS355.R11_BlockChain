# DÀN Ý SLIDE THUYẾT TRÌNH ĐỒ ÁN IS355 (PHẦN THÀNH VIÊN A - TRÂM)

> **Ghi chú chuẩn bị Slide theo Rubric:**
> - **Cỡ chữ hiển thị:** Tiêu đề slide $\ge 28\text{pt}$, nội dung văn bản $\ge 20\text{pt}$ (đáp ứng tiêu chuẩn Rubric $> 18\text{pt}$).
> - **Màu sắc & Trình bày:** Tương phản cao (nền trắng/sáng, chữ đen/xanh đậm), mỗi slide từ 4–6 ý chính (bullet points), không nhồi chữ, kết hợp hình ảnh minh chứng thực tế.

---

### SLIDE 1: TỔNG QUAN KIẾN TRÚC SMART CONTRACT TRONG MEDICHAIN

#### Tiêu đề: Vai trò của Smart Contract trong Hệ thống MediChain
- **Vấn đề cốt lõi:** BHYT truyền thống chậm trễ trong giám định, thiếu minh bạch và tốn kém chi phí hành chính.
- **Giải pháp MediChain:** Smart contract đóng vai trò là **"Trọng tài số khách quan"** thực thi mô hình bảo hiểm tham số (Parametric Insurance).
- **Cơ chế vận hành:**
  - Tự động hóa 100% quy trình thu phí, đúc thẻ và giải ngân bồi thường.
  - Loại bỏ hoàn toàn sự can thiệp chủ quan hoặc từ chối chi trả tùy tiện.
  - Kết hợp lưu trữ lai (Hybrid Storage): Trạng thái trên chuỗi (On-chain) và Dữ liệu lớn trên IPFS (Off-chain).
- **Công nghệ nền tảng:** Solidity `^0.8.20`, OpenZeppelin Contracts v5, Hardhat framework.

---

### SLIDE 2: THIẾT KẾ HỢP ĐỒNG `HealthInsuranceNFT` & THẺ SOULBOUND TOKEN

#### Tiêu đề: Kiến trúc Kế thừa và Thẻ định danh Soulbound Token
- **Kế thừa 3 trụ cột bảo mật OpenZeppelin v5:**
  - `ERC721`: Quản trị thẻ bảo hiểm số dưới dạng NFT độc bản.
  - `AccessControl`: Phân quyền dựa trên vai trò (`DEFAULT_ADMIN_ROLE` và `HOSPITAL_ROLE`).
  - `ReentrancyGuard`: Khóa bảo vệ giao dịch tài chính chống tấn công tái nhập.
- **Đột phá với Soulbound Token (SBT):**
  - Thẻ BHYT gắn liền với danh tính cá nhân người bệnh, **không thể chuyển nhượng hoặc mua bán lại**.
  - **Kỹ thuật hiện thực:** Ghi đè (override) hàm hook nội bộ `_update`:
    - Cho phép đúc mới: `from == address(0)` $\rightarrow$ Chấp thuận.
    - Chặn giao dịch chuyển nhượng: `from != 0 && to != 0` $\rightarrow$ `revert("Soulbound: khong the chuyen nhuong")`.

---

### SLIDE 3: KỸ THUẬT HIỆN THỰC CÁC RÀNG BUỘC LOGIC CỐT LÕI

#### Tiêu đề: Đáp ứng Nghiêm ngặt Tiêu chí 1 của Rubric
- **Ràng buộc logic 1: Phân quyền Bệnh viện xác nhận chi phí (`confirmClaim`)**
  - Chỉ cơ sở y tế có quyền `HOSPITAL_ROLE` mới được phép xác thực viện phí.
  - Ràng buộc an toàn: `confirmedAmount <= c.amount` (ngăn chặn kê khống chi phí).
  - Ngăn ngừa bệnh nhân hoặc kẻ xấu tự ý phê duyệt hồ sơ rút tiền bảo hiểm.
- **Ràng buộc logic 2: Kiểm soát hạn mức và Tự động chi trả (`approveClaim`)**
  - Tự động thẩm định 5 điều kiện: Hồ sơ chờ $\rightarrow$ Đã xác nhận viện phí $\rightarrow$ Còn hạn dùng $\rightarrow$ Trong hạn mức $\rightarrow$ Quỹ đủ thanh khoản.
  - **Mô hình bảo mật Checks-Effects-Interactions (CEI):**
    - *Checks:* Kiểm tra toàn bộ điều kiện tham số.
    - *Effects:* Cập nhật trạng thái `APPROVED` và tăng `usedAmount` vào storage trước.
    - *Interactions:* Chuyển tiền ETH cho người bệnh qua lệnh `call{value}` an toàn.

---

### SLIDE 4: KẾT QUẢ KIỂM THỬ ĐƠN VỊ VÀ TỐI ƯU HÓA GAS

#### Tiêu đề: Kiểm thử Toàn diện & Đo lường Chi phí Gas
- **Kết quả Unit Test (Mocha + Chai + Ethers v6):**
  - **34/34 ca kiểm thử đạt (100% Passing)** chỉ trong 2.8 giây.
  - Bao phủ 100% các hàm nghiệp vụ, điều kiện biên và phân quyền RBAC.
  - **Phòng chống Reentrancy:** Ca kiểm thử T31 chứng minh hợp đồng tấn công độc hại bị chặn hoàn toàn khi cố ý gọi đệ quy.
- **Đo lường chi phí Gas (`hardhat-gas-reporter`):**
  - Gas triển khai hợp đồng: `3,176,363 gas` (chỉ chiếm 5.29% giới hạn khối).
  - Hàm mua bảo hiểm `purchasePolicy`: `~304k gas` (mint NFT + ghi storage).
  - Hàm chi trả tự động `approveClaim`: `~117k gas` (tối ưu hóa theo chuẩn CEI).
  - Tiết kiệm **>98% chi phí gas** nhờ đưa dữ liệu bệnh án và hóa đơn lên IPFS.

---

### SLIDE 5: TRIỂN KHAI THỰC TẾ TRÊN ETHEREUM SEPOLIA TESTNET

#### Tiêu đề: Minh chứng On-chain & Xác thực Mã nguồn trên Etherscan
- **Thông số mạng thử nghiệm Sepolia (Chain ID: 11155111):**
  - **Địa chỉ Contract:** `0x9B5868254c31818320d2DDCBb5B28f15af265b62`
  - **Khối triển khai:** Block số `12103715`
  - **Số dư Quỹ bảo hiểm ban đầu:** `0.03 ETH`
- **Xác thực mã nguồn Etherscan (Source Code Verified):**
  - Đạt dấu tích xanh chính thức trên Sepolia Etherscan.
  - Trình biên dịch: Solidity `v0.8.28`, Optimizer kích hoạt 200 runs.
  - Công khai các tab **Read Contract** và **Write Contract**, cho phép hội đồng chấm thi và người dùng độc lập tương tác trực tiếp.

---

### SLIDE 6: PHÂN HỆ GIAO DIỆN BỆNH VIỆN (`/hospital`)

#### Tiêu đề: Giao diện Tương tác Web3 cho Cơ sở Y tế
- **Thiết kế theo chuẩn Modern CSS3:** Nền sáng, độ tương phản cao, cỡ chữ $\ge 16\text{pt}$, thân thiện với nhân viên y tế.
- **4 khối nghiệp vụ tích hợp trực tiếp với MetaMask:**
  1. *Quản lý khóa y tế:* Sinh cặp khóa RSA-OAEP 2048, đăng ký Public Key on-chain.
  2. *Tra cứu thẻ bảo hiểm:* Gọi `verifyInsurance` kiểm tra hiệu lực thẻ tức thì.
  3. *Lập hồ sơ bồi thường:* Tải hóa đơn viện phí lên IPFS, mã hóa phong bì bệnh án (AES-256-GCM + RSA) và gọi `submitClaim`.
  4. *Đối soát viện phí:* Xem danh sách bệnh nhân tự nộp và ký giao dịch `confirmClaim`.
- **Minh chứng thực tế:** Giao diện đã kết nối và giao dịch trực tiếp với mạng Sepolia.
