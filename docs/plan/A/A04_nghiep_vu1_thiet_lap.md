# CHẶNG A04 — Nghiệp vụ 1: Thiết lập hệ thống (contract + test)

> **Mã master:** A-04 · **Hạn:** CN 25/10 · **Rubric:** 1 (hàm nghiệp vụ, ràng buộc phân quyền) · **Nhánh:** `tram` · **Cần trước:** A03 đã merge.

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Làm thật **nghiệp vụ 1 — công ty bảo hiểm thiết lập hệ thống**: tạo gói bảo hiểm, bật/tắt gói, cấp/thu hồi quyền cho bệnh viện, đăng ký khóa mã hóa, nạp quỹ chi trả. Cùng lúc viết test để chứng minh chạy đúng, trong đó có test **"ví lạ không được tạo gói / cấp quyền"** (một phần của ràng buộc logic số 1 trong Rubric).

## 1. Nạp ngữ cảnh (AI phải đọc)
File 00: mục 1, 2.2, 2.4, **4.1, 4.2, 4.7**, **6.1, 6.2, 6.3** · `RULES_A.md` (mục 2 Solidity) · `PROGRESS_A.md` · file contract hiện tại.

## 2. File được phép tạo/sửa
- `contracts-hardhat/contracts/HealthInsuranceNFT.sol` (ghi đè)
- `contracts-hardhat/test/HealthInsuranceNFT.test.js` (mới)
- `docs/plan/A/reports/REPORT_A04.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** đụng `scripts/`; thêm hàm ngoài danh sách; viết logic nghiệp vụ 2, 3, 4 (các hàm đó **giữ nguyên bản `revert("TODO")`**).

## 3. Kiểm tra trước khi làm
```bash
cd contracts-hardhat && npx hardhat compile   # OK
```

## 4. Các bước
**Bước 1.** Ghi đè `contracts-hardhat/contracts/HealthInsuranceNFT.sol` bằng **nội dung đầy đủ** dưới đây:

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
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // ===================== NGHIEP VU 1: THIET LAP HE THONG =====================

    /// Admin tao goi bao hiem moi
    function createPlan(
        string calldata name,
        uint256 price,
        uint256 coverageLimit,
        uint256 durationDays,
        string calldata policyDocCID
    ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256 planId) {
        require(price > 0 && coverageLimit > 0 && durationDays > 0, "So tien khong hop le");
        totalPlans++;
        planId = totalPlans;
        plans[planId] = Plan(planId, name, price, coverageLimit, durationDays, policyDocCID, true);
        emit PlanCreated(planId, name, price, coverageLimit, durationDays, policyDocCID);
    }

    /// Admin bat/tat goi
    function setPlanActive(uint256 planId, bool active) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(planId != 0 && planId <= totalPlans, "Goi bao hiem khong ton tai");
        plans[planId].active = active;
        emit PlanStatusChanged(planId, active);
    }

    /// Admin cap hoac thu hoi quyen benh vien
    function authorizeHospital(address hospital, bool status) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (status) {
            _grantRole(HOSPITAL_ROLE, hospital);
        } else {
            _revokeRole(HOSPITAL_ROLE, hospital);
        }
        emit HospitalAuthorized(hospital, status);
    }

    /// Nap quy boi thuong
    function fundPool() external payable {
        require(msg.value > 0, "So tien khong hop le");
        emit PoolFunded(msg.sender, msg.value);
    }

    /// Dang ky khoa cong khai RSA (PEM)
    function registerEncryptionKey(string calldata rsaPublicKeyPem) external {
        encryptionKeyOf[msg.sender] = rsaPublicKeyPem;
        emit EncryptionKeyRegistered(msg.sender);
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

    function getPlans() external view returns (Plan[] memory) {
        Plan[] memory list = new Plan[](totalPlans);
        for (uint256 i = 1; i <= totalPlans; i++) {
            list[i - 1] = plans[i];
        }
        return list;
    }

    function getPolicy(uint256 tokenId) external view returns (Policy memory) {
        return policies[tokenId];
    }

    function getClaim(uint256 claimId) external view returns (Claim memory) {
        require(claimId != 0 && claimId <= totalClaims, "Khong tim thay yeu cau boi thuong");
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

**Bước 2.** Tạo `contracts-hardhat/test/HealthInsuranceNFT.test.js` với **nội dung đầy đủ** dưới đây:

```js
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// ===== Du lieu mau chuan (file 00 muc 6.2, 6.3) =====
const BASIC = { name: "Gói Cơ bản", price: ethers.parseEther("0.002"), limit: ethers.parseEther("0.02"), days: 30, cid: "mock-cid-policy-basic" };
const PREMIUM = { name: "Gói Nâng cao", price: ethers.parseEther("0.005"), limit: ethers.parseEther("0.05"), days: 90, cid: "mock-cid-policy-premium" };
const POOL = ethers.parseEther("0.1");
const CLAIM1 = ethers.parseEther("0.012");
const CLAIM2 = ethers.parseEther("0.015");
const DAY = 24 * 60 * 60;

