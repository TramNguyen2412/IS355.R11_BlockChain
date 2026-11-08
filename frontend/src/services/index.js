// index.js — cổng DUY NHẤT để trang import service. Chọn mock/thật theo VITE_USE_MOCK.
import * as realIpfs from "./ipfsService.js";
import * as realCrypto from "./cryptoService.js";
import * as mockIpfs from "./mock/mockIpfs.js";
import * as mockCrypto from "./mock/mockCrypto.js";
const useMock = import.meta.env?.VITE_USE_MOCK === "true";
export const ipfsService = useMock ? mockIpfs : realIpfs;
export const cryptoService = useMock ? mockCrypto : realCrypto;
