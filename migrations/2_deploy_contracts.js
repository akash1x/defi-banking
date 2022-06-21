/*
Blockchain state changes when we put new contracts on it
So basically migrating from one state of blockchain to another. 
*/

const TokenFarm = artifacts.require("TokenFarm");

module.exports = function(deployer) {
  deployer.deploy(TokenFarm);
};
