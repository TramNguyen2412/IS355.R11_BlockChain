# FILE 1 — THIẾT KẾ TỔNG QUAN & SƯỜN BÁO CÁO

> **CẬP NHẬT 23/10/2026:** Tên sản phẩm là **MediChain** (tên smart contract trong code vẫn là `HealthInsuranceNFT`). Hợp đồng giao tiếp đóng băng nằm ở `docs/00_AI_RULES_AND_CONTRACTS.md` (file 00); nếu khác file này thì theo file 00. Phân công: A = Trâm, B = Phương Anh, C = Lan Anh.

**Đề tài:** Hệ thống quản lý bảo hiểm y tế phi tập trung (Decentralized Health Insurance Management DApp)
**Mục tiêu:** 9.5–10 điểm theo rubric của thầy
**Cách dùng bộ 3 file:**

| File | Dùng để làm gì |
|---|---|
| `01_THIET_KE_TONG_QUAN_VA_SUON_BAO_CAO.md` (file này) | Hiểu hệ thống, chốt thiết kế, có sườn viết báo cáo |
| `02_KE_HOACH_THUC_HIEN_VA_PHAN_CONG.md` | Biết làm gì trước, làm gì sau, ai làm gì, git chia sao |
| `03_CHECKLIST_RUBRIC_DEMO_VA_BAO_VE.md` | Tự chấm điểm, test case, kịch bản demo, câu hỏi bảo vệ |

> Nguyên tắc xuyên suốt: **rubric là luật**. Cái gì rubric có ghi thì phải có sản phẩm + minh chứng (ảnh, link, test pass). Cái gì không ghi thì làm vừa đủ.

---

## 0. BA ĐIỀU PHẢI HIỂU TRƯỚC KHI LÀM (vì cả nhóm sẽ bị hỏi)

**(1) Blockchain "bất biến" nghĩa là gì?**
Không sửa hay xóa được những gì đã ghi (block, giao dịch). Nhưng *trạng thái* của smart contract vẫn đổi được bằng giao dịch mới. Ví dụ: `usedAmount` từ 0 lên 2 ETH là một giao dịch mới, giá trị cũ vẫn nằm trong lịch sử. Code contract đã deploy thì không sửa được. Vì vậy phải test kỹ trước khi deploy lên Sepolia.

**(2) Blockchain không tự chạy.**
Contract không tự "thức dậy" vào giờ nào đó. Luôn cần *có ai đó gửi giao dịch* thì code mới chạy. Cho nên chữ "tự động phê duyệt" trong đề được hiểu là: *khi có người gọi `approveClaim()`, contract tự kiểm tra điều kiện và tự chuyển tiền, không có con người quyết định*. Câu này cần thuộc để trả lời thầy.

**(3) Dữ liệu trên blockchain và IPFS đều là công khai.**
Ai biết CID là tải được file trên IPFS. Ai có địa chỉ contract là đọc được mọi biến `public` và mọi tham số giao dịch. Vì vậy dữ liệu nhạy cảm **bắt buộc mã hóa trước khi đưa lên**, đây cũng chính là yêu cầu mã hóa trong Tiêu chí 2 của rubric. Mã hóa không phải trang trí, nó là cách duy nhất để giữ riêng tư.

---

## 1. ĐÁNH GIÁ BẢN KẾ HOẠCH CỦA GEMINI: GIỮ GÌ, SỬA GÌ, THÊM GÌ

Bản Gemini khá ổn về khung (4 module, 3 thành viên, nhắc rubric). Nhưng có các lỗ hổng sau, đều đã được sửa trong bộ file này:

