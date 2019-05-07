pragma solidity ^0.5.0;

import "./ERC20Interface.sol";

contract BVAFounders {
    ERC20Interface erc20Contract;
    address payable owner;

    uint constant unlockTime = 1557238800; // Unlock time

    modifier isOwner() {
        require(msg.sender == owner, "must be contract owner");
        _;
    }


    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor(ERC20Interface ctr) public {
        erc20Contract = ctr;
        owner         = msg.sender;
    }


    // ------------------------------------------------------------------------
    // Unlock Tokens
    // ------------------------------------------------------------------------
    function unlockTokens(address to) external isOwner {
        require(now > unlockTime, 'Unlock time unmet');

        uint balance = erc20Contract.balanceOf(address(this));
        erc20Contract.transfer(to, balance);
    }


    // ------------------------------------------------------------------------
    // Withdraw ETH from this contract to `owner`
    // ------------------------------------------------------------------------
    function withdrawEther(uint _amount) external isOwner {
        owner.transfer(_amount);
    }


    // ------------------------------------------------------------------------
    // accept ETH
    // ------------------------------------------------------------------------
    function () external payable {
    }
}
