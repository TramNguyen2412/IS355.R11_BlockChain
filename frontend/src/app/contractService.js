
import { BrowserProvider, Contract, ZeroHash } from 'ethers';
import abi from '../contracts/abi.json';
import addressConfig from '../contracts/address.json';
import { toVietnameseError } from './errors.js';

const CONTRACT_ADDRESS = addressConfig.HealthInsuranceNFT;
const DEPLOY_BLOCK = Number(addressConfig.deployBlock ?? 0);
const EXPECTED_CHAIN_ID = Number(
  import.meta.env.VITE_CHAIN_ID ?? addressConfig.chainId,
);

const EVENT_NAMES = [
  'PlanCreated',
  'PlanStatusChanged',
  'HospitalAuthorized',
  'PoolFunded',
  'EncryptionKeyRegistered',
  'PolicyPurchased',
  'ClaimSubmitted',
  'ClaimConfirmed',
  'ClaimApproved',
  'ClaimRejected',
];

const STATUS_LABELS = ['PENDING', 'APPROVED', 'REJECTED'];

function asPlan(plan) {
  return {
    id: Number(plan.id ?? plan[0]),
    name: plan.name ?? plan[1],
    price: BigInt(plan.price ?? plan[2]),
    coverageLimit: BigInt(plan.coverageLimit ?? plan[3]),
    durationDays: Number(plan.durationDays ?? plan[4]),
    policyDocCID: plan.policyDocCID ?? plan[5],
    active: plan.active ?? plan[6],
  };
}

function asPolicy(policy) {
  const coverageLimit = BigInt(policy.coverageLimit ?? policy[4]);
  const usedAmount = BigInt(policy.usedAmount ?? policy[5]);

  return {
    tokenId: Number(policy.tokenId ?? policy[0]),
    planId: Number(policy.planId ?? policy[1]),
    holder: policy.holder ?? policy[2],
    encryptedHealthId: policy.encryptedHealthId ?? policy[3],
    coverageLimit,
    usedAmount,
    startDate: Number(policy.startDate ?? policy[6]),
    expiryDate: Number(policy.expiryDate ?? policy[7]),
    policyDocCID: policy.policyDocCID ?? policy[8],
    remainingLimit: coverageLimit - usedAmount,
  };
}

function asClaim(claim) {
  const status = Number(claim.status ?? claim[9]);

  return {
    claimId: Number(claim.claimId ?? claim[0]),
    tokenId: Number(claim.tokenId ?? claim[1]),
    patient: claim.patient ?? claim[2],
    hospital: claim.hospital ?? claim[3],
    amount: BigInt(claim.amount ?? claim[4]),
    confirmedAmount: BigInt(claim.confirmedAmount ?? claim[5]),
    hospitalConfirmed: claim.hospitalConfirmed ?? claim[6],
    billCID: claim.billCID ?? claim[7],
    recordCID: claim.recordCID ?? claim[8],
    status,
    statusLabel: STATUS_LABELS[status] ?? 'PENDING',
    createdAt: Number(claim.createdAt ?? claim[10]),
    resolvedAt: Number(claim.resolvedAt ?? claim[11]),
  };
}

function toPlainEventArgs(fragment, values) {
  return Object.fromEntries(
    fragment.inputs.map((input, index) => [
      input.name || String(index),
      values[index],
    ]),
  );
}

// Kết nối MetaMask và kiểm tra mạng blockchain.
async function getContract({ write = false } = {}) {
  if (!window.ethereum) {
    throw new Error(
      'Không tìm thấy MetaMask. Vui lòng cài đặt hoặc bật tiện ích.',
    );
  }

  if (
    typeof CONTRACT_ADDRESS !== 'string' ||
    !/^0x[a-fA-F0-9]{40}$/.test(CONTRACT_ADDRESS)
  ) {
    throw new Error('Địa chỉ contract chưa được cấu hình hợp lệ.');
  }

  const provider = new BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  if (Number(network.chainId) !== EXPECTED_CHAIN_ID) {
    throw new Error(
        `Sai mạng blockchain. Vui lòng chuyển sang mạng có Chain ID ${EXPECTED_CHAIN_ID}.`,
    );
  }

  const runner = write
    ? await provider.getSigner()
    : provider;

  return new Contract(CONTRACT_ADDRESS, abi, runner);
}

// Chuyển lỗi blockchain thành thông báo tiếng Việt.
function throwVietnameseError(error) {
  throw new Error(toVietnameseError(error));
}

// Thực hiện thao tác đọc dữ liệu từ contract.
async function readContract(callback) {
  try {
    const contract = await getContract();
    return await callback(contract);
  } catch (error) {
    throwVietnameseError(error);
  }
}

