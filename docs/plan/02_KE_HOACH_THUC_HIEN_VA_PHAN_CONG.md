# FILE 2 — KẾ HOẠCH THỰC HIỆN & PHÂN CÔNG NHÓM 3 NGƯỜI

> **CẬP NHẬT 23/10/2026 (đọc trước):** Khi file này mâu thuẫn với `docs/00_AI_RULES_AND_CONTRACTS.md` (file 00) hoặc `docs/plan/00_MASTER_PLAN.md`, **hai file đó thắng**. Các điểm đã đổi trong file này: (1) **A (Trâm)** dựng repo và các file gốc ở M0 (không phải C); (2) repo tên **MediChain** (GitHub: `TramNguyen2412/IS355.R11_BlockChain`); (3) **mỗi người đúng 1 nhánh cố định**: A (Trâm) `tram`, B (Phương Anh) `phuong-anh`, C (Lan Anh) `lan-anh`; (4) **không có lịch họp**, phối hợp qua chat, Git và `PROGRESS_<A|B|C>.md`; (5) hợp đồng giao tiếp nằm ở file 00 (thay cho `docs/INTERFACE.md`); (6) mốc ngày và phân việc chi tiết theo master plan.

**Căn cứ:** (1) Đề bài "Bài tập 04: Hệ thống quản lý bảo hiểm y tế phi tập trung" và (2) Rubric 5 tiêu chí của thầy. Hai thứ này là luật. Bản Gemini và 2 báo cáo cũ chỉ để tham khảo.
**Đọc cùng:** file 01 (thiết kế, tên hàm, cấu trúc dữ liệu). Tên hàm và cấu trúc trong file 01 mục 5 là **hợp đồng giao tiếp chung**, đừng tự đổi.

Quy ước: **A = Trâm, B = Phương Anh, C = Lan Anh** (đã chốt). Ai mạnh code Solidity/JS thì làm A hoặc C, ai thích viết và vẽ sơ đồ thì làm B (nhưng B vẫn có code thật, xem bên dưới).

---

## 1. TỔNG QUAN MODULE VÀ QUAN HỆ PHỤ THUỘC

| Module | Nội dung | Chủ | Cần gì từ module khác | Cung cấp gì cho module khác |
|---|---|---|---|---|
| **M0** | Khởi tạo repo, quy ước, hợp đồng giao tiếp | Cả nhóm (1 buổi) | Không | Nền cho mọi module |
| **M1** | Smart contract + test + deploy + verify | A | M0 | `abi.json`, `address.json`, event để M3/M4/M5 dùng |
| **M2** | IPFS service + Crypto service + dữ liệu mẫu | B | M0 | 2 file service để M3/M4/M5 gọi |
| **M3** | Khung ứng dụng (kết nối ví, phân vai, layout, thông báo tx) + màn hình **Bệnh nhân** | C | M0 (ABI nháp từ M1 giai đoạn 1) | Khung để M4/M5 cắm trang vào |
| **M4** | Màn hình **Bệnh viện** | A | M1 (hợp đồng), M2 (service), M3 (khung) | |
| **M5** | Màn hình **Công ty bảo hiểm** (console + thống kê + xem hồ sơ) | B | M1, M2, M3 | |
| **M6** | Tích hợp, kiểm thử end-to-end trên Sepolia, sửa lỗi | C điều phối, cả nhóm cùng chạy | M1–M5 xong | Bản chạy ổn định để quay video |
| **M7** | Báo cáo, BPMN, slide, video | Chia đều, C ghép và format | Phần lớn viết được song song từ đầu | Sản phẩm nộp |

**Sơ đồ phụ thuộc (mũi tên = "làm xong cái trước mới cắm được cái sau"):**

```text
M0 ──► M1 (hợp đồng) ───────────────┬──► M4 (UI bệnh viện)  ┐
 │                                  ├──► M5 (UI công ty BH) ├──► M6 Tích hợp ──► Quay video
 ├───► M2 (ipfs, crypto) ───────────┤                       │
 └───► M3 (khung + UI bệnh nhân) ───┘───────────────────────┘
 
M7 (báo cáo, BPMN, slide) chạy song song gần như suốt quá trình; chỉ phần ảnh chụp màn hình/Etherscan phải chờ M6.
```

### Cái nào làm TRƯỚC, cái nào SONG SONG, cái nào SAU

**Làm trước (tuần tự, ngắn):**
1. M0 hoàn tất (cả nhóm).
2. A đưa ra **bản khung contract** (đủ tên hàm, struct, event, chưa cần logic) và xuất ABI nháp. Thời gian: nửa ngày đến 1 ngày.
3. C dựng **khung ứng dụng** (kết nối ví + phân vai + trang trống cho 3 màn hình). Thời gian: 1–2 ngày.

**Làm song song 100%, không chờ nhau (sau bước trên):**
- A: viết logic contract + test + deploy local.
- B: viết `ipfsService`, `cryptoService`, dữ liệu mẫu, vẽ BPMN. Hai service này **độc lập hoàn toàn** với contract.
- C: làm màn hình Bệnh nhân dùng **dữ liệu giả (mock)**.
- Cả ba: viết các chương báo cáo thuộc phần mình.

**Cắm vào nhau (cần hoàn tất bước trước):**
- A xong contract bản chạy được trên local → A, B, C đều bắt đầu thay mock bằng contract thật. Trong lúc đó A làm màn hình Bệnh viện, B làm màn hình Công ty BH.
- Deploy Sepolia → M6 tích hợp.

**Làm sau cùng:**
- Chụp ảnh Etherscan/giao diện chạy thật, test E2E, quay video, hoàn thiện báo cáo/slide, tập dượt.

> Chỉ có **2 điểm phải chờ nhau** trong cả kế hoạch: (1) B và C cần ABI nháp của A, nhưng điểm này được gỡ bằng "bản khung contract" ngay ngày đầu; (2) C cần A deploy Sepolia mới tích hợp xong. Còn lại đều chạy song song.

---

## 2. M0 — VIỆC LÀM ĐẦU TIÊN (A (Trâm) làm, không cần họp)

