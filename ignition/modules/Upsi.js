const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const UpsiModule = buildModule("UpsiModule", (m) => {
  const upsi = m.contract("Upsi");

  return { upsi };
});

module.exports = UpsiModule;