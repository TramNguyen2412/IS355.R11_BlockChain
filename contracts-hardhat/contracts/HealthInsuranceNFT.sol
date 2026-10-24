// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// BAN TAM chang A01: chi de thu bien dich. Chang A02 se thay bang ban khung day du.
contract HealthInsuranceNFT is ERC721, AccessControl, ReentrancyGuard {
    constructor() ERC721("Health Insurance Card", "HIC") {}

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
