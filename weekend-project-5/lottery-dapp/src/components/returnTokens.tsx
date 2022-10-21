import { ethers } from "ethers";
import React, { useState } from "react";
import { lotteryTokenContract } from "../assets/lotteryTokenContract";
import { lotteryTokenERC20Address } from "../assets/lotteryTokenERC20Address";
import { lotteryContract } from "../assets/lotteryContract";
import { lotteryAddress } from "../assets/lotteryAddress";

function ReturnTokens({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [transactionHash, setTransactionHash] = useState("");
  const [amountOfTokens, setAmountOfTokens] = useState(0);

  const handleAmountOfTokens = (event: { target: { value: any } }) => {
    setAmountOfTokens(event.target.value);
  };

  async function returnTokens() {
    try {
      if (accounts[0] !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const erc20Contract = new ethers.Contract(lotteryTokenERC20Address, lotteryTokenContract.abi, signer);
        const lottery = new ethers.Contract(lotteryAddress, lotteryContract.abi, signer);

        const returnTokensFunction = await lottery.returnTokens(amountOfTokens);
        const receipt = await returnTokensFunction.wait();

        if (receipt.transactionHash !== "undefined") {
          setTransactionHash(receipt.transactionHash);
        } else {
          setTransactionHash("Transaction failed");
          setAmountOfTokens(0);
        }
      }
    } catch (error) {
      let result = (error as Error).message;
      setTransactionHash(result);
    }
  }

  return (
    <div className="inner-container">
      <h2>Return Tokens</h2>
      <p>
        <b>Return Tokens Transaction Hash:</b> <i>{transactionHash}</i>
      </p>
      <p>
        <b>Tokens</b> {amountOfTokens}
      </p>
      <button className="button" onClick={returnTokens}>
        Return Tokens
      </button>
      <input type="number" id="tokens" name="tokens" onChange={handleAmountOfTokens} value={amountOfTokens}></input>
    </div>
  );
}

export default ReturnTokens;
