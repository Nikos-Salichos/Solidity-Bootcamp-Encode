import React, { useState } from "react";
import { ethers } from "ethers";
import { lotteryTokenContract } from "../assets/lotteryTokenContract";
import { lotteryTokenERC20Address } from "../assets/lotteryTokenERC20Address";
import { lotteryContract } from "../assets/lotteryContract";
import { lotteryAddress } from "../assets/lotteryAddress";

function CloseLottery({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [transactionHash, setTransactionHash] = useState("");

  async function closeLotteryFunction() {
    try {
      if (accounts[0] !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const erc20Contract = new ethers.Contract(lotteryTokenERC20Address, lotteryTokenContract.abi, signer);
        const lottery = new ethers.Contract(lotteryAddress, lotteryContract.abi, signer);

        const closeLottery = await lottery.closeLottery();
        const closeLotteryTx  = await closeLottery.wait();

        console.log(`closeLotteryTx.transactionHash ${closeLotteryTx.transactionHash}`);

        if (closeLotteryTx.transactionHash !== "undefined") {
          setTransactionHash(closeLotteryTx.transactionHash);
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
    <div className="inner-container-full">
      <h2>Close Lottery</h2>
      <p>
        <b>Close Lottery Hash:</b> <i>{transactionHash}</i>
      </p>
      <button className="button" onClick={closeLotteryFunction}>
        Close Lottery
      </button>
    </div>
  );
};

export default CloseLottery;
