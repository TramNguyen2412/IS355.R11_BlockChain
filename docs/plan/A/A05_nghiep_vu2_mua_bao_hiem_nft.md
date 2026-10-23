# CHẶNG A05 — Nghiệp vụ 2: Mua bảo hiểm, thẻ NFT, xác minh thẻ

> **Mã master:** A-05 · **Hạn:** Thứ 3 27/10 · **Rubric:** 1 và **4 (NFT: Minting + Verification)** · **Nhánh:** `tram` · **Cần trước:** A04 đã merge.

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Làm thật **nghiệp vụ 2 — bệnh nhân mua bảo hiểm và nhận thẻ NFT**: bệnh nhân gửi đúng số ETH của gói, contract tạo bản ghi `Policy` và **phát hành (mint) một NFT** làm thẻ bảo hiểm. NFT này **không chuyển nhượng được** (soulbound) vì thẻ bảo hiểm gắn với người. Thêm hàm **xác minh thẻ** (`verifyInsurance`) cho bệnh viện kiểm tra. Đây là hai thao tác token mà Rubric 4 yêu cầu.

## 1. Nạp ngữ cảnh
File 00 mục 1, 2.4, **4.1, 4.2** (đặc biệt "Hành vi cố định"), **4.7**, **6.2** · `RULES_A.md` · `PROGRESS_A.md`.

## 2. File được phép tạo/sửa
- `contracts-hardhat/contracts/HealthInsuranceNFT.sol` (ghi đè)
- `contracts-hardhat/test/HealthInsuranceNFT.test.js` (ghi đè)
- `docs/plan/A/reports/REPORT_A05.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** viết logic claim (giữ `revert("TODO")` cho `submitClaim`, `confirmClaim`, `approveClaim`, `rejectClaim`); dùng `ERC721URIStorage`, `ERC721Enumerable`; dùng hook cũ `_beforeTokenTransfer`.

## 3. Kiểm tra trước khi làm
`cd contracts-hardhat && npx hardhat test` → **9 passing** (kết quả A04).

## 4. Các bước
**Bước 1.** Ghi đè `contracts/HealthInsuranceNFT.sol` bằng **nội dung đầy đủ**:

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

    /// Benh nhan mua goi, tra dung gia, nhan the NFT (soulbound)
    function purchasePolicy(uint256 planId, string calldata encryptedHealthId)
        external
        payable
        nonReentrant
        returns (uint256 tokenId)
    {
        require(planId != 0 && planId <= totalPlans, "Goi bao hiem khong ton tai");
        Plan storage plan = plans[planId];
        require(plan.active, "Goi bao hiem khong hoat dong");
        require(msg.value == plan.price, "Sai so tien thanh toan");

        uint256 current = activePolicyOf[msg.sender];
        if (current != 0) {
            require(block.timestamp > policies[current].expiryDate, "Da co goi bao hiem con han");
        }

        totalPolicies++;
        tokenId = totalPolicies;
        uint256 expiry = block.timestamp + plan.durationDays * 1 days;
        policies[tokenId] = Policy(
            tokenId, planId, msg.sender, encryptedHealthId,
            plan.coverageLimit, 0, block.timestamp, expiry, plan.policyDocCID
        );
        activePolicyOf[msg.sender] = tokenId;

        emit PolicyPurchased(tokenId, msg.sender, planId, expiry);
        _safeMint(msg.sender, tokenId);
    }

    /// Kiem tra the (Verification). Khong bao gio revert.
    function verifyInsurance(address patient)
        external
        view
        returns (bool isValid, uint256 tokenId, uint256 remainingLimit, uint256 expiryDate)
    {
        uint256 id = activePolicyOf[patient];
        if (id == 0) {
            return (false, 0, 0, 0);
        }
        Policy storage p = policies[id];
        return (block.timestamp <= p.expiryDate, id, p.coverageLimit - p.usedAmount, p.expiryDate);
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

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string.concat("ipfs://", policies[tokenId].policyDocCID);
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: khong the chuyen nhuong");
        }
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
```

