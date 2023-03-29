// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Ownable.sol";

contract Ballot is Ownable {
	string[] encryptedVotes;
	mapping(string => bool) voters;
	bool public votingPhase = true;

    constructor() Ownable(msg.sender) {}

	function checkVoteStatus (string memory _UUID) external view returns (bool){
		return voters[_UUID];
	}

	function getAllEncryptedVotes() onlyOwner external view returns (string[] memory){
		require(votingPhase == false,"Voting Phase Still going!");
		return encryptedVotes;
	}

	function addVote(string memory _UUID,string memory _encryptedVote) external{
		require(votingPhase == true,"Voting Phase closed!");
		if(voters[_UUID] == false){
			encryptedVotes.push(_encryptedVote);
			voters[_UUID] = true;
		}
	}

	function closeVotingPhase () onlyOwner public {
		votingPhase = false;
	}
}
