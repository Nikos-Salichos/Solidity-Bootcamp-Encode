import { TokenizedBallot__factory } from "../typechain-types";
import { ethers } from "hardhat";

namespace ReadVariablesAndFunctions {
  require("dotenv").config();

  const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
  const walletAddress = process.env.REACT_APP_WALLET_ADDRESS;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;

  const tokenSmartContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const ballotSmartContractAddress = "0xfb4EF73cc752890f5e7Def605556A8b7a5D49bC3";

  const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
  const wallet = new ethers.Wallet(privateKey!, provider);
  const signer = wallet.connect(provider);

  const smartContract = TokenizedBallot__factory.connect(ballotSmartContractAddress, signer);
  console.log(smartContract.address);

  const proposals = ["Coffee", "Tea"];

  const readSmartContract = async () => {
    const referenceBlock = await smartContract.referenceBlock();
    console.log(`referenceBlock: ${referenceBlock}`);

    const tokenContract = await smartContract.tokenContract();
    console.log(`tokenContract: ${tokenContract}`);

    const winnerName = await smartContract.winnerName();
    let winnerNameInString = ethers.utils.parseBytes32String(winnerName);
    console.log(`WinnerName: ${winnerNameInString}`);

    const votePowerSpent = await smartContract.votePowerSpent(walletAddress!);
    console.log(`votePowerSpent ${votePowerSpent} for address ${walletAddress}`);

    proposals.forEach(async (_proposal, index) => {
      const proposalInBytes = await smartContract.proposals(index);
      let proposalInString = ethers.utils.parseBytes32String(proposalInBytes.name);
      console.log(`Number of proposal: ${index} , proposal in Bytes: ${proposalInBytes}, proposal in string: ${proposalInString}`);
    });
  };

  readSmartContract().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}