Làm đúng thứ tự, không bỏ bước nào. **A (Trâm) tạo repo và dựng khung** (hướng dẫn từng bước và script ở `docs/plan/A/A00_chuan_bi_va_cach_dung.md`). B (Phương Anh) và C (Lan Anh) chỉ cần nhận lời mời, `git clone` và chuyển sang nhánh của mình. C bỏ qua C-01.

### M0.1 Tạo repository GitHub
- Repo GitHub (đã đăng ký với giảng viên): `https://github.com/TramNguyen2412/IS355.R11_BlockChain.git`. **Private** cho đến khi nộp xong. Thư mục local: `MediChain`. Tên sản phẩm: **MediChain** (tên smart contract trong code vẫn là `HealthInsuranceNFT`).
- A (Trâm) mời B (Phương Anh) và C (Lan Anh) làm collaborator (quyền Write).
- Bật bảo vệ nhánh `main`: bắt buộc Pull Request, ít nhất 1 người duyệt, không push thẳng vào `main`. (Settings → Branches.)

### M0.2 Cấu trúc thư mục (mỗi người một "lãnh địa")

```text
MediChain/  (thư mục local; repo GitHub: IS355.R11_BlockChain)
├── README.md                          [A (Trâm) tạo bản tối thiểu; C (Lan Anh) viết đầy đủ]
├── .gitignore                         [A (Trâm), tạo ở M0]
├── .env.example                       [A (Trâm), tạo ở M0]  Mẫu biến môi trường (KHÔNG chứa key thật)
├── .github/CODEOWNERS                 [A (Trâm), tạo ở M0]
├── AGENTS.md  CLAUDE.md               [A (Trâm), tạo ở M0]
├── docs/
│   ├── 00_AI_RULES_AND_CONTRACTS.md   [ĐÓNG BĂNG]  Luật chung và hợp đồng giao tiếp (thay cho INTERFACE.md). Sửa theo mục 8.1 của file này
│   ├── plan/                          Master plan và kế hoạch chi tiết A/, B/, C/
│   ├── progress/                      PROGRESS_A.md, PROGRESS_B.md, PROGRESS_C.md
│   ├── report/                        Mỗi người một file chương, xem mục 8
│   ├── bpmn/                          [B]
│   ├── slides/                        [mỗi người một file phần của mình]
│   └── video/                         [C]
├── contracts-hardhat/                 [A]
│   ├── contracts/HealthInsuranceNFT.sol
│   ├── test/HealthInsuranceNFT.test.js
│   ├── scripts/ deploy.js, seed.js, exportAbi.js
│   └── hardhat.config.js
├── frontend/                          [C là chủ package.json, vite.config]
│   └── src/
│       ├── app/                       [C]  App.jsx, router, WalletProvider, role detection
│       ├── components/shared/         [C]  Layout, TxToast, Loading, Address, ErrorBox
│       ├── contracts/                 [A, file sinh tự động]  abi.json, address.json
│       ├── services/                  [B]  ipfsService.js, cryptoService.js, mock/
│       ├── pages/patient/             [C]
│       ├── pages/hospital/            [A]
│       └── pages/insurer/             [B]
├── sample-data/                       [B]  PDF, ảnh hóa đơn, JSON mẫu (dữ liệu giả)
└── tools/web3py/                      [B, tùy chọn]  Script Python đọc event
```

**Nguyên tắc "không đụng file":** mỗi thư mục có đúng **một chủ**. Muốn sửa thư mục của người khác thì nhắn họ, hoặc tạo Pull Request để họ duyệt. Các file dùng chung dễ xung đột (`App.jsx`, `package.json`, router) chỉ **C** được sửa; A và B muốn thêm trang thì chỉ cần tạo file trong thư mục của mình, vì C đã đăng ký sẵn route từ đầu (xem M0.5).

### M0.3 `.gitignore` bắt buộc có

```text
node_modules/
.env
.env.local
*.pem
*.key
artifacts/
cache/
typechain-types/
dist/
.DS_Store
```
> **Tuyệt đối không commit** private key ví, JWT Pinata, API key Alchemy/Etherscan, khóa riêng RSA. Lỡ commit thì coi như đã lộ: đổi key mới, không chỉ xóa commit.

### M0.4 `.env.example` (mỗi người tự copy ra `.env` của mình)

```text
# contracts-hardhat/.env  (A)
SEPOLIA_RPC_URL=
DEPLOYER_PRIVATE_KEY=       # ví demo chỉ dùng cho testnet, tuyệt đối không dùng ví có tiền thật
ETHERSCAN_API_KEY=

# frontend/.env  (B, C)
VITE_PINATA_JWT=
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
VITE_CHAIN_ID=11155111
```

### M0.5 Dựng sẵn "ổ cắm" để mỗi người không phải sửa file của người khác
C (Lan Anh) tạo trước và commit (việc C-02 trong master plan):
- Router có sẵn 3 route: `/patient`, `/hospital`, `/insurer`, mỗi route trỏ tới một component trống `pages/patient/PatientPage.jsx`, `pages/hospital/HospitalPage.jsx`, `pages/insurer/InsurerPage.jsx` (chỉ hiện chữ "đang phát triển").
- Từ đó A chỉ sửa trong `pages/hospital/`, B chỉ sửa trong `pages/insurer/`, không ai phải đụng `App.jsx`.

### M0.6 Thống nhất quy ước chung
- **Ngôn ngữ code:** JavaScript (ES modules). Tên hàm, biến: tiếng Anh `camelCase`. Chuỗi hiển thị cho người dùng: tiếng Việt.
- **Đơn vị tiền:** nội bộ luôn dùng wei (`bigint`), hiển thị đổi sang ETH bằng `ethers.formatEther`.
- **Ngày giờ:** contract dùng Unix timestamp (giây); frontend đổi sang `dd/mm/yyyy`.
- **Nhánh git: mỗi người đúng 1 nhánh cố định suốt dự án:** A (Trâm) `tram`, B (Phương Anh) `phuong-anh`, C (Lan Anh) `lan-anh`. Không tạo nhánh theo từng task (xem file 00 mục 8.3).
- **Commit message:** `[M1] thêm hàm submitClaim`, nhắc module ở đầu.
- **Kích thước giao dịch demo:** dùng số ETH rất nhỏ (xem file 03 mục 3.1), vì ETH Sepolia xin có giới hạn.
- **Phiên bản công cụ:** ghi `node -v`, phiên bản Hardhat, OpenZeppelin vào `README.md` để cả nhóm dùng giống nhau (lệch phiên bản là nguồn lỗi "máy tôi chạy được").

