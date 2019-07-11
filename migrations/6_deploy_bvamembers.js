const BVA            = artifacts.require("BVA");
const BVATeamMembers = artifacts.require("BVATeamMembers");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(BVATeamMembers, BVA.address);
};
