import { ethers } from "ethers";
import React, { useState } from "react";
import { lotteryTokenContract } from "../assets/lotteryTokenContract";
import { lotteryTokenERC20Address } from "../assets/lotteryTokenERC20Address";
import { lotteryContract } from "../assets/lotteryContract";
import { lotteryAddress } from "../assets/lotteryAddress";

function OpenBets({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [transactionHash, setTransactionHash] = useState("");
  const [closingTime, setClosingTime] = useState(0);

  async function openNewBet() {
    try {
      if (accounts[0] !== "undefined") {
        const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
        const privateKey = process.env.REACT_APP_PRIVATE_KEY;

        const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
        const wallet = new ethers.Wallet(privateKey!, provider);
        const signer = wallet.connect(provider);

        const erc20Contract = new ethers.Contract(lotteryTokenERC20Address, lotteryTokenContract.abi, signer);
        const lottery = new ethers.Contract(lotteryAddress, lotteryContract.abi, signer);

        const timestamp = (await provider.getBlock(`latest`)).timestamp;
        const closingTime = timestamp + 10000;
        const openBet = await lottery.openBets(closingTime);

        const receipt = await openBet.wait();

        console.log(`receipt.transactionHash ${receipt.transactionHash}`);

        if (receipt.transactionHash !== "undefined") {
          setTransactionHash(receipt.transactionHash);
          setClosingTime(closingTime);
        } else {
          setTransactionHash("Transaction failed");
        }
      }
    } catch (error) {
      let result = (error as Error).message;
      setTransactionHash(result);
    }
  }

  return (
    <div className="inner-container">
      <h2>Open Bets</h2>
      <p>
        <b>Open Bet Hash:</b> <i>{transactionHash}</i>
      </p>
      <p>
        <b>Closing Time:</b> {closingTime}
      </p>
      <button className="button" onClick={openNewBet}>
        Open new bet
      </button>
    </div>
  );
}

export default OpenBets;
