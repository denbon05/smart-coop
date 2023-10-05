// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/governance/Governor.sol";
// import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
// import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
// import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
// import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
// Uncomment this line to use console.log
import "hardhat/console.sol";

contract CoopGovernor {
    struct Account {
        bool exists;
        uint id;
        string name;
        string location;
        // TODO rest of the neede data
    }

    mapping (address => Account) accounts;

    // only member himself can add an account
    function addAccount(Account memory _account) external {
        accounts[msg.sender] = _account;
    }

    // fetch account
    function getAccount(address _accountAddress) external view returns(Account memory) {
        return accounts[_accountAddress];
    }
}