| # | Vấn đề trong bản Gemini | Vì sao là vấn đề | Cách sửa trong bản này |
|---|---|---|---|
| 1 | Mã hóa AES nhưng **không nói ai giữ khóa** (`secretKey` đâu ra?) | Nếu khóa nằm trong code/frontend thì ai cũng lấy được, thầy hỏi là đứng hình. Bệnh nhân/bệnh viện/công ty bảo hiểm đều cần giải mã, dùng chung 1 khóa là sai | Dùng **mã hóa phong bì (envelope encryption)**: AES-256-GCM mã hóa dữ liệu, RSA-OAEP bọc khóa AES cho từng vai trò. Khớp luôn chữ "RSA, AES" trong rubric. Xem mục 7 |
| 2 | `purchasePolicy(encryptedHealthId, policyDocCID)`: để người mua **tự nhập CID** hợp đồng | Người dùng có thể nhét CID bậy. Hạn mức, giá, thời hạn cũng không có chỗ định nghĩa | Thêm **Plan (gói mẫu)** do công ty bảo hiểm tạo. Bệnh nhân chỉ chọn `planId`. Giá, hạn mức, thời hạn, PDF điều khoản lấy từ Plan |
| 3 | NFT thẻ bảo hiểm **chuyển nhượng được** | Người ta bán/tặng thẻ cho nhau thì "xác minh bằng NFT trong ví" mất ý nghĩa chống giả mạo | NFT là **soulbound** (khóa chuyển nhượng), chỉ mint và không transfer |
| 4 | `verifyInsurance(address)` trả về một `tokenId`, nhưng 1 ví có thể có nhiều NFT | Mơ hồ, dễ lỗi | Quy định **mỗi ví chỉ có 1 gói đang hiệu lực** (mapping `activePolicyOf`). Hết hạn mới mua lại được |
| 5 | Bệnh viện submit và "xác nhận" gộp một. Rubric lại nói *"Bệnh nhân **hoặc** bệnh viện gửi yêu cầu"* và *"chỉ bệnh viện mới xác nhận chi phí"* | Thiếu bước bệnh viện xác nhận khi bệnh nhân tự gửi | Tách thành `submitClaim` (bệnh nhân hoặc bệnh viện) → `confirmClaim` (chỉ bệnh viện) → `approveClaim` (contract tự kiểm tra rồi chi trả) |
| 6 | Không nói **quỹ bảo hiểm** lấy tiền đâu để bồi thường | Contract không đủ tiền thì chi trả revert, demo hỏng | Thêm `fundPool()` cho công ty bảo hiểm nạp quỹ + kiểm tra `address(this).balance` khi chi trả |
| 7 | Để **JWT Pinata trong frontend** mà không cảnh báo | Lộ key lên GitHub là bị lấy và bị khóa tài khoản | `.gitignore`, `.env.example`, không commit key. Ghi vào mục "Hạn chế" của báo cáo |
| 8 | Chọn Streamlit hay React cho "nhanh" mà không phân tích | Streamlit + Web3.py thường phải để private key trong app, khó ký giao dịch bằng MetaMask, khó demo 3 vai trò | **Chốt React + Vite + Ethers.js v6 + MetaMask**. Có thêm 1 script Web3.py nhỏ (tùy chọn) để khớp tên Tiêu chí 2 và nối với lab 2 |
| 9 | Chia 3 người nhưng C (Lan Anh) gánh cả giao diện 3 màn hình + ghép + format báo cáo + slide + video | Quá tải, dễ trễ | Chia lại: mỗi người **sở hữu 1 màn hình** + 1 module lõi. Xem file 02 |
| 10 | Thiếu: test chi tiết, gas, Etherscan verify, kịch bản demo, dữ liệu mẫu, ví demo, ETH faucet, câu hỏi bảo vệ | Đây là chỗ rớt điểm "oan" | Có đủ trong file 02 và 03 |

**Phần Gemini làm tốt, giữ nguyên:** cấu trúc thư mục tách lãnh địa, 3 loại dữ liệu IPFS, ghi rõ cỡ chữ và phụ đề video, nhắc phần "kỹ thuật thực hiện ràng buộc" trong báo cáo.

**Chốt ngôn ngữ:** đề bài (Bước 2) ghi viết bằng **Solidity**, báo cáo khóa trước cũng dùng Solidity + Hardhat nên đi theo hướng này là an toàn. Lab của lớp dùng Vyper + Ape, nên trong báo cáo thêm **1 đoạn ngắn so sánh Vyper và Solidity** và lý do chọn Solidity (có OpenZeppelin ERC-721 và AccessControl chuẩn, tài liệu nhiều). Vừa thể hiện hiểu bài, vừa khớp với lab.

---

## 2. CÔNG NGHỆ CHỐT

| Lớp | Công nghệ | Lý do |
|---|---|---|
| Smart contract | Solidity `^0.8.20`, OpenZeppelin v5 (`ERC721`, `AccessControl`, `ReentrancyGuard`, tùy chọn `Pausable`) | Chuẩn, ít lỗi, tự chống tràn số từ 0.8 |
| Dev/test/deploy | Hardhat + ethers v6 + Mocha/Chai | Test nhanh trên mạng local, deploy được Sepolia, có plugin verify Etherscan |
| Mạng | Hardhat local (dev) → **Sepolia testnet** (nộp) | Rubric bắt buộc testnet |
| RPC | Alchemy hoặc Infura (free), hoặc public RPC | Cần endpoint để deploy và frontend đọc |
| Tiền | ETH Sepolia (SepoliaETH) | Không cần tự làm ERC-20 cho gọn. Rubric cho "ERC-20 **hoặc** NFT" |
| Token | **ERC-721 soulbound** (thẻ bảo hiểm) | Đúng nguyên văn đề |
| Lưu trữ | IPFS qua **Pinata** | Nhiều người dùng, demo dễ |
| Mã hóa | WebCrypto của trình duyệt: **AES-256-GCM** + **RSA-OAEP 2048** | Có sẵn trong trình duyệt, khỏi cài thư viện |
| Frontend | React + Vite + Ethers.js v6 + MetaMask | Ký giao dịch thật bằng ví |
| Web3.py (tùy chọn) | Script Python đọc event, in thống kê | Khớp tên tiêu chí 2, nối với lab 2 |
| Không dùng | MySQL, MongoDB, backend riêng | Tránh "phi tập trung giả" |

> Phiên bản thư viện (Hardhat, OpenZeppelin, ethers) đổi khá nhanh. Khi cài, đọc docs bản hiện hành. Nếu cú pháp lệch với ví dụ trong file này thì làm theo docs, đừng sửa sai cả hướng đi.

---

## 3. KIẾN TRÚC TỔNG THỂ

