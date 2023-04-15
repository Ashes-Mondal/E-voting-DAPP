// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Ownable.sol";

contract Ballot is Ownable {
    string[] encryptedVotes;
    mapping(string => bool) voters;
    mapping(string => string) votes;
    bool public votingPhase = true;
    address serverAccountAddr;

    modifier onlyServer() {
        require(msg.sender == serverAccountAddr, "Access Denied");
        _;
    }

    constructor(address _own) Ownable(_own) {
        serverAccountAddr = msg.sender;
    }

    function checkVoteStatus(string memory _UUID) external view returns (bool) {
        return voters[_UUID];
    }

    function getAllEncryptedVotes()
        external
        view
        onlyOwner
        returns (string[] memory)
    {
        require(votingPhase == false, "Voting Phase Still going!");
        return encryptedVotes;
    }

    function getEncryptedVote(
        string memory _UUID
    ) external view returns (string memory) {
        require(voters[_UUID] == true, "Not voted!");
        return votes[_UUID];
    }

    function addVote(
        string memory _UUID,
        string memory _encryptedVote
    ) external onlyServer {
        require(votingPhase == true, "Voting Phase closed!");
        if (voters[_UUID] == false) {
            encryptedVotes.push(_encryptedVote);
            voters[_UUID] = true;
            votes[_UUID] = _encryptedVote;
        }
    }

    function closeVotingPhase() public onlyOwner {
        votingPhase = false;
    }

    function isVotingPhase() external view returns(bool){
        return votingPhase;
    }
}
