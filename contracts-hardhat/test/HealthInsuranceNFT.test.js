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