```text
                        ┌────────────────────────────────────────┐
                        │   TRÌNH DUYỆT (React DApp)             │
                        │   ┌──────────┬───────────┬──────────┐  │
  Người dùng ──MetaMask─┼──►│ Bệnh nhân│ Bệnh viện │ Cty BH   │  │
                        │   └────┬─────┴─────┬─────┴────┬─────┘  │
                        │        │  Role router (đọc role từ contract)
                        │   ┌────▼───────────▼──────────▼─────┐  │
                        │   │ cryptoService (AES-GCM + RSA)   │  │
                        │   │ ipfsService (Pinata upload/get) │  │
                        │   │ contractService (ethers v6)     │  │
                        │   └────┬──────────────────────┬─────┘  │
                        └────────┼──────────────────────┼────────┘
                                 │ CID, ciphertext      │ giao dịch ký bằng MetaMask
                        ┌────────▼────────┐   ┌─────────▼──────────────────────┐
                        │ IPFS (Pinata)   │   │ Ethereum Sepolia                │
                        │ OFF-CHAIN       │   │ HealthInsuranceNFT.sol (ON-CHAIN)│
                        │ PDF, ảnh, JSON  │   │ Plan, Policy(NFT), Claim, quỹ    │
                        └─────────────────┘   └─────────────────────────────────┘
```

Ý chính để viết báo cáo mục 3.3: **tiền, trạng thái, quyền, hạn mức, CID** nằm trên chain (cần minh bạch, không sửa được). **File lớn và dữ liệu nhạy cảm đã mã hóa** nằm trên IPFS (rẻ gas). Contract chỉ lưu CID làm "con trỏ".

---

## 4. TÁC NHÂN VÀ PHÂN QUYỀN (RBAC)

| Tác nhân | Nhận diện bằng | Việc được làm |
|---|---|---|
| **Công ty bảo hiểm (Insurer/Admin)** | `DEFAULT_ADMIN_ROLE` (ví deploy contract) | Tạo gói bảo hiểm, bật/tắt gói, cấp/thu hồi quyền bệnh viện, nạp quỹ, từ chối claim nghi ngờ, xem và giải mã hồ sơ, xem thống kê |
| **Bệnh viện** | `HOSPITAL_ROLE` | Kiểm tra thẻ NFT bệnh nhân, gửi claim thay bệnh nhân, **xác nhận chi phí điều trị** |
| **Bệnh nhân** | Bất kỳ ví nào (không cần role) | Mua gói, nhận NFT, xem hạn mức còn lại, gửi claim, theo dõi trạng thái |
| **Người ngoài (ví thứ 4)** | Không role, không NFT | Không làm được gì ngoài đọc dữ liệu công khai. Dùng để **demo RBAC chặn** |

Frontend lấy vai trò bằng cách hỏi contract (`hasRole`), không tự đoán theo địa chỉ cứng trong code.

---

## 5. THIẾT KẾ SMART CONTRACT `HealthInsuranceNFT.sol`

### 5.1. Kiểu dữ liệu

```solidity
struct Plan {
    uint256 id;
    string  name;
    uint256 price;          // phí mua (wei)
    uint256 coverageLimit;  // hạn mức tối đa (wei)
    uint256 durationDays;   // thời hạn hiệu lực
    string  policyDocCID;   // CID file PDF điều khoản trên IPFS
    bool    active;
}

struct Policy {             // gắn với tokenId của NFT
    uint256 tokenId;
    uint256 planId;
    address holder;
    string  encryptedHealthId;   // mã số BH, đã mã hóa RSA-OAEP bằng khóa công khai của cty BH
    uint256 coverageLimit;
    uint256 usedAmount;          // đã bồi thường
    uint256 startDate;
    uint256 expiryDate;
    string  policyDocCID;
}

enum ClaimStatus { PENDING, APPROVED, REJECTED }

struct Claim {
    uint256 claimId;
    uint256 tokenId;
    address patient;
    address hospital;            // điền khi bệnh viện xác nhận
    uint256 amount;              // số tiền yêu cầu
    uint256 confirmedAmount;     // số tiền bệnh viện xác nhận
    bool    hospitalConfirmed;
    string  billCID;             // hóa đơn viện phí
    string  recordCID;           // JSON bệnh án/xét nghiệm (đã mã hóa)
    ClaimStatus status;
    uint256 createdAt;
    uint256 resolvedAt;
}
```

> Vì sao không lưu `encryptedDiagnosis` ngay trong claim như bản Gemini? Dữ liệu càng dài thì gas càng cao, còn CID của JSON đã là "mã băm nội dung" chứng minh dữ liệu không bị sửa. Chẩn đoán bệnh nằm trong `recordCID` (đã mã hóa). Trong báo cáo ghi rõ: **CID = mã băm nội dung của bằng chứng y tế**, đáp ứng yêu cầu "kèm mã hash bằng chứng y tế" của rubric.

### 5.2. Danh sách hàm (hợp đồng giao tiếp: CHỐT, không đổi tên nếu chưa thống nhất cả nhóm theo file 00 mục 8.1)

