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

  async function purchaseTokens() {
    try {
      if (accounts[0] !== "undefined") {
        const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
        const privateKey = process.env.REACT_APP_PRIVATE_KEY;

        const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
        const wallet = new ethers.Wallet(privateKey!, provider);
        const signer = wallet.connect(provider);

        const erc20Contract = new ethers.Contract(lotteryTokenERC20Address, lotteryTokenContract.abi, signer);
        const lottery = new ethers.Contract(lotteryAddress, lotteryContract.abi, signer);

        const returnTokens = await lottery.returnTokens();
        const receipt = await returnTokens.wait();

        console.log(`receipt.transactionHash ${receipt.transactionHash}`);

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
      <button className="button" onClick={purchaseTokens}>
        Return Tokens
      </button>
      <input type="number" id="tokens" name="tokens" onChange={handleAmountOfTokens} value={amountOfTokens}></input>
    </div>
  );
}

export default ReturnTokens;
