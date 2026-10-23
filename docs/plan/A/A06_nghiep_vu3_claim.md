# CHẶNG A06 — Nghiệp vụ 3: Gửi yêu cầu bồi thường và bệnh viện xác nhận

> **Mã master:** A-06 · **Hạn:** Thứ 5 29/10 · **Rubric:** 1 (**ràng buộc logic số 1: chỉ bệnh viện được cấp quyền mới xác nhận chi phí**) · **Nhánh:** `tram` · **Cần trước:** A05 đã merge.

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Làm thật **nghiệp vụ 3 — yêu cầu bồi thường (claim)**. Có hai đường: (a) **bệnh viện** gửi claim giùm bệnh nhân → claim được coi là đã xác nhận ngay; (b) **bệnh nhân** tự gửi → phải chờ bệnh viện xác nhận chi phí bằng `confirmClaim`. Trong `confirmClaim` có **ràng buộc logic số 1** của Rubric: chỉ ví có quyền `HOSPITAL_ROLE` gọi được (`onlyRole`), ví lạ sẽ bị revert. Claim lưu hai mã CID IPFS: hóa đơn (`billCID`) và hồ sơ đã mã hóa (`recordCID`).

## 1. Nạp ngữ cảnh
File 00 mục 1, 2.4, **4.2 (phần "Hành vi cố định")**, **4.7**, **6.3** · `RULES_A.md` · `PROGRESS_A.md`.

