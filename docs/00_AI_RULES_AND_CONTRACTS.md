# 00 — LUẬT CHUNG & HỢP ĐỒNG GIAO TIẾP (AI RULES AND CONTRACTS)

**Dự án:** IS355 — Hệ thống quản lý bảo hiểm y tế phi tập trung (DApp: Solidity + NFT ERC-721 + IPFS/Pinata + mã hóa AES/RSA + React)
**Nhóm:** A = **Trâm**, B = **Phương Anh**, C = **Lan Anh**
**Sản phẩm:** **MediChain** (tên hiển thị trên giao diện và báo cáo). Tên smart contract và mọi tên hàm đóng băng **vẫn là `HealthInsuranceNFT`**, không đổi.
**Repo:** `https://github.com/TramNguyen2412/IS355.R11_BlockChain.git` (Private, đã đăng ký với giảng viên). Thư mục local: `MediChain`.
**Nhánh Git cố định:** A (Trâm) = `tram` · B (Phương Anh) = `phuong-anh` · C (Lan Anh) = `lan-anh` (xem mục 8.3).
**Trạng thái file:** ĐÓNG BĂNG (frozen). Muốn sửa phải theo mục 8. Không ai (người hay AI) tự ý sửa.
**File này thay thế** `docs/INTERFACE.md` đã nhắc trong file kế hoạch trước. Chỉ có **một** nguồn sự thật là file này.

---

## 0. HƯỚNG DẪN BÀN GIAO CHO AI (ĐỌC ĐẦU TIÊN)

### 0.1. Nếu bạn là AI vừa được đưa file này
1. Bạn đang hỗ trợ **đúng một** thành viên (A, B hoặc C). Nếu người dùng chưa nói rõ họ là ai, **hỏi trước**, không đoán.
2. Đọc **toàn bộ** file này. Sau đó đọc theo thứ tự: `docs/progress/PROGRESS_<vai trò>.md` (đang làm tới đâu) → file task hiện tại trong `docs/plan/<vai trò>/` (làm gì tiếp).
3. Trước khi viết bất kỳ dòng code nào, hãy **nhắc lại cho người dùng** 4 điều, ngắn gọn:
   - Vai trò của bạn (A/B/C) và danh sách thư mục bạn được phép sửa (mục 3)
   - Task bạn sắp làm (đúng 1 task)
   - Danh sách file bạn sẽ **tạo** và **sửa**
   - Những hàm/tên đã đóng băng mà task này phụ thuộc (mục 4)
4. Làm đúng 1 task. Làm xong thì **cập nhật `PROGRESS_<vai trò>.md`** (mục 8.2) trước khi kết thúc phiên.
5. Nếu yêu cầu của người dùng **mâu thuẫn với file này** hoặc buộc bạn làm một việc bị cấm: **dừng lại, nói rõ điều khoản bị vi phạm, đề xuất cách làm đúng luật**. Không tự làm "cho nhanh".
6. Nếu thiếu thông tin: **hỏi**, đừng bịa tên hàm, địa chỉ, CID, số liệu. Mọi số liệu giả chỉ lấy từ mục 6.

### 0.2. Prompt khởi động (người dùng copy dán vào chat AI mới)

```text
Bạn là trợ lý lập trình cho thành viên <A | B | C> của nhóm đồ án IS355.
Hãy đọc docs/00_AI_RULES_AND_CONTRACTS.md, rồi docs/progress/PROGRESS_<A|B|C>.md,
rồi file task: docs/plan/<A|B|C>/<tên file task>.
Làm ĐÚNG task đó, không làm thêm. Tuân thủ tuyệt đối luật trong file đã đọc.
Trước khi code, nhắc lại vai trò, thư mục được sửa, danh sách file sẽ tạo/sửa. Cuối phiên, cập nhật PROGRESS.
```

### 0.3. Gợi ý cho người dùng công cụ AI có hỗ trợ file hướng dẫn tự đọc
Tạo ở thư mục gốc repo một file `AGENTS.md` (và/hoặc `CLAUDE.md`) với **đúng 3 dòng** dưới đây để công cụ tự đọc đúng file luật:
```text
Đọc docs/00_AI_RULES_AND_CONTRACTS.md trước mọi việc. Đây là luật bắt buộc.
Hỏi người dùng họ là thành viên A, B hay C nếu chưa biết. Chỉ sửa thư mục của vai trò đó.
Cuối phiên làm việc, cập nhật docs/progress/PROGRESS_<vai trò>.md.
```

---

## 1. LUẬT BẤT DI BẤT DỊCH (R1–R16)

| # | Luật |
|---|---|
| **R1** | **Một vai trò, một lãnh địa.** Khi làm cho thành viên X, chỉ được **tạo/sửa/xóa** file nằm trong thư mục thuộc X ở mục 3. Cấm tạo hoặc sửa file ngoài danh sách đó, kể cả "chỉ sửa một dòng". |
| **R2** | **Cấm đổi tên.** Tên hàm, tham số, struct, field, event, mã lỗi, tên file, tên thư mục đã ghi trong file này là **cố định**. Cấm "đổi cho đẹp", cấm đổi kiểu viết hoa/thường, cấm thêm/bớt tham số. |
| **R3** | **Cấm cài thư viện ngoài danh sách cho phép** ở mục 2.3. Cần thêm thư viện → dừng, hỏi người dùng, xử lý theo mục 8.1. Không `npm install`/`pip install` gói nào khác, kể cả gói "chỉ để dev". |
| **R4** | **Cấm sửa file sinh tự động**: `frontend/src/contracts/abi.json`, `frontend/src/contracts/address.json` (chỉ script của A ghi). |
| **R5** | **Cấm đưa bí mật vào Git**: private key ví, JWT Pinata, API key RPC/Etherscan, khóa riêng RSA, file `.env`. Chỉ commit `.env.example`. Không in (`console.log`) private key, JWT ra màn hình hay log. |
| **R6** | **Một lần một task.** Không làm thêm task khác "tiện tay". Không tạo tính năng ngoài mô tả task. |
| **R7** | **Không refactor ngoài phạm vi.** Không đổi cấu trúc thư mục, không di chuyển file, không đổi định dạng code của file không thuộc task. |
| **R8** | **Không đoán, hỏi.** Gặp điều chưa rõ trong luật hoặc task → hỏi người dùng. Không tự nghĩ thêm tên hàm/field/số liệu. |
| **R9** | **Dữ liệu giả chỉ lấy ở mục 6.** Không tự bịa địa chỉ ví, CID, JSON bệnh án, giá gói. |
| **R10** | **Ngôn ngữ:** code, tên biến, tên hàm, commit message: tiếng Anh (commit có mã module, mục 8.3). Chuỗi hiển thị cho người dùng cuối: tiếng Việt có dấu. Chuỗi `revert` trong Solidity: tiếng Việt **không dấu** đúng bảng ở mục 4.7. |
| **R11** | **Tiền luôn là `bigint` (wei)** trong JavaScript. Chỉ đổi sang ETH khi hiển thị bằng `ethers.formatEther`. Cấm dùng `Number`/`parseFloat` cho tiền. |
| **R12** | **Địa chỉ ví so sánh bằng chữ thường:** `a.toLowerCase() === b.toLowerCase()`. Khóa trong JSON (`keyWraps`) luôn là **chữ thường**. |
| **R13** | **Cuối phiên phải cập nhật** `docs/progress/PROGRESS_<vai trò>.md` (mục 8.2). Chưa cập nhật = chưa xong task. |
| **R14** | **Git:** làm việc trên nhánh cố định của mình: `tram`, `phuong-anh` hoặc `lan-anh` (mục 8.3), **không push thẳng `main`**. Không `git push --force`. Không xóa nhánh/lịch sử của người khác. |
| **R15** | **Không xóa file** không do bạn tạo trong phiên này. Không tạo file tài liệu thừa (README phụ, ghi chú rải rác). Tài liệu chỉ nằm trong `docs/` đúng chỗ ở mục 3. |
| **R16** | **Thấy lỗi ở file của người khác:** không sửa. Ghi vào mục "Yêu cầu gửi người khác" của PROGRESS (mục 8.2) và báo người dùng. |

