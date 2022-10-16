import { ethers } from "hardhat";
import { myTokenERC20 } from "../tokenAddresses/myTokenAddress";

namespace DeployTokenizedBallot {
  const proposals = ["Coffee", "Tea"];

  let bytes32Array: any[] = [];

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
    let referenceBlock = (await ethers.provider.getBlockNumber()) + 100;

    let tokenizedBallotContract = await Ballot.deploy(proposalsInBytes32, myTokenERC20, referenceBlock);
    await tokenizedBallotContract.deployed();

    console.log(`Proposals ${proposalsInBytes32}`);
    console.log(`ERC20 token ${myTokenERC20}`);
    console.log(`ReferenceBlock ${referenceBlock}`);

    console.log("TokenizedBallot deployed successfully Address: ", tokenizedBallotContract.address);
  }
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
