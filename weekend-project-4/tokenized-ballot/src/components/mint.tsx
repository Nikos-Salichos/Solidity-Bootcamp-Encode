import { ethers } from "ethers";
import React, { useState } from "react";
import { myTokenERC20Address } from "../assets/myTokenERC20Address";
import { myTokenERC20 } from "../assets/myTokenERC20";

function Mint({ accounts, setAccounts, amountOfTokens, setAmountOfTokens }: { accounts: any; setAccounts: any; amountOfTokens: any; setAmountOfTokens: any }) {
  const [transactionHash, setTransactionHash] = useState("");

  async function mintTokens() {
    const claimList = ["0x05b4Ae8d9B4ccd9f6D470956968DD49274BdD16F", "0xe3a9a11232f4d52786ca61f56bb7fb01b00c80cd", "0xF0263339678ec2ad8C6722b5eCedDB904cBed19D"];

    const upperCase = claimList.map((element) => {
      return element.toUpperCase();
    });
    let isAccountExist;
    if (accounts[0] !== "undefined") {
      isAccountExist = upperCase.includes(accounts[0].toUpperCase());
    }

 

  }

  return (
    <div>
      <button className="mintButton" onClick={mintTokens}>
        Mint
      </button>
      <div>
        <p>Transaction Hash: {transactionHash}</p>
        <p>Tokens minted: {amountOfTokens}</p>
      </div>
    </div>
  );
}

export default Mint;