**Bước 2.** Ghi đè `test/HealthInsuranceNFT.test.js` bằng **nội dung đầy đủ**:

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
    it("T08 tat goi roi mua bi revert", async function () {
      const { c, patient } = await loadFixture(deployFixture);
      await expect(c.setPlanActive(1, false)).to.emit(c, "PlanStatusChanged").withArgs(1, false);
      await expect(c.connect(patient).purchasePolicy(1, "id", { value: BASIC.price })).to.be.revertedWith("Goi bao hiem khong hoat dong");
    });
  });

  describe("Mua bao hiem va NFT", function () {
    it("T09 mua dung gia: mint NFT, Policy dung, event", async function () {
      const { c, patient } = await loadFixture(deployFixture);
      const tx = await c.connect(patient).purchasePolicy(1, "enc-health-id", { value: BASIC.price });
      const now = BigInt(await time.latest());
      await expect(tx).to.emit(c, "PolicyPurchased").withArgs(1, patient.address, 1, now + 30n * 86400n);
      expect(await c.ownerOf(1)).to.equal(patient.address);
      const p = await c.getPolicy(1);
      expect(p.holder).to.equal(patient.address);
      expect(p.coverageLimit).to.equal(BASIC.limit);
      expect(p.usedAmount).to.equal(0n);
      expect(p.expiryDate).to.equal(now + 30n * 86400n);
      expect(p.encryptedHealthId).to.equal("enc-health-id");
      expect(await c.activePolicyOf(patient.address)).to.equal(1n);
      expect(await c.tokenURI(1)).to.equal("ipfs://mock-cid-policy-basic");
      expect(await c.totalPolicies()).to.equal(1n);
    });
    it("T10 gui sai so ETH (thieu/thua) bi revert", async function () {
      const { c, patient } = await loadFixture(deployFixture);
      await expect(c.connect(patient).purchasePolicy(1, "id", { value: BASIC.price - 1n })).to.be.revertedWith("Sai so tien thanh toan");
      await expect(c.connect(patient).purchasePolicy(1, "id", { value: BASIC.price + 1n })).to.be.revertedWith("Sai so tien thanh toan");
    });
    it("T11 mua khi da co goi con han bi revert", async function () {
      const { c, patient } = await loadFixture(boughtFixture);
      await expect(c.connect(patient).purchasePolicy(2, "id", { value: PREMIUM.price })).to.be.revertedWith("Da co goi bao hiem con han");
    });
    it("T12 chuyen nhuong NFT bi revert Soulbound", async function () {
      const { c, patient, outsider } = await loadFixture(boughtFixture);
      await expect(c.connect(patient).transferFrom(patient.address, outsider.address, 1)).to.be.revertedWith("Soulbound: khong the chuyen nhuong");
      await expect(c.connect(patient)["safeTransferFrom(address,address,uint256)"](patient.address, outsider.address, 1)).to.be.revertedWith("Soulbound: khong the chuyen nhuong");
    });
    it("T13 verifyInsurance: vi co the con han", async function () {
      const { c, patient } = await loadFixture(boughtFixture);
      const p = await c.getPolicy(1);
      const r = await c.verifyInsurance(patient.address);
      expect(r.isValid).to.equal(true);
      expect(r.tokenId).to.equal(1n);
      expect(r.remainingLimit).to.equal(BASIC.limit);
      expect(r.expiryDate).to.equal(p.expiryDate);
    });
    it("T14 verifyInsurance: vi khong co the", async function () {
      const { c, outsider } = await loadFixture(boughtFixture);
      const r = await c.verifyInsurance(outsider.address);
      expect(r.isValid).to.equal(false);
      expect(r.tokenId).to.equal(0n);
      expect(r.remainingLimit).to.equal(0n);
      expect(r.expiryDate).to.equal(0n);
    });
    it("T15 verifyInsurance sau khi het han", async function () {
      const { c, patient } = await loadFixture(boughtFixture);
      await time.increase(31 * DAY);
      expect((await c.verifyInsurance(patient.address)).isValid).to.equal(false);
    });
    it("Them: het han roi duoc mua goi moi", async function () {
      const { c, patient } = await loadFixture(boughtFixture);
      await time.increase(31 * DAY);
      await c.connect(patient).purchasePolicy(2, "id2", { value: PREMIUM.price });
      expect(await c.activePolicyOf(patient.address)).to.equal(2n);
      expect((await c.verifyInsurance(patient.address)).isValid).to.equal(true);
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

**Bước 3.** `npx hardhat test` và so với mục 6.

**Phần mới của chặng này (giải thích):**
| Hàm | Ý chính |
|---|---|
| `purchasePolicy(planId, encryptedHealthId)` `payable` `nonReentrant` | Kiểm tra theo **thứ tự**: gói tồn tại → gói đang mở bán → `msg.value == price` (đúng, không thiếu không thừa) → chưa có thẻ còn hạn. Rồi tạo `Policy` (sao chép `coverageLimit` từ gói lúc mua, để sau này đổi gói không ảnh hưởng thẻ cũ), `expiryDate = bây giờ + durationDays * 1 days`, ghi `activePolicyOf`, phát event, **cuối cùng** `_safeMint`. |
| `verifyInsurance(patient)` `view` | **Không bao giờ revert.** Ví chưa từng có thẻ → `(false,0,0,0)`. Có thẻ → `isValid = (now <= expiryDate)`, kèm `tokenId`, `remainingLimit = coverageLimit - usedAmount`, `expiryDate`. |
| `_update` (override) | Bản OpenZeppelin v5 gom mọi thao tác chuyển/mint/burn vào hàm này. Nếu `from != 0` **và** `to != 0` (tức là chuyển nhượng) → `revert("Soulbound: khong the chuyen nhuong")`. Mint (from = 0) vẫn cho qua. |
| `tokenURI(tokenId)` | `"ipfs://" + policyDocCID`; `_requireOwned` để token chưa tồn tại thì revert chuẩn của OZ. |

**Vì sao `_safeMint` đặt cuối cùng và có `nonReentrant`?** `_safeMint` gọi ngược sang ví nhận nếu ví đó là contract (`onERC721Received`). Đặt cuối cùng (sau khi đã ghi trạng thái) và chặn gọi lại là cách an toàn chuẩn. Đây là điểm đáng ghi vào báo cáo mục bảo mật.

## 5. Lỗi hay gặp
- Viết `_beforeTokenTransfer` (của OpenZeppelin v4): v5 **không còn**; phải là `_update(address to, uint256 tokenId, address auth) returns (address)`.
- `isValid` dùng `<` thay vì `<=` ở mốc hết hạn: file 00 nói `block.timestamp <= expiryDate`.
- Tự tính `expiryDate` bằng `durationDays * 86400`: được, nhưng giữ đúng cách viết `* 1 days` của file để mã băm khớp.
- Dùng `msg.value >= price` (cho dư): **sai**, phải `==` (test T10 kiểm cả thiếu và thừa).

## 6. Lệnh kiểm tra và kết quả mong đợi
```bash
cd contracts-hardhat
npx hardhat test
```
→ **`18 passing`**, không `failing`. Phải thấy các test **T08–T15** và dòng "Them: het han roi duoc mua goi moi".

```bash
grep -nE "tx\.origin|selfdestruct|delegatecall|\.transfer\(|\.send\(|console\.log|ERC721Enumerable|ERC721URIStorage|_beforeTokenTransfer" contracts/HealthInsuranceNFT.sol
```
→ rỗng.

**Dấu vân tay:** contract **233** dòng, `9b36a2d95ef4f80f`; test **168** dòng, `ee332c2697cb1719`.

## 7. Mục riêng trong báo cáo
Output `npx hardhat test` đầy đủ; xác nhận **T12 (Soulbound)** và **T09 (mint)** pass; dòng số dòng, mã băm.

## 8. Gửi mình kiểm
Báo cáo + file `HealthInsuranceNFT.sol`.

**Mình sẽ soi:** `_safeMint` ở cuối `purchasePolicy`; `_update` đúng chữ ký v5; `verifyInsurance` không có `require`; `tokenURI` dùng `string.concat`.

## 9. Prompt dán cho AI
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A05_nghiep_vu2_mua_bao_hiem_nft.md.
Chỉ làm ĐÚNG chặng A05 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A05.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