**Danh sách kiểm tra bắt buộc của AI trước khi trả lời "đã xong":**
- [ ] Mọi file tôi tạo/sửa đều nằm trong thư mục của vai trò (mục 3)?
- [ ] Không đổi tên gì đã đóng băng (mục 4)? Không thêm thư viện (mục 2.3)?
- [ ] Số liệu giả khớp mục 6?
- [ ] Không có secret trong code?
- [ ] Đã cập nhật PROGRESS?

---

## 2. KHÓA CÔNG NGHỆ (TECH STACK & VERSION LOCK)

### 2.1. Bảng khóa

| Lớp | Bắt buộc | Ghi chú |
|---|---|---|
| Ngôn ngữ contract | **Solidity**, `pragma solidity ^0.8.20;` | Compiler cụ thể do A ghi vào `contracts-hardhat/hardhat.config.js` |
| Thư viện contract | **OpenZeppelin Contracts v5** (`@openzeppelin/contracts`) | Dùng `ERC721`, `AccessControl`, `ReentrancyGuard`. Cú pháp v5: hook `_update`, không dùng `_beforeTokenTransfer` |
| Test/deploy | **Hardhat** + plugin chính thức (toolbox, verify) | Phiên bản do A cài lúc khởi tạo, ghi vào `README.md`. **Không ai tự nâng cấp** |
| Test contract | Mocha + Chai (ethers v6) | `const { expect } = require("chai")` |
| Frontend | **React + Vite**, **JavaScript** (`.jsx`/`.js`) | **Không dùng TypeScript.** Function component + hooks, không class component |
| Web3 client | **ethers v6** | Xem mục 2.2 |
| Mã hóa | **WebCrypto API của trình duyệt** (`window.crypto.subtle`) | AES-256-GCM, RSA-OAEP 2048 SHA-256. **Không** thư viện mã hóa ngoài |
| Gọi Pinata | **`fetch` thuần** tới REST API của Pinata | Không dùng SDK của Pinata |
| Mạng | Local: Hardhat node (chainId 31337). Nộp bài: **Sepolia** (chainId 11155111) | |
| Ví | **MetaMask** (`window.ethereum`) | |
| Tùy chọn | Python + `web3` cho `tools/web3py/` | Chỉ B, chỉ gói `web3` |
| Style | CSS thường (`.css`), nền sáng, tương phản cao | Cỡ chữ giao diện tối thiểu 16px |

### 2.2. Cú pháp ethers v6 BẮT BUỘC

```js
import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);   // KHÔNG Web3Provider
const signer   = await provider.getSigner();                    // có await
const contract = new ethers.Contract(address, abi, signer);

ethers.parseEther("0.002");        // -> bigint
ethers.formatEther(value);         // bigint -> string
ethers.ZeroAddress;                // KHÔNG ethers.constants.AddressZero
ethers.ZeroHash;                   // = DEFAULT_ADMIN_ROLE
ethers.id("text");                 // keccak256 của chuỗi
await contract.getAddress();       // KHÔNG contract.address
await contract.fn.staticCall(...); // mô phỏng, không gửi giao dịch (v6)
const tx = await contract.fn(...); const receipt = await tx.wait();
contract.queryFilter(contract.filters.EventName(), fromBlock);
// Deploy trong script: const c = await Factory.deploy(...); await c.waitForDeployment();
```

### 2.3. Danh sách thư viện ĐƯỢC PHÉP (ngoài danh sách = CẤM)

| Package | Thư viện được cài |
|---|---|
| `contracts-hardhat/` (A) | `hardhat`, plugin Hardhat chính thức cho test/verify/gas-report (toolbox), `@openzeppelin/contracts`, `dotenv` |
| `frontend/` (C quản lý `package.json`) | `react`, `react-dom`, `react-router-dom`, `ethers` (v6), `vite`, `@vitejs/plugin-react` |
| `tools/web3py/` (B, tùy chọn) | `web3` |

### 2.4. Danh sách CẤM DÙNG (không ngoại lệ nếu chưa qua mục 8.1)

**Thư viện:** Tailwind, Bootstrap, Material UI, Ant Design, styled-components, Redux, Zustand, MobX, axios (dùng `fetch`), crypto-js, node-forge, tweetnacl, `@pinata/sdk`, `ipfs-http-client`, web3.js, viem, wagmi, RainbowKit, Web3Modal, TypeScript, moment, lodash, uuid, jQuery.

**Cú pháp ethers v5 (cấm):** `ethers.providers.*`, `Web3Provider`, `ethers.utils.*`, `ethers.BigNumber`, `BigNumber.from`, `ethers.constants.*`, `contract.deployed()`, `contract.callStatic`, `contract.address`, `.toNumber()` trên tiền, `.toString()` để tính tiền.

