pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";


contract BGT is ERC20Detailed("Bavala Gold Token", "BGT", 18), ERC20Pausable, ERC20Burnable, ERC20Mintable, WhitelistedRole {

    constructor () public {
        _addWhitelisted(msg.sender);
    }

    function removeMinter(address account) public onlyWhitelisted {
        _removeMinter(account);
    }

    function removePauser(address account) public onlyWhitelisted {
        _removePauser(account);
    }
}
