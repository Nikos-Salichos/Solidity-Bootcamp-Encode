namespace GiveRightToVote {
  const ethers = require("ethers");
  require("dotenv").config();

  const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
  const walletAddress = process.env.REACT_APP_WALLET_ADDRESS;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;

  const ballotSmartContractAddress = "0x41874b62017e8bf2c533B73c11750FDBB78ac956";
  const ballotSmartContractAbi = require("../abi/ballotAbi");
  const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);

  const wallet = new ethers.Wallet(privateKey, provider);
  const signer = wallet.connect(provider);
  const smartContract = new ethers.Contract(ballotSmartContractAddress, ballotSmartContractAbi, signer);

  const giveRightToVote = async () => {
    const transaction = await smartContract.giveRightToVote("0x56814Ca0854e878C2FD9FfA0899c12f4c4e35346");
    await transaction.wait();
    console.log(`Transaction Hash: ${transaction.hash}`);
  };
  giveRightToVote();
}
