# MỤC 4.2 — RÀNG BUỘC LOGIC VÀ BẢO MẬT SMART CONTRACT
- Tài liệu phục vụ thuyết minh báo cáo đồ án IS355 (MediChain)
- Hợp đồng: `HealthInsuranceNFT.sol`

---

## 1. Ràng buộc logic 1: Phân quyền xác nhận chi phí viện phí (Role-Based Access Control)

### (a) Phát biểu luật
Chỉ những địa chỉ ví được công ty bảo hiểm cấp vai trò `HOSPITAL_ROLE` mới có quyền thực hiện xác nhận chi phí khám chữa bệnh thực tế (`confirmClaim`) cho yêu cầu bồi thường của bệnh nhân.

### (b) Đoạn mã nguồn thực tế (Trích nguyên văn từ `contracts/HealthInsuranceNFT.sol`, dòng 201–212)
```solidity
201:     /// RANG BUOC 1: chi vi co HOSPITAL_ROLE moi xac nhan duoc chi phi
202:     function confirmClaim(uint256 claimId, uint256 confirmedAmount) external onlyRole(HOSPITAL_ROLE) {
203:         require(claimId != 0 && claimId <= totalClaims, "Khong tim thay yeu cau boi thuong");
204:         Claim storage c = claims[claimId];
205:         require(c.status == ClaimStatus.PENDING, "Claim da xu ly");
206:         require(confirmedAmount > 0, "So tien khong hop le");
207:         require(confirmedAmount <= c.amount, "So tien xac nhan vuot so tien yeu cau");
208:         c.hospital = msg.sender;
209:         c.hospitalConfirmed = true;
210:         c.confirmedAmount = confirmedAmount;
211:         emit ClaimConfirmed(claimId, msg.sender, confirmedAmount);
212:     }
```

### (c) Lý do thiết kế
Trong nghiệp vụ bảo hiểm y tế, bệnh nhân có thể tự gửi yêu cầu bồi thường kèm hóa đơn, nhưng công ty bảo hiểm không thể tự ý chi trả nếu cơ sở y tế điều trị chưa đối soát xác nhận tính xác thực của chi phí khám bệnh. Modifier `onlyRole(HOSPITAL_ROLE)` của OpenZeppelin v5 đảm bảo tính toàn vẹn và ngăn chặn bệnh nhân hoặc bên thứ ba giả mạo xác nhận. Đồng thời, ràng buộc dòng 207 `confirmedAmount <= c.amount` đảm bảo bệnh viện không thể xác nhận số tiền vượt quá số tiền mà bệnh nhân đã yêu cầu.

### (d) Ca kiểm thử chứng minh
- **T20:** `vi la confirmClaim bi revert (RBAC)` — Kiểm tra ví bệnh nhân hoặc ví người ngoài không có vai trò `HOSPITAL_ROLE` khi gọi `confirmClaim` sẽ bị chặn với lỗi `AccessControlUnauthorizedAccount`.
- **T21:** `benh vien confirmClaim hop le` — Kiểm tra ví bệnh viện được cấp quyền gọi `confirmClaim` thành công và phát event `ClaimConfirmed`.
- **T22:** `confirmedAmount > amount bi revert` — Kiểm tra nếu bệnh viện xác nhận số tiền lớn hơn số tiền yêu cầu sẽ bị revert `"So tien xac nhan vuot so tien yeu cau"`.

### (e) Hậu quả nếu thiếu ràng buộc
Nếu thiếu modifier `onlyRole(HOSPITAL_ROLE)`, bất kỳ ai (kể cả chính bệnh nhân) cũng có thể tự xác nhận chi phí cho hồ sơ của mình để rút tiền bồi thường từ quỹ bảo hiểm mà không qua bước giám định y khoa thực tế.

---

## 2. Ràng buộc logic 2: Kiểm soát hạn mức, thời hạn, ngân quỹ và chi trả tự động (Automated Verification & Payout)

