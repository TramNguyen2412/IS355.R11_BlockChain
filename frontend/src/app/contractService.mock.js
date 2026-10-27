import { ZeroAddress, ZeroHash, id } from 'ethers';

const ADMIN = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const HOSPITAL = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
const PATIENT = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
const OUTSIDER = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
const HOSPITAL_ROLE = id('HOSPITAL_ROLE');
const lower = (v) => String(v ?? '').toLowerCase();
const bi = (v, label = 'Số tiền') => { try { const n = BigInt(v); if (n < 0n) throw 0; return n; } catch { throw new Error(`${label} không hợp lệ.`); } };
const clone = (v) => Array.isArray(v) ? v.map(clone) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clone(x)])) : v;
const statusLabel = (status) => ['PENDING', 'APPROVED', 'REJECTED'][status] ?? 'PENDING';
const claimView = (c) => ({ ...clone(c), statusLabel: statusLabel(c.status) });
const policyView = (p) => p ? ({ ...clone(p), remainingLimit: p.coverageLimit - p.usedAmount }) : null;
const timestamp = () => Math.floor(Date.now() / 1000);
const DAY = 86400;
const plansSeed = () => [
  { id: 1, name: 'Gói Cơ bản', price: 2000000000000000n, coverageLimit: 20000000000000000n, durationDays: 30, policyDocCID: 'mock-cid-policy-basic', active: true },
  { id: 2, name: 'Gói Nâng cao', price: 5000000000000000n, coverageLimit: 50000000000000000n, durationDays: 90, policyDocCID: 'mock-cid-policy-premium', active: true },
];
const policySeed = () => ({ tokenId: 1, planId: 1, holder: PATIENT, encryptedHealthId: 'MOCK_RSA_B64_HEALTH_ID', coverageLimit: 20000000000000000n, usedAmount: 12000000000000000n, startDate: 1893456000, expiryDate: 1896048000, policyDocCID: 'mock-cid-policy-basic' });
const claimsSeed = () => [
  { claimId: 1, tokenId: 1, patient: PATIENT, hospital: HOSPITAL, amount: 12000000000000000n, confirmedAmount: 12000000000000000n, hospitalConfirmed: true, billCID: 'mock-cid-bill-01', recordCID: 'mock-cid-record-01', status: 1, createdAt: 1893542400, resolvedAt: 1893546000, reason: '' },
  { claimId: 2, tokenId: 1, patient: PATIENT, hospital: ZeroAddress, amount: 5000000000000000n, confirmedAmount: 0n, hospitalConfirmed: false, billCID: 'mock-cid-bill-01', recordCID: 'mock-cid-record-02', status: 0, createdAt: 1893628800, resolvedAt: 0, reason: '' },
  { claimId: 3, tokenId: 1, patient: PATIENT, hospital: ZeroAddress, amount: 3000000000000000n, confirmedAmount: 0n, hospitalConfirmed: false, billCID: 'mock-cid-bill-01', recordCID: 'mock-cid-record-02', status: 2, createdAt: 1893715200, resolvedAt: 1893718800, reason: 'Mock claim rejected' },
];
let plans, policies, activePolicies, claims, pool, keys, hospitals, events, block, nextPlan, nextPolicy, nextClaim, totalPremium, totalPaid;
export function __resetMockStateForTests() {
  plans = plansSeed(); policies = new Map([[1, policySeed()]]); activePolicies = new Map([[lower(PATIENT), 1]]); claims = claimsSeed();
  pool = 100000000000000000n;
  keys = new Map([[lower(ADMIN), 'MOCK_RSA_PUBLIC_KEY_PEM_INSURER'], [lower(HOSPITAL), 'MOCK_RSA_PUBLIC_KEY_PEM_HOSPITAL'], [lower(PATIENT), 'MOCK_RSA_PUBLIC_KEY_PEM_PATIENT']]);
  hospitals = new Set([lower(HOSPITAL)]); events = []; block = 1; nextPlan = 3; nextPolicy = 2; nextClaim = 4;
  totalPremium = 7000000000000000n; totalPaid = 12000000000000000n;
}
__resetMockStateForTests();
const sender = (options) => options?.from ?? ADMIN;
const admin = (address) => { if (lower(address) !== lower(ADMIN)) throw new Error('Ví của bạn không có quyền thực hiện thao tác này.'); };
const hospital = (address) => { if (!hospitals.has(lower(address))) throw new Error('Ví của bạn không có quyền thực hiện thao tác này.'); };
const getPlan = (idValue) => { const p = plans.find((x) => x.id === Number(idValue)); if (!p) throw new Error('Gói bảo hiểm không tồn tại.'); return p; };
const findClaimRaw = (idValue) => { const c = claims.find((x) => x.claimId === Number(idValue)); if (!c) throw new Error('Không tìm thấy yêu cầu bồi thường.'); return c; };
const getPolicyRaw = (idValue) => { const p = policies.get(Number(idValue)); if (!p) throw new Error('Không tìm thấy thẻ bảo hiểm.'); return p; };
const policyOf = (address) => policies.get(activePolicies.get(lower(address)) ?? 0) ?? null;
const active = (p) => { const plan = plans.find((x) => x.id === p.planId); if (!plan?.active || timestamp() > p.expiryDate) throw new Error('Gói bảo hiểm đã hết hạn.'); };
const pending = (c) => { if (c.status !== 0) throw new Error('Yêu cầu bồi thường này đã được xử lý.'); };
const tx = (name, args, dryRun = false) => {
  if (dryRun) return { hash: null, receipt: null };
  block += 1; const event = { name, args: clone(args), blockNumber: block, txHash: `0xmock${String(block).padStart(8, '0')}`, timestamp: timestamp() }; events.unshift(event);
  return { hash: event.txHash, receipt: { status: 1, blockNumber: block, logs: [], mock: true } };
};

