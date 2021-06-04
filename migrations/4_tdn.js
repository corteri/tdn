const tdn = artifacts.require("tdn");
module.exports = function (deployer) {
  deployer.deploy(tdn);
};