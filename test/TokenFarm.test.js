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

  describe("Farming tokens", async () => {
    it("rewards investor for staking mDai tokens", async () => {
      let result;

      //Check investor balance before staking
      result = await daiToken.balanceOf(accounts[1]);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor mock DAI wallet balance correct before staking"
      );

      //Stake Mock DAI Tokens
      await daiToken.approve(tokenFarm.address, tokens("100"), {
        from: accounts[1],
      });
      await tokenFarm.stakeTokens(tokens("100"), { from: accounts[1] });

      //Checking staking result
      result = await daiToken.balanceOf(accounts[1]);
      assert.equal(
        result.toString(),
        tokens("0"),
        "investor Mock DAI wallet balance correct after staking"
      );

      result = await tokenFarm.stakingBalance(accounts[1]);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor staking balance correct after staking"
      );

      result = await tokenFarm.isStaking(accounts[1]);
      assert.equal(
        result.toString(),
        "true",
        "investor staking status correct after staking"
      );

      //Issue Tokens
      await tokenFarm.issueTokens({ from: accounts[0] });

      result = await dappToken.balanceOf(accounts[1]);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor DApp Token wallet balance correct after issuance"
      );

      //Ensure that only owner can call it. We can try call below function from another account here investor is calling to check basically.
      await tokenFarm.issueTokens({ from: accounts[1] }).should.be.rejected;

      //Unstake tokens
      await tokenFarm.unstakeTokens({ from: accounts[1] });

      //Check result after unstaking
      result = await daiToken.balanceOf(accounts[1]);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor Mock DAI wallet balance correct after unstaking"
      );

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        result.toString(),
        tokens("0"),
        "Token Farm Mock DAI wallet balance correct after unstaking"
      );

      result = await tokenFarm.stakingBalance(accounts[1]);
      assert.equal(
        result.toString(),
        tokens("0"),
        "Investor staking balance correct after unstaking"
      );

      result = await tokenFarm.isStaking(accounts[1]);
      assert.equal(
        result.toString(),
        "false",
        "Investor staking status correct after unstaking"
      );
    });
  });
});
