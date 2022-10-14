import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types";
import { tokenizedBallot } from "../tokenAddresses/tokenizedBallotAddress";
import { BigNumber } from "ethers";

namespace Vote {
  const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
  const walletAddress = process.env.REACT_APP_WALLET_ADDRESS;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;

  const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
  const wallet = new ethers.Wallet(privateKey!, provider);
  const signer = wallet.connect(provider);

  const tokenizedBallotSmartContract = TokenizedBallot__factory.connect(tokenizedBallot, signer);

  const proposals = ["Coffee", "Tea"];

  const vote = async () => {
    const votingPower = await tokenizedBallotSmartContract.votePower(walletAddress!);

    const voteTx = await tokenizedBallotSmartContract.vote(0, votingPower);
    console.log(`voteTx: ${voteTx.hash}`);
  };

  vote().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