### M0.7 Mọi người chuẩn bị tài khoản (làm song song ngay trong buổi này)
| Việc | Ai | Ghi chú |
|---|---|---|
| Cài Node.js bản LTS, Git, VS Code, MetaMask | Cả nhóm | |
| Tạo tài khoản Alchemy hoặc Infura lấy RPC Sepolia | A (Trâm) | |
| Tạo tài khoản Etherscan lấy API key (để verify contract) | A (Trâm) | |
| Tạo tài khoản Pinata, lấy JWT | B (Phương Anh) | Free plan đủ dùng |
| Tạo **4 tài khoản MetaMask demo**: Admin, Bệnh viện, Bệnh nhân, Người ngoài | Mỗi người tạo trong MetaMask của mình hoặc dùng chung bằng cách import | Địa chỉ công khai ghi vào file 00 mục 6.1 (qua quy trình mục 8.1). **Không ghi khóa riêng vào repo** |
| Xin ETH Sepolia cho 4 ví (từ các faucet đang hoạt động) | Cả nhóm chia nhau, mỗi người xin cho 1–2 ví | Làm sớm, faucet hay giới hạn. Kiểm tra faucet nào còn chạy tại thời điểm làm |

### M0.8 Xác nhận cuối M0 (tick từng ô)
- [ ] Repo có đủ thư mục và 3 file `.gitignore`, `.env.example`, `CODEOWNERS`.
- [ ] Nhánh `main` đã bảo vệ.
- [ ] Mọi người clone được và chạy `npm install` ở thư mục của mình.
- [ ] Đã đọc kỹ `docs/00_AI_RULES_AND_CONTRACTS.md` (file 00) và đồng ý.
- [ ] Có ví demo và đã có ETH Sepolia.
- [ ] Biết deadline nộp bài thật của thầy và ngày demo. **Ghi vào README.** (Hiện tại: thuyết trình trực tiếp xong trước 04/12, nộp Word + video hạn chốt 08/12/2026, theo master plan.) (Nhóm tự lùi mốc nội bộ về trước hạn thầy ít nhất vài ngày để dự phòng.)

---

## 3. HỢP ĐỒNG GIAO TIẾP (bản gốc; **bản đóng băng đang dùng là file 00**, ưu tiên file 00 khi khác nhau)

### 3.1. Smart contract → Frontend (do A sở hữu)
`exportAbi.js` (A viết) sau mỗi lần deploy sẽ ghi đè 2 file:
- `frontend/src/contracts/abi.json`: ABI của `HealthInsuranceNFT`
- `frontend/src/contracts/address.json`:
```json
{ "chainId": 11155111, "network": "sepolia", "HealthInsuranceNFT": "0x....", "deployBlock": 0 }
```
`deployBlock` dùng để lọc event từ block đó trở đi (nhanh hơn quét từ đầu).

Danh sách hàm và tham số: **đúng bảng file 01 mục 5.2**. A **không đổi tên hàm** sau khi đã gửi ABI nháp. Nếu bắt buộc đổi thì nhắn cả nhóm và cập nhật `INTERFACE.md`.

**Mã trạng thái Claim:** `0 = PENDING`, `1 = APPROVED`, `2 = REJECTED`.

**Thông báo lỗi (revert reason) đã thống nhất, để C map ra tiếng Việt:**
| Chuỗi trong contract | Hiển thị cho người dùng |
|---|---|
| `Bao hiem da het han` | Gói bảo hiểm đã hết hạn |
| `Vuot qua han muc bao hiem` | Số tiền vượt hạn mức còn lại |
| `Quy bao hiem khong du` | Quỹ bảo hiểm hiện không đủ tiền chi trả |
| `Benh vien chua xac nhan` | Bệnh viện chưa xác nhận chi phí |
| `Claim da xu ly` | Yêu cầu này đã được xử lý |
| `Soulbound: khong the chuyen nhuong` | Thẻ bảo hiểm không thể chuyển nhượng |
| Lỗi `AccessControlUnauthorizedAccount` của OpenZeppelin | Ví của bạn không có quyền thực hiện thao tác này |

### 3.2. `ipfsService.js` (B sở hữu), C, A và B gọi các hàm này
```js
uploadFile(file)            // File (pdf/png/jpg) -> Promise<{ cid, url }>
uploadJSON(obj, name)       // object            -> Promise<{ cid, url }>
fetchJSON(cid)              // -> Promise<object>
fetchBlob(cid)              // -> Promise<Blob>     (tải file hóa đơn)
gatewayUrl(cid)             // -> string            (link xem)
```
Lỗi: luôn `throw new Error("<thông báo tiếng Việt>")` để UI hiển thị.

### 3.3. `cryptoService.js` (B sở hữu)
```js
generateRsaKeyPair()                                  // -> { publicKeyPem, privateKeyPem }
saveKeyPair(address, pair) / loadKeyPair(address)     // localStorage theo địa chỉ ví
exportKeyPair(address) / importKeyPair(address, text) // sao lưu khóa
rsaEncrypt(publicKeyPem, plainText)                   // -> base64
rsaDecrypt(privateKeyPem, base64)                     // -> plainText
buildEncryptedRecord(record, recipients)              // recipients = [{address, publicKeyPem}] -> jsonObject
openEncryptedRecord(jsonObject, myAddress, myPrivateKeyPem) // -> record (object gốc)
```
Chi tiết thuật toán: file 01 mục 7.

### 3.4. Dữ liệu mock cho C (B cung cấp trong `services/mock/`)
- `mockIpfs.js`, `mockCrypto.js`: có cùng chữ ký hàm như thật, trả dữ liệu giả ngay lập tức, để C/A dựng giao diện mà không chờ B.
- Cách chuyển sang bản thật: đổi dòng `import` trong `services/index.js` (file do B sở hữu), không phải sửa gì ở trang.

