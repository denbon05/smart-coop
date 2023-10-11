// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorStorage.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "./CoopToken.sol";

import "hardhat/console.sol";

contract CoopGovernor is
    Governor,
    GovernorCountingSimple,
    GovernorStorage,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    // // ? for study purposes. The data details cheaper store on backend.
    // struct Member {
    //     string name;
    //     string location;
    //     string email;
    //     bool isMember;
    // }

    // // keep track of members
    // mapping (address => bool) memebers;

    constructor(IVotes _token)
        Governor("CoopGovernor")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
    {}

    function votingDelay() public pure override returns (uint256) {
        return 7200; // 1 day
    }

    function votingPeriod() public pure override returns (uint256) {
        return 201600; // 4 weeks
    }

    function proposalThreshold() public pure override returns (uint256) {
        return 2;
    }

    // ? for now anyone can join to any coop
    // TODO prevent from free connection (add ESCROW? members will accept newbies?)
    function join() public {
        address tokenAddress = address(GovernorVotes.token());
        CoopToken(tokenAddress).safeMint(msg.sender);
    }

    // ? the main idea is to hire external services
    function hireService(address payable _target, uint _price) external payable {
        bool success = _target.send(_price);
        require(success, "Failed to send ether");
    }

    // The following functions are overrides required by Solidity.

    function quorum(uint256 blockNumber)
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function _propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        address proposer
    )
        internal
        override(Governor, GovernorStorage)
        returns (uint256)
    {
        return super._propose(targets, values, calldatas, description, proposer);
    }

    // override clock behavior
    // Error: Transaction reverted: function returned an unexpected amount of data at
    //  @openzeppelin/contracts/governance/extensions/GovernorVotes.sol:35
    function clock() public view override(Governor, GovernorVotes) returns (uint48) {
        return Time.blockNumber();
    }
}
