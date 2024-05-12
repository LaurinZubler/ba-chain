require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

const { vars } = require("hardhat/config");

const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const OPTIMISM_SEPOLIA_PRIVATE_KEY = vars.get("OPTIMISM_SEPOLIA_PRIVATE_KEY");
const ETHERSCAN_OPTIMISM_KEY = vars.get("ETHERSCAN_OPTIMISM_KEY");

module.exports = {
  solidity: "0.8.24",
  networks: {
    optimismSepolia: {
      url: `https://optimism-sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [OPTIMISM_SEPOLIA_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      optimismSepolia: ETHERSCAN_OPTIMISM_KEY,
    },
    customChains: [
      {
        network: "optimismSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimistic.etherscan.io"
        }
      }
    ]
  },
  sourcify: {
    enabled: true,
  }
};