### 3.5. Quy tắc cho `contractService` (C sở hữu)
C viết 1 lớp bao quanh ethers: `getContract(signerOrProvider)`, các hàm `buy()`, `submitClaim()`... **Mọi trang đều dùng chung lớp này** để A và B không phải tự viết lại việc gọi contract. C cập nhật danh sách hàm theo ABI mới nhất.

---

## 4. NHIỆM VỤ CHI TIẾT TỪNG THÀNH VIÊN

> Mỗi nhiệm vụ có **mã (A1, A2...)**, **việc cần làm**, **kết quả phải có (DoD, "xong" nghĩa là gì)**. Làm theo thứ tự đánh số trừ khi có ghi "song song".

---

### 👤 THÀNH VIÊN A — Smart Contract (M1) + Màn hình Bệnh viện (M4)

**Thư mục sở hữu:** `contracts-hardhat/`, `frontend/src/contracts/`, `frontend/src/pages/hospital/`

**Vì sao A phụ trách cả M4:** A hiểu hàm contract nhất, nên màn hình Bệnh viện (gọi `verifyInsurance`, `submitClaim`, `confirmClaim`) là chỗ tự nhiên nhất. Việc này cũng giúp cân bằng với C (không phải gánh cả 3 giao diện).

#### A1. Khung contract (làm ĐẦU TIÊN, nửa đến 1 ngày) — mở khóa cho B và C
- Khởi tạo Hardhat project trong `contracts-hardhat/`, cài OpenZeppelin.
- Viết `HealthInsuranceNFT.sol` với đủ struct, enum, event, **tên hàm và tham số đúng file 01 mục 5.2**, thân hàm tạm để trống hoặc `revert("TODO")`.
- Biên dịch được, chạy `exportAbi.js` ghi `abi.json` và `address.json` (địa chỉ tạm) vào `frontend/src/contracts/`.
- Push lên nhánh `tram`, mở PR vào `main`, báo B (Phương Anh) và C (Lan Anh).
- **DoD:** C chạy được `new ethers.Contract(address, abi, signer)` không lỗi (chưa cần gọi thành công).

#### A2. Logic contract (song song với B, C)
Làm theo thứ tự (mỗi bước chạy test ngay):
1. Kế thừa `ERC721`, `AccessControl`, `ReentrancyGuard`. Khai báo `HOSPITAL_ROLE`. Constructor cấp `DEFAULT_ADMIN_ROLE` cho `msg.sender`.
2. `createPlan`, `setPlanActive`, `getPlans`.
3. `authorizeHospital`, `registerEncryptionKey`.
4. `purchasePolicy` (kiểm tra `msg.value == price`, mỗi ví một gói còn hạn, `_safeMint`, lưu `Policy`, `activePolicyOf`).
5. Soulbound: override `_update`; override `supportsInterface`; `tokenURI`.
6. `verifyInsurance`.
7. `submitClaim` (xử lý 2 trường hợp người gọi: chủ NFT hoặc bệnh viện).
8. `confirmClaim` (`onlyRole(HOSPITAL_ROLE)`).
9. `approveClaim` (kiểm tra hạn dùng, hạn mức, quỹ; Checks-Effects-Interactions; `nonReentrant`).
10. `rejectClaim`, `fundPool`, các hàm đọc (`getPolicy`, `getClaim`, `getClaimsByPatient`, `totalClaims`, `poolBalance`).
11. Emit đủ event ở từng hàm (file 01 mục 5.2). Event rất quan trọng vì console công ty BH đọc thống kê từ đây.
- **DoD:** các test ở A3 đều pass.

#### A3. Unit test (viết cùng lúc với A2, không để cuối)
- File `test/HealthInsuranceNFT.test.js`, dùng danh sách test case ở **file 03 mục 2** (≥ 20 case).
- Chạy `npx hardhat test`, chụp ảnh `passing` (dùng chụp nền sáng) cho báo cáo.
- (Khuyến khích) cài gas reporter để có bảng gas từng hàm cho chương 5.4.
- **DoD:** tất cả pass, có cả test "ví lạ bị revert" và "vượt hạn mức bị revert".

#### A4. Script triển khai và dữ liệu khởi tạo
- `deploy.js`: deploy lên mạng chỉ định, in địa chỉ, gọi `exportAbi.js`.
- `seed.js`: tạo sẵn 2 gói (ví dụ *Gói Cơ bản* và *Gói Nâng cao*), cấp quyền ví Bệnh viện, nạp quỹ, cho gói nào dùng CID PDF mẫu của B. Chạy 1 lệnh là xong.
- Chạy thử trên mạng local (`npx hardhat node`) trước.
- **DoD:** C và B chạy được contract thật trên local sau khi pull.

#### A5. Triển khai Sepolia + verify Etherscan
- Deploy Sepolia. Chạy verify để Etherscan hiển thị mã nguồn và tab Read/Write Contract.
- Chạy `seed.js` trên Sepolia.
- Chụp ảnh: trang contract trên Etherscan, tab Code đã verify, giao dịch deploy, giao dịch mua gói, mint NFT, chi trả.
- Gửi địa chỉ contract cho cả nhóm, cập nhật `address.json`, tag commit `v1-sepolia`.
- **DoD:** link `https://sepolia.etherscan.io/address/<địa chỉ>` mở ra thấy code đã verify.
- Lưu ý: sau khi deploy lên Sepolia **không sửa được contract**. Nếu phát hiện lỗi thì deploy bản mới, cập nhật `address.json`, thông báo cả nhóm. Vì vậy phải test kỹ trên local trước.

