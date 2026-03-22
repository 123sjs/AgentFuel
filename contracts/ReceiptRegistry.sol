// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ReceiptRegistry is Ownable {
    struct Receipt {
        uint256 id;
        uint256 serviceId;
        address payer;
        address provider;
        address paymentToken;
        uint256 amount;
        bytes32 requestHash;
        bytes32 responseHash;
        uint256 latencyMs;
        bool success;
        uint256 timestamp;
    }

    uint256 public totalReceipts;
    mapping(uint256 => Receipt) public receipts;
    mapping(address => bool) public recorders;

    event RecorderUpdated(address indexed recorder, bool allowed);
    event ReceiptRecorded(uint256 indexed id, uint256 indexed serviceId, address indexed payer);

    constructor(address initialOwner) Ownable(initialOwner) {}

    modifier onlyRecorder() {
        require(recorders[msg.sender], "not recorder");
        _;
    }

    function setRecorder(address recorder, bool allowed) external onlyOwner {
        recorders[recorder] = allowed;
        emit RecorderUpdated(recorder, allowed);
    }

    function recordReceipt(
        uint256 serviceId,
        address payer,
        address provider,
        address paymentToken,
        uint256 amount,
        bytes32 requestHash,
        bytes32 responseHash,
        uint256 latencyMs,
        bool success
    ) external onlyRecorder returns (uint256) {
        totalReceipts += 1;

        receipts[totalReceipts] = Receipt({
            id: totalReceipts,
            serviceId: serviceId,
            payer: payer,
            provider: provider,
            paymentToken: paymentToken,
            amount: amount,
            requestHash: requestHash,
            responseHash: responseHash,
            latencyMs: latencyMs,
            success: success,
            timestamp: block.timestamp
        });

        emit ReceiptRecorded(totalReceipts, serviceId, payer);
        return totalReceipts;
    }
}
