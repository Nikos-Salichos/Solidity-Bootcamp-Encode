import { ethers } from "hardhat";

async function main() {
  const BET_PRICE = 1;
  const BET_FEE = 0.2;
  const TOKEN_RATIO = 1;
  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy("Group8", "GNE", TOKEN_RATIO, ethers.utils.parseEther(BET_PRICE.toFixed(18)), ethers.utils.parseEther(BET_FEE.toFixed(18)));

  console.log(ethers.utils.parseEther(BET_PRICE.toFixed(18)));
  console.log(ethers.utils.parseEther(BET_FEE.toFixed(18)));

  //   await lottery.deployed();

  //   console.log(`Lottery Address ${lottery.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
