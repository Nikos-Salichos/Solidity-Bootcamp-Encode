import { ethers } from "ethers";
import React, { useState } from "react";
import { myTokenERC20Address } from "../assets/myTokenERC20Address";
import { myTokenERC20 } from "../assets/myTokenERC20";

function Mint({ accounts, setAccounts, amountOfTokens, setAmountOfTokens }: { accounts: any; setAccounts: any; amountOfTokens: any; setAmountOfTokens: any }) {
  const [transactionHash, setTransactionHash] = useState("");

  async function mintTokens() {
    try {
      const claimList = ["0x05b4Ae8d9B4ccd9f6D470956968DD49274BdD16F", "0xe3a9a11232f4d52786ca61f56bb7fb01b00c80cd", "0xF0263339678ec2ad8C6722b5eCedDB904cBed19D"];

      const upperCase = claimList.map((element) => {
        return element.toUpperCase();
      });
      let isAccountExists;
      if (accounts[0] !== "undefined") {
        isAccountExists = upperCase.includes(accounts[0].toUpperCase());
      }

      if (isAccountExists) {
        const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
        const privateKey = process.env.REACT_APP_PRIVATE_KEY;

        const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
        const wallet = new ethers.Wallet(privateKey!, provider);
        const signer = wallet.connect(provider);

        const tokenContract = new ethers.Contract(myTokenERC20Address, myTokenERC20.abi, signer);
        console.log(tokenContract);
        const mintingTo = accounts[0];

        const mintingAmount = ethers.utils.parseEther("1");

        const mintTx = await tokenContract.mint(mintingTo, mintingAmount);

        const receipt = await mintTx.wait();

        console.log(`receipt.transactionHash ${receipt.transactionHash}`);

        if (receipt.transactionHash !== "undefined") {
          setAmountOfTokens(mintingAmount.toString());
          setTransactionHash(receipt.transactionHash);
        } else {
          setTransactionHash("Transaction failed");
          setAmountOfTokens("0");
        }
      }
    } catch (error) {
      let result = (error as Error).message;
      setTransactionHash(result);
      setAmountOfTokens("0");
    }
  }

  return (
    <div className="inner-container">
      <h2>Minting Tokens</h2>
      <p>
        <b>Mint Transaction Hash:</b> <i>{transactionHash}</i>
      </p>
      <p>
        <b>Tokens minted:</b> {amountOfTokens}
      </p>
      <button className="button" onClick={mintTokens}>
        Mint
      </button>
    </div>
  );
}

export default Mint;
