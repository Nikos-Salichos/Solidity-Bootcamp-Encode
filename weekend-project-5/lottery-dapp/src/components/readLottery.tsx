import { ethers } from "ethers";
import React, { useState } from "react";
import { lotteryTokenContract } from "../assets/lotterytokenContract";
import { lotteryTokenERC20Address } from "../assets/lotteryTokenERC20Address";
import { lotteryContract } from "../assets/lotteryContract";
import { lotteryAddress } from "../assets/lotteryAddress";

function ReadSmartContract({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [balance, setBalance] = useState("");
  const [purchaseRatio, setPurchaseRatio] = useState("");
  const [betPrice, setBetPrice] = useState("");
  const [betFee, setBetFee] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [ownerPool, setOwnerPool] = useState("");
  const [betsOpen, setBetsOpen] = useState("");
  const [betsClosingTime, setBetsClosingTime] = useState("");

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

      const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;

      const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
      const wallet = new ethers.Wallet(privateKey!, provider);
      const signer = wallet.connect(provider);

      const erc20Contract = new ethers.Contract(lotteryTokenERC20Address, lotteryTokenContract.abi, signer);
      const lottery = new ethers.Contract(lotteryAddress, lotteryContract.abi, signer);

      const betFee = await lottery._betFee();
      console.log(`betFee ${betFee}`);
      setVotingPower(betFee.toString());

      const betPrice = await lottery._betPrice();
      const betPrice = ethers.utils.parseBytes32String(betPrice);
      console.log(`_betPrice ${betPrice}`);
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
          <b>Lottery Address:</b> {lotteryAddress}
        </p>
        <p>
          <b>Token Address:</b> {lotteryTokenERC20Address}
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
