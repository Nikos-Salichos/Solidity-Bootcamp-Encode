// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface ITokenizedContract {
    function getPastVotes(address, uint256) external view returns (uint256);
}

/// @title Voting with delegation.
contract TokenizedBallot {
    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name; // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    address public chairperson;

    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    uint256 public referenceBlock;
    ITokenizedContract public tokenizedContract;
    mapping(address => uint256) public votePowerSpent;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(
        bytes32[] memory proposalNames,
        address _tokenContract,
        uint256 _referenceBlock
    ) {
        chairperson = msg.sender;

        // For each of the provided proposal names,
        // create a new proposal object and add it
        // to the end of the array.
        for (uint i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` creates a temporary
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`.
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }

        referenceBlock = _referenceBlock;
        tokenizedContract = ITokenizedContract(_tokenContract);
    }

    function votePower(address account) public view returns (uint256 votePower_) {
        votePower_ = tokenizedContract.getPastVotes(account, referenceBlock) - votePowerSpent[account];
    }

    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint proposal, uint256 amount) public {
        uint256 sendVotePower = votePower(msg.sender);
        require(sendVotePower >= amount, "Has no right to vote");
        votePowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}