export async function getRoles(address) { return { isInsurer: lower(address) === lower(ADMIN), isHospital: hospitals.has(lower(address)) }; }
export async function verifyInsurance(address) { const p = policyOf(address); if (!p) return { isValid: false, tokenId: 0, remainingLimit: 0n, expiryDate: 0 }; const plan = plans.find((x) => x.id === p.planId); return { isValid: Boolean(plan?.active) && timestamp() <= p.expiryDate, tokenId: p.tokenId, remainingLimit: p.coverageLimit - p.usedAmount, expiryDate: p.expiryDate }; }
export async function getPlans() { return clone(plans); }
export async function getPolicy(tokenId) { return policyView(getPolicyRaw(tokenId)); }
export async function getPolicyOf(address) { return policyView(policyOf(address)); }
export async function getClaim(claimId) { return claimView(findClaimRaw(claimId)); }
export async function getClaimsByPatient(address) { return claims.filter((c) => lower(c.patient) === lower(address)).map(claimView); }
export async function getAllClaims() { return claims.map(claimView); }
export async function getPoolBalance() { return pool; }
export async function getEncryptionKey(address) { return keys.get(lower(address)) ?? ''; }
export async function getInsurerAddress() { return ADMIN; }
export async function getEvents(fromBlock) { return events.filter((e) => fromBlock == null || e.blockNumber >= Number(fromBlock)).map(clone); }
export async function getStats() { return { totalPremium, totalPaid, pending: claims.filter((c) => c.status === 0).length, approved: claims.filter((c) => c.status === 1).length, rejected: claims.filter((c) => c.status === 2).length, poolBalance: pool }; }

