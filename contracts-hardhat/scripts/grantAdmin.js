// Script cấp quyền DEFAULT_ADMIN_ROLE cho ví của thành viên B (Phương Anh)
// Chạy: npx hardhat run scripts/grantAdmin.js --network sepolia

const { ethers } = require("hardhat");
const addressJson = require("../../frontend/src/contracts/address.json");

async function main() {
  const GRANT_TO = "0x3FBBa628dC4C30DCE74Eb38d015D409125750639"; // ví Phương Anh (B)

  const [deployer] = await ethers.getSigners();
  console.log("Admin đang dùng ví:", deployer.address);

  const contract = await ethers.getContractAt(
    "HealthInsuranceNFT",
    addressJson.HealthInsuranceNFT
  );

  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;

  // Kiểm tra trước
  const alreadyHas = await contract.hasRole(DEFAULT_ADMIN_ROLE, GRANT_TO);
  if (alreadyHas) {
    console.log("✅ Địa chỉ này đã có quyền Admin rồi, không cần làm gì thêm.");
    return;
  }

  console.log(`Đang cấp DEFAULT_ADMIN_ROLE cho ${GRANT_TO} ...`);
  const tx = await contract.grantRole(DEFAULT_ADMIN_ROLE, GRANT_TO);
  await tx.wait();

  console.log("✅ Cấp quyền thành công! Tx hash:", tx.hash);
  console.log(`🔗 https://sepolia.etherscan.io/tx/${tx.hash}`);
}

main().catch((err) => {
  console.error("❌ Lỗi:", err.message);
  process.exit(1);
});