## 2. File được phép tạo/sửa
- `contracts-hardhat/contracts/HealthInsuranceNFT.sol` (ghi đè)
- `contracts-hardhat/test/HealthInsuranceNFT.test.js` (ghi đè)
- `docs/plan/A/reports/REPORT_A06.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** viết `approveClaim`, `rejectClaim` (giữ `revert("TODO")`, chặng A07); thêm kiểm tra CID rỗng hoặc chuỗi lỗi mới (chưa có trong bảng 4.7).

## 3. Kiểm tra trước khi làm
`npx hardhat test` → **18 passing** (kết quả A05).

## 4. Các bước
**Bước 1.** Ghi đè `contracts/HealthInsuranceNFT.sol`:

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

    /// Benh nhan (chu NFT) hoac benh vien gui yeu cau boi thuong
    function submitClaim(uint256 tokenId, uint256 amount, string calldata billCID, string calldata recordCID)
        external
        returns (uint256 claimId)
    {
        bool byHospital = hasRole(HOSPITAL_ROLE, msg.sender);
        require(byHospital || _ownerOf(tokenId) == msg.sender, "Khong phai chu the hoac benh vien");
        require(amount > 0, "So tien khong hop le");

        Policy storage p = policies[tokenId];
        require(block.timestamp <= p.expiryDate, "Bao hiem da het han");
        require(amount <= p.coverageLimit - p.usedAmount, "Vuot qua han muc bao hiem");

        totalClaims++;
        claimId = totalClaims;
        Claim storage c = claims[claimId];
        c.claimId = claimId;
        c.tokenId = tokenId;
        c.patient = p.holder;
        c.amount = amount;
        c.billCID = billCID;
        c.recordCID = recordCID;
        c.status = ClaimStatus.PENDING;
        c.createdAt = block.timestamp;
        if (byHospital) {
            c.hospital = msg.sender;
            c.hospitalConfirmed = true;
            c.confirmedAmount = amount;
        }
        claimIdsOf[p.holder].push(claimId);
        emit ClaimSubmitted(claimId, tokenId, p.holder, msg.sender, amount);
    }

    /// RANG BUOC 1: chi vi co HOSPITAL_ROLE moi xac nhan duoc chi phi
    function confirmClaim(uint256 claimId, uint256 confirmedAmount) external onlyRole(HOSPITAL_ROLE) {
        require(claimId != 0 && claimId <= totalClaims, "Khong tim thay yeu cau boi thuong");
        Claim storage c = claims[claimId];
        require(c.status == ClaimStatus.PENDING, "Claim da xu ly");
        require(confirmedAmount > 0, "So tien khong hop le");
        require(confirmedAmount <= c.amount, "So tien xac nhan vuot so tien yeu cau");
        c.hospital = msg.sender;
        c.hospitalConfirmed = true;
        c.confirmedAmount = confirmedAmount;
        emit ClaimConfirmed(claimId, msg.sender, confirmedAmount);
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

**Bước 2.** Ghi đè `test/HealthInsuranceNFT.test.js`:

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

  describe("Claim va rang buoc", function () {
    it("T16 benh vien submitClaim: PENDING, da xac nhan, event", async function () {
      const { c, hospital, patient } = await loadFixture(boughtFixture);
      await expect(c.connect(hospital).submitClaim(1, CLAIM1, "mock-cid-bill-01", "mock-cid-record-01"))
        .to.emit(c, "ClaimSubmitted").withArgs(1, 1, patient.address, hospital.address, CLAIM1);
      const cl = await c.getClaim(1);
      expect(cl.status).to.equal(0n);
      expect(cl.hospitalConfirmed).to.equal(true);
      expect(cl.hospital).to.equal(hospital.address);
      expect(cl.confirmedAmount).to.equal(CLAIM1);
      expect(cl.patient).to.equal(patient.address);
      expect(cl.resolvedAt).to.equal(0n);
      expect((await c.getClaimsByPatient(patient.address)).map(Number)).to.deep.equal([1]);
    });
    it("T17 benh nhan submitClaim: PENDING, chua xac nhan", async function () {
      const { c, patient } = await loadFixture(boughtFixture);
      await c.connect(patient).submitClaim(1, CLAIM1, "b", "r");
      const cl = await c.getClaim(1);
      expect(cl.status).to.equal(0n);
      expect(cl.hospitalConfirmed).to.equal(false);
      expect(cl.hospital).to.equal(ethers.ZeroAddress);
      expect(cl.confirmedAmount).to.equal(0n);
    });
    it("T18 vi la submitClaim bi revert", async function () {
      const { c, outsider } = await loadFixture(boughtFixture);
      await expect(c.connect(outsider).submitClaim(1, CLAIM1, "b", "r")).to.be.revertedWith("Khong phai chu the hoac benh vien");
    });
    it("T19 submitClaim vuot han muc con lai bi revert", async function () {
      const { c, patient } = await loadFixture(boughtFixture);
      await expect(c.connect(patient).submitClaim(1, BASIC.limit + 1n, "b", "r")).to.be.revertedWith("Vuot qua han muc bao hiem");
      await expect(c.connect(patient).submitClaim(1, 0, "b", "r")).to.be.revertedWith("So tien khong hop le");
    });
    it("T20 vi la confirmClaim bi revert (RBAC)", async function () {
      const { c, patient, outsider } = await loadFixture(boughtFixture);
      await c.connect(patient).submitClaim(1, CLAIM1, "b", "r");
      await expect(c.connect(outsider).confirmClaim(1, CLAIM1)).to.be.revertedWithCustomError(c, "AccessControlUnauthorizedAccount");
      await expect(c.connect(patient).confirmClaim(1, CLAIM1)).to.be.revertedWithCustomError(c, "AccessControlUnauthorizedAccount");
    });
    it("T21 benh vien confirmClaim hop le", async function () {
      const { c, hospital, patient } = await loadFixture(boughtFixture);
      await c.connect(patient).submitClaim(1, CLAIM1, "b", "r");
      await expect(c.connect(hospital).confirmClaim(1, CLAIM1)).to.emit(c, "ClaimConfirmed").withArgs(1, hospital.address, CLAIM1);
      const cl = await c.getClaim(1);
      expect(cl.hospitalConfirmed).to.equal(true);
      expect(cl.confirmedAmount).to.equal(CLAIM1);
      expect(cl.hospital).to.equal(hospital.address);
    });
    it("T22 confirmedAmount > amount bi revert", async function () {
      const { c, hospital, patient } = await loadFixture(boughtFixture);
      await c.connect(patient).submitClaim(1, CLAIM1, "b", "r");
      await expect(c.connect(hospital).confirmClaim(1, CLAIM1 + 1n)).to.be.revertedWith("So tien xac nhan vuot so tien yeu cau");
      await expect(c.connect(hospital).confirmClaim(99, 1)).to.be.revertedWith("Khong tim thay yeu cau boi thuong");
    });
    it("T23 submitClaim khi het han bi revert", async function () {
      const { c, patient } = await loadFixture(boughtFixture);
      await time.increase(31 * DAY);
      await expect(c.connect(patient).submitClaim(1, CLAIM1, "b", "r")).to.be.revertedWith("Bao hiem da het han");
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

**Bước 3.** `npx hardhat test`, so với mục 6.

**Phần mới của chặng này (giải thích):**
| Hàm | Kiểm tra theo thứ tự | Ghi chú |
|---|---|---|
| `submitClaim(tokenId, amount, billCID, recordCID)` | (1) người gọi là bệnh viện **hoặc** chủ NFT → (2) `amount > 0` → (3) thẻ chưa hết hạn → (4) `amount <= coverageLimit - usedAmount` | Bệnh viện gọi: `hospitalConfirmed = true`, `hospital = msg.sender`, `confirmedAmount = amount`. Bệnh nhân gọi: `false`, `address(0)`, `0`. `patient` luôn là chủ thẻ. Thứ tự (1) trước nên ví lạ nhận đúng lỗi "Khong phai chu the hoac benh vien" |
| `confirmClaim(claimId, confirmedAmount)` | `onlyRole(HOSPITAL_ROLE)` → claim tồn tại → còn `PENDING` → `confirmedAmount > 0` → `confirmedAmount <= amount` | **Đây là ràng buộc logic số 1.** Ghi `hospital = msg.sender` |

Quy ước thời điểm kiểm tra hạn mức: `submitClaim` chỉ kiểm tra `amount <= còn lại` **tại lúc gửi**. `usedAmount` chỉ tăng khi **duyệt** (chặng A07). Vì thế có thể có hai claim chờ cùng lúc mà tổng vượt hạn mức; claim thứ hai sẽ bị chặn khi **duyệt** (test T27). Kịch bản demo (claim 0.012 rồi 0.015 ETH) bị chặn ngay lúc gửi claim thứ hai sau khi claim đầu đã duyệt.

## 5. Lỗi hay gặp
- Quên `onlyRole(HOSPITAL_ROLE)` ở `confirmClaim`: test T20 sẽ đỏ.
- Đặt kiểm tra "chủ NFT" bằng `ownerOf(tokenId)` làm token chưa tồn tại bị revert lạ; file dùng `_ownerOf` (không revert).
- Dùng `tx.origin` để xác định người gửi: **cấm**.
- Thêm `emit ClaimConfirmed` trong `submitClaim` của bệnh viện: **không**, `ClaimConfirmed` chỉ phát trong `confirmClaim`.

## 6. Lệnh kiểm tra và kết quả mong đợi
```bash
cd contracts-hardhat
npx hardhat test
```
→ **`26 passing`**, không `failing`; thấy T16–T23.

```bash
grep -nE "tx\.origin|selfdestruct|delegatecall|\.transfer\(|\.send\(|console\.log|ERC721Enumerable|ERC721URIStorage|_beforeTokenTransfer" contracts/HealthInsuranceNFT.sol
```
→ rỗng.

**Dấu vân tay:** contract **270** dòng, `2dc1ee909e20b366`; test **228** dòng, `5c54d49eedf433a8`.

## 7. Mục riêng trong báo cáo
Output test đầy đủ; xác nhận **T19, T20, T21** (ba test quan trọng cho báo cáo) pass; số dòng, mã băm.

## 8. Gửi mình kiểm
Báo cáo + file contract.

**Mình sẽ soi:** `confirmClaim` có `onlyRole(HOSPITAL_ROLE)`; `submitClaim` kiểm tra người gọi **trước** số tiền; nhánh bệnh viện đặt đủ 3 field; không có `tx.origin`.

## 9. Prompt dán cho AI
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A06_nghiep_vu3_claim.md.
Chỉ làm ĐÚNG chặng A06 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A06.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
