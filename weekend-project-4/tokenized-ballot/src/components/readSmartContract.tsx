import { ethers } from "ethers";
import React, { useState } from "react";
import { myTokenERC20Address } from "../assets/myTokenERC20Address";
import { tokenizedBallotAddress } from "../assets/tokenizedBallotAddress";
import { myTokenERC20 } from "../assets/myTokenERC20";

function ReadSmartContract({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const isConnected = Boolean(accounts[0]);
  const [balance, setBalance] = useState("");

  async function connectAccount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletBalance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });

      setAccounts(accounts);
      setBalance(walletBalance);
    }
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