### (a) Phát biểu luật
Hàm phê duyệt bồi thường `approveClaim` tự động thẩm định và thực thi tuần tự: kiểm tra tính hợp lệ của hợp đồng bảo hiểm (chưa hết hạn, còn đủ hạn mức, viện phí đã xác nhận, quỹ bảo hiểm đủ số dư), sau đó cập nhật hạn mức đã dùng trước khi thực hiện chuyển tiền ETH cho bệnh nhân theo mẫu thiết kế Checks-Effects-Interactions kết hợp ReentrancyGuard.

### (b) Đoạn mã nguồn thực tế (Trích nguyên văn từ `contracts/HealthInsuranceNFT.sol`, dòng 216–236)
```solidity
216:     /// RANG BUOC 2: tu kiem tra han muc, han dung, quy; Checks -> Effects -> Interactions
217:     function approveClaim(uint256 claimId) external nonReentrant {
218:         require(claimId != 0 && claimId <= totalClaims, "Khong tim thay yeu cau boi thuong");
219:         Claim storage c = claims[claimId];
220:         require(c.status == ClaimStatus.PENDING, "Claim da xu ly");
221:         require(c.hospitalConfirmed, "Benh vien chua xac nhan");
222: 
223:         uint256 amt = c.confirmedAmount;
224:         Policy storage p = policies[c.tokenId];
225:         require(block.timestamp <= p.expiryDate, "Bao hiem da het han");
226:         require(p.usedAmount + amt <= p.coverageLimit, "Vuot qua han muc bao hiem");
227:         require(address(this).balance >= amt, "Quy bao hiem khong du");
228: 
229:         c.status = ClaimStatus.APPROVED;
230:         c.resolvedAt = block.timestamp;
231:         p.usedAmount += amt;
232: 
233:         (bool ok, ) = payable(c.patient).call{value: amt}("");
234:         require(ok, "Chuyen tien that bai");
235:         emit ClaimApproved(claimId, c.patient, amt);
236:     }
```

### (c) Lý do thiết kế
1. **Khách quan và minh bạch:** Khi gọi `approveClaim`, smart contract đóng vai trò là trọng tài không thể can thiệp: contract tự kiểm tra dòng 225 (`block.timestamp <= p.expiryDate`), dòng 226 (`p.usedAmount + amt <= p.coverageLimit`) và dòng 227 (`address(this).balance >= amt`). Bất kỳ điều kiện nào không thỏa mãn đều lập tức dừng giao dịch và hoàn nguyên trạng thái.
2. **Nguyên tắc an toàn Checks-Effects-Interactions:** 
   - *Checks:* Dòng 218–227 kiểm tra toàn bộ điều kiện logic.
   - *Effects:* Dòng 229–231 cập nhật trạng thái `ClaimStatus.APPROVED` và ghi tăng `p.usedAmount += amt` ngay trên blockchain.
   - *Interactions:* Dòng 233 mới thực hiện chuyển tiền ETH đến ví bệnh nhân `payable(c.patient).call{value: amt}("")`.

### (d) Ca kiểm thử chứng minh
- **T24:** `approveClaim khi benh vien chua xac nhan bi revert` — Revert `"Benh vien chua xac nhan"`.
- **T25:** `approveClaim hop le: chi tra dung so tien` — ETH được chuyển vào ví bệnh nhân, `usedAmount` cập nhật chính xác, `remainingLimit` giảm tương ứng.
- **T26:** `approveClaim lan 2 bi revert` — Revert `"Claim da xu ly"`, ngăn chặn chi trả trùng lặp.
- **T27:** `hai claim, tong vuot han muc: claim sau bi revert khi duyet` — Kiểm soát tổng hạn mức bồi thường của thẻ không bị vượt quá giới hạn cam kết ban đầu.
- **T28:** `quy khong du bi revert` — Revert `"Quy bao hiem khong du"` nếu quỹ hợp đồng không đủ tiền chi trả.

### (e) Hậu quả nếu thiếu ràng buộc
Nếu thiếu ràng buộc kiểm tra hạn mức (`p.usedAmount + amt <= p.coverageLimit`), bệnh nhân có thể gửi nhiều yêu cầu bồi thường và rút vượt quá hạn mức gói bảo hiểm đã mua. Nếu chuyển tiền trước khi cập nhật số dư, hệ thống sẽ đối mặt với lỗ hổng tấn công tái nhập (Reentrancy Attack).