#### A6. Màn hình Bệnh viện (M4) — làm sau khi có A4 và khung của C
Trong `frontend/src/pages/hospital/`:
1. Ô nhập địa chỉ ví bệnh nhân + nút **"Kiểm tra thẻ bảo hiểm"** → `verifyInsurance` → hiện kết quả: ✅ "Thẻ #id hợp lệ, hạn mức còn X ETH, hết hạn dd/mm/yyyy" hoặc ❌ "Không có thẻ còn hiệu lực". **Chỉ khi hợp lệ mới mở khóa form bên dưới** (đây chính là nghiệp vụ Verification của Tiêu chí 4).
2. Form gửi claim: số tiền, chẩn đoán/ghi chú (mã hóa bằng `cryptoService`), chọn file hóa đơn và file xét nghiệm → `ipfsService.uploadFile` → `buildEncryptedRecord` → `uploadJSON` → `submitClaim`.
3. Danh sách claim do bệnh nhân tự gửi đang chờ xác nhận + nút **"Xác nhận chi phí"** (`confirmClaim`).
4. Hiển thị kết quả mỗi giao dịch qua `TxToast` của C (hash + link Etherscan).
- Nếu ví đang kết nối **không có role bệnh viện**, trang này hiện thông báo từ chối (RBAC ở giao diện) và các nút bị vô hiệu.
- Trong lúc chờ B xong service thật, dùng `services/mock/`.
- **DoD:** chạy đủ luồng 1–3 trên local và Sepolia, không lỗi.

#### A7. Báo cáo của A (xem mục 8)
Viết song song từ khi làm A2, đừng để dồn cuối.

**Ước lượng khối lượng A:** contract + test + deploy + 1 màn hình + ~35% báo cáo.

---

### 👤 THÀNH VIÊN B — Services IPFS + Mã hóa (M2) + Màn hình Công ty bảo hiểm (M5) + Thiết kế nghiệp vụ (BPMN)

**Thư mục sở hữu:** `frontend/src/services/`, `frontend/src/pages/insurer/`, `sample-data/`, `tools/web3py/`, `docs/bpmn/`

**Vì sao B phụ trách M5:** màn hình công ty bảo hiểm dùng nhiều nhất IPFS và giải mã (xem hồ sơ, retrieve), đều là mảng của B. Thêm nữa B có nhiều việc viết/vẽ (BPMN, chương 1, 3) nên phần code của B vẫn rất đủ.

#### B1. Dữ liệu mẫu (nửa ngày, làm đầu tiên)
Trong `sample-data/` tạo **dữ liệu giả**, trông chuyên nghiệp:
- `Policy_Basic.pdf`, `Policy_Premium.pdf`: điều khoản gói bảo hiểm (quyền lợi, hạn mức, loại trừ, thời hạn).
- `Medical_Bill_01.png`, `Medical_Bill_02.pdf`: hóa đơn viện phí giả có số tiền khớp với kịch bản demo.
- `Lab_Result_01.pdf` hoặc ảnh kết quả xét nghiệm giả.
- `Medical_Record_01.json`: bệnh án mẫu (chưa mã hóa), dùng test crypto.
- Một file `DEMO_SCENARIO.md` ghi rõ số tiền các kịch bản (xem file 03 mục 3) để A, B, C dùng chung.
- **DoD:** các file mở được, không chứa thông tin của người thật.

#### B2. Mock service (1–2 tiếng, làm trước để mở khóa A và C)
- `services/mock/mockIpfs.js`, `mockCrypto.js` đúng chữ ký hàm ở mục 3.2, 3.3. Trả `Promise` giả sau độ trễ nhỏ.
- `services/index.js` xuất ra hàm thật hay mock theo một cờ (`USE_MOCK`).
- Báo A và C là đã sẵn sàng.

#### B3. `ipfsService.js` (thật)
1. Gọi API upload của Pinata bằng JWT lấy từ `VITE_PINATA_JWT`. Tham khảo tài liệu Pinata hiện hành về endpoint upload file và JSON (API có thể thay đổi, đừng chép từ nguồn cũ).
2. `uploadFile`, `uploadJSON`, `fetchJSON`, `fetchBlob`, `gatewayUrl`.
3. Xử lý lỗi (mất mạng, sai JWT, file quá lớn) ném `Error` tiếng Việt.
4. Test thủ công bằng một trang nháp hoặc script Node: upload 3 loại file mẫu, ghi lại 3 CID, mở thử bằng gateway.
- **DoD:** có 3 CID thật (PDF, ảnh, JSON) mở được. **Chụp ảnh trang Pinata** cho báo cáo.
- Ghi chú rủi ro: JWT nằm ở frontend nên có thể bị xem trong trình duyệt. Chấp nhận ở mức đồ án, ghi vào mục hạn chế, **không commit JWT**, thu hồi key sau khi nộp bài.

#### B4. `cryptoService.js` (thật)
Làm theo thiết kế file 01 mục 7. Thứ tự gợi ý:
1. Dùng **WebCrypto API** của trình duyệt (`crypto.subtle`), không cần thư viện ngoài.
2. AES-256-GCM: `aesEncrypt`, `aesDecrypt` (iv ngẫu nhiên 12 byte mỗi lần).
3. RSA-OAEP 2048 (SHA-256): `generateRsaKeyPair`, `rsaEncrypt`, `rsaDecrypt`, xuất/nhập khóa dạng PEM hoặc JWK.
4. `wrapKey`/`unwrapKey` (bọc khóa AES bằng RSA).
5. `buildEncryptedRecord(record, recipients)` và `openEncryptedRecord(...)`.
6. `saveKeyPair/loadKeyPair/exportKeyPair/importKeyPair` bằng `localStorage` (khóa theo địa chỉ ví).
7. **Test:** viết file kiểm thử nhỏ (có thể chạy bằng Node với `crypto.webcrypto`): mã hóa rồi giải mã ra đúng bản gốc; sai khóa thì giải mã thất bại; sửa 1 byte dữ liệu thì GCM báo lỗi.
- **DoD:** test chạy pass; chụp được ảnh "chuỗi gốc → chuỗi đã mã hóa" cho báo cáo.
- Cảnh báo: `localStorage` mất khi xóa dữ liệu trình duyệt. Nút Xuất/Nhập khóa là bắt buộc để demo không toang.

