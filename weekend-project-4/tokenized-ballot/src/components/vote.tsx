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
