# CHƯƠNG 5. KIỂM THỬ VÀ ĐÁNH GIÁ (PHẦN THÀNH VIÊN A)

---

## 5.3. Đánh giá an toàn và bảo mật Smart Contract

Bảo mật là tiêu chí sống còn đối với các hệ thống hợp đồng thông minh trên nền tảng blockchain, đặc biệt trong lĩnh vực tài chính phi tập trung (DeFi) và quản lý bảo hiểm y tế. Do tính chất bất biến của blockchain, mã lệnh sau khi triển khai không thể chỉnh sửa; bất kỳ lỗ hổng bảo mật nào cũng có thể dẫn đến việc thất thoát toàn bộ ngân quỹ hoặc rò rỉ dữ liệu y tế nhạy cảm. 

Hợp đồng `HealthInsuranceNFT` được thiết kế theo nguyên lý **phòng thủ đa lớp (Defense-in-Depth)** và đã trải qua quá trình đánh giá an ninh nghiêm ngặt trước các vector tấn công phổ biến.

---

### 5.3.1. Phân tích các mối đe dọa và giải pháp kỹ thuật

#### 1. Phòng chống tấn công tái nhập (Reentrancy Attack)
- **Bản chất tấn công:** Kẻ tấn công lợi dụng việc hợp đồng gọi chuyển tiền (`call.value`) đến một địa chỉ ví bên ngoài để thực thi mã độc trong hàm nhận tiền dự phòng (`receive` hoặc `fallback`), từ đó gọi đệ quy ngược lại hàm rút tiền trước khi số dư của họ bị trừ.
- **Biện pháp phòng vệ trong MediChain:**
  - Áp dụng nguyên mẫu thiết kế **Checks-Effects-Interactions (CEI)**: Toàn bộ việc cập nhật trạng thái (`c.status = ClaimStatus.APPROVED`, tăng hạn mức sử dụng `p.usedAmount += amt`, lưu nhãn thời gian `resolvedAt`) đều hoàn thành 100% trước khi câu lệnh chuyển tiền `c.patient.call{value: amt}("")` được thực thi.
  - Sử dụng modifier `nonReentrant` kế thừa từ `ReentrancyGuard` của OpenZeppelin v5. Khóa mutex nội bộ sẽ chặn đứng bất kỳ lời gọi hàm lồng nhau nào trong cùng một phiên giao dịch.
  - **Kiểm thử thực tế (Ca T31):** Một hợp đồng tấn công giả lập (`ReentrantAttacker.sol`) đã được xây dựng để cố ý kích hoạt đệ quy hàm `approveClaim`. Kết quả kiểm thử chứng minh kẻ tấn công chỉ nhận tiền bồi thường đúng một lần duy nhất, toàn bộ các lời gọi đệ quy sau đó đều bị chặn hoàn toàn (`reentryBlocked == true`).

#### 2. Phòng chống lỗi tràn số và dưới tràn số (Integer Overflow / Underflow)
- **Bản chất rủi ro:** Trước phiên bản Solidity 0.8.0, các phép toán cộng trừ số nguyên có thể bị quay vòng (wrap around), ví dụ `uint256(0) - 1` sẽ trở thành giá trị cực đại $2^{256} - 1$, dẫn đến việc kẻ tấn công có thể sở hữu số dư vô hạn.
- **Biện pháp phòng vệ trong MediChain:**
  - Hợp đồng sử dụng trình biên dịch **Solidity `^0.8.20`** (cụ thể là `0.8.28`). Từ phiên bản 0.8.0 trở đi, EVM tích hợp sẵn cơ chế kiểm tra tràn số học ở mức mã máy (Opcode-level overflow check). Bất kỳ phép tính số học nào vượt quá giới hạn biểu diễn của kiểu dữ liệu đều tự động kích hoạt `Panic(0x11)` và hoàn tác giao dịch ngay lập tức mà không cần phụ thuộc vào thư viện `SafeMath` bên ngoài.

#### 3. Kiểm soát phân quyền truy cập nghiêm ngặt (Role-Based Access Control - RBAC)
- **Bản chất rủi ro:** Kẻ tấn công lợi dụng các hàm quan trọng không được kiểm tra quyền hạn chặt chẽ (thiếu modifier) để tự cấp quyền, tạo gói bảo hiểm giả hoặc xác nhận khống chi phí viện phí.
- **Biện pháp phòng vệ trong MediChain:**
  - Kế thừa module chuẩn `AccessControl` của OpenZeppelin v5. 
  - Khởi tạo hai vai trò tách biệt rõ ràng: `DEFAULT_ADMIN_ROLE` (dành riêng cho Công ty bảo hiểm) và `HOSPITAL_ROLE` (dành riêng cho các cơ sở khám chữa bệnh được kiểm định).
  - Mọi hàm nhạy cảm đều được bảo vệ bởi modifier tương ứng: `onlyRole(DEFAULT_ADMIN_ROLE)` cho `createPlan`, `setPlanActive`, `authorizeHospital`, `rejectClaim`; và `onlyRole(HOSPITAL_ROLE)` cho `confirmClaim`.
  - Các ca kiểm thử T03, T06, T20, T30 chứng minh 100% các yêu cầu từ địa chỉ ví không có thẩm quyền đều bị EVM từ chối với mã lỗi phân quyền chuẩn.

