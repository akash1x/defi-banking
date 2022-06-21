import Navbar from "./Navbar";
import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Web3 from "web3";
import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";

const App = () => {
  const [account, setAccount] = useState("");
  const [daiToken, setDaiToken] = useState({});
  const [daiTokenBalance, setDaiTokenBalance] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    connectToWeb3();
  }, []);

  async function connectToWeb3() {
    await loadWeb3();
    await loadBlockChainData();
  }

  async function loadBlockChainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    // setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    //setNetworkId(networkId);

    //Load DaiToken
    const daiTokenData = DaiToken.networks[networkId];
    console.log(daiTokenData);
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiToken.abi,
        daiTokenData.address
      );
      // console.log(daiToken);
      // setDaiToken(daiToken);
      console.log(daiToken);
      let daiTokenBalance = await daiToken.methods
        .balanceOf(accounts[0])
        .call();
      console.log(daiTokenBalance);
      // setDaiTokenBalance(daiTokenBalance.toString());
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
      // console.log(daiToken);
      // setDaiToken(daiToken);
      console.log(dappToken);
      let dappTokenBalance = await dappToken.methods
        .balanceOf(accounts[0])
        .call();
      console.log(dappTokenBalance);
      // setDaiTokenBalance(daiTokenBalance.toString());
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
      // console.log(daiToken);
      // setDaiToken(daiToken);
      console.log(dappToken);
      let stakingBalance = await tokenFarm.methods
        .balanceOf(accounts[0])
        .call();
      console.log(stakingBalance);
      // setDaiTokenBalance(daiTokenBalance.toString());
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

              <h1>Hello, World!</h1>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
