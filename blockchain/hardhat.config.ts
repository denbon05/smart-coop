import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const isTestMode = process.env.NODE_ENV === "test";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      loggingEnabled: !isTestMode,
      mining: {
        auto: isTestMode,
        interval: [13000, 15000], // mining is each 13-15 seconds
        mempool: {
          order: "fifo",
        },
      },
    },
  },
  paths: {
    artifacts: "../frontend/src/artifacts",
    tests: "./__tests__",
  },
};

export default config;
