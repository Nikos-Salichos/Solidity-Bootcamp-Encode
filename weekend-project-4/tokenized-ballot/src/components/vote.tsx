import React, { useState } from "react";
import { tokenizedBallotAddress } from "../assets/tokenizedBallotAddress";
import { tokenizedBallot } from "../assets/tokenizedBallot";
import { ethers } from "ethers";

function Vote({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [transactionHash, setTransactionHash] = useState("");
  const [proposal, setProposal] = useState("");
  const [voteAmount, setvoteAmount] = useState("");
  const [votersState, setVotersState] = useState<string[]>([]);

  const proposals = ["Coffee", "Tea"];
  const proposalsMap = proposals.map((key, index) => index + "=" + key + " ");

  const handleProposalChange = (event: { target: { value: any } }) => {
    setProposal(event.target.value);
    console.log("proposal is:", event.target.value);
  };
  const handleVoteAmount = (event: { target: { value: any } }) => {
    setvoteAmount(event.target.value);
    const voteAmountToEth = ethers.utils.parseEther(event.target.value);
    console.log("voteAmountToEth is:", voteAmountToEth);
  };

  async function vote() {
    try {
      if (accounts[0] !== "undefined") {
        console.log("Voting started");

        const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
        const walletAddress: string = process.env.REACT_APP_WALLET_ADDRESS!;
        const privateKey = process.env.REACT_APP_PRIVATE_KEY;

        const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${providerRpcKey}`);
        const wallet = new ethers.Wallet(privateKey!, provider);
        const signer = wallet.connect(provider);

        const tokenContract = new ethers.Contract(tokenizedBallotAddress, tokenizedBallot.abi, signer);

        const votingPower = await tokenContract.votePower(walletAddress);

        if (votingPower > 0) {
          setVotersState((initialArray) => [...initialArray, walletAddress]);

          const voteAmountToEth = ethers.utils.parseEther(voteAmount);

          const voteTx = await tokenContract.vote(proposal, voteAmountToEth);
          console.log(`voteTx ${voteTx}`);
          const receipt = await voteTx.wait();
          console.log(`voteTx: ${receipt.transactionHash}`);
          setTransactionHash(receipt.transactionHash);
        } else {
          setTransactionHash("No voting power left");
        }
      }
    } catch (error) {
      let result = (error as Error).message;
      setTransactionHash(result);
    }
  }

  return (
    <div className="inner-container-full">
      <h2>Vote</h2>
      <p>
        <b>Choose a proposal</b>
      </p>
      <p>{proposalsMap}</p>
      <input type="number" id="proposal" name="proposal" onChange={handleProposalChange} value={proposal} min="0" max="1" placeholder="Choose a proposal" />
      <p>
        <b>Vote Amount</b>
      </p>
      <input type="number" id="voteAmount" name="voteAmount" onChange={handleVoteAmount} value={voteAmount} min="0" placeholder="Choose voting amount" />
      <div>
        <br></br>
        <button className="button" onClick={vote}>
          Vote
        </button>
      </div>
      <div>
        <p>
          <b>Vote Status:</b> <i>{transactionHash}</i>
        </p>
      </div>
      <div>
        <b>Voters</b>
        <p>{votersState}</p>
      </div>
    </div>
  );
}

export default Vote;
