namespace ReadVariablesAndFunctions {
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

  const proposals = ["Cofee", "Tea"];

  const readSmartContract = async () => {
    const chairman = await smartContract.chairperson();
    console.log(`Chairman: ${chairman}`);

    const winningProposal = await smartContract.winningProposal();
    console.log(`Number of winning proposal: ${winningProposal}`);

    const winnerName = await smartContract.winnerName();
    let winnerNameInString = ethers.utils.parseBytes32String(winnerName);
    console.log(`WinnerName: ${winnerNameInString}`);

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

    proposals.forEach(async (_proposal, index) => {
      const proposalInBytes = await smartContract.proposals(index);
      let proposalInString = ethers.utils.parseBytes32String(proposalInBytes.name);
      console.log(`Number of proposal: ${index} , proposal in Bytes: ${proposalInBytes}, proposal in string: ${proposalInString}`);
    });
  };
  readSmartContract();
}
