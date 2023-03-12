// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Ownable.sol";

contract Ballot is Ownable {
	address serverAddr;
	string[] encryptedVotes;
	mapping(string => bool) voters;

	modifier onlyServer(){
		require(isServer(),"Access Denied");
		_;
	}

    constructor(address _owner) Ownable(_owner) {
		serverAddr = msg.sender;//only deployed by server
	}

	function checkVoteStatus (string memory _UUID) external view returns (bool){
		return voters[_UUID];
	}

	function isServer() internal view returns(bool){
		return msg.sender == serverAddr;
	}

	function getAllEncryptedVotes(address _ownerAddr) onlyServer external view returns (string[] memory){
		require(Ownable.getOwner() == _ownerAddr,"ACCESS DENIED");
		return encryptedVotes;
	}

	function addVote(string memory _UUID,string memory _encryptedVote) onlyServer external{
		if(voters[_UUID] == false){
			encryptedVotes.push(_encryptedVote);
			voters[_UUID] = true;
		}
	}

}
