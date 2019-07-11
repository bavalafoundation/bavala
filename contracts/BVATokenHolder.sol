pragma solidity ^0.5.0;

import "./ERC20Interface.sol";

contract BVATokenHolder {
    ERC20Interface erc20Contract;
    address payable owner;
    string public name;


    modifier isOwner() {
        require(msg.sender == owner, "must be contract owner");
        _;
    }


    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor(ERC20Interface ctr, string memory _name) public {
        erc20Contract = ctr;
        owner         = msg.sender;
        name          = _name;
    }


    // ------------------------------------------------------------------------
    // Unlock Tokens
    // ------------------------------------------------------------------------
    function transferTokens(address to, uint amount) external isOwner {
        erc20Contract.transfer(to, amount);
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
