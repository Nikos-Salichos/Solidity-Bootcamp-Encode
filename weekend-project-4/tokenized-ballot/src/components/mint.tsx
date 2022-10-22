import { ethers } from "ethers";
import React, { useState } from "react";
import { myTokenERC20Address } from "../assets/myTokenERC20Address";
import { myTokenERC20 } from "../assets/myTokenERC20";

function Mint({ accounts, setAccounts, amountOfTokens, setAmountOfTokens }: { accounts: any; setAccounts: any; amountOfTokens: any; setAmountOfTokens: any }) {
  const [transactionHash, setTransactionHash] = useState("");
  const [mintERC20Tokens, setMintERC20Tokens] = useState("");
  const [mintingToAccount, setMintingToAccount] = useState("");

  const handleMintTokens = (event: { target: { value: any } }) => {
    setMintERC20Tokens(event.target.value);
  };

  const handleMintingToAccount = (event: { target: { value: any } }) => {
    setMintingToAccount(event.target.value);
  };

  async function mintTokens() {
    try {
      const claimList = ["0x05b4Ae8d9B4ccd9f6D470956968DD49274BdD16F", "0xe3a9a11232f4d52786ca61f56bb7fb01b00c80cd", "0xF0263339678ec2ad8C6722b5eCedDB904cBed19D", "0x3187Bf4b5B648F0E051EdC3f7ab54884aa37B262"];

      const upperCase = claimList.map((element) => {
        return element.toUpperCase();
      });
      let isAccountExists;
      if (accounts[0] !== "undefined") {
        isAccountExists = upperCase.includes(accounts[0].toUpperCase());
        console.log(isAccountExists);
      }

      if (isAccountExists) {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        // const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
        // const privateKey = process.env.REACT_APP_PRIVATE_KEY;
        // const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
        // const wallet = new ethers.Wallet(privateKey!, provider);
        // const signer = wallet.connect(provider);

        const tokenContract = new ethers.Contract(myTokenERC20Address, myTokenERC20.abi, signer);

        const mintingAmount = ethers.utils.parseEther("1");
        const mintTx = await tokenContract.mint(mintingToAccount, mintingAmount);

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
      <p>
        <b>Minting to account:</b> {mintingToAccount}
      </p>
      <div>
        <button className="button" onClick={mintTokens}>
          Mint
        </button>
      </div>
      <div>
        <input type="number" id="mint" name="mint" onChange={handleMintTokens} value={mintERC20Tokens} min="0" max="5" placeholder="Amount of ERC20 tokens to mint" />
      </div>
      <div>
        <input type="text" id="mintingTo" name="mintingTo" onChange={handleMintingToAccount} value={mintingToAccount} placeholder="Minting to address" />
      </div>
    </div>
  );
}

export default Mint;