**Solidity (cấm):** `transfer()`/`send()` để chuyển ETH (dùng `call` và kiểm tra kết quả), `tx.origin` để xác thực, `selfdestruct`, `delegatecall` không cần thiết, `ERC721Enumerable`, `ERC721URIStorage` (dùng tokenURI tự viết), hook cũ `_beforeTokenTransfer`/`_afterTokenTransfer` (OZ v4), `require` với chuỗi lỗi **không** nằm trong mục 4.7, proxy/upgradeable.

**Hành vi (cấm):** đổi tên hàm đã đóng băng; thêm tham số vào hàm đã đóng băng; lưu khóa riêng RSA ở nơi khác `localStorage`; gọi Pinata từ file nằm ngoài `services/ipfsService.js`; gọi `crypto.subtle` từ file nằm ngoài `services/cryptoService.js`; gọi contract trực tiếp từ trang mà không qua `contractService.js`; trang này `import` từ trang khác.

---

## 3. BẢN ĐỒ SỞ HỮU THƯ MỤC (DIRECTORY OWNERSHIP MATRIX)

### 3.1. Cây thư mục chuẩn (tên thư mục cố định)

```text
MediChain/   (thư mục local; repo GitHub: IS355.R11_BlockChain)
├── AGENTS.md  CLAUDE.md                [A (Trâm) tạo ở M0, sau đó đóng băng]
├── README.md                           [A (Trâm) tạo bản tối thiểu ở M0; C (Lan Anh) viết đầy đủ]
├── .gitignore  .env.example            [A (Trâm) tạo ở M0, sau đó đóng băng]
├── .github/CODEOWNERS                  [A (Trâm) tạo ở M0, sau đó đóng băng]
├── docs/
│   ├── 00_AI_RULES_AND_CONTRACTS.md    [ĐÓNG BĂNG — file này]
│   ├── plan/
│   │   ├── 00_MASTER_PLAN.md           [cả nhóm, sửa qua PR]
│   │   ├── A/  B/  C/                  [mỗi người một thư mục kế hoạch riêng]
│   ├── progress/
│   │   ├── PROGRESS_A.md  PROGRESS_B.md  PROGRESS_C.md   [mỗi người một file]
│   ├── report/                         [file chương theo hậu tố _A/_B/_C]
│   │   └── images/A/  images/B/  images/C/
│   ├── bpmn/                           [B]
│   ├── slides/                         [slides_A, slides_B, slides_C; C hợp nhất]
│   └── video/                          [C]
├── contracts-hardhat/                  [A]
│   ├── contracts/HealthInsuranceNFT.sol
│   ├── test/HealthInsuranceNFT.test.js
│   ├── scripts/deploy.js  seed.js  exportAbi.js
│   ├── hardhat.config.js  package.json  .env (không commit)
├── frontend/
│   ├── package.json  vite.config.js  index.html  .env (không commit)
│   └── src/
│       ├── main.jsx
│       ├── app/                        [C]  App.jsx, WalletProvider.jsx, roleDetection.js,
│       │                                     contractService.js, errors.js, format.js
│       ├── components/shared/          [C]  Layout, TxToast, ErrorBox, Loading, Address, Button...
│       ├── styles/global.css           [C]
│       ├── contracts/                  [A, SINH TỰ ĐỘNG]  abi.json, address.json
│       ├── services/                   [B]  index.js, ipfsService.js, cryptoService.js, mock/
│       └── pages/
│           ├── patient/                [C]
│           ├── hospital/               [A]
│           └── insurer/                [B]
├── sample-data/                        [B]
└── tools/web3py/                       [B, tùy chọn]
```

### 3.2. Bảng quyền

| Đường dẫn | Chủ sở hữu | Ai được tạo/sửa | Ghi chú |
|---|---|---|---|
| `contracts-hardhat/**` | **A** (Trâm) | Chỉ A (Trâm) | Contract, test, script deploy/seed/export |
| `frontend/src/contracts/abi.json`, `address.json` | **A (Trâm)** | Chỉ **script** `exportAbi.js` của A ghi | Không ai sửa tay. B, C chỉ đọc |
| `frontend/src/pages/hospital/**` | **A (Trâm)** | Chỉ A (Trâm) | CSS của trang để trong chính thư mục này |
| `frontend/src/services/**` (kể cả `mock/`) | **B** (Phương Anh) | Chỉ B (Phương Anh) | A và C chỉ `import` từ `services/index.js` |
| `frontend/src/pages/insurer/**` | **B (Phương Anh)** | Chỉ B (Phương Anh) | |
| `sample-data/**`, `tools/web3py/**`, `docs/bpmn/**` | **B (Phương Anh)** | Chỉ B (Phương Anh) | |
| `frontend/package.json`, `vite.config.js`, `index.html`, `src/main.jsx` | **C** (Lan Anh) | Chỉ C (Lan Anh) | A/B cần thư viện → xin C qua mục 8.1 |
| `frontend/src/app/**` (gồm `contractService.js`, `errors.js`, `format.js`) | **C (Lan Anh)** | Chỉ C (Lan Anh) | |
| `frontend/src/components/shared/**`, `src/styles/**` | **C (Lan Anh)** | Chỉ C (Lan Anh) | Dùng chung, A và B chỉ dùng, không sửa |
| `frontend/src/pages/patient/**` | **C (Lan Anh)** | Chỉ C (Lan Anh) | |
| `AGENTS.md`, `CLAUDE.md`, `.gitignore`, `.env.example`, `.github/**` | **A (Trâm)** | A tạo lúc M0 (A đứng ra dựng repo); sau đó chỉ sửa qua mục 8.1 | C (Lan Anh) **không** làm lại việc tạo repo/khung (bỏ qua C-01) |
| `README.md` | **C (Lan Anh)** | A tạo bản tối thiểu lúc M0; C viết đầy đủ sau đó | |
| `docs/00_AI_RULES_AND_CONTRACTS.md` | Cả nhóm | **Không ai**, chỉ qua mục 8.1 | |
| `docs/plan/00_MASTER_PLAN.md` | Cả nhóm | Qua PR, cả 3 duyệt | |
| `docs/plan/A/**`, `docs/progress/PROGRESS_A.md`, `docs/report/*_A*`, `docs/report/images/A/**`, `docs/slides/*_A*` | **A (Trâm)** | Chỉ A (Trâm) | |
| `docs/plan/B/**`, `docs/progress/PROGRESS_B.md`, `docs/report/*_B*`, `docs/report/images/B/**`, `docs/slides/*_B*` | **B (Phương Anh)** | Chỉ B (Phương Anh) | |
| `docs/plan/C/**`, `docs/progress/PROGRESS_C.md`, `docs/report/*_C*`, `docs/report/images/C/**`, `docs/slides/*_C*`, `docs/video/**` | **C (Lan Anh)** | Chỉ C (Lan Anh) | C là người duy nhất ghép file Word cuối |