// Thực hiện giao dịch ghi và hỗ trợ kiểm tra dryRun.
async function writeContract(method, args, options = {}, overrides = {}) {
  try {
    const contract = await getContract({ write: true });
    const transactionOverrides = { ...overrides };

    if (options.dryRun) {
      await contract[method].staticCall(
        ...args,
        transactionOverrides,
      );

      return {
        hash: null,
        receipt: null,
      };
    }

    const transaction = await contract[method](
      ...args,
      transactionOverrides,
    );

    const receipt = await transaction.wait();

    return {
      hash: transaction.hash,
      receipt,
    };
  } catch (error) {
    throwVietnameseError(error);
  }
}

// ==================== HÀM ĐỌC ====================

// Lấy quyền ADMIN và HOSPITAL của địa chỉ ví.
export async function getRoles(address) {
  return readContract(async (contract) => {
    const [isInsurer, hospitalRole] = await Promise.all([
      contract.hasRole(ZeroHash, address),
      contract.HOSPITAL_ROLE(),
    ]);

    const isHospital = await contract.hasRole(
      hospitalRole,
      address,
    );

    return {
      isInsurer,
      isHospital,
    };
  });
}

// Kiểm tra trạng thái bảo hiểm của bệnh nhân.
export async function verifyInsurance(address) {
  return readContract(async (contract) => {
    const result = await contract.verifyInsurance(address);

    return {
      isValid: result.isValid ?? result[0],
      tokenId: Number(result.tokenId ?? result[1]),
      remainingLimit: BigInt(result.remainingLimit ?? result[2]),
      expiryDate: Number(result.expiryDate ?? result[3]),
    };
  });
}

// Lấy danh sách tất cả gói bảo hiểm.
export async function getPlans() {
  return readContract(async (contract) => {
    const plans = await contract.getPlans();
    return plans.map(asPlan);
  });
}

// Lấy thông tin thẻ bảo hiểm theo tokenId.
export async function getPolicy(tokenId) {
  return readContract(async (contract) => {
    const policy = await contract.getPolicy(tokenId);
    return asPolicy(policy);
  });
}

// Lấy thẻ bảo hiểm đang hoạt động của bệnh nhân.
export async function getPolicyOf(address) {
  return readContract(async (contract) => {
    const tokenId = await contract.activePolicyOf(address);

    if (tokenId === 0n) {
      return null;
    }

    const policy = await contract.getPolicy(tokenId);
    return asPolicy(policy);
  });
}

// Lấy thông tin yêu cầu bồi thường theo claimId.
export async function getClaim(claimId) {
  return readContract(async (contract) => {
    const claim = await contract.getClaim(claimId);
    return asClaim(claim);
  });
}

// Lấy danh sách yêu cầu bồi thường của bệnh nhân.
export async function getClaimsByPatient(address) {
  return readContract(async (contract) => {
    const claimIds = await contract.getClaimsByPatient(address);

    const claims = await Promise.all(
      claimIds.map((claimId) => contract.getClaim(claimId)),
    );

    return claims.map(asClaim);
  });
}

// Lấy tất cả yêu cầu bồi thường.
export async function getAllClaims() {
  return readContract(async (contract) => {
    const totalClaims = Number(await contract.totalClaims());

    const claimIds = Array.from(
      { length: totalClaims },
      (_, index) => index + 1,
    );

    const claims = await Promise.all(
      claimIds.map((claimId) => contract.getClaim(claimId)),
    );

    return claims.map(asClaim);
  });
}

// Lấy số dư quỹ bảo hiểm.
export async function getPoolBalance() {
  return readContract(async (contract) => {
    return BigInt(await contract.poolBalance());
  });
}

// Lấy khóa mã hóa công khai của địa chỉ.
export async function getEncryptionKey(address) {
  return readContract(async (contract) => {
    return contract.encryptionKeyOf(address);
  });
}

// Lấy địa chỉ công ty bảo hiểm từ address.json.
export async function getInsurerAddress() {
  return addressConfig.insurer;
}

