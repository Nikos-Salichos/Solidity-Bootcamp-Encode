import { ethers } from "hardhat";

namespace DeployToken {
  async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    let token = await ethers.getContractFactory("MyToken");
    let tokenContract = await token.deploy();
    await tokenContract.deployed();

    console.log("MyToken deployed successfully address: ", tokenContract.address);
  }
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