### 3.3. Quy tắc import (chiều phụ thuộc, cấm đảo ngược)

```text
pages/*  ──►  app/ (contractService, errors, format)   ──►  contracts/ (abi, address)
pages/*  ──►  components/shared/
pages/*  ──►  services/index.js  (ipfsService, cryptoService)
cấm:  pages/X  ──►  pages/Y     |     services  ──►  pages     |     services  ──►  app
```
- Trang **chỉ** nhập `ipfsService`, `cryptoService` từ `src/services/index.js`. Không nhập thẳng file `mock/` hay file thật.
- Trang **chỉ** gọi blockchain qua `src/app/contractService.js`.
- Dùng đường dẫn tương đối, không alias.

### 3.4. Các điểm DÍNH CHUNG (nơi dễ xung đột) và cách xử lý
| Điểm chung | Người sửa duy nhất | Người khác làm gì khi cần thay đổi |
|---|---|---|
| `frontend/package.json` | C | Gửi yêu cầu cho C (mục 8.1) |
| Route/router (`App.jsx`) | C | C đã đăng ký sẵn 3 route trỏ tới `PatientPage.jsx`, `HospitalPage.jsx`, `InsurerPage.jsx`; A và B chỉ viết trong thư mục trang của mình |
| ABI/địa chỉ contract | A (qua script) | B, C `git pull` rồi dùng |
| Tên hàm của contract | Không ai (đóng băng) | Xin đổi qua mục 8.1 và cả 3 đồng ý |
| Chữ ký service (`ipfsService`, `cryptoService`) | Không ai (đóng băng) | Như trên |
| `contractService.js` | C | A, B xin thêm hàm bọc qua mục 8.1; **chữ ký hàm đã đóng băng ở mục 4.4** |

---

## 4. HỢP ĐỒNG GIAO TIẾP ĐÓNG BĂNG (FROZEN INTERFACE CONTRACT)

### 4.1. Quy ước chung
- **Mọi ID bắt đầu từ 1** (`planId`, `tokenId`, `claimId`). Giá trị `0` nghĩa là "không có".
- `ClaimStatus`: `0 = PENDING`, `1 = APPROVED`, `2 = REJECTED`.
- `DEFAULT_ADMIN_ROLE` = `0x00…00` (`ethers.ZeroHash`). `HOSPITAL_ROLE` = `keccak256("HOSPITAL_ROLE")`. Lấy bằng `contract.HOSPITAL_ROLE()`, không tự tính lại.
- Thời gian là Unix timestamp **giây** (`uint256`/`bigint`).
- Contract tên **`HealthInsuranceNFT`**. NFT: tên `"Health Insurance Card"`, ký hiệu `"HIC"`.
- Mỗi ví **tối đa 1 gói còn hiệu lực**.

### 4.2. Smart contract — struct, hàm, event

```solidity
// ===== STRUCT (tên và thứ tự field đóng băng) =====
struct Plan {
    uint256 id;
    string  name;
    uint256 price;            // wei
    uint256 coverageLimit;    // wei
    uint256 durationDays;
    string  policyDocCID;
    bool    active;
}
struct Policy {
    uint256 tokenId;
    uint256 planId;
    address holder;
    string  encryptedHealthId;
    uint256 coverageLimit;    // wei, sao chép từ Plan lúc mua
    uint256 usedAmount;       // wei
    uint256 startDate;
    uint256 expiryDate;
    string  policyDocCID;
}
enum ClaimStatus { PENDING, APPROVED, REJECTED }
struct Claim {
    uint256 claimId;
    uint256 tokenId;
    address patient;
    address hospital;         // address(0) cho tới khi bệnh viện xác nhận
    uint256 amount;           // số tiền yêu cầu (wei)
    uint256 confirmedAmount;  // số tiền bệnh viện xác nhận (wei)
    bool    hospitalConfirmed;
    string  billCID;
    string  recordCID;
    ClaimStatus status;
    uint256 createdAt;
    uint256 resolvedAt;       // 0 cho tới khi APPROVED/REJECTED
}

// ===== HÀM GHI (state-changing) =====
function createPlan(string name, uint256 price, uint256 coverageLimit, uint256 durationDays, string policyDocCID) external returns (uint256 planId);      // ADMIN
function setPlanActive(uint256 planId, bool active) external;                                  // ADMIN
function authorizeHospital(address hospital, bool status) external;                            // ADMIN
function fundPool() external payable;                                                           // ai cũng gọi được
function registerEncryptionKey(string rsaPublicKeyPem) external;                                // ai cũng gọi được
function purchasePolicy(uint256 planId, string encryptedHealthId) external payable returns (uint256 tokenId);   // msg.value == plan.price
function submitClaim(uint256 tokenId, uint256 amount, string billCID, string recordCID) external returns (uint256 claimId);   // chủ NFT hoặc HOSPITAL_ROLE
function confirmClaim(uint256 claimId, uint256 confirmedAmount) external;                       // HOSPITAL_ROLE
function approveClaim(uint256 claimId) external;                                                // ai cũng gọi được, nonReentrant
function rejectClaim(uint256 claimId, string reason) external;                                  // ADMIN

// ===== HÀM ĐỌC (view) =====
function verifyInsurance(address patient) external view returns (bool isValid, uint256 tokenId, uint256 remainingLimit, uint256 expiryDate);
function getPlans() external view returns (Plan[] memory);
function getPolicy(uint256 tokenId) external view returns (Policy memory);
function getClaim(uint256 claimId) external view returns (Claim memory);
function getClaimsByPatient(address patient) external view returns (uint256[] memory);
function totalPlans() external view returns (uint256);
function totalPolicies() external view returns (uint256);
function totalClaims() external view returns (uint256);
function poolBalance() external view returns (uint256);
function activePolicyOf(address holder) external view returns (uint256);       // public mapping, 0 = không có
function encryptionKeyOf(address user) external view returns (string memory);  // public mapping, "" = chưa đăng ký
function HOSPITAL_ROLE() external view returns (bytes32);
function hasRole(bytes32 role, address account) external view returns (bool);  // từ AccessControl
// Từ ERC721: ownerOf, balanceOf, tokenURI. tokenURI(tokenId) = "ipfs://" + policyDocCID

// ===== EVENT =====
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
```
**Hành vi cố định (A phải làm đúng, B và C được phép dựa vào):**
- `submitClaim` do **bệnh viện** gọi → claim có `hospitalConfirmed = true`, `hospital = msg.sender`, `confirmedAmount = amount`. Do **chủ NFT** gọi → `hospitalConfirmed = false`, `hospital = address(0)`, `confirmedAmount = 0`.
- `approveClaim` chi trả `confirmedAmount` về `claim.patient`.
- `verifyInsurance`: `isValid` chỉ `true` khi có gói đang hoạt động **và** `block.timestamp <= expiryDate`. Không bao giờ revert; ví không có thẻ trả `(false, 0, 0, 0)`. `remainingLimit = coverageLimit - usedAmount`.
- NFT **soulbound**: chỉ mint, không chuyển nhượng được.

