// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ServiceRegistry is Ownable {
    struct Service {
        uint256 id;
        address owner;
        string name;
        string endpoint;
        string metadataURI;
        address paymentToken;
        uint256 price;
        uint256 stakeRequired;
        bool active;
    }

    uint256 public totalServices;
    mapping(uint256 => Service) public services;

    event ServiceCreated(uint256 indexed id, address indexed owner, string name);
    event ServiceUpdated(uint256 indexed id);
    event ServiceStatusChanged(uint256 indexed id, bool active);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function createService(
        string calldata name,
        string calldata endpoint,
        string calldata metadataURI,
        address paymentToken,
        uint256 price,
        uint256 stakeRequired
    ) external returns (uint256) {
        totalServices += 1;
        services[totalServices] = Service({
            id: totalServices,
            owner: msg.sender,
            name: name,
            endpoint: endpoint,
            metadataURI: metadataURI,
            paymentToken: paymentToken,
            price: price,
            stakeRequired: stakeRequired,
            active: true
        });

        emit ServiceCreated(totalServices, msg.sender, name);
        return totalServices;
    }

    function updateService(
        uint256 id,
        string calldata endpoint,
        string calldata metadataURI,
        address paymentToken,
        uint256 price,
        uint256 stakeRequired
    ) external {
        Service storage s = services[id];
        require(s.owner == msg.sender, "not owner");

        s.endpoint = endpoint;
        s.metadataURI = metadataURI;
        s.paymentToken = paymentToken;
        s.price = price;
        s.stakeRequired = stakeRequired;

        emit ServiceUpdated(id);
    }

    function setActive(uint256 id, bool active) external {
        Service storage s = services[id];
        require(s.owner == msg.sender, "not owner");
        s.active = active;
        emit ServiceStatusChanged(id, active);
    }
}
