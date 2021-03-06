pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC20Interface.sol";

contract BVATeamMembers {
    using SafeMath for uint;

    ERC20Interface erc20Contract;
    address payable owner;


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
        // Total Allocation : 1,260,000 BVA (4.5% of total supply)
        // 1. 25% - 2020/01/01 (315,000 BVA) - timestamp 1577808000
        // 2. 25% - 2021/01/01 (315,000 BVA) - timestamp 1609430400
        // 3. 40% - 2022/01/01 (504,000 BVA) - timestamp 1640966400
        // 4. 10% - 2022/12/01 (126,000 BVA) - timestamp 1669824000

        require(now >= 1577808000, "locked");

        uint balance = erc20Contract.balanceOf(address(this));
        uint amount;
        uint remain;

        if (now < 1609430400) {
            // 1st unlock : before balance must have at least 1,260,000 BVA
            require(balance >= 1260000e18, "checkpoint 1 balance error");
            remain = 945000e18;
            amount = balance.sub(remain);
        } else if (now < 1640966400) {
            // 2nd unlock : before balance must have at least 945,000 BVA
            require(balance >= 945000e18, "checkpoint 2 balance error");
            remain = 630000e18;
            amount = balance.sub(remain);
        } else if (now < 1669824000) {
            // 3rd unlock : before balance must have at least 630,000 BVA
            require(balance >= 630000e18, "checkpoint 3 balance error");
            remain = 126000e18;
            amount = balance.sub(remain);
        } else {
            // 6th unlock : before balance must have at least 126,000 BVA
            amount = balance;
        }

        if (amount > 0) {
            erc20Contract.transfer(to, amount);
        }
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