### 4.3. File cấu hình sinh tự động (A ghi, B/C chỉ đọc)

`frontend/src/contracts/address.json`
```json
{
  "chainId": 11155111,
  "network": "sepolia",
  "HealthInsuranceNFT": "0x0000000000000000000000000000000000000000",
  "insurer": "0x0000000000000000000000000000000000000000",
  "deployBlock": 0
}
```
`insurer` = địa chỉ ví deployer (Admin). `frontend/src/contracts/abi.json` = mảng ABI.

**Biến môi trường frontend (`frontend/.env`, mẫu ở `.env.example`):**
```text
VITE_USE_MOCK=true
VITE_PINATA_JWT=
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
VITE_CHAIN_ID=31337
```
**Biến môi trường contracts (`contracts-hardhat/.env`):** `SEPOLIA_RPC_URL`, `DEPLOYER_PRIVATE_KEY`, `ETHERSCAN_API_KEY`, `HOSPITAL_ADDRESS=` (địa chỉ ví Bệnh viện, công khai; `seed.js` dùng để cấp quyền khi chạy trên Sepolia), `POOL_FUND_ETH=` (số ETH nạp quỹ khi seed trên Sepolia, ví dụ `0.1`).

### 4.4. `contractService.js` — chữ ký đóng băng (C viết, A/B/C dùng)

Đường dẫn: `frontend/src/app/contractService.js`. Mọi hàm là `async`. Trả về **object JS thuần** (đã chuyển từ `Result` của ethers), tiền luôn là `bigint`.

```js
// ---- Hình dạng dữ liệu trả về ----
// Plan   : { id, name, price, coverageLimit, durationDays, policyDocCID, active }
// Policy : { tokenId, planId, holder, encryptedHealthId, coverageLimit, usedAmount,
//            startDate, expiryDate, policyDocCID, remainingLimit }   // remainingLimit = coverageLimit - usedAmount
// Claim  : { claimId, tokenId, patient, hospital, amount, confirmedAmount, hospitalConfirmed,
//            billCID, recordCID, status, statusLabel, createdAt, resolvedAt }
//          statusLabel: "PENDING" | "APPROVED" | "REJECTED"
// TxResult : { hash, receipt }
// ChainEvent : { name, args, blockNumber, txHash, timestamp }   // timestamp: giây (number)

// ---- Đọc ----
getRoles(address)            // -> { isInsurer: boolean, isHospital: boolean }
verifyInsurance(address)     // -> { isValid, tokenId, remainingLimit, expiryDate }
getPlans()                   // -> Plan[]
getPolicy(tokenId)           // -> Policy
getPolicyOf(address)         // -> Policy | null   (qua activePolicyOf)
getClaim(claimId)            // -> Claim
getClaimsByPatient(address)  // -> Claim[]
getAllClaims()               // -> Claim[]
getPoolBalance()             // -> bigint
getEncryptionKey(address)    // -> string ("" nếu chưa đăng ký)
getInsurerAddress()          // -> string (lấy từ address.json)
getEvents(fromBlock?)        // -> ChainEvent[]  (mọi event ở mục 4.2, mới nhất trước)
getStats()                   // -> { totalPremium, totalPaid, pending, approved, rejected, poolBalance }

// ---- Ghi (mỗi hàm nhận options cuối cùng: { dryRun?: boolean }) ----
// dryRun = true: dùng staticCall, KHÔNG gửi giao dịch; nếu sẽ revert thì ném Error tiếng Việt
createPlan({ name, price, coverageLimit, durationDays, policyDocCID }, options?) // -> TxResult
setPlanActive(planId, active, options?)
authorizeHospital(hospitalAddress, status, options?)
fundPool(amountWei, options?)
registerEncryptionKey(publicKeyPem, options?)
purchasePolicy(planId, encryptedHealthId, valueWei, options?)
submitClaim({ tokenId, amount, billCID, recordCID }, options?)
confirmClaim(claimId, confirmedAmount, options?)
approveClaim(claimId, options?)
rejectClaim(claimId, reason, options?)
```
Mọi lỗi từ contract được đổi qua `errors.js` thành `Error` có `message` **tiếng Việt** (bảng mục 4.7). `errors.js` xuất `toVietnameseError(err) -> string`.

### 4.5. `ipfsService.js` — chữ ký đóng băng (B viết)

Đường dẫn: `frontend/src/services/ipfsService.js`.
```js
uploadFile(file)           // File  -> Promise<{ cid: string, url: string }>
uploadJSON(obj, name)      // object, string -> Promise<{ cid: string, url: string }>
fetchJSON(cid)             // -> Promise<object>
fetchBlob(cid)             // -> Promise<Blob>
gatewayUrl(cid)            // -> string  (VITE_PINATA_GATEWAY + cid)
```
Lỗi: luôn ném `new Error("<thông báo tiếng Việt>")`. Chỉ file này được gọi Pinata. CID giả bắt đầu bằng `mock-` (mục 6.4).

### 4.6. `cryptoService.js` — chữ ký đóng băng (B viết)

Đường dẫn: `frontend/src/services/cryptoService.js`. Khóa RSA là **chuỗi PEM** (công khai: SPKI, riêng: PKCS8). Dữ liệu nhị phân dạng **base64 chuẩn**.
```js
generateRsaKeyPair()                          // -> Promise<{ publicKeyPem, privateKeyPem }>
saveKeyPair(address, pair)                    // lưu localStorage, khóa theo address.toLowerCase()
loadKeyPair(address)                          // -> { publicKeyPem, privateKeyPem } | null
exportKeyPair(address)                        // -> string (JSON để người dùng tải về)
importKeyPair(address, text)                  // nhập lại từ chuỗi JSON
rsaEncrypt(publicKeyPem, plainText)           // -> Promise<string>  base64; ném lỗi nếu plainText > 190 byte UTF-8
rsaDecrypt(privateKeyPem, base64)             // -> Promise<string>
buildEncryptedRecord(record, recipients)      // record = { meta, secret }; recipients = [{ address, publicKeyPem }]
                                              // -> Promise<EncryptedRecord>
openEncryptedRecord(encrypted, myAddress, myPrivateKeyPem) // -> Promise<{ meta, secret }>
```
**Tham số thuật toán (cố định):** AES-256-GCM, IV 12 byte ngẫu nhiên mỗi lần; RSA-OAEP, modulus 2048, SHA-256, public exponent 65537. Khóa AES (32 byte thô) được bọc trực tiếp bằng RSA-OAEP cho từng người nhận.

