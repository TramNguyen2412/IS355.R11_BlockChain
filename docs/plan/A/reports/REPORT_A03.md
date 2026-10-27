# BÁO CÁO CHẶNG A03 — Script xuất ABI và địa chỉ (mốc H2)
- Ngày giờ: 2026-10-24 21:02
- Mô hình/công cụ AI: Gemini 3.8 Flash (Medium)
- Nhánh git: tram

## 1. Kết luận một dòng
HOÀN THÀNH — Đã viết scripts exportAbi.js và deploy.js, deploy thử nghiệm thành công trên node localhost (địa chỉ 0x5FbDB2315678afecb367f032d93F642f64180aa3), tự động xuất abi.json (69 mục) và address.json vào frontend/src/contracts/. Sẵn sàng bàn giao mốc H2.

## 2. File đã tạo/sửa
- `git status --short`:
```text
?? contracts-hardhat/scripts/deploy.js
?? contracts-hardhat/scripts/exportAbi.js
?? frontend/src/contracts/abi.json
?? frontend/src/contracts/address.json
```
- `wc -l`:
```text
34 scripts/exportAbi.js
24 scripts/deploy.js
```

## 3. Lệnh kiểm tra và kết quả THẬT
- **Lệnh 1:** Deploy trên localhost (`npx hardhat run scripts/deploy.js --network localhost`):
```text
Da ghi abi.json (69 muc) va address.json vao D:\MediChain\frontend\src\contracts
HealthInsuranceNFT: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Insurer (admin): 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deploy block: 1
```

- **Lệnh 2:** Nội dung `frontend/src/contracts/address.json`:
```json
{
  "chainId": 31337,
  "network": "localhost",
  "HealthInsuranceNFT": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "insurer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "deployBlock": 1
}
```

- **Lệnh 3:** Kiểm tra `frontend/src/contracts/abi.json`:
```bash
node -e "const a=require('./frontend/src/contracts/abi.json'); console.log(Array.isArray(a), a.filter(x=>x.type==='function').length>0, a.some(x=>x.name==='createPlan'), a.some(x=>x.name==='approveClaim'))"
```
Kết quả:
```text
true true true true
```

## 4. Tự kiểm theo checklist
- [x] `address.json` có đủ 5 trường: `chainId`, `network`, `HealthInsuranceNFT`, `insurer`, `deployBlock`.
- [x] `chainId` và `deployBlock` là kiểu số (number).
- [x] `HealthInsuranceNFT` khớp địa chỉ contract deployer (`0x5FbDB2315678afecb367f032d93F642f64180aa3`).
- [x] `insurer` lấy từ `deployer.address` (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`).
- [x] `abi.json` chứa đầy đủ các hàm contract (69 mục gồm functions, events, constructor, errors).
- [x] Không lưu trữ bí mật / private key trong code script.
- [x] Không sửa bất kỳ file nào trong `frontend/src/app/` hay ngoài lãnh địa được phép.

## 5. Chỗ KHÁC với file chặng
Không có (chép nguyên văn 100%).

## 6. Điều chưa chắc / câu hỏi cho người dùng
Không.

## 7. Việc cần người khác làm (luật R16 file 00)
Sau khi PR được merge vào main, nhắn nhóm: "H2 xong: contract khung + abi.json + address.json (local), git pull nhé" để C (Lan Anh) và B (Phương Anh) sử dụng ABI và địa chỉ.

## 8. Đề xuất cải tiến (chỉ ghi, KHÔNG làm)
Không.

## 9. Bước tiếp theo
Chặng A04 — Nghiệp vụ 1: Thiết lập hệ thống (`A04_nghiep_vu1_thiet_lap.md`).
