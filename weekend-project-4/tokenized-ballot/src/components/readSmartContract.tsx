import { ethers } from "ethers";
import React from "react";
import { myTokenERC20 } from "./myTokenERC20Address";
import { tokenizedBallotAddress } from "./tokenizedBallotAddress";
require('dotenv').config()

function ReadSmartContract({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const isConnected = Boolean(accounts[0]);
  let balance = 0;

  async function connectAccount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
      getBalance();
    }
  }

  async function getBalance() {
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
      .then((balanceOfWallet: number) => {
        console.log(balanceOfWallet);
        balance = balanceOfWallet;
      });
  }

  const openInNewTab = (url: any) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <button className="connectButton" onClick={connectAccount}>
        Connect
      </button>
      <div>{accounts[0]}</div>
      <div>Balance</div>
      <div>{balance}</div>
    </div>
  );
}

export default ReadSmartContract;
