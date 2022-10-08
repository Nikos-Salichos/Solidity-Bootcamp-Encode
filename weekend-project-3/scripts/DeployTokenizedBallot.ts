import { ethers } from "hardhat";

namespace DeployTokenizedBallot {
  const proposals = ["Cofee", "Tea"];
  let bytes32Array: any[] = [];
  const erc20Token = "0xb3CbfB95A57318A8764F0533F5e43600daf18B07";
  const referenceBlock = 7734792;

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
