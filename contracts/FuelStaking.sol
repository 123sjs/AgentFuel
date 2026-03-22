// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FuelStaking is Ownable {
    IERC20 public immutable fuel;
    mapping(address => uint256) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event Slashed(address indexed user, uint256 amount);

    constructor(address fuelToken, address initialOwner) Ownable(initialOwner) {
        fuel = IERC20(fuelToken);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "amount=0");
        require(fuel.transferFrom(msg.sender, address(this), amount), "transfer failed");
        stakes[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "amount=0");
        require(stakes[msg.sender] >= amount, "insufficient stake");
        stakes[msg.sender] -= amount;
        require(fuel.transfer(msg.sender, amount), "transfer failed");
        emit Unstaked(msg.sender, amount);
    }

    function slash(address user, uint256 amount) external onlyOwner {
        require(stakes[user] >= amount, "insufficient stake");
        stakes[user] -= amount;
        emit Slashed(user, amount);
    }
}