**Định dạng `EncryptedRecord` (file JSON đưa lên IPFS, `recordCID`):**
```json
{
  "version": 1,
  "meta": { "visitDate": "2030-01-02", "hospitalName": "Bệnh viện Mẫu", "billCID": "mock-cid-bill-01" },
  "cipher": { "alg": "AES-256-GCM", "iv": "<base64>", "data": "<base64 của JSON(secret)>" },
  "keyWraps": { "<địa chỉ ví chữ thường>": "<base64 của khóa AES bọc RSA-OAEP>" }
}
```
`keyWraps` chứa đủ 3 người nhận: bệnh nhân, bệnh viện gửi, công ty bảo hiểm (địa chỉ viết thường).

### 4.7. Bảng lỗi đóng băng (chuỗi trong contract → thông báo tiếng Việt trên giao diện)

| Chuỗi `revert` trong Solidity (không dấu, **đúng từng ký tự**) | Thông báo hiển thị |
|---|---|
| `Bao hiem da het han` | Gói bảo hiểm đã hết hạn. |
| `Vuot qua han muc bao hiem` | Số tiền vượt hạn mức bảo hiểm còn lại. |
| `Quy bao hiem khong du` | Quỹ bảo hiểm hiện không đủ để chi trả. |
| `Benh vien chua xac nhan` | Bệnh viện chưa xác nhận chi phí điều trị. |
| `Claim da xu ly` | Yêu cầu bồi thường này đã được xử lý. |
| `Soulbound: khong the chuyen nhuong` | Thẻ bảo hiểm không thể chuyển nhượng. |
| `Goi bao hiem khong ton tai` | Gói bảo hiểm không tồn tại. |
| `Goi bao hiem khong hoat dong` | Gói bảo hiểm này hiện không mở bán. |
| `Sai so tien thanh toan` | Số ETH thanh toán không đúng giá gói. |
| `Da co goi bao hiem con han` | Bạn đã có gói bảo hiểm còn hiệu lực. |
| `Khong phai chu the hoac benh vien` | Chỉ chủ thẻ hoặc bệnh viện được ủy quyền mới gửi được yêu cầu. |
| `So tien khong hop le` | Số tiền không hợp lệ. |
| `So tien xac nhan vuot so tien yeu cau` | Số tiền xác nhận lớn hơn số tiền yêu cầu. |
| `Khong tim thay yeu cau boi thuong` | Không tìm thấy yêu cầu bồi thường. |
| `Chuyen tien that bai` | Chuyển tiền thất bại. |
| Lỗi `AccessControlUnauthorizedAccount` (OpenZeppelin v5) | Ví của bạn không có quyền thực hiện thao tác này. |
| MetaMask từ chối (`ACTION_REJECTED`, mã 4001) | Bạn đã hủy giao dịch. |

**Thông báo lỗi chỉ có ở frontend (không nằm trong contract):** `Cong ty bao hiem chua dang ky khoa ma hoa` → "Công ty bảo hiểm chưa đăng ký khóa mã hóa. Hãy đăng ký trước." · `Ma so bao hiem qua dai` → "Mã số bảo hiểm quá dài." · "Vui lòng chuyển MetaMask sang mạng Sepolia."

---

## 5. THỨ TỰ KHỞI TẠO HỆ THỐNG (bắt buộc theo đúng thứ tự khi chạy demo hoặc test tích hợp)

1. `deploy.js` → deploy; ghi `abi.json`, `address.json` (có `insurer`).
2. `seed.js` → tạo 2 gói theo mục 6.2 (dùng CID PDF từ mục 6.4), cấp quyền ví Bệnh viện, nạp quỹ 0.1 ETH.
3. **Admin mở màn hình Công ty bảo hiểm** → tạo cặp khóa RSA → `registerEncryptionKey`. (Phải làm **trước** khi bệnh nhân mua, vì `encryptedHealthId` được mã hóa bằng khóa công khai của Admin.) `seed.js` **không** làm được bước này vì khóa riêng phải nằm ở trình duyệt của Admin.
4. Bệnh nhân và Bệnh viện mở giao diện → mỗi người tạo khóa RSA → `registerEncryptionKey`.
5. Bệnh nhân mua gói → Bệnh viện kiểm tra thẻ và gửi claim → Công ty bảo hiểm duyệt.

---

## 6. DỮ LIỆU MẪU CHUẨN (STANDARD MOCK DATA)

> Mọi người và mọi AI **chỉ dùng** số liệu dưới đây khi mock/test. B tạo file `frontend/src/services/mock/fixtures.js` chứa đúng các giá trị này; A dùng đúng các giá trị gói ở 6.2 trong `seed.js` và test.
> Trong JSON, số tiền (wei) ghi dạng **chuỗi** để tránh mất độ chính xác; khi nạp vào JS phải `BigInt("...")`. **Chuỗi ETH là chuẩn gốc**, wei là kết quả của `ethers.parseEther`.

### 6.1. Bốn ví mẫu (tài khoản mặc định #0–#3 của Hardhat, địa chỉ công khai, chạy local khớp 100%)

