# BÁO CÁO CHẶNG A05 — Nghiệp vụ 2: Mua bảo hiểm, thẻ NFT, xác minh thẻ
- Ngày giờ: 2026-10-24 21:50
- Mô hình/công cụ AI: Gemini 3.8 Flash (Medium)
- Nhánh git: tram

## 1. Kết luận một dòng
HOÀN THÀNH — Đã cài đặt hoàn chỉnh Nghiệp vụ 2 (purchasePolicy, verifyInsurance, tokenURI, _update soulbound) và 18 test case (T01–T15, T32, 2 test phụ) đều passing 100%, khớp dấu vân tay chuẩn.

## 2. File đã tạo/sửa
- `git status --short`:
```text
 M contracts-hardhat/contracts/HealthInsuranceNFT.sol
 M contracts-hardhat/test/HealthInsuranceNFT.test.js
```
- `wc -l`:
```text
233 contracts/HealthInsuranceNFT.sol
168 test/HealthInsuranceNFT.test.js
```

## 3. Lệnh kiểm tra và kết quả THẬT
- **Lệnh 1:** `npx hardhat test`
```text
  HealthInsuranceNFT
    Trien khai va phan quyen
      √ T01 deploy: deployer la admin, ten/ky hieu NFT dung (563ms)
      √ T02 admin cap quyen benh vien + event (48ms)
      √ T03 vi khong phai admin goi authorizeHospital bi revert
      √ T04 admin thu hoi quyen benh vien
    Goi bao hiem
      √ T05 admin tao goi hop le (39ms)
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
    Bao mat nang cao
      √ T32 fundPool cong dung vao poolBalance
      √ Them: registerEncryptionKey luu khoa va phat event


  18 passing (818ms)
```

- **Xác nhận đặc biệt:**
  - Test T09 (Mint NFT + Policy + Event): PASS
  - Test T12 (Soulbound chặn transferFrom / safeTransferFrom): PASS

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
  233 contracts/HealthInsuranceNFT.sol
  168 test/HealthInsuranceNFT.test.js
9b36a2d95ef4f80f
ee332c2697cb1719
```
(Khớp 100% với file chặng: contract 233 dòng mã `9b36a2d95ef4f80f`, test 168 dòng mã `ee332c2697cb1719`)

## 4. Tự kiểm theo checklist
- [x] `purchasePolicy` có modifier `payable`, `nonReentrant`.
- [x] Kiểm tra đầy đủ: gói tồn tại, gói active (`Goi bao hiem khong hoat dong`), đúng số tiền `msg.value == plan.price` (`Sai so tien thanh toan`), không có gói còn hạn (`Da co goi bao hiem con han`).
- [x] Gọi `_safeMint(msg.sender, tokenId)` ở cuối hàm `purchasePolicy` (sau khi đã cập nhật trạng thái).
- [x] Thẻ bảo hiểm là Soulbound: override `_update(address to, uint256 tokenId, address auth)` revert `Soulbound: khong the chuyen nhuong` khi `from != address(0) && to != address(0)`.
- [x] `verifyInsurance(address patient)` là hàm view, không bao giờ revert (ví không có thẻ trả `(false, 0, 0, 0)`).
- [x] `tokenURI` override trả `string.concat("ipfs://", policies[tokenId].policyDocCID)`.
- [x] Chuỗi revert đúng 100% bảng file 00 mục 4.7.
- [x] Các hàm nghiệp vụ 3, 4 giữ nguyên stub `revert("TODO")`.

## 5. Chỗ KHÁC với file chặng
Không có (chép nguyên văn 100%).

## 6. Điều chưa chắc / câu hỏi cho người dùng
Không.

## 7. Việc cần người khác làm (luật R16 file 00)
Không.

## 8. Đề xuất cải tiến (chỉ ghi, KHÔNG làm)
Không.

## 9. Bước tiếp theo
Chặng A06 — Nghiệp vụ 3: Yêu cầu bồi thường (claim) (`A06_nghiep_vu3_claim.md`).
