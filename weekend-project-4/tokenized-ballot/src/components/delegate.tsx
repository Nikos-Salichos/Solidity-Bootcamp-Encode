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
      const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;

      const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
      const wallet = new ethers.Wallet(privateKey!, provider);
      const signer = wallet.connect(provider);

      const tokenContract = new ethers.Contract(myTokenERC20Address, myTokenERC20.abi, signer);

      const delegateTx = await tokenContract.delegate(accounts[0]);
      const receipt = await delegateTx.wait();

      console.log(`Delegating voting power to: ${accounts[0]}`);
      console.log(`Transaction hash: ${receipt.transactionHash}`);

      setTransactionHash(receipt.transactionHash);
    }
  }

  return (
    <div>
      <button className="delegateButton" onClick={delegateTokens}>
        Delegate
      </button>
      <div>
        <p>Delegate Address {accounts[0]}</p>
        <p>Delegate Transaction Hash: {transactionHash}</p>
        <p>{delegateToAddress}</p>
      </div>
    </div>
  );
}

export default Delegate;