// Lấy lịch sử event từ deployBlock.
export async function getEvents(fromBlock = DEPLOY_BLOCK) {
  return readContract(async (contract) => {
    const startBlock = Math.max(
      DEPLOY_BLOCK,
      Number(fromBlock ?? DEPLOY_BLOCK),
    );

    const eventGroups = await Promise.all(
      EVENT_NAMES.map(async (eventName) => {
        const filter = contract.filters[eventName]();
        return contract.queryFilter(filter, startBlock);
      }),
    );

    const logs = eventGroups.flat().sort(
      (left, right) =>
        right.blockNumber - left.blockNumber ||
        right.index - left.index,
    );

    const blockNumbers = [
      ...new Set(logs.map((log) => log.blockNumber)),
    ];

    const blocks = await Promise.all(
      blockNumbers.map((blockNumber) =>
        contract.runner.getBlock(blockNumber),
      ),
    );

    const timestampByBlock = new Map(
      blockNumbers.map((blockNumber, index) => [
        blockNumber,
        Number(blocks[index]?.timestamp ?? 0),
      ]),
    );

    return logs.map((log) => ({
      name: log.fragment.name,
      args: toPlainEventArgs(log.fragment, log.args),
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
      timestamp: timestampByBlock.get(log.blockNumber) ?? 0,
    }));
  });
}

// Tổng hợp thống kê từ event và dữ liệu claim.
export async function getStats() {
  const [events, claims, poolBalance] = await Promise.all([
    getEvents(),
    getAllClaims(),
    getPoolBalance(),
  ]);

  // Xây dựng bảng giá gói từ các event tạo gói.
  const planPriceById = new Map();

  for (const event of events) {
    if (event.name === 'PlanCreated') {
      planPriceById.set(
        Number(event.args.planId),
        BigInt(event.args.price),
      );
    }
  }

  // Tính tổng phí bảo hiểm từ các event mua bảo hiểm.
  const totalPremium = events.reduce((total, event) => {
    if (event.name !== 'PolicyPurchased') {
      return total;
    }

    const planId = Number(event.args.planId);

    return total + (planPriceById.get(planId) ?? 0n);
  }, 0n);

  // Tính tổng tiền đã chi trả.
  const totalPaid = events.reduce((total, event) => {
    if (event.name !== 'ClaimApproved') {
      return total;
    }

    return total + BigInt(event.args.amount);
  }, 0n);

  return {
    totalPremium,
    totalPaid,
    pending: claims.filter((claim) => claim.status === 0).length,
    approved: claims.filter((claim) => claim.status === 1).length,
    rejected: claims.filter((claim) => claim.status === 2).length,
    poolBalance,
  };
}

// ==================== HÀM GHI ====================

// Tạo gói bảo hiểm mới.
export async function createPlan(input, options = {}) {
  return writeContract(
    'createPlan',
    [
      input.name,
      input.price,
      input.coverageLimit,
      input.durationDays,
      input.policyDocCID,
    ],
    options,
  );
}

// Bật hoặc tắt gói bảo hiểm.
export async function setPlanActive(planId, active, options = {}) {
  return writeContract(
    'setPlanActive',
    [planId, active],
    options,
  );
}

// Cấp hoặc thu hồi quyền bệnh viện.
export async function authorizeHospital(
  hospitalAddress,
  status,
  options = {},
) {
  return writeContract(
    'authorizeHospital',
    [hospitalAddress, status],
    options,
  );
}

// Nạp tiền vào quỹ bảo hiểm.
export async function fundPool(amountWei, options = {}) {
  return writeContract(
    'fundPool',
    [],
    options,
    { value: amountWei },
  );
}

// Đăng ký khóa RSA công khai.
export async function registerEncryptionKey(
  publicKeyPem,
  options = {},
) {
  return writeContract(
    'registerEncryptionKey',
    [publicKeyPem],
    options,
  );
}

// Mua gói bảo hiểm.
export async function purchasePolicy(
  planId,
  encryptedHealthId,
  valueWei,
  options = {},
) {
  return writeContract(
    'purchasePolicy',
    [planId, encryptedHealthId],
    options,
    { value: valueWei },
  );
}

// Gửi yêu cầu bồi thường.
export async function submitClaim(input, options = {}) {
  return writeContract(
    'submitClaim',
    [
      input.tokenId,
      input.amount,
      input.billCID,
      input.recordCID,
    ],
    options,
  );
}

// Bệnh viện xác nhận chi phí điều trị.
export async function confirmClaim(
  claimId,
  confirmedAmount,
  options = {},
) {
  return writeContract(
    'confirmClaim',
    [claimId, confirmedAmount],
    options,
  );
}

// Duyệt yêu cầu bồi thường.
export async function approveClaim(claimId, options = {}) {
  return writeContract(
    'approveClaim',
    [claimId],
    options,
  );
}

// Từ chối yêu cầu bồi thường.
export async function rejectClaim(
  claimId,
  reason,
  options = {},
) {
  return writeContract(
    'rejectClaim',
    [claimId, reason],
    options,
  );
}
