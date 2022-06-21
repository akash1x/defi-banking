const { assert } = require("chai");

const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

require("chai")
  .use(require("chai-as-promised"))
  .should();

//Utility Function
function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", (accounts) => {
  let daiToken, dappToken, tokenFarm;
  //before(): runs before every describe function
  before(async () => {
    //Load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    //Transfer all Dapp tokens
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));

    //Transfer DAI to investor
    //Note: Here we need to pass metadata like "from"  even though in the fxn signature it is not present
    // Only in testing it is valid.
    await daiToken.transfer(accounts[1], tokens("100"), { from: accounts[0] });
  });

  describe("Mock DAI deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("Dapp Token deployment", async () => {
    it("has a name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "Dapp Token Farm");
    });

    it("contract has tokens", async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });
});
