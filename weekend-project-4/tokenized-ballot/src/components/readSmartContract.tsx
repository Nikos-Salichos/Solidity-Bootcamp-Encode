import { ethers } from "ethers";
import React, { useState } from "react";
import { myTokenERC20Address } from "../assets/myTokenERC20Address";
import { tokenizedBallotAddress } from "../assets/tokenizedBallotAddress";
import { myTokenERC20 } from "../assets/myTokenERC20";
import { tokenizedBallot } from "../assets/tokenizedBallot";

function ReadSmartContract({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [balance, setBalance] = useState("");
  const [votingPower, setVotingPower] = useState("");
  const [winnerName, setWinnerName] = useState("");

  async function connectAccount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletBalanceBN = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });

      const walletBalance = ethers.utils.formatEther(walletBalanceBN);

      setAccounts(accounts);
      setBalance(walletBalance);
    }
  }

  async function contractInfo() {
    if (accounts[0] !== "undefined") {
      console.log(`Reading smart contract started`);

 

      const tokenContract = new ethers.Contract(myTokenERC20Address, myTokenERC20.abi, signer);
      const tokenizedBallotContract = new ethers.Contract(tokenizedBallotAddress, tokenizedBallot.abi, signer);

      const votingPower = await tokenizedBallotContract.votePower(accounts[0]);
      console.log(`Voting power: ${votingPower}`);
      setVotingPower(votingPower.toString());

      const winnerNameBN = await tokenizedBallotContract.winnerName();
      const winnerName = ethers.utils.parseBytes32String(winnerNameBN);
      console.log(`Winner name: ${winnerName}`);
      setWinnerName(winnerName);
    }
  }

  const openInNewTab = (url: any) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid-section">
      <div className="inner-container">
        <div>
          <h2>{balance} ETH</h2>
          <p>
            <b>Wallet Address:</b>{" "}
          </p>
          <p>{accounts[0]}</p>
        </div>
        <button className="button" onClick={connectAccount}>
          Connect
        </button>
      </div>
      <div className="inner-container">
        <h2>Reading Smart Contract</h2>
        <p>
          <b>Tokenized Ballot Address:</b> {tokenizedBallotAddress}
        </p>
        <p>
          <b>Token Address:</b> {myTokenERC20Address}
        </p>
        <p>
          <b>Voting Power:</b> {votingPower}
        </p>
        <p>
          <b>Winner Name:</b> {winnerName}
        </p>
        <button className="button" onClick={contractInfo}>
          Read Smart Contract
        </button>
      </div>
    </div>
  );
}

export default ReadSmartContract;
