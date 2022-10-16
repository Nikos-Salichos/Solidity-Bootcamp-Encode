import React, { useState } from "react";
import { tokenizedBallotAddress } from "../assets/tokenizedBallotAddress";
import { tokenizedBallot } from "../assets/tokenizedBallot";
import { ethers } from "ethers";

function Vote({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [transactionHash, setTransactionHash] = useState("");
  const [proposal, setProposal] = useState("");
  const [voteAmount, setvoteAmount] = useState("");

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
    if (accounts[0] !== "undefined") {
      console.log("Voting started");
      const providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
      const walletAddress = process.env.REACT_APP_WALLET_ADDRESS;
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;

     
 
  }

  return (
    <div>
      <p>Choose a proposal</p>
      <p>{proposalsMap}</p>
      <input type="number" id="proposal" name="proposal" onChange={handleProposalChange} value={proposal} min="0" max="1" />
      <br></br>
      <p>Choose voting amount</p>
      <input type="number" id="voteAmount" name="voteAmount" onChange={handleVoteAmount} value={voteAmount} min="0" />

      <div>
        <br></br>
        <button className="voteButton" onClick={vote}>
          Vote
        </button>
      </div>

      <div>
        <p>Vote Transaction Hash: {transactionHash}</p>
      </div>
    </div>
  );
}

export default Vote;
