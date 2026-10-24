# BÁO CÁO CHẶNG A08 — Script nạp dữ liệu mẫu và bàn giao H3
- Ngày giờ: 2026-10-24 22:34
- Nhánh git: tram

## 1. Kết luận một dòng
HOÀN THÀNH — Đã viết script seed.js, deploy lại và khởi tạo dữ liệu mẫu thành công trên node local (2 gói bảo hiểm, cấp quyền ví bệnh viện, nạp quỹ 0.1 ETH). Sẵn sàng bàn giao mốc H3.

## 2. File đã tạo/sửa
- `git status --short`:
```text
?? contracts-hardhat/scripts/seed.js
```
- `wc -l`:
```text
49 scripts/seed.js
```

## 3. Lệnh kiểm tra và kết quả THẬT
- **Lệnh 1:** `npx hardhat run scripts/deploy.js --network localhost`
```text
Da ghi abi.json (69 muc) va address.json vao D:\MediChain\frontend\src\contracts
HealthInsuranceNFT: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Insurer (admin): 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deploy block: 1
```

- **Lệnh 2:** `npx hardhat run scripts/seed.js --network localhost` (lần 1)
```text
Da tao 2 goi mau
Da cap quyen benh vien: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Quy hien tai: 0.1 ETH
```

- **Lệnh 3:** `npx hardhat run scripts/seed.js --network localhost` (lần 2 - kiểm tra tính idempotent không nạp trùng)
```text
Da co goi, bo qua buoc tao goi
Da cap quyen benh vien: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Quy da co tien, bo qua buoc nap quy
Quy hien tai: 0.1 ETH
```

- **Lệnh 4:** Kiểm tra trạng thái on-chain qua node script:
```bash
node -e "const {ethers}=require('ethers');(async()=>{const p=new ethers.JsonRpcProvider('http://127.0.0.1:8545');const abi=require('../frontend/src/contracts/abi.json');const a=require('../frontend/src/contracts/address.json');const c=new ethers.Contract(a.HealthInsuranceNFT,abi,p);const pl=await c.getPlans();console.log(pl.length,pl[0].name,pl[0].price.toString(),pl[1].price.toString(),ethers.formatEther(await c.poolBalance()),await c.hasRole(await c.HOSPITAL_ROLE(),'0x70997970C51812dc3A010C7d01b50e0d17dc79C8'))})()"
```
Kết quả:
```text
2 Gói Cơ bản 2000000000000000 5000000000000000 0.1 true
```

- **Lệnh 5 (Bảng Gas cho báo cáo - A-09):**
```text
·------------------------------------------------|---------------------------|-------------|-----------------------------·
|              Solc version: 0.8.28              ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 60000000 gas  │
·················································|···························|·············|······························
|  Methods                                                                                                               │
·······················|·························|·············|·············|·············|···············|··············
|  Contract            ·  Method                 ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·······················|·························|·············|·············|·············|···············|··············
|  HealthInsuranceNFT  ·  approveClaim           ·          -  ·          -  ·     117178  ·            4  ·          -  │
|  HealthInsuranceNFT  ·  authorizeHospital      ·      28649  ·      50634  ·      47493  ·            7  ·          -  │
|  HealthInsuranceNFT  ·  confirmClaim           ·      98911  ·      98923  ·      98913  ·            7  ·          -  │
|  HealthInsuranceNFT  ·  createPlan             ·     191613  ·     208677  ·     202989  ·            9  ·          -  │
|  HealthInsuranceNFT  ·  fundPool               ·          -  ·          -  ·      22686  ·            6  ·          -  │
|  HealthInsuranceNFT  ·  purchasePolicy         ·     263770  ·     312998  ·     304771  ·            6  ·          -  │
|  HealthInsuranceNFT  ·  registerEncryptionKey  ·          -  ·          -  ·      46076  ·            2  ·          -  │
|  HealthInsuranceNFT  ·  rejectClaim            ·          -  ·          -  ·      73531  ·            2  ·          -  │
|  HealthInsuranceNFT  ·  setPlanActive          ·          -  ·          -  ·      28003  ·            2  ·          -  │
|  HealthInsuranceNFT  ·  submitClaim            ·     229550  ·     328291  ·     281444  ·            9  ·          -  │
·······················|·························|·············|·············|·············|···············|··············
|  Deployments                                                                                                           │
·················································|·············|·············|·············|···············|··············
|  HealthInsuranceNFT                            ·          -  ·          -  ·    3176363  ·        5.3 %  ·          -  │
·------------------------------------------------|-------------|-------------|-------------|---------------|-------------·
```

## 4. Tự kiểm theo checklist
- [x] Tạo 2 gói bảo hiểm đúng số liệu file 00 mục 6.2 (Gói Cơ bản 0.002 ETH, hạn mức 0.02 ETH, 30 ngày; Gói Nâng cao 0.005 ETH, hạn mức 0.05 ETH, 90 ngày).
- [x] Cấp quyền bệnh viện cho tài khoản #1 (`0x70997970C51812dc3A010C7d01b50e0d17dc79C8`).
- [x] Nạp quỹ khởi tạo 0.1 ETH.
- [x] Chạy lại không tạo trùng gói và không nạp trùng quỹ.
- [x] Không tạo gói trên Sepolia trong script seed (để Admin tự tạo trên UI).
- [x] ABI cuối cùng và address.json đã được sinh vào `frontend/src/contracts/`.

## 5. Chỗ KHÁC với file chặng
Không có (chép nguyên văn 100%).

## 6. Điều chưa chắc / câu hỏi cho người dùng
Không.

## 7. Việc cần người khác làm (luật R16 file 00)
Sau khi PR được merge vào main, nhắn nhóm: "H3 xong: contract hoàn chỉnh trên local + seed.js + ABI cuối. Chạy npx hardhat node, deploy.js, seed.js rồi đổi VITE_USE_MOCK=false để phát triển giao diện."

## 8. Đề xuất cải tiến (chỉ ghi, KHÔNG làm)
Không.

## 9. Bước tiếp theo
Chặng A09 — Màn hình Bệnh viện phần 1: Thiết lập khóa RSA và kiểm tra thẻ NFT (`A09_bv_khoa_va_kiem_tra_the.md`).
