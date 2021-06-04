const maincontract = artifacts.require("maincontract");
module.exports = function (deployer) {
  deployer.deploy(maincontract);
};