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
