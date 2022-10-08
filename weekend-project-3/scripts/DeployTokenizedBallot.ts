import { ethers } from "hardhat";

namespace DeployTokenizedBallot {
  const proposals = ["Cofee", "Tea"];
  let bytes32Array: any[] = [];
  const erc20Token = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const referenceBlock = 7728787;

  function convertStringArrayToBytes32() {
    proposals.forEach((proposal) => {
      bytes32Array.push(ethers.utils.formatBytes32String(proposal));
    });
    return bytes32Array;
  }

  async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    let Ballot = await ethers.getContractFactory("TokenizedBallot");
    let proposalsInBytes32 = convertStringArrayToBytes32();
    let tokenizedBallotContract = await Ballot.deploy(proposalsInBytes32, erc20Token, referenceBlock);
    await tokenizedBallotContract.deployed();

    console.log("TokenizedBallot deployed successfully Address: ", tokenizedBallotContract.address);
  }
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
