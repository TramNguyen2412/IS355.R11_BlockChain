# BÁO CÁO CHẶNG A02 — Viết bản KHUNG contract
- Ngày giờ: 2026-10-24 20:45
- Nhánh git: tram

## 1. Kết luận một dòng
HOÀN THÀNH — Đã viết bản khung HealthInsuranceNFT.sol gồm đầy đủ struct, enum, 10 event, 17 hàm (chữ ký đóng băng), biên dịch thành công evm cancun và khớp 100% dấu vân tay chuẩn.

## 2. File đã tạo/sửa
- `git status --short`:
```text
 M contracts-hardhat/contracts/HealthInsuranceNFT.sol
```
- `wc -l`:
```text
159 contracts/HealthInsuranceNFT.sol
```

## 3. Lệnh kiểm tra và kết quả THẬT
- **Lệnh 1:** `npx hardhat compile`
```text
Compiled 1 Solidity file successfully (evm target: cancun).
(Có các warning: Unused function parameter, Function state mutability can be restricted to pure; 0 error)
```

- **Lệnh 2:** Trích xuất 17 hàm:
```bash
grep -nE "^\s+function " contracts/HealthInsuranceNFT.sol | sed -E 's/.*function ([A-Za-z_]+).*/\1/' | sort | tr '\n' ' '
```
Kết quả:
```text
approveClaim authorizeHospital confirmClaim createPlan fundPool getClaim getClaimsByPatient getPlans getPolicy poolBalance purchasePolicy registerEncryptionKey rejectClaim setPlanActive submitClaim supportsInterface verifyInsurance 
```

- **Lệnh 3:** Kiểm tra 10 event:
```bash
node -e "const a=require('./artifacts/contracts/HealthInsuranceNFT.sol/HealthInsuranceNFT.json').abi; console.log(a.filter(x=>x.type==='event'&&!['Approval','ApprovalForAll','Transfer','RoleAdminChanged','RoleGranted','RoleRevoked'].includes(x.name)).map(x=>x.name).sort().join(','))"
```
Kết quả:
```text
ClaimApproved,ClaimConfirmed,ClaimRejected,ClaimSubmitted,EncryptionKeyRegistered,HospitalAuthorized,PlanCreated,PlanStatusChanged,PolicyPurchased,PoolFunded
```

- **Lệnh 4:** Dấu vân tay file:
```bash
wc -l contracts/HealthInsuranceNFT.sol
tr -d '\r' < contracts/HealthInsuranceNFT.sol | sha256sum | cut -c1-16
```
Kết quả:
```text
159 contracts/HealthInsuranceNFT.sol
d453413b0dc38f64
```
(Khớp chính xác 159 dòng và sha256 prefix `d453413b0dc38f64`)

## 4. Tự kiểm theo checklist
- [x] Đủ 17 hàm công khai/external đóng băng theo file 00 mục 4.2 + supportsInterface.
- [x] Đủ 10 event đóng băng theo file 00 mục 4.2.
- [x] Thứ tự và tên field trong các struct Plan, Policy, Claim đúng 100% file 00 mục 4.2.
- [x] `pragma solidity ^0.8.20;` và import đúng OpenZeppelin Contracts v5.
- [x] Không có các từ khóa cấm (grep kiểm tra rỗng): `tx.origin`, `selfdestruct`, `delegatecall`, `.transfer(`, `.send(`, `console.log`, `ERC721Enumerable`, `ERC721URIStorage`, `_beforeTokenTransfer`.
- [x] Chỉ dùng revert("TODO") trong bản khung.

## 5. Chỗ KHÁC với file chặng
Không có (chép nguyên văn 100%).

## 6. Điều chưa chắc / câu hỏi cho người dùng
Không.

## 7. Việc cần người khác làm (luật R16 file 00)
Không.

## 8. Đề xuất cải tiến (chỉ ghi, KHÔNG làm)
Không.

## 9. Bước tiếp theo
Chặng A03 — Viết script tự xuất ABI và script deploy (`A03_script_xuat_abi_deploy.md`, mốc H2).
