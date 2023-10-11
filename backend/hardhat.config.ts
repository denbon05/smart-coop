import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "localhost",
  paths: {
    artifacts: "../frontend/src/artifacts",
    tests: "./__tests__",
  },
};

export default config;
