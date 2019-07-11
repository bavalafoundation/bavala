const BVA            = artifacts.require("BVA");
const BVATokenHolder = artifacts.require("BVATokenHolder");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(BVATokenHolder, BVA.address, 'Marketing & Strategic Partners');
};
