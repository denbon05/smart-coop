// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "./CoopToken.sol";

import "hardhat/console.sol";

contract CoopGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    address private tokenAddress;

    // Ethereum doesn't have a fixed block time,
    // but on average, it's approximately 13-15 seconds per block
    constructor(IVotes _token)
        Governor("CoopGovernor")
        GovernorSettings(1 /* 1 block */, 50 /* 10 minutes */, 1e18)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
    {
        tokenAddress = address(_token);
    }

    receive() external payable override {
        require(_executor() == address(this), "Governor: must send to executor");
        // mint vote power after bill payed
        CoopToken(tokenAddress).mint(msg.sender, 1e18);
    }

    // ? for now anyone can join to any coop
    // TODO prevent from free connection (add ESCROW? members will accept newbies?)
    function join() public {
        CoopToken(tokenAddress).mint(msg.sender, 1e18);
    }

    // ? the main idea is to hire external services
    function hireService(address payable _target, uint _price) external payable {
        bool success = _target.send(_price);
        require(success, "Failed to send ether");
    }

    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
}
