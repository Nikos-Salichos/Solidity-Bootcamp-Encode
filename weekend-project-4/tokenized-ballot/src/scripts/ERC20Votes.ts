import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const TOKENS_MINTED = ethers.utils.parseEther("1");

async function main() {
  const [deployer, acc1, acc2] = await ethers.getSigners();
  console.log("Enter main");
  const myTokenContractFactory = await ethers.getContractFactory("MyToken");
  console.log("myTokenContractFactory pass");

  const myTokenContract = await myTokenContractFactory.deploy();
  await myTokenContract.deployed();
  console.log(`myTokenContract.address ${myTokenContract}`);

  const totalSupply = await myTokenContract.totalSupply();
  console.log(`initial Supply after deployment ${totalSupply}`);

  const mintTx = await myTokenContract.mint(acc1.address, TOKENS_MINTED);
  await mintTx.wait();
  console.log(`mintTx ${mintTx.address}`);

  const totalSupplyAfter = await myTokenContract.totalSupply();
  console.log(`totalSupplyAfter minting ${ethers.utils.formatEther(totalSupplyAfter)}`);

  const account1BalanceAfterMint = await myTokenContract.balanceOf(acc1.address);
  console.log(`the vote balance of acc1 after minting is ${ethers.utils.formatEther(account1BalanceAfterMint)}`);

  const account1InitialVotingPowerAfterMint = await myTokenContract.getVotes(acc1.address);
  console.log(`the vote balance of acc1 after minting is ${ethers.utils.formatEther(account1InitialVotingPowerAfterMint)}`);

  console.log(`Delegating myself`);
  const delegateTx = await myTokenContract.connect(acc1).delegate(acc1.address);
  await delegateTx.wait();

  const account1InitialVotingPowerAfterDelegate = await myTokenContract.getVotes(acc1.address);
  console.log(`the vote balance of acc1 after selfdelegating is ${ethers.utils.formatEther(account1InitialVotingPowerAfterDelegate)}`);

  let currentBlock = await ethers.provider.getBlock("latest");
  console.log(`Current block ${currentBlock}`);

  //force to mine blocks
  const mintTx2 = await myTokenContract.mint(acc2.address, ethers.utils.parseEther("1"));
  await mintTx2.wait();

  currentBlock = await ethers.provider.getBlock("latest");
  console.log(`Current block ${currentBlock}`);

  const mintTx3 = await myTokenContract.mint(acc2.address, ethers.utils.parseEther("1"));
  await mintTx3.wait();

  currentBlock = await ethers.provider.getBlock("latest");
  console.log(`Current block ${currentBlock}`);

  const mintTx4 = await myTokenContract.mint(acc2.address, ethers.utils.parseEther("1"));
  await mintTx4.wait();

  currentBlock = await ethers.provider.getBlock("latest");
  console.log(`Current block ${currentBlock}`);

  const pastVotes = await Promise.all([myTokenContract.getPastVotes(acc1.address, 4), myTokenContract.getPastVotes(acc1.address, 3), myTokenContract.getPastVotes(acc1.address, 2), myTokenContract.getPastVotes(acc1.address, 1), myTokenContract.getPastVotes(acc1.address, 0)]);

  console.log(`pastVotes ${pastVotes}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
