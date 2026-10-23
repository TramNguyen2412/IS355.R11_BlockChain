# CHẶNG A02 — Viết bản KHUNG contract

> **Mã master:** A-02 · **Hạn:** Thứ 5 22/10 · **Rubric:** 1 · **Nhánh:** `tram` · **Cần trước:** A01 xong, `npx hardhat compile` chạy được.

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Viết "bộ xương" của contract `HealthInsuranceNFT`: khai báo **đủ** các cấu trúc dữ liệu (Plan, Policy, Claim), 10 sự kiện (event), các biến lưu trữ, và **tên + chữ ký của tất cả hàm** đúng file 00 mục 4.2. Thân các hàm ghi chưa làm (`revert("TODO")`). Mục đích: B (Phương Anh) và C (Lan Anh) có tên hàm và ABI chuẩn để viết giao diện từ sớm, không ai phải chờ A (Trâm) làm xong logic. Tên hàm là **đóng băng**: sai một chữ là cả nhóm lệch.

## 1. Nạp ngữ cảnh (AI phải đọc)
`docs/00_AI_RULES_AND_CONTRACTS.md` mục 1, 2.4, **4.1, 4.2 (rất kỹ)**, 4.7 · `docs/plan/A/RULES_A.md` · `docs/progress/PROGRESS_A.md`.

## 2. File được phép tạo/sửa
- `contracts-hardhat/contracts/HealthInsuranceNFT.sol` (ghi đè bản tạm của A01)
- `docs/plan/A/reports/REPORT_A02.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** thêm bất kỳ hàm công khai nào ngoài danh sách; đổi tên field; thêm field; viết logic thật (để các chặng sau).

## 3. Kiểm tra trước khi làm
```bash
cd contracts-hardhat && npx hardhat compile    # phải chạy được (kết quả chặng A01)
git branch --show-current                       # phải in ra: tram
```

## 4. Các bước
**Bước 1.** Ghi đè toàn bộ file `contracts-hardhat/contracts/HealthInsuranceNFT.sol` bằng **nội dung đầy đủ** dưới đây (chép nguyên văn, kể cả comment):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title HealthInsuranceNFT - bao hiem y te phi tap trung, the bao hiem la NFT soulbound
contract HealthInsuranceNFT is ERC721, AccessControl, ReentrancyGuard {
    bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");

    struct Plan {
        uint256 id;
        string name;
        uint256 price;
        uint256 coverageLimit;
        uint256 durationDays;
        string policyDocCID;
        bool active;
    }
    struct Policy {
        uint256 tokenId;
        uint256 planId;
        address holder;
        string encryptedHealthId;
        uint256 coverageLimit;
        uint256 usedAmount;
        uint256 startDate;
        uint256 expiryDate;
        string policyDocCID;
    }
    enum ClaimStatus { PENDING, APPROVED, REJECTED }
    struct Claim {
        uint256 claimId;
        uint256 tokenId;
        address patient;
        address hospital;
        uint256 amount;
        uint256 confirmedAmount;
        bool hospitalConfirmed;
        string billCID;
        string recordCID;
        ClaimStatus status;
        uint256 createdAt;
        uint256 resolvedAt;
    }

    event PlanCreated(uint256 indexed planId, string name, uint256 price, uint256 coverageLimit, uint256 durationDays, string policyDocCID);
    event PlanStatusChanged(uint256 indexed planId, bool active);
    event HospitalAuthorized(address indexed hospital, bool status);
    event PoolFunded(address indexed from, uint256 amount);
    event EncryptionKeyRegistered(address indexed user);
    event PolicyPurchased(uint256 indexed tokenId, address indexed holder, uint256 planId, uint256 expiryDate);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed tokenId, address indexed patient, address submittedBy, uint256 amount);
    event ClaimConfirmed(uint256 indexed claimId, address indexed hospital, uint256 confirmedAmount);
    event ClaimApproved(uint256 indexed claimId, address indexed patient, uint256 amount);
    event ClaimRejected(uint256 indexed claimId, string reason);

    uint256 public totalPlans;
    uint256 public totalPolicies;
    uint256 public totalClaims;

    mapping(uint256 => Plan) private plans;
    mapping(uint256 => Policy) private policies;
    mapping(uint256 => Claim) private claims;
    mapping(address => uint256[]) private claimIdsOf;
    mapping(address => uint256) public activePolicyOf;
    mapping(address => string) public encryptionKeyOf;

    constructor() ERC721("Health Insurance Card", "HIC") {
        // TODO A04: cap DEFAULT_ADMIN_ROLE cho deployer
    }

    // ===================== NGHIEP VU 1: THIET LAP HE THONG =====================
    // TODO A04: than ham se duoc viet o chang A04

    function createPlan(string calldata name, uint256 price, uint256 coverageLimit, uint256 durationDays, string calldata policyDocCID) external returns (uint256 planId) {
        revert("TODO");
    }

    function setPlanActive(uint256 planId, bool active) external {
        revert("TODO");
    }

    function authorizeHospital(address hospital, bool status) external {
        revert("TODO");
    }

    function fundPool() external payable {
        revert("TODO");
    }

    function registerEncryptionKey(string calldata rsaPublicKeyPem) external {
        revert("TODO");
    }

    // ===================== NGHIEP VU 2: MUA BAO HIEM + MINT NFT =====================
    // TODO A05

    function purchasePolicy(uint256 planId, string calldata encryptedHealthId) external payable returns (uint256 tokenId) {
        revert("TODO");
    }

    function verifyInsurance(address patient) external view returns (bool isValid, uint256 tokenId, uint256 remainingLimit, uint256 expiryDate) {
        return (false, 0, 0, 0);
    }

    // ===================== NGHIEP VU 3: YEU CAU BOI THUONG =====================
    // TODO A06

    function submitClaim(uint256 tokenId, uint256 amount, string calldata billCID, string calldata recordCID) external returns (uint256 claimId) {
        revert("TODO");
    }

    function confirmClaim(uint256 claimId, uint256 confirmedAmount) external {
        revert("TODO");
    }

    // ===================== NGHIEP VU 4: DUYET VA CHI TRA TU DONG =====================
    // TODO A07

    function approveClaim(uint256 claimId) external {
        revert("TODO");
    }

    function rejectClaim(uint256 claimId, string calldata reason) external {
        revert("TODO");
    }

    // ===================== HAM DOC =====================
    // TODO A04: tra gia tri mac dinh, se viet that o chang A04

    function getPlans() external view returns (Plan[] memory) {
        return new Plan[](0);
    }

    function getPolicy(uint256 tokenId) external view returns (Policy memory) {
        return policies[tokenId];
    }

    function getClaim(uint256 claimId) external view returns (Claim memory) {
        return claims[claimId];
    }

    function getClaimsByPatient(address patient) external view returns (uint256[] memory) {
        return claimIdsOf[patient];
    }

    function poolBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // ===================== NFT SOULBOUND =====================
    // TODO A05: them tokenURI va _update (soulbound) o chang A05

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
```

