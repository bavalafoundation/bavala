const BVA         = artifacts.require("BVA");
const BVAFounders = artifacts.require("BVAFounders");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(BVAFounders, BVA.address);
};
