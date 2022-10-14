import { TokenizedBallot__factory } from "../typechain-types";
import { ethers } from "hardhat";
import { tokenizedBallot } from "../tokenAddresses/tokenizedBallotAddress";
require("dotenv").config();

namespace ReadVariablesAndFunctions {
  const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
  const walletAddress = process.env.REACT_APP_WALLET_ADDRESS;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;

  const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
  const wallet = new ethers.Wallet(privateKey!, provider);
  const signer = wallet.connect(provider);

  const smartContract = TokenizedBallot__factory.connect(tokenizedBallot, signer);
  console.log(`TokenizedBallot smartContract address ${smartContract.address}`);

  const proposals = ["Coffee", "Tea"];

  const readSmartContract = async () => {
    const referenceBlock = await smartContract.referenceBlock();
    console.log(`referenceBlock: ${referenceBlock}`);

    const tokenContract = await smartContract.tokenContract();
    console.log(`tokenContract: ${tokenContract}`);

    const votePower = await smartContract.votePower(walletAddress!);
    console.log(`votePower: ${votePower}`);

    const winningProposal = await smartContract.winningProposal();
    console.log(`winningProposal: ${winningProposal}`);

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