#### B5. Màn hình Công ty bảo hiểm (M5) — sau khi có khung của C và contract chạy local của A
Trong `frontend/src/pages/insurer/`, chia thành các tab/khối:
1. **Quản trị:** form tạo gói (nhập thông tin + chọn PDF → `uploadFile` → `createPlan`), danh sách gói, bật/tắt gói; form cấp/thu hồi quyền ví bệnh viện (`authorizeHospital`); nút nạp quỹ (`fundPool`); hiển thị số dư quỹ.
2. **Danh sách yêu cầu bồi thường:** bảng claim (id, bệnh nhân, số tiền, trạng thái, bệnh viện đã xác nhận chưa). Mỗi dòng có:
   - nút **"Xem hồ sơ IPFS"**: lấy `recordCID` từ chain → `fetchJSON` → `openEncryptedRecord` (giải mã bằng khóa riêng của công ty BH) → hiện chẩn đoán, và hóa đơn qua `fetchBlob` (**đây là thao tác Retrieve của Tiêu chí 3**);
   - nút **"Duyệt và chi trả"** (`approveClaim`) và **"Từ chối"** (`rejectClaim`).
3. **Giám sát và thống kê on-chain:** bảng các sự kiện (`PolicyPurchased`, `ClaimSubmitted`, `ClaimApproved`...) đọc bằng `queryFilter`, hiển thị thời gian, hash, link Etherscan; thẻ thống kê: tổng phí thu, tổng đã chi, số claim theo trạng thái, số dư quỹ.
- Chỉ ví có `DEFAULT_ADMIN_ROLE` mới vào được trang; ví khác thấy thông báo từ chối.
- **DoD:** tạo gói, cấp quyền, duyệt claim và xem hồ sơ giải mã được trên local và Sepolia.

#### B6. BPMN (làm song song từ đầu, không phụ thuộc code)
- Vẽ **4–5 sơ đồ** theo file 01 mục 8 (Thiết lập hệ thống; Mua bảo hiểm và mint NFT; Khám bệnh và gửi claim; Duyệt và chi trả; Giám sát).
- Dùng công cụ miễn phí (draw.io hoặc bpmn.io). Xuất PNG nền trắng, chữ đủ lớn (đồng bộ yêu cầu cỡ chữ).
- Mỗi sơ đồ kèm 1 đoạn văn mô tả (3–5 câu) và caption `Hình 3.x`.
- **DoD:** file `.png` trong `docs/bpmn/` + đoạn mô tả viết sẵn.

#### B7. Script Web3.py (tùy chọn, làm nếu còn thời gian, chi phí thấp)
`tools/web3py/monitor.py`: kết nối RPC Sepolia, dùng ABI trong repo, đọc event của contract và in thống kê ra console. Có tác dụng: khớp tên Tiêu chí 2 ("Web3.py / Frontend") và nối với lab 2. Chụp ảnh chạy script đưa vào báo cáo như "công cụ giám sát bổ sung".

#### B8. Báo cáo của B (xem mục 8)

**Ước lượng khối lượng B:** 2 service + 1 màn hình + BPMN + dữ liệu mẫu + ~35% báo cáo.

---

### 👤 THÀNH VIÊN C — Khung ứng dụng + Màn hình Bệnh nhân (M3) + Điều phối tích hợp (M6) + Hoàn thiện báo cáo/slide/video

**Thư mục sở hữu:** `frontend/` (trừ các thư mục con đã giao cho A và B), `README.md`, `docs/slides/` bản tổng, `docs/video/`

#### C1. Khung ứng dụng (làm NGAY SAU M0, 1–2 ngày) — mở khóa A và B
1. Tạo dự án React + Vite trong `frontend/`, cài `ethers` v6, router, (tùy chọn) thư viện UI nhẹ. Dùng giao diện **nền sáng, tương phản cao, chữ lớn** (phù hợp quy định báo cáo).
2. **WalletProvider:** nút "Kết nối MetaMask", lấy địa chỉ + `signer`, kiểm tra đúng mạng Sepolia (nếu sai thì yêu cầu chuyển mạng), lắng nghe đổi tài khoản/đổi mạng.
3. **Phát hiện vai trò (RBAC):** hỏi contract `hasRole(DEFAULT_ADMIN_ROLE)`, `hasRole(HOSPITAL_ROLE)` → vai trò `insurer | hospital | patient`. Tự chuyển đến route tương ứng; ví không có quyền mà gõ URL trang khác thì bị chặn.
4. **Thành phần dùng chung:** `Layout`, `TxToast` (đang xử lý → thành công + hash + link Etherscan → lỗi), `ErrorBox` (map lỗi revert ra tiếng Việt theo bảng ở mục 3.1), `Loading`, `Address` (rút gọn + sao chép).
5. **`contractService`** (mục 3.5).
6. Đăng ký sẵn 3 route trống (M0.5), push và báo A, B.
- **DoD:** chạy `npm run dev`, kết nối ví, thấy vai trò đúng cho 3 ví demo (dùng ABI nháp, khi contract thật có sau thì cập nhật).

#### C2. Màn hình Bệnh nhân (M3) — làm bằng mock trước, sau cắm contract thật
Trong `frontend/src/pages/patient/`:
1. Đăng ký khóa mã hóa lần đầu (tạo RSA, `registerEncryptionKey`) + nút Xuất/Nhập khóa.
2. **Danh sách gói bảo hiểm** (từ `getPlans`): tên, giá, hạn mức, thời hạn, link xem PDF điều khoản (`gatewayUrl`).
3. **Mua gói:** nhập mã số bảo hiểm → mã hóa RSA bằng khóa công khai của công ty BH → `purchasePolicy` kèm ETH. (Nghiệp vụ Minting)
4. **Thẻ bảo hiểm NFT:** hiển thị mã thẻ, gói, hạn mức tối đa, **số dư hạn mức còn lại**, hạn dùng, trạng thái hiệu lực (đây là yêu cầu "xem số dư bảo hiểm" của đề).
5. **Gửi yêu cầu bồi thường** (tùy chọn nhưng nên có vì đề cho phép bệnh nhân gửi): nhập số tiền, tải hóa đơn/xét nghiệm → IPFS → `submitClaim`.
6. **Danh sách claim của tôi** với trạng thái **Pending / Approved / Rejected** (màu khác nhau, kèm số tiền, link tx).
7. Nút "Xem hồ sơ của tôi" giải mã bệnh án bằng khóa riêng của bệnh nhân.
- **DoD:** chạy đủ trên local, rồi trên Sepolia.

