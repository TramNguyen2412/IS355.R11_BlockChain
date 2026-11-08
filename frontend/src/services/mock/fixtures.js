// fixtures.js — chép nguyên văn file 00 mục 6. Số tiền là BigInt.
export const WALLETS = {
  ADMIN: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  HOSPITAL: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  PATIENT: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  OUTSIDER: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
};
export const MOCK_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const PLANS = [
  { id: 1n, name: "Gói Cơ bản", price: 2000000000000000n, coverageLimit: 20000000000000000n, durationDays: 30n, policyDocCID: "mock-cid-policy-basic", active: true },
  { id: 2n, name: "Gói Nâng cao", price: 5000000000000000n, coverageLimit: 50000000000000000n, durationDays: 90n, policyDocCID: "mock-cid-policy-premium", active: true },
];
export const POOL_INITIAL = 100000000000000000n;
export const SCENARIO = { claim1: 12000000000000000n, claim2: 15000000000000000n, remainingAfterClaim1: 8000000000000000n };
export const CIDS = {
  policyBasic: "mock-cid-policy-basic", policyPremium: "mock-cid-policy-premium",
  bill01: "mock-cid-bill-01", record01: "mock-cid-record-01", record02: "mock-cid-record-02",
};
export const MOCK_PUBLIC_KEYS = {
  [WALLETS.ADMIN.toLowerCase()]: "MOCK_RSA_PUBLIC_KEY_PEM_INSURER",
  [WALLETS.HOSPITAL.toLowerCase()]: "MOCK_RSA_PUBLIC_KEY_PEM_HOSPITAL",
  [WALLETS.PATIENT.toLowerCase()]: "MOCK_RSA_PUBLIC_KEY_PEM_PATIENT",
};
export const PLAIN_RECORD = {
  meta: { visitDate: "2030-01-02", hospitalName: "Bệnh viện Mẫu", billCID: "mock-cid-bill-01" },
  secret: {
    patientName: "Nguyễn Văn Mẫu", healthId: "HS4010123456789", diagnosis: "Viêm ruột thừa cấp",
    treatment: "Phẫu thuật nội soi cắt ruột thừa",
    labResults: [{ test: "Bạch cầu", value: "13.2", unit: "G/L" }, { test: "CRP", value: "48", unit: "mg/L" }],
    doctor: "BS. Trần Mẫu", totalCost: "12000000000000000",
  },
};
export const ENCRYPTED_RECORD_01 = {
  version: 1, meta: PLAIN_RECORD.meta,
  cipher: { alg: "AES-256-GCM", iv: "MOCK_IV_BASE64", data: "MOCK_CIPHERTEXT_BASE64" },
  keyWraps: {
    "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc": "MOCK_WRAP_PATIENT",
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8": "MOCK_WRAP_HOSPITAL",
    "0xf39fd6e51aad88f6f4ce6ab8827279cffffb92266": "MOCK_WRAP_INSURER",
  },
};
