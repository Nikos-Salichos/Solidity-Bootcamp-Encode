import { ethers } from "ethers";
import React, { useState } from "react";
import { myTokenERC20Address } from "../assets/myTokenERC20Address";
import { myTokenERC20 } from "../assets/myTokenERC20";

function Delegate({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [transactionHash, setTransactionHash] = useState("");
  const [delegateToAddress, setDelegateToAddress] = useState("");

  
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
