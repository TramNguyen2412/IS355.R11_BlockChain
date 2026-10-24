# BÁO CÁO CHẶNG A04 — Nghiệp vụ 1: Thiết lập hệ thống (contract + test)
- Ngày giờ: 2026-10-24 21:22
- Mô hình/công cụ AI: Gemini 3.8 Flash (Medium)
- Nhánh git: tram

## 1. Kết luận một dòng
HOÀN THÀNH — Đã cài đặt hoàn chỉnh Nghiệp vụ 1 (createPlan, setPlanActive, authorizeHospital, fundPool, registerEncryptionKey, getPlans, poolBalance) và 9 test case (T01–T07, T32, test phụ) đều passing 100%, khớp dấu vân tay chuẩn.

## 2. File đã tạo/sửa
- `git status --short`:
```text
 M contracts-hardhat/contracts/HealthInsuranceNFT.sol
?? contracts-hardhat/test/HealthInsuranceNFT.test.js
```
- `wc -l`:
```text
186 contracts/HealthInsuranceNFT.sol
101 test/HealthInsuranceNFT.test.js
```

## 3. Lệnh kiểm tra và kết quả THẬT
- **Lệnh 1:** `npx hardhat test`
```text
  HealthInsuranceNFT
    Trien khai va phan quyen
      √ T01 deploy: deployer la admin, ten/ky hieu NFT dung (578ms)
      √ T02 admin cap quyen benh vien + event (46ms)
      √ T03 vi khong phai admin goi authorizeHospital bi revert
      √ T04 admin thu hoi quyen benh vien
    Goi bao hiem
      √ T05 admin tao goi hop le
      √ T06 vi la tao goi bi revert
      √ T07 tao goi gia = 0 hoac han muc = 0 bi revert
    Bao mat nang cao
      √ T32 fundPool cong dung vao poolBalance
      √ Them: registerEncryptionKey luu khoa va phat event


  9 passing (734ms)
```

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
  186 contracts/HealthInsuranceNFT.sol
  101 test/HealthInsuranceNFT.test.js
07c2d9bfa0669a29
8d74a52d376e4cb2
```
(Khớp 100% với file chặng: contract 186 dòng mã `07c2d9bfa0669a29`, test 101 dòng mã `8d74a52d376e4cb2`)

## 4. Tự kiểm theo checklist
- [x] `authorizeHospital` dùng `_grantRole` và `_revokeRole` nội bộ.
- [x] `createPlan`, `setPlanActive`, `authorizeHospital` có modifier `onlyRole(DEFAULT_ADMIN_ROLE)`.
- [x] Chuỗi revert đúng bảng file 00 mục 4.7: `So tien khong hop le`, `Goi bao hiem khong ton tai`, `Khong tim thay yeu cau boi thuong`.
- [x] Test phân quyền dùng `revertedWithCustomError(c, "AccessControlUnauthorizedAccount")`.
- [x] Không có hàm `receive()` / `fallback()` nhận ETH tự do; chỉ nạp quỹ qua `fundPool`.
- [x] Bộ đếm ID bắt đầu từ 1 (`totalPlans++` rồi mới gán `planId`).
- [x] Các hàm nghiệp vụ 2, 3, 4 giữ nguyên stub `revert("TODO")`.

## 5. Chỗ KHÁC với file chặng
Không có (chép nguyên văn 100%).

## 6. Điều chưa chắc / câu hỏi cho người dùng
Không.

## 7. Việc cần người khác làm (luật R16 file 00)
Không.

## 8. Đề xuất cải tiến (chỉ ghi, KHÔNG làm)
Không.

## 9. Bước tiếp theo
Chặng A05 — Nghiệp vụ 2: Mua bảo hiểm và phát hành NFT soulbound (`A05_nghiep_vu2_mua_bao_hiem_nft.md`).