| Hàm | Ai gọi | Mục đích | Kiểm tra (require) | Event |
|---|---|---|---|---|
| `createPlan(name, price, coverageLimit, durationDays, policyDocCID)` | Admin | Tạo gói mẫu | `onlyRole(ADMIN)`, price>0, limit>0 | `PlanCreated` |
| `setPlanActive(planId, active)` | Admin | Bật/tắt gói | admin, plan tồn tại | `PlanStatusChanged` |
| `authorizeHospital(hospital, status)` | Admin | Cấp/thu hồi quyền bệnh viện | admin, địa chỉ khác 0 | `HospitalAuthorized` |
| `fundPool()` payable | Admin (hoặc ai cũng được) | Nạp quỹ bồi thường | `msg.value>0` | `PoolFunded` |
| `registerEncryptionKey(rsaPublicKey)` | Mọi vai trò | Đăng ký khóa công khai RSA để người khác bọc khóa AES cho mình | chuỗi không rỗng | `EncryptionKeyRegistered` |
| **`purchasePolicy(planId, encryptedHealthId)`** payable | Bệnh nhân | **Nghiệp vụ 1:** mua gói, trả phí, **mint NFT** | plan active, `msg.value == price`, ví chưa có gói còn hạn | `PolicyPurchased` |
| `verifyInsurance(patient)` view | Bệnh viện/ai cũng gọi | **Verification NFT** | không revert, trả `(isValid, tokenId, remainingLimit, expiryDate)` | |
| **`submitClaim(tokenId, amount, billCID, recordCID)`** | Bệnh nhân (chủ NFT) hoặc bệnh viện | **Nghiệp vụ 2:** gửi yêu cầu bồi thường | gói còn hạn, `amount>0`, `amount <= remaining`, CID không rỗng, chủ NFT hoặc có role bệnh viện | `ClaimSubmitted` |
| `confirmClaim(claimId, confirmedAmount)` | **Chỉ bệnh viện** | **Ràng buộc 1:** xác nhận chi phí điều trị | `onlyRole(HOSPITAL)`, claim PENDING, `confirmedAmount <= amount` | `ClaimConfirmed` |
| **`approveClaim(claimId)`** | Ai cũng gọi được, contract tự quyết | **Nghiệp vụ 3:** kiểm tra điều kiện rồi chi trả | xem 5.3 | `ClaimApproved` |
| `rejectClaim(claimId, reason)` | Admin | Từ chối claim nghi ngờ gian lận | admin, claim PENDING | `ClaimRejected` |
| Hàm đọc | Ai cũng gọi | `getPlans()`, `getPolicy(tokenId)`, `getClaim(id)`, `getClaimsByPatient(addr)`, `totalClaims()`, `poolBalance()` | | |

Nếu `submitClaim` do **bệnh viện** gọi thì claim tự động `hospitalConfirmed = true`, `confirmedAmount = amount`, `hospital = msg.sender`. Nếu do **bệnh nhân** gọi thì phải chờ bệnh viện `confirmClaim`.

### 5.3. Hai ràng buộc logic bắt buộc + kỹ thuật thực hiện (phần ăn điểm Tiêu chí 1)

**Ràng buộc 1 — kiểm tra quyền (RBAC):** chỉ ví bệnh viện được cấp quyền mới xác nhận được chi phí.

```solidity
bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");

function confirmClaim(uint256 claimId, uint256 confirmedAmount)
    external onlyRole(HOSPITAL_ROLE)   // ví lạ gọi là revert ngay
{ ... }
```
Giải thích: `AccessControl` của OpenZeppelin lưu `role → danh sách địa chỉ`. Modifier `onlyRole` kiểm tra `hasRole(role, msg.sender)` trước khi chạy thân hàm. Admin cấp quyền bằng `authorizeHospital` (nội bộ gọi `grantRole`/`revokeRole`).

**Ràng buộc 2 — hạn mức và thời hạn:** tiền bồi thường không bao giờ vượt hạn mức gói đã mua.

```solidity
Policy storage p = policies[c.tokenId];
require(block.timestamp <= p.expiryDate, "Bao hiem da het han");
require(p.usedAmount + amt <= p.coverageLimit, "Vuot qua han muc bao hiem");
require(address(this).balance >= amt, "Quy bao hiem khong du");
```

**Chống reentrancy khi chi trả (viết vào báo cáo):** dùng `nonReentrant` và đúng thứ tự *Checks → Effects → Interactions*:

```solidity
function approveClaim(uint256 claimId) external nonReentrant {
    Claim storage c = claims[claimId];
    require(c.status == ClaimStatus.PENDING, "Claim da xu ly");
    require(c.hospitalConfirmed, "Benh vien chua xac nhan");
    uint256 amt = c.confirmedAmount;
    Policy storage p = policies[c.tokenId];
    require(block.timestamp <= p.expiryDate, "Bao hiem da het han");
    require(p.usedAmount + amt <= p.coverageLimit, "Vuot qua han muc bao hiem");
    require(address(this).balance >= amt, "Quy bao hiem khong du");

    c.status = ClaimStatus.APPROVED;      // EFFECTS trước
    c.resolvedAt = block.timestamp;
    p.usedAmount += amt;

    (bool ok, ) = payable(c.patient).call{value: amt}("");   // INTERACTION sau cùng
    require(ok, "Chuyen tien that bai");
    emit ClaimApproved(claimId, c.patient, amt);
}
```

Chú ý các trường hợp biên đã gặp khi nghĩ thiết kế:
- Một bệnh nhân gửi 2 claim cùng lúc, mỗi cái đều ≤ hạn mức còn lại nhưng cộng lại thì vượt. Vì vậy `approveClaim` phải **kiểm tra lại hạn mức** (đoạn trên đã làm).
- Chi trả bằng `call` và kiểm tra `ok`, không dùng `transfer`.

### 5.4. NFT thẻ bảo hiểm (Tiêu chí 4)

- `purchasePolicy` gọi `_safeMint(msg.sender, tokenId)`. **Đây là nghiệp vụ Minting.**
- `verifyInsurance` đọc `activePolicyOf[patient]`, kiểm tra `ownerOf(tokenId) == patient` và `block.timestamp <= expiryDate`. **Đây là nghiệp vụ Verification.**
- Khóa chuyển nhượng (soulbound), ghi vào báo cáo là điểm cộng thiết kế:

