# BÁO CÁO CHẶNG A06 — Nghiệp vụ 3: Gửi yêu cầu bồi thường và bệnh viện xác nhận
- Ngày giờ: 2026-10-24 21:58
- Nhánh git: tram

## 1. Kết luận một dòng
HOÀN THÀNH — Đã cài đặt hoàn chỉnh Nghiệp vụ 3 (submitClaim, confirmClaim với Ràng buộc logic số 1 onlyRole HOSPITAL_ROLE) và 26 test case (T01–T23, T32, 2 test phụ) đều passing 100%, khớp dấu vân tay chuẩn.

## 2. File đã tạo/sửa
- `git status --short`:
```text
 M contracts-hardhat/contracts/HealthInsuranceNFT.sol
 M contracts-hardhat/test/HealthInsuranceNFT.test.js
```
- `wc -l`:
```text
270 contracts/HealthInsuranceNFT.sol
228 test/HealthInsuranceNFT.test.js
```

## 3. Lệnh kiểm tra và kết quả THẬT
- **Lệnh 1:** `npx hardhat test`
```text
  HealthInsuranceNFT
    Trien khai va phan quyen
      √ T01 deploy: deployer la admin, ten/ky hieu NFT dung (548ms)
      √ T02 admin cap quyen benh vien + event (39ms)
      √ T03 vi khong phai admin goi authorizeHospital bi revert
      √ T04 admin thu hoi quyen benh vien
    Goi bao hiem
      √ T05 admin tao goi hop le (52ms)
      √ T06 vi la tao goi bi revert
      √ T07 tao goi gia = 0 hoac han muc = 0 bi revert
      √ T08 tat goi roi mua bi revert
    Mua bao hiem va NFT
      √ T09 mua dung gia: mint NFT, Policy dung, event (57ms)
      √ T10 gui sai so ETH (thieu/thua) bi revert (38ms)
      √ T11 mua khi da co goi con han bi revert (60ms)
      √ T12 chuyen nhuong NFT bi revert Soulbound
      √ T13 verifyInsurance: vi co the con han
      √ T14 verifyInsurance: vi khong co the
      √ T15 verifyInsurance sau khi het han
      √ Them: het han roi duoc mua goi moi
    Claim va rang buoc
      √ T16 benh vien submitClaim: PENDING, da xac nhan, event (52ms)
      √ T17 benh nhan submitClaim: PENDING, chua xac nhan
      √ T18 vi la submitClaim bi revert
      √ T19 submitClaim vuot han muc con lai bi revert
      √ T20 vi la confirmClaim bi revert (RBAC)
      √ T21 benh vien confirmClaim hop le
      √ T22 confirmedAmount > amount bi revert
      √ T23 submitClaim khi het han bi revert
    Bao mat nang cao
      √ T32 fundPool cong dung vao poolBalance
      √ Them: registerEncryptionKey luu khoa va phat event


  26 passing (1s)
```

- **Xác nhận đặc biệt (3 test quan trọng cho báo cáo):**
  - Test T19 (submitClaim vượt hạn mức bị revert `Vuot qua han muc bao hiem`): PASS
  - Test T20 (ví lạ/bệnh nhân confirmClaim bị revert RBAC `AccessControlUnauthorizedAccount`): PASS
  - Test T21 (bệnh viện confirmClaim hợp lệ phát emit ClaimConfirmed): PASS

- **Lệnh 2:** Grep từ khóa cấm:
```bash
grep -nE "tx\.origin|selfdestruct|delegatecall|\.transfer\(|\.send\(|console\.log|ERC721Enumerable|ERC721URIStorage|_beforeTokenTransfer" contracts/HealthInsuranceNFT.sol
```
Kết quả:
```text
(trống / không có dòng nào vi phạm)
```

- **Lệnh 3:** Dấu vân tay file:
```bash
wc -l contracts/HealthInsuranceNFT.sol test/HealthInsuranceNFT.test.js
tr -d '\r' < contracts/HealthInsuranceNFT.sol | sha256sum | cut -c1-16
tr -d '\r' < test/HealthInsuranceNFT.test.js | sha256sum | cut -c1-16
```
Kết quả:
```text
  270 contracts/HealthInsuranceNFT.sol
  228 test/HealthInsuranceNFT.test.js
2dc1ee909e20b366
5c54d49eedf433a8
```
(Khớp 100% với file chặng: contract 270 dòng mã `2dc1ee909e20b366`, test 228 dòng mã `5c54d49eedf433a8`)

## 4. Tự kiểm theo checklist
- [x] `submitClaim` kiểm tra người gọi (chủ NFT hoặc ví có `HOSPITAL_ROLE`) trước khi kiểm tra số tiền.
- [x] Nhánh bệnh viện gọi `submitClaim` tự động điền: `hospital = msg.sender`, `hospitalConfirmed = true`, `confirmedAmount = amount`.
- [x] Nhánh bệnh nhân tự gửi `submitClaim`: `hospital = address(0)`, `hospitalConfirmed = false`, `confirmedAmount = 0`.
- [x] `confirmClaim` có modifier `onlyRole(HOSPITAL_ROLE)` (Ràng buộc logic số 1), kiểm tra `confirmedAmount <= c.amount`.
- [x] Chuỗi revert đúng 100% bảng file 00 mục 4.7 (`Khong phai chu the hoac benh vien`, `Bao hiem da het han`, `Vuot qua han muc bao hiem`, `So tien khong hop le`, `So tien xac nhan vuot so tien yeu cau`, `Khong tim thay yeu cau boi thuong`, `Claim da xu ly`).
- [x] Không dùng `tx.origin`.
- [x] Các hàm nghiệp vụ 4 (`approveClaim`, `rejectClaim`) giữ nguyên stub `revert("TODO")`.

## 5. Chỗ KHÁC với file chặng
Không có (chép nguyên văn 100%).

## 6. Điều chưa chắc / câu hỏi cho người dùng
Không.

## 7. Việc cần người khác làm (luật R16 file 00)
Không.

## 8. Đề xuất cải tiến (chỉ ghi, KHÔNG làm)
Không.

## 9. Bước tiếp theo
Chặng A07 — Nghiệp vụ 4: Duyệt và chi trả tự động (`A07_nghiep_vu4_duyet_chi_tra.md`).
