import { ethers } from "ethers";
import React, { useState } from "react";
import { lotteryTokenContract } from "../assets/lotteryTokenContract";
import { lotteryTokenERC20Address } from "../assets/lotteryTokenERC20Address";
import { lotteryContract } from "../assets/lotteryContract";
import { lotteryAddress } from "../assets/lotteryAddress";


function PrizeWithdraw({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [transactionHash, setTransactionHash] = useState("");
  const [msgValue, setMsgValue] = useState(0);

  const handlePrizeAmount = (event: { target: { value: any } }) => {
    setMsgValue(event.target.value);
  };

  async function prizeWithdraw() {
    try {
      if (accounts[0] !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());
  
        const erc20Contract = new ethers.Contract(lotteryTokenERC20Address, lotteryTokenContract.abi, signer);
        const lottery = new ethers.Contract(lotteryAddress, lotteryContract.abi, signer);
  
        const prizeWithdraw = await lottery.prizeWithdraw(msgValue);
  
        const receipt = await prizeWithdraw.wait();
        console.log(`receipt.transactionHash ${receipt.transactionHash}`);
  
        if (receipt.transactionHash !== "undefined") {
          setTransactionHash(receipt.transactionHash);
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
      <h2>Prize Withdraw</h2>
      <p>
        <b>Prize Withdraw Transaction Hash:</b> <i>{transactionHash}</i>
      </p>
      <p><b>Amount: </b></p>
      <input type="number" id="tokens" name="tokens" onChange={handlePrizeAmount} value={msgValue} />
      <button className="button" onClick={prizeWithdraw}>
        Prize Withdraw
      </button>
    </div>
  );
}

export default PrizeWithdraw;