```solidity
function _update(address to, uint256 tokenId, address auth)
    internal override returns (address)
{
    address from = _ownerOf(tokenId);
    require(from == address(0) || to == address(0), "Soulbound: khong the chuyen nhuong");
    return super._update(to, tokenId, auth);
}
```
- `tokenURI(tokenId)` trả về `ipfs://<policyDocCID>` (hoặc JSON metadata nếu còn thời gian).
- Nhớ override `supportsInterface` vì cùng kế thừa `ERC721` và `AccessControl`.

> Với kiểm tra "NFT còn hiệu lực": thông tin hạn dùng và hạn mức nằm trong struct `Policy`, tra theo `tokenId`. Giao diện bệnh viện hiển thị "Thẻ #1 hợp lệ, còn X ETH, hết hạn ngày Y".

### 5.5. Mô hình Parametric Insurance (lưu ý trong đề)

Điều kiện kích hoạt chi trả được **viết cứng trong contract**: bệnh viện hợp lệ đã xác nhận ∧ thẻ còn hạn ∧ số tiền ≤ hạn mức còn lại ∧ quỹ đủ. Thỏa hết thì `approveClaim` tự chuyển tiền, không cần con người duyệt. Ghi vào báo cáo hai điểm trung thực:
1. Dữ liệu đầu vào đến từ **bệnh viện được ủy quyền**, tức là phụ thuộc niềm tin vào bệnh viện (bài toán *oracle*). Hướng giảm thiểu: chỉ admin mới cấp quyền bệnh viện, mọi xác nhận đều có event truy vết được.
2. `rejectClaim` của admin là "van an toàn" khi nghi ngờ gian lận, nên mức độ tự động là *bán tự động có kiểm soát*.

---

## 6. THIẾT KẾ DỮ LIỆU: ON-CHAIN / OFF-CHAIN

| Dữ liệu | Nơi lưu | Lý do |
|---|---|---|
| Tiền, quỹ, phí | On-chain | Cần chính xác, minh bạch |
| Plan, Policy (hạn mức, đã dùng, hạn dùng), trạng thái Claim | On-chain | Contract cần đọc để kiểm tra điều kiện |
| Quyền (role) | On-chain | RBAC |
| `encryptedHealthId` | On-chain (ciphertext ngắn) | Nhỏ, đã mã hóa |
| Khóa công khai RSA của từng vai trò | On-chain | Để người khác bọc khóa cho mình |
| **File PDF điều khoản** | IPFS (CID trên chain) | File lớn |
| **Ảnh/PDF hóa đơn viện phí** | IPFS (CID trên chain) | File lớn, bằng chứng |
| **JSON bệnh án/xét nghiệm đã mã hóa** | IPFS (CID trên chain) | Nhạy cảm, có thể dài |
| Khóa riêng RSA | **Chỉ ở trình duyệt người dùng** | Không bao giờ rời máy |

### 3 loại dữ liệu IPFS (khớp Tiêu chí 3)

1. **PDF hợp đồng bảo hiểm** (`Policy_Document.pdf`): công ty bảo hiểm tải lên khi tạo gói. CID nằm trong `Plan`.
2. **Hóa đơn viện phí** (`Medical_Bill.png/.pdf`): tải lên khi gửi claim. CID là `billCID`. Có thể mã hóa file trước khi tải (khuyến nghị).
3. **JSON bệnh án/kết quả xét nghiệm** (`Medical_Record.json`): CID là `recordCID`. Cấu trúc gợi ý:

```json
{
  "version": 1,
  "visitDate": "2026-11-02",
  "hospitalName": "Bệnh viện Demo",
  "billCID": "bafy...",
  "cipher": {
    "alg": "AES-256-GCM",
    "iv": "base64...",
    "data": "base64... (chẩn đoán, kết quả xét nghiệm đã mã hóa)"
  },
  "keyWraps": {
    "0xPatient...":  "base64... (khóa AES bọc bằng RSA công khai của bệnh nhân)",
    "0xHospital...": "base64...",
    "0xInsurer...":  "base64..."
  }
}
```

Thao tác bắt buộc: **Upload** (khi gửi claim) và **Retrieve** (công ty bảo hiểm lấy CID từ chain, tải JSON/ảnh từ gateway, giải mã để xem).

> **Về "kiểm soát truy cập RBAC cho tài nguyên IPFS" (rubric Tiêu chí 3):** IPFS tự nó không có phân quyền. Mình đạt được RBAC bằng **hai lớp**: (a) mã hóa, chỉ người có phần `keyWraps` đúng ví mới giải mã được; (b) giao diện chỉ hiện nút "Giải mã & xem" cho đúng vai trò (kiểm tra `hasRole`/chủ NFT từ contract). Demo bằng ví thứ 4: có CID nhưng giải mã thất bại. Viết thẳng điều này vào báo cáo, thầy sẽ đánh giá cao việc hiểu giới hạn của IPFS.

---

## 7. THIẾT KẾ MÃ HÓA (Tiêu chí 2 + 3)

**Mô hình: mã hóa phong bì (envelope encryption), kết hợp hai thuật toán đối xứng và bất đối xứng.**

