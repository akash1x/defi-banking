import Navbar from "./Navbar";
import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Web3 from "web3";

const App = () => {
  const [account, setAccount] = useState("0x0");
  const [networkId, setNetworkId] = useState(0);
  const [daiToken, setDaiToken] = useState({});
  const [daiTokenBalance, setDaiTokenBalance] = useState("");

  useEffect(() => {
    connectToWeb3();setNetworkId
  async function connectToWeb3() {
    await loadWeb3();
    await loadBlockChainData();
  }

  async function loadBlockChainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    setNetworkId(networkId);
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
