import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

namespace MintTokens {
    require("dotenv").config();

    const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
  
    const tokenSmartContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
    const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
    const wallet = new ethers.Wallet(privateKey!, provider);
    const signer = wallet.connect(provider);

    const tokenContract = MyToken__factory.connect(tokenSmartContractAddress, signer);

    // Ercan's wallet address
    const mintingTo = "0xF0263339678ec2ad8C6722b5eCedDB904cBed19D"

    const mintTokens = async () => {
        const mintingAmount = "10";

        const mintTx = await tokenContract.mint(mintingTo, mintingAmount);
        const receipt = await mintTx.wait();

        const balance = await tokenContract.balanceOf(mintingTo);

        console.log(`Minting token to: ${mintingTo}`);
        console.log(`Minting amount: ${mintingAmount}`);
        console.log(`Balance of ${mintingTo}: ${balance}`);
        console.log(`Transaction hash: ${receipt.transactionHash}`);
    };

    mintTokens().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}