/*
Blockchain state changes when we put new contracts on it
So basically migrating from one state of blockchain to another. 
*/

const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

/*
deployer: account that puts the smart contract on the network.
network: The network where the smart contract is deployed.
accounts: accounts available in the network. 
*/
module.exports = async function(deployer, network, accounts) {
  //Step 1
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();
  const daiTokenAddress = daiToken.address;

  //Step 2
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();
  const dappTokenAddress = dappToken.address;

  //Step 3
  await deployer.deploy(TokenFarm, dappTokenAddress, daiTokenAddress);
  const tokenFarm = await TokenFarm.deployed();
  const tokenFarmAddress = tokenFarm.address;

  //Step 4: Transfer all dapp tokens to Token Farm as it will be given as interest to user.
  await dappToken.transfer(tokenFarmAddress, "1000000000000000000000000");

  //Step 5: Transfer 100 mock DAI token to investor the will invest these DAI token on TokenFarm
  //accounts[1] in ganache is our investor
  await daiToken.transfer(accounts[1], "100000000000000000000");
};
