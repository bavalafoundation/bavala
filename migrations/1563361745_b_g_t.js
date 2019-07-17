const BGT = artifacts.require("BGT");

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(BGT);
};
