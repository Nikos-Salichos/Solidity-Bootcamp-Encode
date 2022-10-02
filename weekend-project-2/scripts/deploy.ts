import { ethers } from "hardhat";

const proposals = ["Cofee", "Tea"];
let bytes32Array: any[] = [];

function convertStringArrayToBytes32() {
  proposals.forEach((proposal) => {
    bytes32Array.push(ethers.utils.formatBytes32String(proposal));
  });
  return bytes32Array;
}

async function main() {
  const provider = ethers.getDefaultProvider("goerli");
  let Ballot = await ethers.getContractFactory("Ballot");
  let proposalsInBytes32 = convertStringArrayToBytes32();
  let ballotContract = await Ballot.deploy(proposalsInBytes32);
  await ballotContract.deployed();

  console.log("Ballot deployed successfully Address: ", ballotContract.address);
  //deployed address 0x7e49beb24d4f429da864ea0495d92ca03a4de167924f2d0f2ab80da5719b7f66
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
