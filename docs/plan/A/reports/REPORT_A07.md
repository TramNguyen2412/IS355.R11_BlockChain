# BÁO CÁO CHẶNG A07 — Nghiệp vụ 4: Duyệt và chi trả tự động + chống reentrancy
- Ngày giờ: 2026-10-24 22:08
- Nhánh git: tram

## 1. Kết luận một dòng
HOÀN THÀNH — Đã cài đặt hoàn chỉnh Nghiệp vụ 4 (approveClaim với Ràng buộc logic số 2 Checks-Effects-Interactions, nonReentrant, rejectClaim) và mock ReentrancyAttacker; toàn bộ 34 test case (T01–T32, 2 test phụ) đều passing 100%, khớp dấu vân tay chuẩn.

## 2. File đã tạo/sửa
- `git status --short`:
```text
 M contracts-hardhat/contracts/HealthInsuranceNFT.sol
 M contracts-hardhat/test/HealthInsuranceNFT.test.js
?? contracts-hardhat/contracts/mocks/ReentrancyAttacker.sol
```
- `wc -l`:
```text
293 contracts/HealthInsuranceNFT.sol
312 test/HealthInsuranceNFT.test.js
 47 contracts/mocks/ReentrancyAttacker.sol
```

## 3. Lệnh kiểm tra và kết quả THẬT
- **Lệnh 1:** `npx hardhat test` (34 test cases)
```text
  HealthInsuranceNFT
    Trien khai va phan quyen
      √ T01 deploy: deployer la admin, ten/ky hieu NFT dung (591ms)
      √ T02 admin cap quyen benh vien + event (50ms)
      √ T03 vi khong phai admin goi authorizeHospital bi revert
      √ T04 admin thu hoi quyen benh vien
    Goi bao hiem
      √ T05 admin tao goi hop le (55ms)
      √ T06 vi la tao goi bi revert
      √ T07 tao goi gia = 0 hoac han muc = 0 bi revert
      √ T08 tat goi roi mua bi revert
    Mua bao hiem va NFT
      √ T09 mua dung gia: mint NFT, Policy dung, event
      √ T10 gui sai so ETH (thieu/thua) bi revert
      √ T11 mua khi da co goi con han bi revert
      √ T12 chuyen nhuong NFT bi revert Soulbound
      √ T13 verifyInsurance: vi co the con han
      √ T14 verifyInsurance: vi khong co the
      √ T15 verifyInsurance sau khi het han
      √ Them: het han roi duoc mua goi moi
    Claim va rang buoc
      √ T16 benh vien submitClaim: PENDING, da xac nhan, event (40ms)
      √ T17 benh nhan submitClaim: PENDING, chua xac nhan
      √ T18 vi la submitClaim bi revert
      √ T19 submitClaim vuot han muc con lai bi revert
      √ T20 vi la confirmClaim bi revert (RBAC)
      √ T21 benh vien confirmClaim hop le
      √ T22 confirmedAmount > amount bi revert
      √ T23 submitClaim khi het han bi revert
    Duyet va chi tra
      √ T24 approveClaim khi benh vien chua xac nhan bi revert
      √ T25 approveClaim hop le: chi tra dung so tien
      √ T26 approveClaim lan 2 bi revert
      √ T27 hai claim, tong vuot han muc: claim sau bi revert khi duyet
      √ T28 quy khong du bi revert
      √ T29 rejectClaim boi admin: REJECTED, khong mat tien quy
      √ T30 rejectClaim boi vi la bi revert
    Bao mat nang cao
      √ T31 reentrancy: goi lai approveClaim bi chan, chi nhan tien 1 lan
      √ T32 fundPool cong dung vao poolBalance (39ms)
      √ Them: registerEncryptionKey luu khoa va phat event


  34 passing (1s)
```

- **Xác nhận đặc biệt:**
  - Test T25 (approveClaim hợp lệ: chi trả đúng số confirmedAmount về bệnh nhân): PASS
  - Test T31 (chống tấn công reentrancy: kẻ tấn công gọi lại approveClaim bị chặn, chỉ nhận tiền đúng 1 lần): PASS