---

## 3. Các cơ chế bảo mật nâng cao

### 3.1. Thẻ bảo hiểm Soulbound NFT (Không thể chuyển nhượng)
Thẻ bảo hiểm y tế là tài sản định danh gắn liền với danh tính và lịch sử bệnh lý của một cá nhân duy nhất. Hệ thống override hook `_update` của chuẩn OpenZeppelin ERC-721 v5 (dòng 282–288):
```solidity
282:     function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
283:         address from = _ownerOf(tokenId);
284:         if (from != address(0) && to != address(0)) {
285:             revert("Soulbound: khong the chuyen nhuong");
286:         }
287:         return super._update(to, tokenId, auth);
288:     }
```
Cơ chế này chỉ cho phép mint mới (`from == address(0)`) hoặc đốt thẻ (`to == address(0)`), chặn tuyệt đối mọi hành vi chuyển nhượng (`transferFrom`, `safeTransferFrom`), đã được kiểm chứng qua ca kiểm thử **T12**.

### 3.2. Chống tấn công tái nhập (Reentrancy Guard)
Hàm `approveClaim` được trang bị modifier `nonReentrant` của OpenZeppelin v5. Trong ca kiểm thử **T31**, hợp đồng tấn công `ReentrancyAttacker` thực hiện gọi đệ quy ngược lại hàm `approveClaim` ngay trong hàm nhận tiền `receive()`. Kết quả thực nghiệm chứng minh: giao dịch đệ quy bị khóa hoàn toàn, kẻ tấn công chỉ nhận tiền bồi thường đúng 1 lần duy nhất (`reentryBlocked = true`, `reentrySucceeded = 0`).

---

## 4. Nháp mục 4.6 — Kiến trúc và Thiết kế Smart Contract

### 4.6.1. Các thành phần và Vai trò trong Hệ thống
Hợp đồng `HealthInsuranceNFT` kế thừa 3 lớp chuẩn từ OpenZeppelin Contracts v5:
- `ERC721`: Quản lý thẻ bảo hiểm dưới dạng NFT Soulbound.
- `AccessControl`: Quản lý phân quyền dựa trên vai trò với hai vai trò chính:
  - `DEFAULT_ADMIN_ROLE` (Công ty bảo hiểm / Admin): Quản trị hệ thống, tạo gói bảo hiểm (`createPlan`), bật/tắt gói (`setPlanActive`), ủy quyền bệnh viện (`authorizeHospital`), nạp quỹ (`fundPool`), từ chối bồi thường (`rejectClaim`).
  - `HOSPITAL_ROLE` (Bệnh viện đối tác): Xác minh thẻ bảo hiểm (`verifyInsurance`), gửi yêu cầu bồi thường (`submitClaim`), xác nhận chi phí viện phí (`confirmClaim`).
- `ReentrancyGuard`: Bảo vệ các hàm luân chuyển tài sản ETH.

### 4.6.2. Luồng thực thi 4 nghiệp vụ cốt lõi
1. **Nghiệp vụ 1 — Thiết lập hệ thống:** Admin cấu hình gói bảo hiểm, cấp quyền ví bệnh viện, nạp quỹ bồi thường ban đầu và đăng ký khóa công khai RSA-OAEP vào hợp đồng.
2. **Nghiệp vụ 2 — Mua bảo hiểm và Phát hành thẻ:** Bệnh nhân thanh toán đúng giá gói bằng ETH, hợp đồng tự động mint thẻ NFT Soulbound chứa thông tin hạn mức, thời hạn và CID điều khoản trên IPFS.
3. **Nghiệp vụ 3 — Khám bệnh và Gửi yêu cầu bồi thường:** Bệnh viện tra cứu thẻ NFT, tải hồ sơ bệnh án và hóa đơn đã mã hóa lên IPFS, sau đó tạo yêu cầu bồi thường trên blockchain kèm xác nhận chi phí.
4. **Nghiệp vụ 4 — Duyệt và Chi trả tự động:** Hợp đồng kiểm tra toàn bộ điều kiện hợp lệ on-chain, tự động giải ngân chuyển ETH từ quỹ thanh khoản về ví của bệnh nhân.
