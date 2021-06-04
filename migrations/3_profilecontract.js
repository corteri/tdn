const profilecontract = artifacts.require("profilecontract");
module.exports = function (deployer) {
  deployer.deploy(profilecontract);
};