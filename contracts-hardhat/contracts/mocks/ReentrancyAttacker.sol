// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IHealthInsurance {
    function purchasePolicy(uint256 planId, string calldata encryptedHealthId) external payable returns (uint256);
    function submitClaim(uint256 tokenId, uint256 amount, string calldata billCID, string calldata recordCID) external returns (uint256);
    function approveClaim(uint256 claimId) external;
}

/// CHI DUNG CHO TEST: ke tan cong goi lai approveClaim khi nhan ETH
contract ReentrancyAttacker is IERC721Receiver {
    IHealthInsurance public immutable target;
    uint256 public targetClaimId;
    uint256 public reentrySucceeded;
    bool public reentryBlocked;

    constructor(address _target) {
        target = IHealthInsurance(_target);
    }

    function buy(uint256 planId) external payable returns (uint256) {
        return target.purchasePolicy{value: msg.value}(planId, "attacker-health-id");
    }

    function submit(uint256 tokenId, uint256 amount) external returns (uint256 id) {
        id = target.submitClaim(tokenId, amount, "mock-cid-bill-01", "mock-cid-record-01");
    }

    function attack(uint256 claimId) external {
        targetClaimId = claimId;
        target.approveClaim(claimId);
    }

    receive() external payable {
        try target.approveClaim(targetClaimId) {
            reentrySucceeded++;
        } catch {
            reentryBlocked = true;
        }
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
