const BVA      = artifacts.require("BVA");
const SafeMath = artifacts.require("SafeMath");

module.exports = function(deployer, network, accounts) {
  deployer.link(SafeMath, BVA);
  deployer.deploy(BVA);
};
