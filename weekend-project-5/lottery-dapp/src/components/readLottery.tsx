import { ethers } from "ethers";
import React, { useState } from "react";
import { lotteryTokenContract } from "../assets/lotteryTokenContract";
import { lotteryTokenERC20Address } from "../assets/lotteryTokenERC20Address";
import { lotteryContract } from "../assets/lotteryContract";
import { lotteryAddress } from "../assets/lotteryAddress";

function ReadLottery({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [balance, setBalance] = useState("");
  const [purchaseRatio, setPurchaseRatio] = useState("");
  const [betPrice, setBetPrice] = useState("");
  const [betFee, setBetFee] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [ownerPool, setOwnerPool] = useState("");
  const [betsOpen, setBetsOpen] = useState("");
  const [betsClosingTime, setBetsClosingTime] = useState("");
  const [randomNumber, setRandomNumber] = useState("");

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
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", signer.getAddress());

      const erc20Contract = new ethers.Contract(lotteryTokenERC20Address, lotteryTokenContract.abi, signer);
      const lottery = new ethers.Contract(lotteryAddress, lotteryContract.abi, signer);

      const purchaseRatio = await lottery.purchaseRatio();
      setPurchaseRatio(purchaseRatio.toString());

      const betPrice = await lottery.betPrice();
      setBetPrice(ethers.utils.formatEther(betPrice.toString()));

      const betFee = await lottery.betFee();
      setBetFee(ethers.utils.formatEther(betFee.toString()));

      const prizePool = await lottery.prizePool();
      setPrizePool(prizePool.toString());

      const ownerPool = await lottery.ownerPool();
      setOwnerPool(ownerPool.toString());

      const betsOpen = await lottery.betsOpen();
      setBetsOpen(betsOpen.toString());

      const betsClosingTime = await lottery.betsClosingTime();
      setBetsClosingTime(betsClosingTime.toString());

      const getRandomNumber = await lottery.getRandomNumber();
      setRandomNumber(getRandomNumber.toString());
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
          <b>Purchase Ratio:</b> {purchaseRatio}
        </p>
        <p>
          <b>Bet Price:</b> {betPrice}
        </p>
        <p>
          <b>Bet Fee:</b> {betFee}
        </p>
        <p>
          <b>Prize Pool:</b> {prizePool}
        </p>
        <p>
          <b>Owner Pool:</b> {ownerPool}
        </p>
        <p>
          <b>Bets Open:</b> {betsOpen}
        </p>
        <p>
          <b>Bets Closing Time:</b> {betsClosingTime}
        </p>
        <p>
          <b>Random Number:</b> {randomNumber}
        </p>
        <button className="button" onClick={contractInfo}>
          Read Smart Contract
        </button>
      </div>
    </div>
  );
}

export default ReadLottery;
