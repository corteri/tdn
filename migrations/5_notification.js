const notification = artifacts.require("notification");
module.exports = function (deployer) {
  deployer.deploy(notification);
};