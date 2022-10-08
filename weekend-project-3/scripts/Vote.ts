import { TokenizedBallot__factory } from "../typechain-types";
import { ethers } from "hardhat";

namespace Vote {
  const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
  const walletAddress = process.env.REACT_APP_WALLET_ADDRESS;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;

  const tokenSmartContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const ballotSmartContractAddress = "0xfb4EF73cc752890f5e7Def605556A8b7a5D49bC3";

  const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
  const wallet = new ethers.Wallet(privateKey!, provider);
  const signer = wallet.connect(provider);

  const smartContract = TokenizedBallot__factory.connect(ballotSmartContractAddress, signer);
  console.log(`smartContract.address ${smartContract.address}`);

  const proposals = ["Coffee", "Tea"];

  const vote = async () => {
    const vote = await smartContract.referenceBlock();
    console.log(`referenceBlock: ${referenceBlock}`);
  };

  vote().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
