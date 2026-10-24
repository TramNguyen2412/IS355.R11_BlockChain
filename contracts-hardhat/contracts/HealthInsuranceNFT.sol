// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title HealthInsuranceNFT - bao hiem y te phi tap trung, the bao hiem la NFT soulbound
contract HealthInsuranceNFT is ERC721, AccessControl, ReentrancyGuard {
    bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");

    struct Plan {
        uint256 id;
        string name;
        uint256 price;
        uint256 coverageLimit;
        uint256 durationDays;
        string policyDocCID;
        bool active;
    }
    struct Policy {
        uint256 tokenId;
        uint256 planId;
        address holder;
        string encryptedHealthId;
        uint256 coverageLimit;
        uint256 usedAmount;
        uint256 startDate;
        uint256 expiryDate;
        string policyDocCID;
    }
    enum ClaimStatus { PENDING, APPROVED, REJECTED }
    struct Claim {
        uint256 claimId;
        uint256 tokenId;
        address patient;
        address hospital;
        uint256 amount;
        uint256 confirmedAmount;
        bool hospitalConfirmed;
        string billCID;
        string recordCID;
        ClaimStatus status;
        uint256 createdAt;
        uint256 resolvedAt;
    }

    event PlanCreated(uint256 indexed planId, string name, uint256 price, uint256 coverageLimit, uint256 durationDays, string policyDocCID);
    event PlanStatusChanged(uint256 indexed planId, bool active);
    event HospitalAuthorized(address indexed hospital, bool status);
    event PoolFunded(address indexed from, uint256 amount);
    event EncryptionKeyRegistered(address indexed user);
    event PolicyPurchased(uint256 indexed tokenId, address indexed holder, uint256 planId, uint256 expiryDate);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed tokenId, address indexed patient, address submittedBy, uint256 amount);
    event ClaimConfirmed(uint256 indexed claimId, address indexed hospital, uint256 confirmedAmount);
    event ClaimApproved(uint256 indexed claimId, address indexed patient, uint256 amount);
    event ClaimRejected(uint256 indexed claimId, string reason);

    uint256 public totalPlans;
    uint256 public totalPolicies;
    uint256 public totalClaims;

    mapping(uint256 => Plan) private plans;
    mapping(uint256 => Policy) private policies;
    mapping(uint256 => Claim) private claims;
    mapping(address => uint256[]) private claimIdsOf;
    mapping(address => uint256) public activePolicyOf;
    mapping(address => string) public encryptionKeyOf;

    constructor() ERC721("Health Insurance Card", "HIC") {
        // TODO A04: cap DEFAULT_ADMIN_ROLE cho deployer
    }

    // ===================== NGHIEP VU 1: THIET LAP HE THONG =====================
    // TODO A04: than ham se duoc viet o chang A04

    function createPlan(string calldata name, uint256 price, uint256 coverageLimit, uint256 durationDays, string calldata policyDocCID) external returns (uint256 planId) {
        revert("TODO");
    }

    function setPlanActive(uint256 planId, bool active) external {
        revert("TODO");
    }

    function authorizeHospital(address hospital, bool status) external {
        revert("TODO");
    }

    function fundPool() external payable {
        revert("TODO");
    }

    function registerEncryptionKey(string calldata rsaPublicKeyPem) external {
        revert("TODO");
    }

    // ===================== NGHIEP VU 2: MUA BAO HIEM + MINT NFT =====================
    // TODO A05

    function purchasePolicy(uint256 planId, string calldata encryptedHealthId) external payable returns (uint256 tokenId) {
        revert("TODO");
    }

    function verifyInsurance(address patient) external view returns (bool isValid, uint256 tokenId, uint256 remainingLimit, uint256 expiryDate) {
        return (false, 0, 0, 0);
    }

    // ===================== NGHIEP VU 3: YEU CAU BOI THUONG =====================
    // TODO A06

    function submitClaim(uint256 tokenId, uint256 amount, string calldata billCID, string calldata recordCID) external returns (uint256 claimId) {
        revert("TODO");
    }

    function confirmClaim(uint256 claimId, uint256 confirmedAmount) external {
        revert("TODO");
    }

    // ===================== NGHIEP VU 4: DUYET VA CHI TRA TU DONG =====================
    // TODO A07

    function approveClaim(uint256 claimId) external {
        revert("TODO");
    }

    function rejectClaim(uint256 claimId, string calldata reason) external {
        revert("TODO");
    }

    // ===================== HAM DOC =====================
    // TODO A04: tra gia tri mac dinh, se viet that o chang A04

    function getPlans() external view returns (Plan[] memory) {
        return new Plan[](0);
    }

    function getPolicy(uint256 tokenId) external view returns (Policy memory) {
        return policies[tokenId];
    }

    function getClaim(uint256 claimId) external view returns (Claim memory) {
        return claims[claimId];
    }

    function getClaimsByPatient(address patient) external view returns (uint256[] memory) {
        return claimIdsOf[patient];
    }

    function poolBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // ===================== NFT SOULBOUND =====================
    // TODO A05: them tokenURI va _update (soulbound) o chang A05

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
