// Ghi frontend/src/contracts/abi.json va address.json (file sinh tu dong, KHONG sua tay)
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "..", "frontend", "src", "contracts");
const ARTIFACT = path.join(__dirname, "..", "artifacts", "contracts", "HealthInsuranceNFT.sol", "HealthInsuranceNFT.json");

function writeAbi() {
  const abi = JSON.parse(fs.readFileSync(ARTIFACT, "utf8")).abi;
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "abi.json"), JSON.stringify(abi, null, 2));
  return abi.length;
}

// info = { chainId, network, address, insurer, deployBlock }
function exportAbi(info) {
  const n = writeAbi();
  const addressJson = {
    chainId: Number(info.chainId),
    network: info.network,
    HealthInsuranceNFT: info.address,
    insurer: info.insurer,
    deployBlock: Number(info.deployBlock),
  };
  fs.writeFileSync(path.join(OUT_DIR, "address.json"), JSON.stringify(addressJson, null, 2));
  console.log(`Da ghi abi.json (${n} muc) va address.json vao ${OUT_DIR}`);
}

module.exports = { exportAbi, OUT_DIR };

// Chay truc tiep: chi lam moi abi.json (khong dong den address.json)
if (require.main === module) {
  console.log(`Da ghi abi.json (${writeAbi()} muc)`);
}
