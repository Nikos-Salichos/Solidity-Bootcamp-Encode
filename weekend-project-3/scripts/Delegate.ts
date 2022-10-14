import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import { myTokenERC20 } from "../tokenAddresses/myTokenAddress";
require("dotenv").config();

namespace Delegate {
  const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;
  const walletAddress = process.env.REACT_APP_WALLET_ADDRESS!;

  const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
  const wallet = new ethers.Wallet(privateKey!, provider);
  const signer = wallet.connect(provider);

  const tokenContract = MyToken__factory.connect(myTokenERC20, signer);

  const delegatingTo = walletAddress;

  const delegateVotingPower = async () => {
    const delegateTx = await tokenContract.delegate(walletAddress);
    const receipt = await delegateTx.wait();

    console.log(`Delegating voting power to: ${delegatingTo}`);
    console.log(`Transaction hash: ${receipt.transactionHash}`);
  };

  delegateVotingPower().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
