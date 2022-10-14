import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import { myTokenERC20 } from "../tokenAddresses/myTokenAddress";

namespace MintTokens {
  require("dotenv").config();

  const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;

  const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
  const wallet = new ethers.Wallet(privateKey!, provider);
  const signer = wallet.connect(provider);

  const tokenContract = MyToken__factory.connect(myTokenERC20, signer);

  const mintingTo = process.env.REACT_APP_WALLET_ADDRESS!;
  console.log(`mintingTo address ${mintingTo}`);

  const mintTokens = async () => {
    const mintingAmount = ethers.utils.parseEther("1");

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
