import ethers from "ethers";
require("dotenv").config();

const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
const walletAddress = process.env.REACT_APP_WALLET_ADDRESS;
const privateKey = process.env.REACT_APP_PRIVATE_KEY;

const ballotSmartContractAddress = "0x41874b62017e8bf2c533B73c11750FDBB78ac956";
import ballotSmartContractAbi from "../weekend-project-2/ballotAbi.js";
import ballotSmartContractByteCode from "../weekend-project-2/ballotByteCode.js";
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
  convertStringArrayToBytes32();
  const price = ethers.utils.formatUnits(await provider.getGasPrice(), "gwei");
  const options = { gasLimit: 100000, gasPrice: ethers.utils.parseUnits(price, "gwei"), constructorArguments };

  const factory = new ethers.ContractFactory(ballotSmartContractAbi, ballotSmartContractByteCode, wallet);
  const contract = await factory.deploy(constructorArguments);
  await contract.deployed();
  console.log(`Deployment successful! Contract Address: ${contract.address}`);
};
// deploySmartContract();

const giveRightToVote = async () => {
  const transaction = await smartContract.giveRightToVote("vote that you want to give access");
  await transaction.wait();
  console.log(transaction);
  console.log(`Transaction Hash: ${transaction.hash}`);
};
// giveRightToVote();

const vote = async () => {
  const transaction = await smartContract.vote("array number of proposal you want to vote");
  await transaction.wait();
  console.log(transaction);
  console.log(`Transaction Hash: ${transaction.hash}`);
};
// vote();
