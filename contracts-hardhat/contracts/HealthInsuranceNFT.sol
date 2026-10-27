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
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // ===================== NGHIEP VU 1: THIET LAP HE THONG =====================

    /// Admin tao goi bao hiem moi
    function createPlan(
        string calldata name,
        uint256 price,
        uint256 coverageLimit,
        uint256 durationDays,
        string calldata policyDocCID
    ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256 planId) {
        require(price > 0 && coverageLimit > 0 && durationDays > 0, "So tien khong hop le");
        totalPlans++;
        planId = totalPlans;
        plans[planId] = Plan(planId, name, price, coverageLimit, durationDays, policyDocCID, true);
        emit PlanCreated(planId, name, price, coverageLimit, durationDays, policyDocCID);
    }

    /// Admin bat/tat goi
    function setPlanActive(uint256 planId, bool active) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(planId != 0 && planId <= totalPlans, "Goi bao hiem khong ton tai");
        plans[planId].active = active;
        emit PlanStatusChanged(planId, active);
    }

    /// Admin cap hoac thu hoi quyen benh vien
    function authorizeHospital(address hospital, bool status) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (status) {
            _grantRole(HOSPITAL_ROLE, hospital);
        } else {
            _revokeRole(HOSPITAL_ROLE, hospital);
        }
        emit HospitalAuthorized(hospital, status);
    }

    /// Nap quy boi thuong
    function fundPool() external payable {
        require(msg.value > 0, "So tien khong hop le");
        emit PoolFunded(msg.sender, msg.value);
    }

    /// Dang ky khoa cong khai RSA (PEM)
    function registerEncryptionKey(string calldata rsaPublicKeyPem) external {
        encryptionKeyOf[msg.sender] = rsaPublicKeyPem;
        emit EncryptionKeyRegistered(msg.sender);
    }

    // ===================== NGHIEP VU 2: MUA BAO HIEM + MINT NFT =====================

    /// Benh nhan mua goi, tra dung gia, nhan the NFT (soulbound)
    function purchasePolicy(uint256 planId, string calldata encryptedHealthId)
        external
        payable
        nonReentrant
        returns (uint256 tokenId)
    {
        require(planId != 0 && planId <= totalPlans, "Goi bao hiem khong ton tai");
        Plan storage plan = plans[planId];
        require(plan.active, "Goi bao hiem khong hoat dong");
        require(msg.value == plan.price, "Sai so tien thanh toan");

        uint256 current = activePolicyOf[msg.sender];
        if (current != 0) {
            require(block.timestamp > policies[current].expiryDate, "Da co goi bao hiem con han");
        }

        totalPolicies++;
        tokenId = totalPolicies;
        uint256 expiry = block.timestamp + plan.durationDays * 1 days;
        policies[tokenId] = Policy(
            tokenId, planId, msg.sender, encryptedHealthId,
            plan.coverageLimit, 0, block.timestamp, expiry, plan.policyDocCID
        );
        activePolicyOf[msg.sender] = tokenId;

        emit PolicyPurchased(tokenId, msg.sender, planId, expiry);
        _safeMint(msg.sender, tokenId);
    }

    /// Kiem tra the (Verification). Khong bao gio revert.
    function verifyInsurance(address patient)
        external
        view
        returns (bool isValid, uint256 tokenId, uint256 remainingLimit, uint256 expiryDate)
    {
        uint256 id = activePolicyOf[patient];
        if (id == 0) {
            return (false, 0, 0, 0);
        }
        Policy storage p = policies[id];
        return (block.timestamp <= p.expiryDate, id, p.coverageLimit - p.usedAmount, p.expiryDate);
    }

    // ===================== NGHIEP VU 3: YEU CAU BOI THUONG =====================

    /// Benh nhan (chu NFT) hoac benh vien gui yeu cau boi thuong
    function submitClaim(uint256 tokenId, uint256 amount, string calldata billCID, string calldata recordCID)
        external
        returns (uint256 claimId)
    {
        bool byHospital = hasRole(HOSPITAL_ROLE, msg.sender);
        require(byHospital || _ownerOf(tokenId) == msg.sender, "Khong phai chu the hoac benh vien");
        require(amount > 0, "So tien khong hop le");

        Policy storage p = policies[tokenId];
        require(block.timestamp <= p.expiryDate, "Bao hiem da het han");
        require(amount <= p.coverageLimit - p.usedAmount, "Vuot qua han muc bao hiem");

        totalClaims++;
        claimId = totalClaims;
        Claim storage c = claims[claimId];
        c.claimId = claimId;
        c.tokenId = tokenId;
        c.patient = p.holder;
        c.amount = amount;
        c.billCID = billCID;
        c.recordCID = recordCID;
        c.status = ClaimStatus.PENDING;
        c.createdAt = block.timestamp;
        if (byHospital) {
            c.hospital = msg.sender;
            c.hospitalConfirmed = true;
            c.confirmedAmount = amount;
        }
        claimIdsOf[p.holder].push(claimId);
        emit ClaimSubmitted(claimId, tokenId, p.holder, msg.sender, amount);
    }

    /// RANG BUOC 1: chi vi co HOSPITAL_ROLE moi xac nhan duoc chi phi
    function confirmClaim(uint256 claimId, uint256 confirmedAmount) external onlyRole(HOSPITAL_ROLE) {
        require(claimId != 0 && claimId <= totalClaims, "Khong tim thay yeu cau boi thuong");
        Claim storage c = claims[claimId];
        require(c.status == ClaimStatus.PENDING, "Claim da xu ly");
        require(confirmedAmount > 0, "So tien khong hop le");
        require(confirmedAmount <= c.amount, "So tien xac nhan vuot so tien yeu cau");
        c.hospital = msg.sender;
        c.hospitalConfirmed = true;
        c.confirmedAmount = confirmedAmount;
        emit ClaimConfirmed(claimId, msg.sender, confirmedAmount);
    }

    // ===================== NGHIEP VU 4: DUYET VA CHI TRA TU DONG =====================

    /// RANG BUOC 2: tu kiem tra han muc, han dung, quy; Checks -> Effects -> Interactions
    function approveClaim(uint256 claimId) external nonReentrant {
        require(claimId != 0 && claimId <= totalClaims, "Khong tim thay yeu cau boi thuong");
        Claim storage c = claims[claimId];
        require(c.status == ClaimStatus.PENDING, "Claim da xu ly");
        require(c.hospitalConfirmed, "Benh vien chua xac nhan");

        uint256 amt = c.confirmedAmount;
        Policy storage p = policies[c.tokenId];
        require(block.timestamp <= p.expiryDate, "Bao hiem da het han");
        require(p.usedAmount + amt <= p.coverageLimit, "Vuot qua han muc bao hiem");
        require(address(this).balance >= amt, "Quy bao hiem khong du");

        c.status = ClaimStatus.APPROVED;
        c.resolvedAt = block.timestamp;
        p.usedAmount += amt;

        (bool ok, ) = payable(c.patient).call{value: amt}("");
        require(ok, "Chuyen tien that bai");
        emit ClaimApproved(claimId, c.patient, amt);
    }

    /// Admin tu choi claim
    function rejectClaim(uint256 claimId, string calldata reason) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(claimId != 0 && claimId <= totalClaims, "Khong tim thay yeu cau boi thuong");
        Claim storage c = claims[claimId];
        require(c.status == ClaimStatus.PENDING, "Claim da xu ly");
        c.status = ClaimStatus.REJECTED;
        c.resolvedAt = block.timestamp;
        emit ClaimRejected(claimId, reason);
    }

    // ===================== HAM DOC =====================

    function getPlans() external view returns (Plan[] memory) {
        Plan[] memory list = new Plan[](totalPlans);
        for (uint256 i = 1; i <= totalPlans; i++) {
            list[i - 1] = plans[i];
        }
        return list;
    }

    function getPolicy(uint256 tokenId) external view returns (Policy memory) {
        return policies[tokenId];
    }

    function getClaim(uint256 claimId) external view returns (Claim memory) {
        require(claimId != 0 && claimId <= totalClaims, "Khong tim thay yeu cau boi thuong");
        return claims[claimId];
    }

    function getClaimsByPatient(address patient) external view returns (uint256[] memory) {
        return claimIdsOf[patient];
    }

    function poolBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // ===================== NFT SOULBOUND =====================

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string.concat("ipfs://", policies[tokenId].policyDocCID);
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: khong the chuyen nhuong");
        }
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
