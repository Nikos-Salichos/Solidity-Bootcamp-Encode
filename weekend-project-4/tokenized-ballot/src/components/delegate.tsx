import { ethers } from "ethers";
import React, { useState } from "react";
import { myTokenERC20Address } from "../assets/myTokenERC20Address";
import { myTokenERC20 } from "../assets/myTokenERC20";

function Delegate({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [transactionHash, setTransactionHash] = useState("");
  const [delegateToAddress, setDelegateToAddress] = useState("");

  async function delegateTokens() {
    if (accounts[0] !== "undefined") {
      console.log(`Delegating voting power started`);

      setDelegateToAddress(accounts[0]);

      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", signer.getAddress());

      const tokenContract = new ethers.Contract(myTokenERC20Address, myTokenERC20.abi, signer);

      const delegateTx = await tokenContract.delegate(accounts[0]);
      const receipt = await delegateTx.wait();

      console.log(`Delegating voting power to: ${accounts[0]}`);
      console.log(`Transaction hash: ${receipt.transactionHash}`);

      setTransactionHash(receipt.transactionHash);
    }
  }

  return (
    <div className="inner-container">
      <h2>Delegate</h2>
      <p>
        <b>Delegate Address:</b> {accounts[0]}
      </p>
      <p>
        <b>Delegate Transaction Hash:</b> <i>{transactionHash}</i>
      </p>
      <button className="button" onClick={delegateTokens}>
        Delegate
      </button>
    </div>
  );
}

export default Delegate;
