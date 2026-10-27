const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { OUT_DIR } = require("./exportAbi");

// Du lieu mau chuan: file 00 muc 6.2
const PLANS = [
  { name: "Gói Cơ bản", price: "0.002", limit: "0.02", days: 30, cid: "mock-cid-policy-basic" },
  { name: "Gói Nâng cao", price: "0.005", limit: "0.05", days: 90, cid: "mock-cid-policy-premium" },
];

async function main() {
  const { ethers, network } = hre;
  const info = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "address.json"), "utf8"));
  const signers = await ethers.getSigners();
  const admin = signers[0];
  const contract = await ethers.getContractAt("HealthInsuranceNFT", info.HealthInsuranceNFT, admin);
  const isLocal = network.name === "localhost" || network.name === "hardhat";

  let hospital, poolEth;
  if (isLocal) {
    hospital = signers[1].address;               // tai khoan #1 cua Hardhat
    poolEth = "0.1";
    if ((await contract.totalPlans()) === 0n) {  // chay lai khong tao trung goi
      for (const p of PLANS) {
        const tx = await contract.createPlan(p.name, ethers.parseEther(p.price), ethers.parseEther(p.limit), p.days, p.cid);
        await tx.wait();
      }
      console.log("Da tao 2 goi mau");
    } else {
      console.log("Da co goi, bo qua buoc tao goi");
    }
  } else {
    hospital = process.env.HOSPITAL_ADDRESS;     // Sepolia: KHONG tao goi (Admin tao qua Console cua B)
    poolEth = process.env.POOL_FUND_ETH;
    if (!hospital || !poolEth) throw new Error("Thieu HOSPITAL_ADDRESS hoac POOL_FUND_ETH trong .env");
  }

  await (await contract.authorizeHospital(hospital, true)).wait();
  console.log("Da cap quyen benh vien:", hospital);
  if (isLocal && (await contract.poolBalance()) > 0n) {
    console.log("Quy da co tien, bo qua buoc nap quy");
  } else {
    await (await contract.fundPool({ value: ethers.parseEther(poolEth) })).wait();
  }
  console.log("Quy hien tai:", ethers.formatEther(await contract.poolBalance()), "ETH");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
