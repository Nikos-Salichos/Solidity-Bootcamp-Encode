import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

namespace DelegateVotingPower {
    require("dotenv").config();

    const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
  
    const tokenSmartContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
    const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
    const wallet = new ethers.Wallet(privateKey!, provider);
    const signer = wallet.connect(provider);

    const tokenContract = MyToken__factory.connect(tokenSmartContractAddress, signer);

    // Ercan's wallet address
    const delegatingFrom = "0xF0263339678ec2ad8C6722b5eCedDB904cBed19D"

    // Nikos's wallet address
    const delegatingTo = "0x56814Ca0854e878C2FD9FfA0899c12f4c4e35346"

    const delegateVotingPower = async () => {
        const delegateTx = await tokenContract.delegate(delegatingTo);
        const receipt = await delegateTx.wait();

        console.log(`Delegating voting power to: ${delegatingTo}`);
        console.log(`Transaction hash: ${receipt.transactionHash}`);
    };

    delegateVotingPower().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}