**Bước 2.** Chạy `npx hardhat compile`. Sẽ có **cảnh báo** (warning) kiểu "Unused function parameter" hoặc "can be restricted to pure": **bình thường, bỏ qua**. Không được có **lỗi** (error).

**Bước 3.** Không viết thêm gì. Dừng, viết báo cáo.

**Giải thích để người đọc hiểu (không cần AI làm gì):**
- `ERC721` = chuẩn NFT; `AccessControl` = phân quyền theo vai trò (Admin, Hospital); `ReentrancyGuard` = chống tấn công gọi lại khi chuyển tiền.
- 3 `mapping private` (`plans`, `policies`, `claims`) lưu dữ liệu; `activePolicyOf` và `encryptionKeyOf` là `public` nên tự có hàm đọc cùng tên (đúng file 00).
- `totalPlans`, `totalPolicies`, `totalClaims` là biến `public` nên tự có hàm đọc cùng tên.
- `supportsInterface` bắt buộc viết lại vì cùng kế thừa `ERC721` và `AccessControl` (nếu thiếu, compile báo lỗi).

## 5. Lỗi hay gặp (đừng mắc)
- Đổi chữ hoa/thường tên hàm hoặc event (ví dụ `createPlan` thành `CreatePlan`): **cấm**.
- Thêm hàm "tiện" như `getAllClaims` hay `getPlan(id)`: **cấm** (C (Lan Anh) tự lấy bằng vòng lặp trong `contractService.js`).
- Thêm `receive()` / `fallback()` để nhận ETH: **cấm** (nạp quỹ chỉ qua `fundPool`).
- Quên `override(ERC721, AccessControl)` ở `supportsInterface`: compile lỗi.

## 6. Lệnh kiểm tra (người dùng tự chạy) và kết quả mong đợi
```bash
cd contracts-hardhat
npx hardhat compile
```
→ `Compiled 1 Solidity file successfully` (có warning, không có error).

```bash
grep -nE "^\s+function " contracts/HealthInsuranceNFT.sol | sed -E 's/.*function ([A-Za-z_]+).*/\1/' | sort | tr '\n' ' '
```
→ phải in **đúng 17 tên** sau (không thừa, không thiếu):
`approveClaim authorizeHospital confirmClaim createPlan fundPool getClaim getClaimsByPatient getPlans getPolicy poolBalance purchasePolicy registerEncryptionKey rejectClaim setPlanActive submitClaim supportsInterface verifyInsurance`

```bash
node -e "const a=require('./artifacts/contracts/HealthInsuranceNFT.sol/HealthInsuranceNFT.json').abi; console.log(a.filter(x=>x.type==='event'&&!['Approval','ApprovalForAll','Transfer','RoleAdminChanged','RoleGranted','RoleRevoked'].includes(x.name)).map(x=>x.name).sort().join(','))"
```
→ `ClaimApproved,ClaimConfirmed,ClaimRejected,ClaimSubmitted,EncryptionKeyRegistered,HospitalAuthorized,PlanCreated,PlanStatusChanged,PolicyPurchased,PoolFunded` (đúng 10 event).

**Dấu vân tay file đúng chuẩn:** `wc -l contracts/HealthInsuranceNFT.sol` → **159** dòng; `tr -d '\r' < contracts/HealthInsuranceNFT.sol | sha256sum | cut -c1-16` → **`d453413b0dc38f64`**. (Lệch thì dán cho Claude xem, chưa chắc là sai.)

## 7. Mục riêng trong báo cáo
Dán output 4 lệnh ở mục 6 (cả dòng số dòng và mã băm). Ghi rõ có bao nhiêu warning, có error không.

## 8. Gửi mình kiểm
File `HealthInsuranceNFT.sol` (nếu đúng dấu vân tay thì chỉ cần gửi báo cáo), file báo cáo.

**Mình sẽ soi:** đủ 17 tên hàm; đúng 10 event; thứ tự field trong struct đúng file 00; `pragma ^0.8.20`; không có hàm thừa.

## 9. Prompt dán cho AI
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A02_khung_contract.md.
Chỉ làm ĐÚNG chặng A02 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A02.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