- **Lệnh 2:** Grep từ khóa cấm:
```bash
grep -nE "tx\.origin|selfdestruct|delegatecall|\.transfer\(|\.send\(|console\.log|ERC721Enumerable|ERC721URIStorage|_beforeTokenTransfer" contracts/HealthInsuranceNFT.sol
```
Kết quả:
```text
(trống / không có dòng nào vi phạm)
```

- **Lệnh 3:** Grep nonReentrant:
```bash
grep -n "nonReentrant" contracts/HealthInsuranceNFT.sol
```
Kết quả:
```text
126:        nonReentrant
217:    function approveClaim(uint256 claimId) external nonReentrant {
```

- **Lệnh 4:** Grep 19 hàm:
```bash
grep -nE "^\s+function " contracts/HealthInsuranceNFT.sol | sed -E 's/.*function ([A-Za-z_]+).*/\1/' | sort | tr '\n' ' '
```
Kết quả:
```text
_update approveClaim authorizeHospital confirmClaim createPlan fundPool getClaim getClaimsByPatient getPlans getPolicy poolBalance purchasePolicy registerEncryptionKey rejectClaim setPlanActive submitClaim supportsInterface tokenURI verifyInsurance 
```

- **Lệnh 5:** Dấu vân tay file:
```bash
wc -l contracts/HealthInsuranceNFT.sol test/HealthInsuranceNFT.test.js contracts/mocks/ReentrancyAttacker.sol
tr -d '\r' < contracts/HealthInsuranceNFT.sol | sha256sum | cut -c1-16
tr -d '\r' < test/HealthInsuranceNFT.test.js | sha256sum | cut -c1-16
tr -d '\r' < contracts/mocks/ReentrancyAttacker.sol | sha256sum | cut -c1-16
```
Kết quả:
```text
  293 contracts/HealthInsuranceNFT.sol
  312 test/HealthInsuranceNFT.test.js
   47 contracts/mocks/ReentrancyAttacker.sol
d28d31bfcdfe852c
a7127d54f6124709
cec9934beb5e53ec
```
(Khớp 100% với file chặng: contract 293 dòng mã `d28d31bfcdfe852c`, test 312 dòng mã `a7127d54f6124709`, attacker 47 dòng mã `cec9934beb5e53ec`)

## 4. Tự kiểm theo checklist
- [x] Thứ tự trong `approveClaim` tuân thủ nghiêm ngặt Checks -> Effects -> Interactions.
- [x] Chi trả ETH bằng `call{value: amt}("")` có kiểm tra `require(ok, "Chuyen tien that bai")`, không dùng `transfer`/`send`.
- [x] Có modifier `nonReentrant` trên `approveClaim` và `purchasePolicy` (chỉ 2 chỗ).
- [x] `approveClaim` chi trả đúng `confirmedAmount` về `claim.patient`.
- [x] `rejectClaim` chỉ cho Admin (`onlyRole(DEFAULT_ADMIN_ROLE)`).
- [x] Chuỗi revert đúng 100% bảng file 00 mục 4.7 (`Claim da xu ly`, `Benh vien chua xac nhan`, `Bao hiem da het han`, `Vuot qua han muc bao hiem`, `Quy bao hiem khong du`, `Chuyen tien that bai`).
- [x] Test T31 chứng minh reentrancy attack bị chặn hoàn toàn.

## 5. Chỗ KHÁC với file chặng
Không có (chép nguyên văn 100%).

## 6. Điều chưa chắc / câu hỏi cho người dùng
Không.

## 7. Việc cần người khác làm (luật R16 file 00)
Không.

## 8. Đề xuất cải tiến (chỉ ghi, KHÔNG làm)
Không.

## 9. Bước tiếp theo
Chặng A08 — Script nạp dữ liệu mẫu seed.js và bàn giao H3 (`A08_seed_va_ban_giao_H3.md`).