export async function createPlan(input, options = {}) {
  admin(sender(options)); const price = bi(input?.price, 'Giá gói'); const coverageLimit = bi(input?.coverageLimit, 'Hạn mức'); const durationDays = Number(input?.durationDays);
  if (!input?.name?.trim() || !String(input.policyDocCID ?? '').startsWith('mock-') || price <= 0n || coverageLimit <= 0n || !Number.isInteger(durationDays) || durationDays <= 0) throw new Error('Thông tin gói bảo hiểm không hợp lệ.');
  if (options.dryRun) return tx('PlanCreated', {}, true);
  const plan = { id: nextPlan++, name: input.name.trim(), price, coverageLimit, durationDays, policyDocCID: input.policyDocCID, active: true }; plans.push(plan); return tx('PlanCreated', { planId: plan.id, ...plan });
}
export async function setPlanActive(planId, activeValue, options = {}) { admin(sender(options)); const p = getPlan(planId); if (typeof activeValue !== 'boolean') throw new Error('Trạng thái gói không hợp lệ.'); if (options.dryRun) return tx('PlanStatusChanged', {}, true); p.active = activeValue; return tx('PlanStatusChanged', { planId: p.id, active: p.active }); }
export async function authorizeHospital(hospitalAddress, status, options = {}) { admin(sender(options)); if (!/^0x[a-fA-F0-9]{40}$/.test(String(hospitalAddress)) || typeof status !== 'boolean') throw new Error('Địa chỉ bệnh viện hoặc trạng thái không hợp lệ.'); if (options.dryRun) return tx('HospitalAuthorized', {}, true); if (status) hospitals.add(lower(hospitalAddress)); else hospitals.delete(lower(hospitalAddress)); return tx('HospitalAuthorized', { hospital: hospitalAddress, status }); }
export async function fundPool(amountWei, options = {}) { const amount = bi(amountWei); if (amount <= 0n) throw new Error('Số tiền không hợp lệ.'); if (options.dryRun) return tx('PoolFunded', {}, true); pool += amount; return tx('PoolFunded', { from: sender(options), amount }); }
export async function registerEncryptionKey(publicKeyPem, options = {}) { if (typeof publicKeyPem !== 'string' || !publicKeyPem.trim()) throw new Error('Khóa mã hóa không hợp lệ.'); if (options.dryRun) return tx('EncryptionKeyRegistered', {}, true); keys.set(lower(sender(options)), publicKeyPem); return tx('EncryptionKeyRegistered', { user: sender(options) }); }
export async function purchasePolicy(planId, encryptedHealthId, valueWei, options = {}) {
  const from = sender(options); const p = getPlan(planId); if (!p.active) throw new Error('Gói bảo hiểm này hiện không mở bán.'); if (bi(valueWei) !== p.price) throw new Error('Số ETH thanh toán không đúng giá gói.');
  const existing = policyOf(from); if (existing && timestamp() <= existing.expiryDate && plans.find((x) => x.id === existing.planId)?.active) throw new Error('Bạn đã có gói bảo hiểm còn hiệu lực.');
  if (typeof encryptedHealthId !== 'string' || !encryptedHealthId.trim()) throw new Error('Mã số bảo hiểm không hợp lệ.'); if (!keys.has(lower(ADMIN))) throw new Error('Công ty bảo hiểm chưa đăng ký khóa mã hóa. Hãy đăng ký trước.');
  if (options.dryRun) return tx('PolicyPurchased', {}, true); const tokenId = nextPolicy++; const startDate = timestamp(); policies.set(tokenId, { tokenId, planId: p.id, holder: from, encryptedHealthId, coverageLimit: p.coverageLimit, usedAmount: 0n, startDate, expiryDate: startDate + p.durationDays * DAY, policyDocCID: p.policyDocCID }); activePolicies.set(lower(from), tokenId); totalPremium += p.price; return tx('PolicyPurchased', { tokenId, holder: from, planId: p.id, expiryDate: startDate + p.durationDays * DAY });
}
export async function submitClaim(input, options = {}) {
  const from = sender(options); const tokenId = Number(input?.tokenId); const amount = bi(input?.amount); if (!Number.isSafeInteger(tokenId) || tokenId < 1 || amount <= 0n) throw new Error('Số tiền không hợp lệ.');
  const p = getPolicyRaw(tokenId); const isOwner = lower(p.holder) === lower(from); const isHospital = hospitals.has(lower(from)); if (!isOwner && !isHospital) throw new Error('Chỉ chủ thẻ hoặc bệnh viện được ủy quyền mới gửi được yêu cầu.'); active(p); if (amount > p.coverageLimit - p.usedAmount) throw new Error('Số tiền vượt hạn mức bảo hiểm còn lại.');
  if (!String(input.billCID ?? '').startsWith('mock-') || !String(input.recordCID ?? '').startsWith('mock-')) throw new Error('CID hồ sơ không hợp lệ.'); if (options.dryRun) return tx('ClaimSubmitted', {}, true);
  const c = { claimId: nextClaim++, tokenId, patient: p.holder, hospital: isHospital ? from : ZeroAddress, amount, confirmedAmount: isHospital ? amount : 0n, hospitalConfirmed: isHospital, billCID: input.billCID, recordCID: input.recordCID, status: 0, createdAt: timestamp(), resolvedAt: 0, reason: '' }; claims.push(c); return tx('ClaimSubmitted', { claimId: c.claimId, tokenId, patient: c.patient, submittedBy: from, amount });
}
export async function confirmClaim(claimId, confirmedAmount, options = {}) { hospital(sender(options)); const c = findClaimRaw(claimId); pending(c); const amount = bi(confirmedAmount); if (amount <= 0n) throw new Error('Số tiền không hợp lệ.'); if (amount > c.amount) throw new Error('Số tiền xác nhận lớn hơn số tiền yêu cầu.'); const p = getPolicyRaw(c.tokenId); if (amount > p.coverageLimit - p.usedAmount) throw new Error('Số tiền vượt hạn mức bảo hiểm còn lại.'); if (options.dryRun) return tx('ClaimConfirmed', {}, true); c.hospital = sender(options); c.confirmedAmount = amount; c.hospitalConfirmed = true; return tx('ClaimConfirmed', { claimId: c.claimId, hospital: c.hospital, confirmedAmount: amount }); }
export async function approveClaim(claimId, options = {}) { const c = findClaimRaw(claimId); pending(c); if (!c.hospitalConfirmed) throw new Error('Bệnh viện chưa xác nhận chi phí điều trị.'); const p = getPolicyRaw(c.tokenId); active(p); if (c.confirmedAmount > p.coverageLimit - p.usedAmount) throw new Error('Số tiền vượt hạn mức bảo hiểm còn lại.'); if (c.confirmedAmount > pool) throw new Error('Quỹ bảo hiểm hiện không đủ để chi trả.'); if (options.dryRun) return tx('ClaimApproved', {}, true); c.status = 1; c.resolvedAt = timestamp(); p.usedAmount += c.confirmedAmount; pool -= c.confirmedAmount; totalPaid += c.confirmedAmount; return tx('ClaimApproved', { claimId: c.claimId, patient: c.patient, amount: c.confirmedAmount }); }
export async function rejectClaim(claimId, reason, options = {}) { admin(sender(options)); const c = findClaimRaw(claimId); pending(c); if (typeof reason !== 'string' || !reason.trim()) throw new Error('Lý do từ chối không hợp lệ.'); if (options.dryRun) return tx('ClaimRejected', {}, true); c.status = 2; c.resolvedAt = timestamp(); c.reason = reason.trim(); return tx('ClaimRejected', { claimId: c.claimId, reason: c.reason }); }

export const MOCK_ADDRESSES = Object.freeze({ ADMIN, HOSPITAL, PATIENT, OUTSIDER });
export const MOCK_HOSPITAL_ROLE = HOSPITAL_ROLE;
export const MOCK_DEFAULT_ADMIN_ROLE = ZeroHash;