1. **Khởi tạo khóa (1 lần cho mỗi ví):** trình duyệt tạo cặp khóa **RSA-OAEP 2048**. Khóa công khai gọi `registerEncryptionKey()` đưa lên contract. Khóa riêng lưu `localStorage`, có nút **Xuất/Nhập khóa** để sao lưu (mất khóa = mất quyền giải mã, ghi vào hạn chế).
2. **Mã hóa mã số bảo hiểm:** `encryptedHealthId = RSA-OAEP(publicKey_cty_BH, healthId)`. Chuỗi này ngắn (dưới 190 byte), nằm trên chain. Chỉ công ty bảo hiểm giải mã được. Bệnh nhân biết số của mình nên không cần giải mã.
3. **Mã hóa hồ sơ bệnh án:** sinh khóa `K` ngẫu nhiên AES-256, mã hóa `Medical_Record` bằng **AES-256-GCM** (GCM có sẵn kiểm tra toàn vẹn). Sau đó bọc `K` bằng RSA công khai của **bệnh nhân, bệnh viện gửi, công ty bảo hiểm** → ghi vào `keyWraps`.
4. **Giải mã:** người dùng lấy phần `keyWraps[ví của mình]`, dùng khóa riêng RSA mở `K`, rồi giải mã AES.

Các hàm cần có trong `cryptoService`:

```text
generateRsaKeyPair()                         -> { publicKeyPem, privateKeyPem }
rsaEncrypt(publicKeyPem, plainText)          -> base64
rsaDecrypt(privateKeyPem, base64)            -> plainText
generateAesKey()                             -> CryptoKey
aesEncrypt(plainText, aesKey)                -> { iv, data }       // AES-256-GCM
aesDecrypt({ iv, data }, aesKey)             -> plainText
wrapKey(aesKey, publicKeyPem)                -> base64
unwrapKey(base64, privateKeyPem)             -> CryptoKey
buildEncryptedRecord(record, recipients[])   -> jsonObject (có keyWraps)
openEncryptedRecord(jsonObject, myAddress, myPrivateKeyPem) -> record
```

**Phương án dự phòng nếu nhóm bị kẹt tiến độ (chỉ dùng khi bắt buộc):** một khóa AES chung đặt trong biến môi trường, ghi rõ trong báo cáo đây là bản đơn giản hóa và hạn chế là không phân biệt người dùng. Ít điểm hơn nhưng vẫn đạt yêu cầu "có mã hóa AES".

---

## 8. CÁC LUỒNG NGHIỆP VỤ (dùng vẽ 4–5 sơ đồ BPMN)

**Luồng 1 — Thiết lập hệ thống (Công ty bảo hiểm):**
Deploy contract → Admin tạo gói (upload PDF điều khoản lên IPFS lấy CID) → `createPlan` → `authorizeHospital` cấp quyền ví bệnh viện → `fundPool` nạp quỹ → mọi bên `registerEncryptionKey`.

**Luồng 2 — Mua bảo hiểm & phát hành NFT (Bệnh nhân):**
Xem danh sách gói (hiện link PDF) → nhập mã số BH → trình duyệt mã hóa RSA → `purchasePolicy(planId, encryptedHealthId)` kèm ETH → contract kiểm tra (gói active, đúng giá, chưa có gói còn hạn) → mint NFT soulbound → bệnh nhân thấy thẻ trong dashboard.

**Luồng 3 — Khám chữa bệnh & gửi yêu cầu bồi thường (Bệnh viện):**
Nhập ví bệnh nhân → `verifyInsurance` (hiện "Thẻ #id hợp lệ, còn X ETH") → nhập chi phí, chẩn đoán → trình duyệt tạo khóa AES, mã hóa hồ sơ, bọc khóa cho 3 vai trò → upload hóa đơn và JSON lên IPFS lấy CID → `submitClaim`. (Nhánh phụ: bệnh nhân tự gửi → bệnh viện `confirmClaim`.)

**Luồng 4 — Duyệt và chi trả (Công ty bảo hiểm / contract):**
Console liệt kê claim → (tùy chọn) lấy CID từ chain, tải hồ sơ từ IPFS, giải mã để xem → bấm `approveClaim` → contract kiểm tra: đã xác nhận bởi bệnh viện, còn hạn, ≤ hạn mức, quỹ đủ → cập nhật `usedAmount` → chuyển ETH về ví bệnh nhân → event `ClaimApproved`. Nhánh lỗi: vượt hạn mức/hết hạn → revert; nghi ngờ → `rejectClaim`.

**Luồng 5 — Giám sát (Công ty bảo hiểm):**
Đọc event (`PolicyPurchased`, `ClaimSubmitted`, `ClaimApproved`...) bằng `getLogs`/`queryFilter` → bảng giao dịch on-chain + thống kê: tổng phí thu, tổng đã chi, số claim theo trạng thái, số dư quỹ.

---

## 9. ÁNH XẠ RUBRIC → HẠNG MỤC SẢN PHẨM (đọc kỹ, đây là "bản đồ điểm")