| Vai trò | Biến | Địa chỉ local (Hardhat) | Địa chỉ Sepolia |
|---|---|---|---|
| Công ty bảo hiểm (Admin) | `ADMIN` | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0x_DIEN_KHI_CO` |
| Bệnh viện | `HOSPITAL` | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x_DIEN_KHI_CO` |
| Bệnh nhân | `PATIENT` | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x_DIEN_KHI_CO` |
| Người ngoài | `OUTSIDER` | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | `0x_DIEN_KHI_CO` |

Địa chỉ contract giả cho mock: `0x5FbDB2315678afecb367f032d93F642f64180aa3` (địa chỉ deploy đầu tiên của Hardhat local; địa chỉ thật lấy từ `address.json`).
*Quy tắc:* cột Sepolia do **cả nhóm** điền một lần khi có ví thật, qua mục 8.1. **Không ghi private key vào bất kỳ file nào.**

### 6.2. Hai gói bảo hiểm mẫu

| | Gói 1 — "Gói Cơ bản" | Gói 2 — "Gói Nâng cao" |
|---|---|---|
| `id` | `1` | `2` |
| `price` | `0.002` ETH = `"2000000000000000"` wei | `0.005` ETH = `"5000000000000000"` wei |
| `coverageLimit` | `0.02` ETH = `"20000000000000000"` wei | `0.05` ETH = `"50000000000000000"` wei |
| `durationDays` | `30` | `90` |
| `policyDocCID` | `mock-cid-policy-basic` | `mock-cid-policy-premium` |
| `active` | `true` | `true` |

**Quỹ nạp ban đầu:** `0.1` ETH = `"100000000000000000"` wei.

### 6.3. Kịch bản số tiền chuẩn (dùng cho test và demo)
| Bước | Số tiền | Kết quả mong đợi |
|---|---|---|
| Claim 1 (hợp lệ) | `0.012` ETH = `"12000000000000000"` | Duyệt thành công. `usedAmount` = `0.012`, `remainingLimit` = `0.008` ETH = `"8000000000000000"` |
| Claim 2 (cố ý vượt hạn mức) | `0.015` ETH = `"15000000000000000"` | Bị từ chối bởi `Vuot qua han muc bao hiem` |

### 6.4. Mã CID mẫu (luôn bắt đầu bằng `mock-`; `mockIpfs` trả đúng các giá trị này)

| Khóa | CID mẫu | Loại | Nội dung |
|---|---|---|---|
| `policyBasic` | `mock-cid-policy-basic` | PDF | Điều khoản Gói Cơ bản |
| `policyPremium` | `mock-cid-policy-premium` | PDF | Điều khoản Gói Nâng cao |
| `bill01` | `mock-cid-bill-01` | Ảnh/PDF | Hóa đơn viện phí số 1 |
| `record01` | `mock-cid-record-01` | JSON | `EncryptedRecord` của claim 1 (mục 6.6) |
| `record02` | `mock-cid-record-02` | JSON | `EncryptedRecord` của claim 2 |

CID thật (khi `VITE_USE_MOCK=false`) do Pinata trả về. **Cấm** dùng CID bắt đầu bằng `mock-` ở môi trường Sepolia thật.

### 6.5. Khóa RSA công khai mẫu (chỉ dùng cho mock, không phải khóa thật)
```json
{
  "<ADMIN lowercase>":    "MOCK_RSA_PUBLIC_KEY_PEM_INSURER",
  "<HOSPITAL lowercase>": "MOCK_RSA_PUBLIC_KEY_PEM_HOSPITAL",
  "<PATIENT lowercase>":  "MOCK_RSA_PUBLIC_KEY_PEM_PATIENT"
}
```
`mockCrypto` mã hóa/giải mã giả (ví dụ chỉ thêm tiền tố `MOCKENC:` rồi base64), nhưng **trả về đúng hình dạng dữ liệu** như bản thật.

### 6.6. Bản ghi y tế mẫu

**Bản rõ (đầu vào của `buildEncryptedRecord`, đầu ra của `openEncryptedRecord`)** — dữ liệu hư cấu:
```json
{
  "meta": {
    "visitDate": "2030-01-02",
    "hospitalName": "Bệnh viện Mẫu",
    "billCID": "mock-cid-bill-01"
  },
  "secret": {
    "patientName": "Nguyễn Văn Mẫu",
    "healthId": "HS4010123456789",
    "diagnosis": "Viêm ruột thừa cấp",
    "treatment": "Phẫu thuật nội soi cắt ruột thừa",
    "labResults": [
      { "test": "Bạch cầu", "value": "13.2", "unit": "G/L" },
      { "test": "CRP", "value": "48", "unit": "mg/L" }
    ],
    "doctor": "BS. Trần Mẫu",
    "totalCost": "12000000000000000"
  }
}
```

**Bản mã (file JSON đưa lên IPFS, đúng định dạng mục 4.6, giá trị giả trong mock):**
```json
{
  "version": 1,
  "meta": {
    "visitDate": "2030-01-02",
    "hospitalName": "Bệnh viện Mẫu",
    "billCID": "mock-cid-bill-01"
  },
  "cipher": {
    "alg": "AES-256-GCM",
    "iv": "MOCK_IV_BASE64",
    "data": "MOCK_CIPHERTEXT_BASE64"
  },
  "keyWraps": {
    "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc": "MOCK_WRAP_PATIENT",
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8": "MOCK_WRAP_HOSPITAL",
    "0xf39fd6e51aad88f6f4ce6ab8827279cffffb92266": "MOCK_WRAP_INSURER"
  }
}
```

### 6.7. Thẻ NFT và danh sách claim mẫu (dùng dựng giao diện đủ 3 trạng thái)

**Policy mẫu** (sau khi claim 1 đã duyệt):
```json
{
  "tokenId": "1",
  "planId": "1",
  "holder": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "encryptedHealthId": "MOCK_RSA_B64_HEALTH_ID",
  "coverageLimit": "20000000000000000",
  "usedAmount": "12000000000000000",
  "startDate": "1893456000",
  "expiryDate": "1896048000",
  "policyDocCID": "mock-cid-policy-basic"
}
```
*(`startDate` = 01/01/2030, `expiryDate` = 31/01/2030, đặt tương lai để giao diện luôn hiện "còn hiệu lực".)*

**Claim mẫu:**
| `claimId` | `tokenId` | `amount` (wei) | `confirmedAmount` | `hospitalConfirmed` | `status` | `billCID` | `recordCID` | `createdAt` | `resolvedAt` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | `12000000000000000` | `12000000000000000` | true | 1 (APPROVED) | `mock-cid-bill-01` | `mock-cid-record-01` | `1893542400` | `1893546000` |
| 2 | 1 | `5000000000000000` | `0` | false | 0 (PENDING) | `mock-cid-bill-01` | `mock-cid-record-02` | `1893628800` | `0` |
| 3 | 1 | `3000000000000000` | `0` | false | 2 (REJECTED) | `mock-cid-bill-01` | `mock-cid-record-02` | `1893715200` | `1893718800` |

`patient` của cả 3 claim = `PATIENT`; `hospital` của claim 1 = `HOSPITAL`, claim 2 và 3 = `0x0000000000000000000000000000000000000000`.

---

## 7. QUY TẮC CHẤT LƯỢNG CODE NGẮN GỌN (để code ghép được với nhau)

- **Comment** tiếng Việt ngắn cho mỗi hàm quan trọng của contract (A) để dán vào báo cáo.
- **Mọi thao tác ghi** trên giao diện: hiện trạng thái *đang xử lý → thành công (hash + link Etherscan) → lỗi tiếng Việt* bằng `TxToast` của C.
- **Trước khi gửi** giao dịch có nguy cơ revert: gọi `contractService` với `{ dryRun: true }` để báo lỗi sớm, tránh giao dịch thất bại (rubric: tối đa 1 lỗi khi demo).
- **Giao diện** nền sáng, chữ ≥ 16px, nút bấm rõ, không tạo hiệu ứng thừa.
- **Không để `console.log` chứa dữ liệu nhạy cảm.**
- **Test:** mọi hàm contract phải có test (A). Mọi hàm `cryptoService` phải có test chạy được bằng Node (B).

---

## 8. QUY TRÌNH THAY ĐỔI, NHẬT KÝ BÀN GIAO, GIT

### 8.1. Muốn thay đổi điều đã đóng băng (hàm, tên, thư viện, quyền thư mục, số liệu mẫu)
1. **Dừng.** AI không tự thay đổi.
2. Người dùng viết yêu cầu theo mẫu, gửi nhóm (chat nhóm) và dán vào `PROGRESS_<vai trò>.md`, mục "Yêu cầu gửi người khác":
```text
[YÊU CẦU ĐỔI] <A/B/C> → cả nhóm
Điều khoản muốn đổi: <mục nào của file 00>
Nội dung cũ → mới: ...
Lý do: ...
Ảnh hưởng tới ai/file nào: ...
```
3. **Cả 3 đồng ý**. Chỉ khi đó **một** người (C) sửa file này, tăng số phiên bản ở dòng dưới, và báo cả nhóm `git pull`.
4. Sau khi file này đổi, mọi người và mọi AI phải **đọc lại file** trước khi làm tiếp.

**Phiên bản file:** `v1.0` (ngày 17/10/2026)

### 8.2. Nhật ký bàn giao (để AI phiên sau làm tiếp được ngay)

Mỗi người có đúng 1 file: `docs/progress/PROGRESS_<A|B|C>.md`. Cập nhật **cuối mỗi phiên làm việc**, giữ **ngắn** (tối đa khoảng 1 trang; gộp các mục cũ đã xong thành 1 dòng). Mẫu:

```markdown
# PROGRESS — Thành viên <A|B|C>
Cập nhật lần cuối: <ngày giờ>

