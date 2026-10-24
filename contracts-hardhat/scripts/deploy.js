const hre = require("hardhat");
const { exportAbi } = require("./exportAbi");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const Factory = await hre.ethers.getContractFactory("HealthInsuranceNFT");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  const receipt = await contract.deploymentTransaction().wait();
  const net = await hre.ethers.provider.getNetwork();
  exportAbi({
    chainId: net.chainId,
    network: hre.network.name,
    address,
    insurer: deployer.address,
    deployBlock: receipt.blockNumber,
  });
  console.log("HealthInsuranceNFT:", address);
  console.log("Insurer (admin):", deployer.address);
  console.log("Deploy block:", receipt.blockNumber);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
