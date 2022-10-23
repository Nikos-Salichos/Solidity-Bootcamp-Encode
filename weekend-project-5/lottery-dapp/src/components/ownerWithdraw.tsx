import { ethers } from "ethers";
import React, { useState } from "react";
import { lotteryTokenContract } from "../assets/lotteryTokenContract";
import { lotteryTokenERC20Address } from "../assets/lotteryTokenERC20Address";
import { lotteryContract } from "../assets/lotteryContract";
import { lotteryAddress } from "../assets/lotteryAddress";

function OwnerWithdraw() {
  const [transactionHash, setTransactionHash] = useState("");
  const [withdrawAmount, setwithdrawAmount] = useState(0);

  const handleWithdrawAmount = (event: { target: { value: any } }) => {
    setwithdrawAmount(event.target.value);
  };

  async function ownerWithdraw() {
    try {
      const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;

      const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
      const wallet = new ethers.Wallet(privateKey!, provider);
      const signer = wallet.connect(provider);

      const erc20Contract = new ethers.Contract(lotteryTokenERC20Address, lotteryTokenContract.abi, signer);
      const lottery = new ethers.Contract(lotteryAddress, lotteryContract.abi, signer);

      const ownerWithdraw = await lottery.ownerWithdraw(withdrawAmount);
      const receipt = await ownerWithdraw.wait();

      if (receipt.transactionHash !== "undefined") {
        setTransactionHash(receipt.transactionHash);
      } else {
        setTransactionHash("Transaction failed");
        setwithdrawAmount(0);
      }
    } catch (error) {
      let result = (error as Error).message;
      setTransactionHash(result);
    }
  }

  return (
    <div className="inner-container">
      <h2>Owner Withdraw</h2>
      <p>
        <b>Owner withdraw Transaction Hash:</b> <i>{transactionHash}</i>
      </p>
      <p>
        <b>Withdraw Amount</b> {withdrawAmount}
      </p>
      <input type="number" id="tokens" name="tokens" onChange={handleWithdrawAmount} value={withdrawAmount}></input>
      <button className="button" onClick={ownerWithdraw}>
        Onwer withdraw
      </button>
    </div>
  );
}

export default OwnerWithdraw;
