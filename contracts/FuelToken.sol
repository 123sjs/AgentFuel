// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FuelToken is ERC20, Ownable {
    constructor(address initialOwner, uint256 initialSupply)
        ERC20("AgentFuel", "FUEL")
        Ownable(initialOwner)
    {
        _mint(initialOwner, initialSupply);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