## Đã xong
- [x] <mã task> — <1 dòng>. File: `<đường dẫn>`

## Đang làm / dừng ở đâu
- Task hiện tại: <mã task>
- Đã làm được: ...
- Dừng ở: <hàm/dòng/bước cụ thể>
- Bước tiếp theo (làm ngay): ...

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `<path>` — tạo mới | sửa
 
## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- ...

## Vấn đề đang kẹt / cần người khác
- ...

## Yêu cầu gửi người khác
- [ ] <gửi ai>: <nội dung>

## Cách chạy / kiểm tra phần đã làm
- Lệnh: `...`  Kết quả mong đợi: ...
```
**Quy tắc cho AI phiên sau:** đọc PROGRESS trước, làm tiếp từ "Bước tiếp theo", không làm lại phần "Đã xong", không giả định gì ngoài những gì ghi trong file này và PROGRESS.

### 8.3. Git
- **Nhánh: mỗi người đúng MỘT nhánh cố định trong suốt dự án** (không tạo nhánh theo từng task/chặng):
  - A (Trâm): `tram`
  - B (Phương Anh): `phuong-anh`
  - C (Lan Anh): `lan-anh`
  - `main` là nhánh chung, **bảo vệ** (chỉ vào bằng Pull Request, không push thẳng).
- **Quy trình chuẩn mỗi lần làm việc:**
  1. `git checkout <nhánh của mình>` (kiểm tra bằng `git branch --show-current`).
  2. Làm việc, commit trên nhánh của mình.
  3. `git pull origin main` để gộp code mới nhất của `main` về nhánh mình; **kiểm tra không có conflict** (có conflict: dừng, không xóa bừa, báo người kia, giữ cả hai thay đổi hợp lý).
  4. `git push origin <nhánh của mình>`.
  5. Mở **Pull Request** từ nhánh của mình vào `main`; nhờ một người khác xem rồi merge.
  6. Sau khi PR được merge: `git checkout <nhánh của mình> && git pull origin main` để nhánh bắt kịp `main`, rồi làm tiếp.
- **Ngoại lệ duy nhất:** lần đẩy đầu tiên khởi tạo repo (M0, khi `main` chưa bật bảo vệ) do A (Trâm) thực hiện.
- **Commit:** `[M1] add submitClaim` — bắt đầu bằng mã module, tiếng Anh, 1 dòng. Mã module: M1 contract (A), M2 services (B), M3 khung + bệnh nhân (C), M4 bệnh viện (A), M5 công ty BH (B), M7 báo cáo/slide (ai làm).
- **Pull Request** vào `main`: nhỏ, merge trong ngày. Trước khi bắt đầu phiên mới: `git pull origin main`.
- Mỗi PR **chỉ chứa file trong thư mục của người tạo** (mục 3). Nếu PR có file ngoài lãnh địa, người duyệt từ chối.
- **Tag:** `v0-local` (chạy được local), `v1-sepolia` (deploy Sepolia), `v2-final` (bản nộp).

---

## 9. TÓM TẮT 12 DÒNG (AI không có thời gian thì đọc phần này, nhưng vẫn phải biết cả file)

1. Bạn phục vụ **một** thành viên (A Trâm / B Phương Anh / C Lan Anh). Hỏi nếu chưa rõ.
2. Chỉ sửa file trong thư mục của vai trò đó (mục 3).
3. Không đổi tên hàm/field/event/lỗi đã đóng băng (mục 4).
4. Không cài thư viện ngoài danh sách (mục 2.3). Không dùng cú pháp ethers v5.
5. Tiền = `bigint` wei. Địa chỉ so sánh bằng chữ thường. ID bắt đầu từ 1.
6. Mã hóa chỉ bằng WebCrypto; gọi Pinata chỉ bằng `fetch`; trong `services/`.
7. Trang chỉ gọi chain qua `contractService`, chỉ gọi IPFS/crypto qua `services/index.js`.
8. Số liệu giả chỉ lấy ở mục 6.
9. Không đưa secret vào Git. Không `push` thẳng `main`.
10. Làm đúng một task mỗi phiên, không làm thêm.
11. Thấy lỗi ở file người khác → báo, không sửa.
12. Cuối phiên cập nhật `PROGRESS_<vai trò>.md`.
