import { ethers } from "ethers";
import React, { useState } from "react";
import { lotteryTokenContract } from "../assets/lotteryTokenContract";
import { lotteryTokenERC20Address } from "../assets/lotteryTokenERC20Address";
import { lotteryContract } from "../assets/lotteryContract";
import { lotteryAddress } from "../assets/lotteryAddress";

function Bet({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [transactionHash, setTransactionHash] = useState("");
  const [msgValue, setMsgValue] = useState(0);

  const handleBetTimes = (event: { target: { value: any } }) => {
    setMsgValue(event.target.value);
  };

  async function betMany() { 
    try {
      if (accounts[0] !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());
  
        const erc20Contract = new ethers.Contract(lotteryTokenERC20Address, lotteryTokenContract.abi, signer);
        const lottery = new ethers.Contract(lotteryAddress, lotteryContract.abi, signer);
  
        const betMany = await lottery.betMany(msgValue);
  
        const receipt = await betMany.wait();
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
      <h2>Bet</h2>
      <p>
        <b>Bet Transaction Hash:</b> <i>{transactionHash}</i>
      </p>
      <p><b>Bet Times:</b></p>
      <input type="number" id="tokens" name="tokens" onChange={handleBetTimes} value={msgValue} />
      <button className="button" onClick={betMany}>
        Bet
      </button>
    </div>
  );
}

export default Bet;
