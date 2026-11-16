const hre = require("hardhat");
const addressInfo = require("../../frontend/src/contracts/address.json");

const PLANS = [
  {
    name: "Gói Cơ bản",
    price: "0.002",
    limit: "0.02",
    days: 30,
    cid: "mock-cid-policy-basic",
  },
  {
    name: "Gói Nâng cao",
    price: "0.005",
    limit: "0.05",
    days: 90,
    cid: "mock-cid-policy-premium",
  },
];

async function main() {
  const { ethers } = hre;
  const [admin] = await ethers.getSigners();
  console.log("Admin address:", admin.address);

  const balance = await ethers.provider.getBalance(admin.address);
  console.log("Admin SepoliaETH balance:", ethers.formatEther(balance), "ETH");

  const contract = await ethers.getContractAt(
    "HealthInsuranceNFT",
    addressInfo.HealthInsuranceNFT,
    admin
  );

  const currentTotal = await contract.totalPlans();
  console.log("Current total plans:", currentTotal.toString());

  if (currentTotal > 0n) {
    console.log("Plans already exist! Current plans:");
    const existing = await contract.getPlans();
    for (const p of existing) {
      console.log(`- Plan #${p.id}: ${p.name}, Price: ${ethers.formatEther(p.price)} ETH, Limit: ${ethers.formatEther(p.coverageLimit)} ETH, Active: ${p.active}`);
    }
    return;
  }

  console.log("\nCreating plans on Sepolia...");
  for (const p of PLANS) {
    console.log(`Sending tx to create "${p.name}"...`);
    const tx = await contract.createPlan(
      p.name,
      ethers.parseEther(p.price),
      ethers.parseEther(p.limit),
      p.days,
      p.cid
    );
    console.log(`Tx submitted: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Confirmed in block: ${receipt.blockNumber}`);
  }

  const newTotal = await contract.totalPlans();
  console.log("\nDone! New total plans:", newTotal.toString());

  const allPlans = await contract.getPlans();
  console.log("All plans on-chain:");
  for (const p of allPlans) {
    console.log(`- Plan #${p.id}: ${p.name}, Price: ${ethers.formatEther(p.price)} ETH, Limit: ${ethers.formatEther(p.coverageLimit)} ETH, Active: ${p.active}`);
  }
}

main().catch((err) => {
  console.error("Error creating plans:", err);
  process.exit(1);
});