#### C3. Điều phối tích hợp (M6)
Làm khi A1–A4, B3–B4 đã xong:
1. Họp 30 phút, đổi `USE_MOCK = false`, cả nhóm cùng chạy luồng đầy đủ trên **local**.
2. Ghi danh sách lỗi phát hiện vào GitHub Issues, gán người chịu trách nhiệm.
3. Sau khi A deploy Sepolia: chạy lại **luồng chuẩn** (file 03 mục 3) trên Sepolia, 3 lần liên tiếp không lỗi mới coi là ổn.
4. Làm **trang/chế độ "Pre-flight check"** nhỏ (tùy chọn): kiểm tra đúng mạng, đủ ETH, contract có phản hồi, Pinata gọi được. Giúp giảm lỗi lúc demo (Tiêu chí 2: tối đa 1 lỗi).

#### C4. Báo cáo, slide, video (M7)
- **Ghép báo cáo** từ các chương của A và B, thống nhất định dạng, đánh số hình/bảng, mục lục, danh mục hình/bảng, bảng chữ viết tắt, tài liệu tham khảo (checklist file 03 mục 1).
- **Slide:** mỗi người làm slide phần mình (file riêng trong `docs/slides/`), C hợp nhất và định dạng.
- **Video demo:** quay màn hình theo kịch bản file 03 mục 3, **chèn phụ đề tiếng Việt** (rubric yêu cầu có caption). B hỗ trợ viết nội dung phụ đề.
- **Kiểm tra chính tả toàn bộ** và tính nhất quán tên (xem file 03).

**Ước lượng khối lượng C:** khung app + 1 màn hình + tích hợp + định dạng và ghép tài liệu + ~30% báo cáo.

---

## 5. KIỂM TRA CÂN BẰNG KHỐI LƯỢNG

| Hạng mục | A | B | C |
|---|---|---|---|
| Code lõi | Contract + test + deploy | 2 service (IPFS, Crypto) | Khung app + hợp tác contractService |
| Màn hình | Bệnh viện | Công ty bảo hiểm | Bệnh nhân + khung dùng chung |
| Việc không phải code | Etherscan verify, ảnh minh chứng | Dữ liệu mẫu, BPMN | Điều phối tích hợp, định dạng, video |
| Báo cáo (chương) | 2.1–2.4, 3.6, 4.2, 4.5 (bệnh viện), 4.6, 5.1, 5.4 | 1, 2.5–2.6, 3.1–3.5, 3.7, 4.3, 4.4, 4.5 (công ty BH) | 2.7, 3.3, 4.1, 4.5 (bệnh nhân), 5.2, 5.5, 6 + ghép/định dạng |
| Mức nặng | Cao ở đầu, nhẹ dần | Đều | Nhẹ ở đầu, nặng ở cuối |

Cái hay của cách chia: **nặng/nhẹ lệch pha nhau.** A nặng lúc đầu (contract), C nặng lúc cuối (tích hợp, định dạng). Nếu A xong sớm, A sang hỗ trợ viết test cho `cryptoService` hoặc review giao diện của B/C, thay vì ngồi chờ.

**Quy tắc "hết việc thì giúp":** ai xong phần của mình thì hỏi nhóm trước khi tự ý đụng thư mục người khác. Cách giúp không gây xung đột: viết test, review PR, viết tài liệu, chụp ảnh minh chứng, tập demo.

---

## 6. QUY TRÌNH LÀM VIỆC TRÊN GITHUB (để không conflict, không chờ nhau)

1. **Mỗi lần làm việc:** `git checkout <nhánh cố định của mình>` (`tram`, `phuong-anh` hoặc `lan-anh`), làm việc, rồi `git pull origin main` (gộp `main` mới nhất, kiểm tra không conflict), `git push origin <nhánh của mình>`. **Không tạo nhánh mới.**
2. Chỉ sửa file **trong thư mục của mình**. Nếu cần file ở thư mục người khác, nhắn họ.
3. Commit nhỏ, thường xuyên, message có mã module.
4. Mở **Pull Request** từ nhánh của mình vào `main`. Người khác xem nhanh (5 phút) rồi merge. Quy tắc: PR **nhỏ, merge nhanh trong ngày**. Vì nhánh sống lâu, **phải `git pull origin main` thường xuyên** (ít nhất mỗi lần bắt đầu phiên làm việc và trước mỗi lần push) để tránh conflict lớn.
5. Sau khi PR được merge: `git checkout <nhánh của mình> && git pull origin main` để nhánh bắt kịp `main`.
6. **File sinh tự động** (`abi.json`, `address.json`) chỉ A (Trâm) commit. B (Phương Anh), C (Lan Anh) không tự sửa tay.
7. **Báo cáo:** mỗi người viết trong **file riêng** trong `docs/report/` (ví dụ `ch2_A_blockchain.md`, `ch3_B_thiet_ke.md`), không cùng chỉnh một file Word. C là người duy nhất ghép vào file Word cuối. Tránh việc 3 người sửa một file `.docx` (file nhị phân, không merge được).
8. **Ảnh chụp minh chứng:** để trong `docs/report/images/<tên-người>/`, đặt tên có nghĩa (`sepolia_deploy_tx.png`).
9. **Không có lịch họp.** Phối hợp qua chat nhóm, Git và `docs/progress/PROGRESS_<A|B|C>.md` (cập nhật cuối mỗi ngày: xong gì, kẹt gì, cần gì từ ai). Kẹt quá 1 ngày thì nhắn chat kèm mã việc.
10. **Gắn tag trước mốc quan trọng:** `v0-local` (chạy được trên local), `v1-sepolia` (deploy Sepolia), `v2-final` (bản nộp). Có tag thì lỡ lỗi vẫn quay lại được bản chạy tốt.

**Cách xử lý khi lỡ conflict:** đừng xóa bừa. Gọi người kia, mở file xung đột, giữ cả hai thay đổi hợp lý. Nếu không chắc, mở PR mới và nhờ người còn lại xem.

