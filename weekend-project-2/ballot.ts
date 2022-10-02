const ethers = require("ethers");
require("dotenv").config();

const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
const walletAddress = process.env.REACT_APP_WALLET_ADDRESS;
const ercanWalletAddress = "0xD67887EBCEE76d5Bb1B05E7ad9251BfCEcf4eCdC";
const privateKey = process.env.REACT_APP_PRIVATE_KEY;

const ballotSmartContractAddress = "0x41874b62017e8bf2c533B73c11750FDBB78ac956";
const ballotSmartContractAbi = require("../weekend-project-2/ballotAbi");
const ballotSmartContractByteCode = require("../weekend-project-2/ballotByteCode");
const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);

const wallet = new ethers.Wallet(privateKey, provider);
const signer = wallet.connect(provider);
const smartContract = new ethers.Contract(ballotSmartContractAddress, ballotSmartContractAbi, signer);

const proposals = ["Cofee", "Tea"];
let constructorArguments: any[] = [];

function convertStringArrayToBytes32() {
  proposals.forEach((proposal) => {
    constructorArguments.push(ethers.utils.formatBytes32String(proposal));
  });
  return constructorArguments;
}

const deploySmartContract = async () => {
  const price = ethers.utils.formatUnits(await provider.getGasPrice(), "gwei");
  const options = { gasLimit: 100000, gasPrice: ethers.utils.parseUnits(price, "gwei"), constructorArguments };

  const factory = new ethers.ContractFactory(ballotSmartContractAbi, ballotSmartContractByteCode, wallet);
  const contract = await factory.deploy(constructorArguments);
  await contract.deployed();
  console.log(`Deployment successful! Contract Address: ${contract.address}`);
};
// deploySmartContract();

const readSmartContract = async () => {
  const chairman = await smartContract.chairperson();
  console.log(`Chairman: ${chairman}`);

  const winningProposal = await smartContract.winningProposal();
  console.log(`WinningProposal: ${winningProposal}`);

  const winnerName = await smartContract.winnerName();
  console.log(`WinnerName: ${winnerName}`);

  proposals.forEach(async (proposal, index) => {
    const proposalInBytes = await smartContract.proposals(index);
    console.log(`${proposal} proposal in bytes ${proposalInBytes}`);
  });
};
readSmartContract();

const giveRightToVote = async () => {
  const chairman = await smartContract.chairperson();
  const transaction = await smartContract.connect(chairman.address).giveRightToVote(walletAddress);
  await transaction.wait();
  console.log(`Transaction Hash: ${transaction.hash}`);
  console.log(transaction);
}
giveRightToVote();

const readVoters = async () => {
  const voters = await smartContract.voters(walletAddress);
  console.log(`Voter Wallet Address: ${walletAddress}`);

  const votersWeight = await voters.weight;
  console.log(`Voter Weight: ${votersWeight}`);

  const votersVoted = await voters.voted;
  console.log(`Voter Voted: ${votersVoted}`);

  const votersVote = await voters.vote;
  console.log(`Voter Vote: ${votersVote}`);

  const votersDelegate = await voters.delegate;
  console.log(`Voters Delegate: ${votersDelegate}`);
};
readVoters();

const delegate = async () => {
  const transaction = await smartContract.connect(walletAddress).delegate(ercanWalletAddress);
  await transaction.wait();
  console.log(transaction);
  console.log(`Transaction Hash: ${transaction.hash}`);
};
delegate();

const vote = async () => {
  const transaction = await smartContract.vote(0);
  await transaction.wait();
  console.log(`Transaction Hash: ${transaction.hash}`);
  console.log(transaction);
};
// vote();

