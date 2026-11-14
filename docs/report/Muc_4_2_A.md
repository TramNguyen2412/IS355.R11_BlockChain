# CHƯƠNG 4. HIỆN THỰC HỆ THỐNG (PHẦN THÀNH VIÊN A)

---

## 4.2. Hiện thực Smart Contract `HealthInsuranceNFT`

Hợp đồng thông minh `HealthInsuranceNFT` được hiện thực bằng ngôn ngữ Solidity phiên bản `^0.8.20`, biên dịch trên môi trường Hardhat với trình tối ưu hóa mã lệnh (Optimizer) 200 runs. Hợp đồng đảm nhiệm vai trò trung tâm xử lý logic nghiệp vụ, quản lý trạng thái tài sản NFT và thực thi bồi thường tự động.

---

### 4.2.1. Cấu trúc tổng thể và tính kế thừa bảo mật
Hợp đồng kế thừa ba module tiêu chuẩn công nghiệp từ thư viện OpenZeppelin Contracts v5:
- **`ERC721`:** Triển khai chuẩn token không thể thay thế cho thẻ bảo hiểm y tế.
- **`AccessControl`:** Hệ thống phân quyền theo vai trò (RBAC), tạo lập phân tầng quản trị giữa Quản trị viên công ty bảo hiểm (`DEFAULT_ADMIN_ROLE`) và Cơ sở y tế (`HOSPITAL_ROLE`).
- **`ReentrancyGuard`:** Cung cấp modifier `nonReentrant` để loại trừ hoàn toàn nguy cơ tấn công tái nhập trong các giao dịch chuyển tiền.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract HealthInsuranceNFT is ERC721, AccessControl, ReentrancyGuard {
    bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");
    // ...
```

---

### 4.2.2. Kỹ thuật thực hiện các ràng buộc logic cốt lõi

Theo yêu cầu Tiêu chí 1 của Rubric chấm điểm đồ án, mục này trình bày chi tiết kỹ thuật thực hiện hai ràng buộc nghiệp vụ quan trọng nhất của hệ thống, bao gồm trích dẫn mã nguồn thực tế, giải thích logic từng dòng và các ca kiểm thử minh chứng.

#### (1) Ràng buộc logic 1: Phân quyền xác nhận chi phí viện phí của Bệnh viện (`confirmClaim`)

- **Phát biểu quy tắc nghiệp vụ:** Bệnh nhân sau khi điều trị có thể tự nộp hồ sơ yêu cầu bồi thường viện phí, nhưng hợp đồng thông minh tuyệt đối không cho phép tự động giải ngân nếu cơ sở y tế điều trị chưa tiến hành đối soát và xác nhận chi phí thực tế. Chỉ duy nhất các địa chỉ ví sở hữu vai trò `HOSPITAL_ROLE` mới có quyền thực thi hàm `confirmClaim`.

- **Đoạn mã nguồn thực tế** (*Trích từ `contracts/HealthInsuranceNFT.sol`, dòng 201–212*):

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

- **Phân tích kỹ thuật chi tiết:**
  - `Dòng 202:` Modifier `onlyRole(HOSPITAL_ROLE)` được cung cấp bởi `AccessControl`. Nếu người gọi không phải là bệnh viện được cấp quyền, EVM sẽ hoàn tác giao dịch ngay lập tức với lỗi chuẩn `AccessControlUnauthorizedAccount`.
  - `Dòng 203–205:` Xác thực định danh `claimId` nằm trong khoảng hợp lệ và trạng thái hồ sơ đang là `ClaimStatus.PENDING`.
  - `Dòng 206–207:` Ràng buộc tính hợp lý của số tiền xác nhận: `confirmedAmount > 0` và bắt buộc `confirmedAmount <= c.amount`. Bệnh viện chỉ có quyền xác nhận tối đa bằng hoặc thấp hơn số tiền bệnh nhân kê khai, loại bỏ nguy cơ bệnh viện thông đồng nâng khống chi phí vượt quá yêu cầu gốc.
  - `Dòng 208–210:` Ghi nhận địa chỉ ví bệnh viện thực tế xác nhận (`c.hospital = msg.sender`), bật cờ `c.hospitalConfirmed = true`, cập nhật số tiền được phê chuẩn và phát sự kiện `ClaimConfirmed`.

- **Hậu quả nếu thiếu ràng buộc:** Nếu thiếu modifier phân quyền này, bất kỳ người dùng nào (kể cả chính bệnh nhân hoặc hacker ngoài mạng) đều có thể tự xác nhận chi phí cho yêu cầu của mình, dẫn đến việc rút cạn ngân quỹ bảo hiểm mà không qua bất kỳ sự kiểm tra y tế nào.

---

#### (2) Ràng buộc logic 2: Kiểm soát hạn mức, thời hạn, ngân quỹ và giải ngân tự động (`approveClaim`)

- **Phát biểu quy tắc nghiệp vụ:** Hàm `approveClaim` đóng vai trò là cơ chế thực thi tự động của mô hình bảo hiểm tham số. Hàm này tự động thẩm định 5 điều kiện tiên quyết: (1) Hồ sơ tồn tại; (2) Hồ sơ đang ở trạng thái chờ; (3) Bệnh viện đã xác nhận chi phí y tế; (4) Thẻ bảo hiểm còn trong thời hạn hiệu lực; (5) Số tiền bồi thường không vượt quá hạn mức còn lại của gói bảo hiểm; và (6) Ngân quỹ hợp đồng có đủ số dư ETH để thanh toán.

- **Đoạn mã nguồn thực tế** (*Trích từ `contracts/HealthInsuranceNFT.sol`, dòng 216–236*):

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

- **Phân tích kỹ thuật chi tiết:**
  - `Dòng 217:` Modifier `nonReentrant` bảo vệ hàm khỏi nguy cơ tấn công đệ quy. Hàm này được mở công khai (`external`) cho phép bất kỳ ai hoặc hệ thống tự động kích hoạt.
  - `Dòng 220–221:` Kiểm tra trạng thái `PENDING` và bắt buộc `c.hospitalConfirmed == true`. Nếu bệnh viện chưa ký xác nhận, giao dịch lập tức dừng lại với lỗi `"Benh vien chua xac nhan"`.
  - `Dòng 225:` So sánh nhãn thời gian thực thi `block.timestamp` với ngày hết hạn của thẻ `p.expiryDate`. Nếu hợp đồng đã quá hạn, hệ thống từ chối chi trả.
  - `Dòng 226:` Kiểm tra tham số toán học cốt lõi: lũy kế đã bồi thường cộng với khoản bồi thường lần này không được vượt quá hạn mức cam kết ban đầu: `p.usedAmount + amt <= p.coverageLimit`.
  - `Dòng 227:` Kiểm tra thanh khoản thực tế của hợp đồng thông minh: `address(this).balance >= amt`. Nếu quỹ bảo hiểm chưa được nạp đủ tiền, giao dịch không thực hiện, bảo vệ người dùng khỏi việc trạng thái bị đổi nhưng tiền không nhận được.
  - `Dòng 229–231 (Effects):` Trạng thái được cập nhật trước khi chuyển tiền: chuyển sang `ClaimStatus.APPROVED`, lưu thời điểm `resolvedAt` và tăng hạn mức đã dùng `p.usedAmount += amt`.
  - `Dòng 233–234 (Interactions):` Thực hiện lệnh chuyển ETH thông qua phương thức cấp thấp an toàn `payable(c.patient).call{value: amt}("")`. Nếu lệnh call thất bại, giao dịch hoàn tác toàn bộ.

---

### 4.2.3. Hiện thực thẻ bảo hiểm Soulbound NFT (Khóa chuyển nhượng)

Theo Tiêu chí 4 của Rubric, thẻ bảo hiểm được định danh dưới dạng NFT ERC-721 với tính chất **Soulbound Token (SBT)**—gắn liền vĩnh viễn với danh tính người mua.

Trong OpenZeppelin v5, toàn bộ các luồng luân chuyển token (khi đúc mới `_safeMint`, chuyển nhượng `transferFrom`, hoặc hủy `_burn`) đều được định tuyến thông qua một hàm hook nội bộ tập trung là `_update`. Do đó, tính năng Soulbound được hiện thực bằng cách ghi đè hàm `_update` trong `HealthInsuranceNFT.sol`:

```solidity
282:     function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
283:         address from = _ownerOf(tokenId);
284:         if (from != address(0) && to != address(0)) {
285:             revert("Soulbound: khong the chuyen nhuong");
286:         }
287:         return super._update(to, tokenId, auth);
288:     }
```

- **Cơ chế hoạt động:**
  - Khi đúc thẻ mới: `from == address(0)` (địa chỉ null) và `to == msg.sender` $\rightarrow$ Điều kiện `if` sai $\rightarrow$ Giao dịch đúc thẻ thành công.
  - Khi người sở hữu cố tình gọi hàm chuyển nhượng token (`transferFrom` hoặc `safeTransferFrom`): `from` là ví bệnh nhân (khác `address(0)`) và `to` là ví người nhận (khác `address(0)`) $\rightarrow$ Điều kiện `if` thỏa mãn $\rightarrow$ EVM lập tức kích hoạt lệnh `revert("Soulbound: khong the chuyen nhuong")`.

---

### 4.2.4. Mô hình an toàn Checks-Effects-Interactions

Lỗ hổng tấn công tái nhập (Reentrancy) từng gây ra thiệt hại nghiêm trọng trong lịch sử Ethereum (điển hình là vụ tấn công The DAO năm 2016). Kẻ tấn công sử dụng một hợp đồng thông minh độc hại đóng vai trò là người nhận tiền, lợi dụng hàm dự phòng (`fallback` hoặc `receive`) để gọi ngược lại hàm rút tiền trước khi số dư của họ được trừ trên hợp đồng gốc.

Hợp đồng `HealthInsuranceNFT` áp dụng **mô hình phòng thủ kép (Defense-in-Depth)**:
1. **Lớp bảo vệ 1 - Mẫu thiết kế Checks-Effects-Interactions (CEI):** 
   Toàn bộ các biến trạng thái (`c.status`, `p.usedAmount`, `c.resolvedAt`) đều được cập nhật hoàn tất vào bộ nhớ lưu trữ on-chain (`storage`) **trước** khi câu lệnh chuyển tiền `call` ra địa chỉ ví bên ngoài được thực thi. Do đó, nếu xảy ra lệnh gọi đệ quy ngược trở lại, hàm sẽ ngay lập tức bị chặn ở bước *Checks* do trạng thái hồ sơ lúc này đã là `ClaimStatus.APPROVED` (vi phạm điều kiện `c.status == ClaimStatus.PENDING`).
2. **Lớp bảo vệ 2 - Khóa ReentrancyGuard:**
   Sử dụng cờ khóa nội bộ `_status` của OpenZeppelin v5 thông qua modifier `nonReentrant`. Mọi nỗ lực xâm nhập đệ quy trong cùng một khung giao dịch đều bị hoàn tác ngay lập tức ở cấp độ byte code EVM.