---

## 7. THỨ TỰ THỰC HIỆN TỔNG THỂ (chỉ có thứ tự, không bảng tuần)

**Giai đoạn 0 — Chuẩn bị chung:** M0 (mục 2). Chia vai A/B/C.

**Giai đoạn 1 — Mở khóa nhau (ngắn):**
- A1 (khung contract + ABI nháp)
- B1 (dữ liệu mẫu) + B2 (mock service)
- C1 (khung ứng dụng)
- Cả ba: bắt đầu bản nháp báo cáo mục của mình.

**Giai đoạn 2 — Làm song song, mỗi người ở lãnh địa riêng:**
- A: A2, A3, A4 (logic, test, script)
- B: B3, B4 (IPFS, mã hóa) rồi B6 (BPMN)
- C: C2 (màn hình Bệnh nhân bằng mock)
- Cả ba: viết báo cáo phần thiết kế và lý thuyết (không cần chờ code).

**Giai đoạn 3 — Cắm vào nhau (local):**
- Hợp nhất `main`, tắt mock, thay bằng contract và service thật trên local.
- A: A6 (UI bệnh viện). B: B5 (UI công ty BH). C: hoàn thiện C2 với dữ liệu thật + C3 bước 1–2.
- Chạy luồng đầy đủ trên local, sửa lỗi. Gắn tag `v0-local`.

**Giai đoạn 4 — Testnet:**
- A5 (deploy Sepolia, verify Etherscan, seed).
- C3 bước 3 (luồng chuẩn 3 lần liên tiếp không lỗi).
- Chụp toàn bộ ảnh minh chứng (A: Etherscan; B: Pinata; C: giao diện). Gắn tag `v1-sepolia`.

**Giai đoạn 5 — Hoàn thiện sản phẩm nộp:**
- Hoàn thiện chương 4, 5, 6; C ghép báo cáo, định dạng, kiểm tra chính tả, mục lục, danh mục.
- Làm slide (mỗi người phần mình), C hợp nhất.
- Quay video demo có phụ đề.
- Đối chiếu **rubric** (file 03 mục 1) từng dòng. Gắn tag `v2-final`.

**Giai đoạn 6 — Tập dượt và bảo vệ:**
- Tập demo ít nhất 3 lần theo kịch bản (file 03 mục 3), có đồng hồ bấm giờ.
- Luyện câu hỏi bảo vệ (file 03 mục 5), mỗi người học kỹ phần mình và hiểu phần của người khác ở mức tổng quát.
- Chuẩn bị phương án dự phòng (video, ảnh, ví phụ có sẵn ETH).

---

## 8. PHÂN CHIA CHƯƠNG BÁO CÁO (đã nêu chi tiết nội dung ở file 01 mục 10)

| Chương/mục | Người viết | File gợi ý trong `docs/report/` |
|---|---|---|
| Mở đầu (bìa, mục lục, danh mục, viết tắt) | C | `00_front.md` |
| Chương 1 Giới thiệu | B | `ch1_B.md` |
| 2.1–2.4 Blockchain, Solidity, ERC-721, Parametric | A | `ch2_A.md` |
| 2.5–2.6 IPFS, Pinata, AES/RSA, RBAC | B | `ch2_B.md` |
| 2.7 Công cụ DApp | C | `ch2_C.md` |
| 3.1, 3.2, 3.4, 3.5, 3.7 | B | `ch3_B.md` |
| 3.3 Kiến trúc tổng thể | C | `ch3_C.md` |
| 3.6 Thiết kế smart contract | A | `ch3_A.md` |
| 4.1 Môi trường | C | `ch4_C.md` |
| 4.2 Hiện thực smart contract (+ mục "Kỹ thuật thực hiện ràng buộc") | A | `ch4_A.md` |
| 4.3, 4.4 IPFS và mã hóa | B | `ch4_B.md` |
| 4.5 Giao diện (mỗi người phần màn hình của mình) | A, B, C | `ch4_5_<ten>.md` |
| 4.6 Triển khai Sepolia | A | `ch4_A.md` |
| 5.1, 5.3 (phần contract), 5.4 | A | `ch5_A.md` |
| 5.3 (phần dữ liệu/mã hóa) | B | `ch5_B.md` |
| 5.2, 5.5 | C | `ch5_C.md` |
| Chương 6 + Tài liệu tham khảo (hợp nhất) | C | `ch6_C.md` |

Mỗi người gửi nội dung chương cho C ở dạng Word hoặc Markdown. C đổ vào một file Word duy nhất để định dạng cỡ chữ, caption, số trang.

---

## 9. NHỮNG THỨ BẠN CÓ THỂ ĐANG THIẾU (đã bổ sung, tick để chắc)

- [ ] Có **deadline thật** của thầy và các mốc nội bộ sớm hơn (ghi ở README).
- [ ] Có **4 ví demo** đủ ETH và địa chỉ ghi trong file 00 mục 6.1.
- [ ] Có file **`.env.example`** và mọi người biết không commit key.
- [ ] Có **quỹ bảo hiểm được nạp** trước khi demo (không thì `approveClaim` revert "Quy bao hiem khong du").
- [ ] Có **khóa RSA đã tạo và sao lưu** cho cả 3 vai trò trước giờ demo.
- [ ] Có **kịch bản demo** + số tiền cố định (file 03).
- [ ] Có **video dự phòng có phụ đề**.
- [ ] Có **Etherscan verify** để thầy bấm vào xem code.
- [ ] Có **mục hạn chế** trung thực trong báo cáo.
- [ ] Có **bảng chữ viết tắt**, danh mục hình/bảng, caption mọi hình/bảng.
- [ ] Có **người ngoài (ví thứ 4)** để chứng minh RBAC chặn thật.
- [ ] Hỏi thầy (nếu còn thời gian): giao diện dùng JavaScript/Ethers.js có chấp nhận cho tiêu chí "Web3.py / Frontend" không? (Rubric ghi "Web3.py / Frontend (DApp)" nên có khả năng cao là chấp nhận. Có script Web3.py nhỏ của B7 làm chắc hơn.)