| Tiêu chí | Yêu cầu rubric | Hạng mục đáp ứng | Minh chứng cho báo cáo |
|---|---|---|---|
| **1. Smart contract (10đ)** | ≥3 nghiệp vụ | `purchasePolicy`, `submitClaim`, `approveClaim` (+ `confirmClaim`, `verifyInsurance`) | Code có chú thích, bảng hàm |
| | ≥2 ràng buộc logic và **trình bày kỹ thuật** | `onlyRole(HOSPITAL_ROLE)`; `usedAmount + amt <= coverageLimit` và hạn dùng | Mục riêng "Kỹ thuật thực hiện ràng buộc", cắt đoạn code ra giải thích |
| | Triển khai + kiểm thử trên testnet | Deploy Sepolia, verify Etherscan, test `npx hardhat test` pass | Địa chỉ contract, ảnh Etherscan, ảnh test |
| | Minh họa giải thích các chức năng | Bảng 5.2 + sơ đồ luồng | |
| **2. Frontend (10đ)** | ≥3 chức năng on-chain (gửi giao dịch, đọc, hiển thị trạng thái) | Mua gói, gửi claim, xác nhận, duyệt (gửi tx); xem thẻ, hạn mức (đọc); trạng thái claim (hiển thị) | Ảnh các màn hình |
| | Tối đa 1 lỗi giao dịch khi demo | Kịch bản demo + chạy thử nhiều lần + video dự phòng | File 03 |
| | Mã hóa input/output nhạy cảm (RSA, AES) | Mục 7 | Ảnh ciphertext trên Etherscan/IPFS |
| | Dashboard bệnh nhân; Console công ty BH theo dõi giao dịch + thống kê | Luồng 5 | |
| **3. IPFS (10đ)** | ≥3 loại dữ liệu | PDF, hóa đơn ảnh, JSON bệnh án | Ảnh Pinata + 3 CID |
| | ≥2 thao tác upload + retrieve | Upload khi gửi claim, retrieve ở console | Demo |
| | RBAC truy cập tài nguyên | Mã hóa keyWraps + ẩn nút theo vai trò | Demo ví thứ 4 bị chặn |
| **4. Token (10đ)** | ≥1 token ERC-20/NFT | ERC-721 thẻ bảo hiểm | Ảnh NFT trong ví / Etherscan token tracker |
| | ≥2 nghiệp vụ token | Minting và Verification (thêm: soulbound) | |
| | Kiểm thử hoặc demo giao dịch | Test + demo | |
| **5. Báo cáo & thuyết trình (10đ)** | Chính tả, số trang/slide, caption, bảng viết tắt, tài liệu tham khảo, cỡ chữ Word >14 và slide >18, tương phản màu, video có caption | Checklist riêng ở file 03 mục 1 | |

---

## 10. SƯỜN BÁO CÁO (SOẠN SƯỜN: ĐỌC LÀ BIẾT VIẾT GÌ)

Mỗi mục ghi **ý chính cần có**, **hình/bảng cần chèn**. Tên người phụ trách theo file 02 (A = Thành viên 1, B = Thành viên 2, C = Thành viên 3).

### Phần mở đầu (C ghép)
Bìa, nhận xét GVHD, lời cảm ơn, mục lục, danh mục hình, danh mục bảng, **bảng chữ viết tắt** (xem file 03 mục 6), (tùy) tóm tắt đồ án.

### CHƯƠNG 1. GIỚI THIỆU (B)
- **1.1 Đặt vấn đề:** 4 nỗi đau của bảo hiểm y tế truyền thống: thủ tục giấy tờ chậm, khó kiểm chứng hóa đơn (dễ làm giả), thiếu minh bạch giữa 3 bên, bồi thường thủ công tốn chi phí. Nên có 1–2 con số/ví dụ có nguồn (nhớ trích dẫn).
- **1.2 Mục tiêu:** DApp bảo hiểm tham số, NFT thẻ bảo hiểm, IPFS + mã hóa bảo vệ hồ sơ.
- **1.3 Phạm vi và giới hạn:** testnet Sepolia, 3 tác nhân, 5 luồng; không tích hợp hệ thống BHYT thật, không kết nối dữ liệu bệnh viện thật.
- **1.4 Phương pháp:** tài liệu → thiết kế BPMN → hiện thực → kiểm thử → đánh giá.
- **1.5 Bố cục báo cáo** (1 đoạn).

### CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ
Mỗi mục **ngắn, 1–2 trang**, có sơ đồ/ví dụ gắn với đề tài. Không chép lại giáo trình.
- **2.1 Blockchain, Ethereum, EVM, gas, tính bất biến** (A). Nhớ giải thích đúng ý bất biến như mục 0 của file này.
- **2.2 Smart contract và Solidity** (A). Kèm đoạn so sánh Vyper và Solidity (bảng 5–6 dòng).
- **2.3 ERC-721, NFT, soulbound token** (A). Phân biệt fungible và non-fungible (ví dụ thẻ Pokemon trong lab 5).
- **2.4 Bảo hiểm tham số (Parametric Insurance)** (A). Nguyên lý, ưu/nhược, vấn đề oracle.
- **2.5 IPFS, CID, Pinata** (B). Định danh theo nội dung, vì sao sửa file thì CID đổi.
- **2.6 Mã hóa AES-256-GCM, RSA-OAEP, mã hóa phong bì; RBAC** (B).
- **2.7 Công cụ phát triển DApp:** Hardhat, Ethers.js, MetaMask, React/Vite, Web3.py (C).

### CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG (chương trọng tâm)
- **3.1 Tác nhân và phân quyền RBAC** (B): bảng mục 4. Có sơ đồ Use Case.
- **3.2 Yêu cầu chức năng (RF) và phi chức năng (RNF)** (B): đánh mã RF-01…, RNF-01…, mỗi mã nối với hàm contract. RNF: bảo mật, riêng tư, minh bạch, chi phí gas, khả dụng.
- **3.3 Kiến trúc tổng thể** (C): sơ đồ mục 3 + mô tả từng lớp.
- **3.4 Các luồng nghiệp vụ, 4–5 sơ đồ BPMN** (B): mục 8. Mỗi sơ đồ có đoạn mô tả bên dưới (như báo cáo bầu cử đã làm).
- **3.5 Thiết kế lưu trữ on-chain/off-chain** (B): bảng mục 6, 3 loại dữ liệu IPFS, cấu trúc JSON.
- **3.6 Thiết kế smart contract** (A): bảng struct, bảng hàm, sơ đồ trạng thái Claim (PENDING → APPROVED/REJECTED), bảng events.
- **3.7 Thiết kế bảo mật và mã hóa** (B): sơ đồ envelope encryption mục 7.

### CHƯƠNG 4. HIỆN THỰC HỆ THỐNG
- **4.1 Môi trường và công cụ** (C): bảng công nghệ + phiên bản thực tế đang dùng.
- **4.2 Hiện thực smart contract** (A): từng nghiệp vụ, cắt code + giải thích.
  - **Mục con bắt buộc: "Kỹ thuật thực hiện các ràng buộc logic"** (mục 5.3).
  - Mục con: hiện thực NFT + soulbound (mục 5.4).
- **4.3 Hiện thực IPFS và kiểm soát truy cập** (B): code upload/retrieve, ảnh Pinata, giải thích RBAC 2 lớp.
- **4.4 Hiện thực mã hóa** (B): code hàm, ảnh ciphertext trước/sau.
- **4.5 Hiện thực giao diện DApp** (A viết phần Bệnh viện, B phần Công ty BH, C phần Bệnh nhân + kết nối ví): ảnh từng màn hình có chú thích.
- **4.6 Triển khai trên Sepolia** (A): địa chỉ contract, ảnh Etherscan (deploy, mint, claim, approve), ảnh verify code.

### CHƯƠNG 5. KIỂM THỬ, ĐÁNH GIÁ
- **5.1 Kịch bản và kết quả unit test** (A): bảng test case (file 03 mục 2) + ảnh `passing`.
- **5.2 Kiểm thử end-to-end trên Sepolia** (C): kịch bản demo, ảnh/ảnh giao dịch.
- **5.3 Đánh giá bảo mật** (A+B): reentrancy, tràn số, RBAC, riêng tư dữ liệu, soulbound. Có bảng "mối đe dọa → biện pháp".
- **5.4 Chi phí gas** (A): bảng gas từng hàm (lấy từ `hardhat-gas-reporter` hoặc từ Etherscan).
- **5.5 Đối chiếu rubric** (C): bảng mục 9.

### CHƯƠNG 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN (C)
- Kết quả đạt được.
- **Hạn chế (viết thật, đừng khoe quá):** phụ thuộc bệnh viện được ủy quyền (oracle), mất khóa RSA là mất quyền giải mã, JWT Pinata nằm ở frontend, ciphertext vẫn công khai vĩnh viễn trên chain nên cần thuật toán đủ mạnh, mới chạy testnet, chưa audit.
- **Hướng phát triển:** backend ký upload IPFS, DID/Verifiable Credentials, Zero-Knowledge Proof, oracle thật cho dữ liệu bệnh viện, nhiều gói và tái tục, tính phí theo rủi ro, Layer 2.

### Tài liệu tham khảo (mọi người cùng góp, C ghép)
EIP-721, EIP-20 (nếu nhắc), OpenZeppelin Docs, Solidity Docs, Hardhat Docs, ethers.js v6 Docs, IPFS Docs, Pinata Docs, MetaMask Docs, MDN WebCrypto API, NIST về AES/RSA (nếu muốn). Ghi theo một chuẩn trích dẫn thống nhất (IEEE như 2 báo cáo cũ).

---

## 11. NHỮNG THỨ PHỤ MÀ BẢN GEMINI KHÔNG NHẮC (nên có để lên 10 điểm)

1. **Dữ liệu demo cố định:** 1 PDF điều khoản đẹp, 2 hóa đơn, 2 bệnh án mẫu (xem file 02, Thành viên 2). Dữ liệu giả, **không dùng thông tin thật của người thật**.
2. **Script `seed.js`:** chạy 1 lệnh là tạo sẵn gói, cấp quyền bệnh viện, nạp quỹ. Demo và tập dượt lặp lại được.
3. **Thông báo lỗi dễ hiểu:** map lý do revert (`"Vuot qua han muc bao hiem"`) ra tiếng Việt trên giao diện.
4. **Hiển thị hash giao dịch + link Etherscan** sau mỗi thao tác.
5. **Verify contract trên Etherscan:** có tab Read/Write Contract, thầy xem trực tiếp được, rất thuyết phục.
6. **Ví demo:** 4 tài khoản MetaMask (Admin, Bệnh viện, Bệnh nhân, Người ngoài) và đủ ETH Sepolia trước ngày demo.
7. **Video demo dự phòng có phụ đề** (rubric yêu cầu caption trong video).
8. **Trang "Hạn chế và hướng phát triển" trung thực:** thầy ưu ái nhóm biết mình thiếu gì hơn nhóm nói quá tay (2 báo cáo cũ đều bị yếu ở chỗ nói quá hoặc thiếu minh chứng).