#### 4. Bảo vệ tính toàn vẹn và bất khả chuyển nhượng (Soulbound Protection)
- **Bản chất rủi ro:** Thẻ bảo hiểm y tế bị người bệnh chuyển nhượng, bán lại hoặc cho người khác mượn ví để hưởng chế độ bảo hiểm trái phép.
- **Biện pháp phòng vệ trong MediChain:**
  - Ghi đè hàm hook nội bộ `_update` của chuẩn OpenZeppelin ERC-721. Toàn bộ các giao dịch chuyển token giữa hai địa chỉ ví khác địa chỉ null (`from != address(0) && to != address(0)`) đều bị hủy bỏ với thông báo lỗi `"Soulbound: khong the chuyen nhuong"`. Thẻ NFT chỉ được phép đúc mới (`mint`) và gắn vĩnh viễn với địa chỉ ví của người bệnh.

#### 5. Bảo vệ bí mật thông tin y tế (Data Privacy on Public Blockchain)
- **Bản chất rủi ro:** Blockchain là một sổ cái công khai toàn cầu. Mọi dữ liệu lưu trữ trực tiếp trên hợp đồng đều có thể bị đọc bởi bất kỳ ai.
- **Biện pháp phòng vệ trong MediChain:**
  - Tuyệt đối không lưu trữ thông tin bệnh án, chẩn đoán y khoa hay số định danh cá nhân dạng văn bản rõ (plaintext) lên on-chain.
  - Số định danh y tế cá nhân được mã hóa bất đối xứng RSA (`encryptedHealthId`) trước khi gửi lên contract.
  - Hồ sơ bệnh án chi tiết được mã hóa đối xứng AES-256-GCM kết hợp bọc khóa RSA đa bên (Envelope Encryption) và lưu trữ phân tán ngoài chuỗi trên mạng IPFS. Hợp đồng thông minh chỉ lưu trữ mã băm CID làm con trỏ tham chiếu.

---

### 5.3.2. Bảng tổng hợp đối chiếu mối đe dọa và biện pháp an ninh

#### Bảng 5.3.1: Ma trận đánh giá mối đe dọa an ninh và biện pháp phòng vệ của Smart Contract

| Vector tấn công / Rủi ro an ninh | Mức độ nghiêm trọng | Biện pháp kỹ thuật áp dụng trong Smart Contract | Kết quả kiểm thử / Minh chứng |
|---|:---:|---|---|
| **Tấn công tái nhập (Reentrancy)** | **Cực cao (Critical)** | - Mô hình Checks-Effects-Interactions (CEI)<br>- Modifier `nonReentrant` (OpenZeppelin) | Ca kiểm thử **T31** thành công, đệ quy bị chặn đứng hoàn toàn. |
| **Tràn số / Dưới tràn số toán học** | **Nghiêm trọng (High)** | - Trình biên dịch Solidity 0.8.20+ tự động kiểm tra số học và kích hoạt Panic revert. | Tự động bảo vệ ở cấp độ EVM bytecode. |
| **Leo thang đặc quyền (Privilege Escalation)** | **Nghiêm trọng (High)** | - Module chuẩn `AccessControl`<br>- Phân định `DEFAULT_ADMIN_ROLE` và `HOSPITAL_ROLE` | Ca kiểm thử **T03, T06, T20, T30** chặn 100% truy cập trái phép. |
| **Gian lận chuyển nhượng thẻ BHYT** | **Trung bình (Medium)** | - Ghi đè hàm hook `_update` chặn toàn bộ lệnh gọi `transferFrom` / `safeTransferFrom`. | Ca kiểm thử **T12** hoàn tác với thông điệp Soulbound. |
| **Rút tiền bảo hiểm trùng lặp (Double Spending)** | **Cực cao (Critical)** | - Ràng buộc chuyển trạng thái `status == PENDING`<br>- Đổi trạng thái sang `APPROVED` trước khi chuyển tiền. | Ca kiểm thử **T26** hoàn tác với lỗi `"Claim da xu ly"`. |
| **Rút cạn ngân quỹ vượt hạn mức** | **Nghiêm trọng (High)** | - Ràng buộc toán học chặt chẽ: `p.usedAmount + amt <= p.coverageLimit`. | Ca kiểm thử **T19, T27** chặn thành công việc chi trả vượt mức. |
| **Lộ lọt dữ liệu y tế cá nhân** | **Nghiêm trọng (High)** | - Kiến trúc lưu trữ lai On-chain / Off-chain<br>- Mã hóa phong bì AES-256-GCM + RSA-OAEP 2048. | Toàn bộ dữ liệu nhạy cảm trên chain đều là bản mã (Ciphertext). |