// Trang thai ban dau: 2 goi, HOSPITAL co quyen, quy 0.1 ETH
async function deployFixture() {
  const [admin, hospital, patient, outsider] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("HealthInsuranceNFT");
  const c = await Factory.deploy();
  await c.waitForDeployment();
  await c.createPlan(BASIC.name, BASIC.price, BASIC.limit, BASIC.days, BASIC.cid);
  await c.createPlan(PREMIUM.name, PREMIUM.price, PREMIUM.limit, PREMIUM.days, PREMIUM.cid);
  await c.authorizeHospital(hospital.address, true);
  await c.fundPool({ value: POOL });
  return { c, admin, hospital, patient, outsider };
}
// Them: benh nhan da mua goi 1 (tokenId = 1)
async function boughtFixture() {
  const base = await deployFixture();
  await base.c.connect(base.patient).purchasePolicy(1, "enc-health-id", { value: BASIC.price });
  return base;
}

describe("HealthInsuranceNFT", function () {
  describe("Trien khai va phan quyen", function () {
    it("T01 deploy: deployer la admin, ten/ky hieu NFT dung", async function () {
      const [admin] = await ethers.getSigners();
      const c = await (await ethers.getContractFactory("HealthInsuranceNFT")).deploy();
      expect(await c.hasRole(ethers.ZeroHash, admin.address)).to.equal(true);
      expect(await c.name()).to.equal("Health Insurance Card");
      expect(await c.symbol()).to.equal("HIC");
    });
    it("T02 admin cap quyen benh vien + event", async function () {
      const { c, outsider } = await loadFixture(deployFixture);
      await expect(c.authorizeHospital(outsider.address, true)).to.emit(c, "HospitalAuthorized").withArgs(outsider.address, true);
      expect(await c.hasRole(await c.HOSPITAL_ROLE(), outsider.address)).to.equal(true);
    });
    it("T03 vi khong phai admin goi authorizeHospital bi revert", async function () {
      const { c, outsider } = await loadFixture(deployFixture);
      await expect(c.connect(outsider).authorizeHospital(outsider.address, true)).to.be.revertedWithCustomError(c, "AccessControlUnauthorizedAccount");
    });
    it("T04 admin thu hoi quyen benh vien", async function () {
      const { c, hospital } = await loadFixture(deployFixture);
      await c.authorizeHospital(hospital.address, false);
      expect(await c.hasRole(await c.HOSPITAL_ROLE(), hospital.address)).to.equal(false);
    });
  });

  describe("Goi bao hiem", function () {
    it("T05 admin tao goi hop le", async function () {
      const [admin] = await ethers.getSigners();
      const c = await (await ethers.getContractFactory("HealthInsuranceNFT")).deploy();
      await expect(c.createPlan(BASIC.name, BASIC.price, BASIC.limit, BASIC.days, BASIC.cid))
        .to.emit(c, "PlanCreated").withArgs(1, BASIC.name, BASIC.price, BASIC.limit, BASIC.days, BASIC.cid);
      const plans = await c.getPlans();
      expect(plans.length).to.equal(1);
      expect(plans[0].id).to.equal(1n);
      expect(plans[0].price).to.equal(BASIC.price);
      expect(plans[0].coverageLimit).to.equal(BASIC.limit);
      expect(plans[0].durationDays).to.equal(30n);
      expect(plans[0].policyDocCID).to.equal(BASIC.cid);
      expect(plans[0].active).to.equal(true);
      expect(await c.totalPlans()).to.equal(1n);
    });
    it("T06 vi la tao goi bi revert", async function () {
      const { c, outsider } = await loadFixture(deployFixture);
      await expect(c.connect(outsider).createPlan("x", 1, 1, 1, "cid")).to.be.revertedWithCustomError(c, "AccessControlUnauthorizedAccount");
    });
    it("T07 tao goi gia = 0 hoac han muc = 0 bi revert", async function () {
      const { c } = await loadFixture(deployFixture);
      await expect(c.createPlan("x", 0, 1, 1, "cid")).to.be.revertedWith("So tien khong hop le");
      await expect(c.createPlan("x", 1, 0, 1, "cid")).to.be.revertedWith("So tien khong hop le");
    });
  });

  describe("Bao mat nang cao", function () {
    it("T32 fundPool cong dung vao poolBalance", async function () {
      const [admin] = await ethers.getSigners();
      const c = await (await ethers.getContractFactory("HealthInsuranceNFT")).deploy();
      await expect(c.fundPool({ value: POOL })).to.emit(c, "PoolFunded").withArgs(admin.address, POOL);
      expect(await c.poolBalance()).to.equal(POOL);
      await c.fundPool({ value: 5n });
      expect(await c.poolBalance()).to.equal(POOL + 5n);
      await expect(c.fundPool({ value: 0 })).to.be.revertedWith("So tien khong hop le");
    });
    it("Them: registerEncryptionKey luu khoa va phat event", async function () {
      const { c, patient } = await loadFixture(deployFixture);
      await expect(c.connect(patient).registerEncryptionKey("-----BEGIN PUBLIC KEY-----abc")).to.emit(c, "EncryptionKeyRegistered").withArgs(patient.address);
      expect(await c.encryptionKeyOf(patient.address)).to.equal("-----BEGIN PUBLIC KEY-----abc");
      expect(await c.encryptionKeyOf(ethers.ZeroAddress)).to.equal("");
    });
  });
});
```

**Bước 3.** Chạy `npx hardhat test` và so với mục 6.

**Phần mới của chặng này (giải thích):**
| Hàm | Ai gọi | Kiểm tra (theo thứ tự) | Revert |
|---|---|---|---|
| `constructor` | deployer | cấp `DEFAULT_ADMIN_ROLE` cho `msg.sender` | |
| `createPlan(...)` | Admin | `onlyRole(DEFAULT_ADMIN_ROLE)`; `price`, `coverageLimit`, `durationDays` đều > 0 | `So tien khong hop le`; AccessControl |
| `setPlanActive` | Admin | gói có tồn tại | `Goi bao hiem khong ton tai` |
| `authorizeHospital` | Admin | dùng `_grantRole` / `_revokeRole` (hàm nội bộ, không bị kiểm tra quyền lần hai) | AccessControl |
| `fundPool` | ai cũng được | `msg.value > 0` | `So tien khong hop le` |
| `registerEncryptionKey` | ai cũng được | ghi `encryptionKeyOf[msg.sender]` (đăng ký lại = ghi đè) | |
| `getPlans`, `getPolicy`, `getClaim`, `getClaimsByPatient`, `poolBalance` | ai cũng được | `getPlans` duyệt id 1..`totalPlans`; `poolBalance` = `address(this).balance` | `getClaim` revert `Khong tim thay yeu cau boi thuong` nếu id không tồn tại |

- ID bắt đầu từ 1: `totalPlans++` rồi mới gán `planId = totalPlans`.
- `fundPool` **không** có `receive()`: gửi ETH thẳng vào contract sẽ bị từ chối, chỉ nạp qua `fundPool` (để có event `PoolFunded`).

## 5. Lỗi hay gặp
- Dùng `grantRole(...)` (hàm công khai) thay vì `_grantRole` trong `authorizeHospital`: Admin gọi được nhưng tốn thêm kiểm tra, và dễ sai quyền. Giữ `_grantRole`.
- Dùng `ethers.constants` / `BigNumber` trong test: **cấm** (ethers v6, dùng `bigint` và `ethers.parseEther`).
- Revert của AccessControl là **custom error**, kiểm bằng `revertedWithCustomError(c, "AccessControlUnauthorizedAccount")`, **không** dùng `revertedWith("...")`.
- Test lưu ý: 9 test, **không có T08** (chuyển sang A05).

## 6. Lệnh kiểm tra (người dùng tự chạy) và kết quả mong đợi
```bash
cd contracts-hardhat
npx hardhat test
```
→ cuối output: **`9 passing`**, không có `failing`. Gồm T01–T07, T32 và 1 test phụ (đăng ký khóa).

```bash
grep -nE "tx\.origin|selfdestruct|delegatecall|\.transfer\(|\.send\(|console\.log|ERC721Enumerable|ERC721URIStorage|_beforeTokenTransfer" contracts/HealthInsuranceNFT.sol
```
→ **không in ra dòng nào**.

**Dấu vân tay:** contract **186** dòng, mã băm `07c2d9bfa0669a29`; test **101** dòng, mã băm `8d74a52d376e4cb2` (lệnh: `tr -d '\r' < <file> | sha256sum | cut -c1-16`).

## 7. Mục riêng trong báo cáo
Dán output `npx hardhat test` **đầy đủ**, output grep, dòng số dòng và mã băm của 2 file.

## 8. Gửi mình kiểm
Báo cáo. Nếu dấu vân tay lệch: thêm file `HealthInsuranceNFT.sol`.

**Mình sẽ soi:** `authorizeHospital` dùng `_grantRole`; `createPlan` có `onlyRole`; chuỗi revert đúng bảng 4.7; không có `receive()`; test dùng `revertedWithCustomError` cho phân quyền.

## 9. Prompt dán cho AI
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A04_nghiep_vu1_thiet_lap.md.
Chỉ làm ĐÚNG chặng A04 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A04.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
