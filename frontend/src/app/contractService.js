import * as mockService from './contractService.mock.js';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';
const unavailable = () => { throw new Error('Chưa cài đặt'); };
const expose = (name) => (...args) => useMock ? mockService[name](...args) : unavailable();

export const getRoles = expose('getRoles');
export const verifyInsurance = expose('verifyInsurance');
export const getPlans = expose('getPlans');
export const getPolicy = expose('getPolicy');
export const getPolicyOf = expose('getPolicyOf');
export const getClaim = expose('getClaim');
export const getClaimsByPatient = expose('getClaimsByPatient');
export const getAllClaims = expose('getAllClaims');
export const getPoolBalance = expose('getPoolBalance');
export const getEncryptionKey = expose('getEncryptionKey');
export const getInsurerAddress = expose('getInsurerAddress');
export const getEvents = expose('getEvents');
export const getStats = expose('getStats');
export const createPlan = expose('createPlan');
export const setPlanActive = expose('setPlanActive');
export const authorizeHospital = expose('authorizeHospital');
export const fundPool = expose('fundPool');
export const registerEncryptionKey = expose('registerEncryptionKey');
export const purchasePolicy = expose('purchasePolicy');
export const submitClaim = expose('submitClaim');
export const confirmClaim = expose('confirmClaim');
export const approveClaim = expose('approveClaim');
export const rejectClaim = expose('rejectClaim');
