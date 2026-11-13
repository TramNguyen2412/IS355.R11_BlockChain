require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun", // bắt buộc: OpenZeppelin v5 mới dùng lệnh mcopy của cancun
    },
  },
  networks: {

    // Phần thêm localhost để chạy C
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: "remote",
    },
    // Hardhat Local node: http://127.0.0.1:8545

    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  etherscan: { apiKey: process.env.ETHERSCAN_API_KEY || "" },
  gasReporter: { enabled: process.env.REPORT_GAS === "true" },
};
