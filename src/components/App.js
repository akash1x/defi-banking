import Navbar from "./Navbar";
import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Web3 from "web3";
import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import Main from "./Main";

const App = () => {
  const [account, setAccount] = useState("0x0");
  const [daiToken, setDaiToken] = useState({});
  const [dappToken, setDappToken] = useState({});
  const [tokenFarm, setTokenFarm] = useState({});
  const [daiTokenBalance, setDaiTokenBalance] = useState("0");
  const [dappTokenBalance, setDappTokenBalance] = useState("0");
  const [stakingBalance, setStakingBalance] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    connectToWeb3();
    console.log("first");
  }, []);

  async function connectToWeb3() {
    await loadWeb3();
    await loadBlockChainData();
  }

  async function loadBlockChainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    console.log(networkId);

    //Load DaiToken
    const daiTokenData = DaiToken.networks[networkId];
    console.log(daiTokenData);
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiToken.abi,
        daiTokenData.address
      );
      console.log(daiToken);
      setDaiToken(daiToken);
      console.log(daiToken);
      let daiTokenBalance = await daiToken.methods
        .balanceOf(accounts[0])
        .call();
      console.log(daiTokenBalance);
      setDaiTokenBalance(daiTokenBalance);
    } else {
      window.alert(
        `DApp Token contract not deployed to detected network: ${networkId}`
      );
    }

    //Load Dapp Token
    const dappTokenData = DappToken.networks[networkId];
    console.log(dappTokenData);
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(
        DappToken.abi,
        dappTokenData.address
      );
      console.log(dappToken);
      setDappToken(dappToken);
      console.log(dappToken);
      let dappTokenBalance = await dappToken.methods
        .balanceOf(accounts[0])
        .call();
      console.log(dappTokenBalance);
      setDappTokenBalance(dappTokenBalance);
    } else {
      window.alert(
        `DAI Token contract not deployed to detected network: ${networkId}`
      );
    }

    //Load Token Farm
    const tokenFarmData = TokenFarm.networks[networkId];
    console.log(tokenFarmData);
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(
        TokenFarm.abi,
        tokenFarmData.address
      );
      console.log(tokenFarm);
      setTokenFarm(tokenFarm);

      let stakingBalance = await tokenFarm.methods
        .stakingBalance(accounts[0])
        .call();
      console.log(stakingBalance);
      setStakingBalance(stakingBalance);
    } else {
      window.alert(
        `Token Farm contract not deployed to detected network: ${networkId}`
      );
    }
    setLoading(false);
  }
  //Connecting app to metamask
  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non Ethereum browser detected. You should consider trying Metamask"
      );
    }
  }

  const stakeTokens = (amount) => {
    setLoading(true);
    daiToken.methods
      .approve(tokenFarm._address, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        tokenFarm.methods
          .stakeTokens(amount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            setLoading(false);
          });
      });
  };

  const unstakeTokens = () => {
    setLoading(true);
    tokenFarm.methods
      .unstakeTokens()
      .send({ from: account })
      .on("transactionHash", (hash) => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="content mr-auto ml-auto">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
              {loading ? (
                <h3>Loading ...</h3>
              ) : (
                <Main
                  daiTokenBalance={daiTokenBalance}
                  dappTokenBalance={dappTokenBalance}
                  stakingBalance={stakingBalance}
                  stakeTokens={stakeTokens}
                  unstakeTokens={unstakeTokens}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
