const BVABurner = artifacts.require("BVABurner");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(BVABurner);
};
