# 00 — KẾ HOẠCH TỔNG 7 TUẦN (MASTER PLAN)

**Dự án:** IS355 — Hệ thống quản lý bảo hiểm y tế phi tập trung
**Thời gian:** Thứ Hai 19/10/2026 → **thuyết trình trực tiếp:** slide + demo phải xong trước **Thứ Sáu 04/12** · **nộp báo cáo Word + video demo: hạn chốt Thứ Ba 08/12/2026** (mục tiêu nộp sớm từ 06/12)
**Nhóm:** A = **Trâm** · B = **Phương Anh** · C = **Lan Anh**
**Sản phẩm:** **MediChain** (tên smart contract trong code vẫn là `HealthInsuranceNFT`) · **Repo:** `https://github.com/TramNguyen2412/IS355.R11_BlockChain.git` (Private; thư mục local `MediChain`) · **Nhánh Git cố định:** A (Trâm) `tram` · B (Phương Anh) `phuong-anh` · C (Lan Anh) `lan-anh`
**Đọc kèm (bắt buộc):** `docs/00_AI_RULES_AND_CONTRACTS.md` (gọi tắt **file 00**). Mọi tên hàm, thư mục, số liệu mẫu lấy từ file 00, file này không lặp lại.

---

## TỔNG QUAN DỰ ÁN TRONG 1 TRANG (đọc phần này trước)

### Đồ án làm ra cái gì?
Một **ứng dụng web chạy trên blockchain** (mạng thử nghiệm **Sepolia** của Ethereum, tiền ảo miễn phí) để quản lý bảo hiểm y tế, có 3 đối tượng dùng: **Bệnh nhân**, **Bệnh viện**, **Công ty bảo hiểm**. Ba ý chính:
- **Thẻ bảo hiểm là một NFT** (ERC-721) gắn với ví của bệnh nhân, không chuyển nhượng được.
- **Hồ sơ bệnh án và hóa đơn lưu trên IPFS** (nơi lưu file phi tập trung, dùng dịch vụ Pinata), nội dung nhạy cảm được **mã hóa** (AES + RSA) nên chỉ ví được phép mới đọc được.
- **Chi trả tự động theo luật viết sẵn trong smart contract**: contract tự kiểm tra thẻ còn hạn, còn hạn mức, quỹ đủ tiền, bệnh viện đã xác nhận, rồi mới chuyển tiền.

### 5 nghiệp vụ của hệ thống (cũng là 5 sơ đồ BPMN trong báo cáo)
| # | Nghiệp vụ | Ai thực hiện | Nội dung | Hàm chính trên contract |
|---|---|---|---|---|
| 1 | Thiết lập hệ thống | Công ty bảo hiểm | Đăng ký khóa mã hóa, tạo gói bảo hiểm, cấp quyền cho bệnh viện, nạp quỹ chi trả | `registerEncryptionKey`, `createPlan`, `authorizeHospital`, `fundPool` |
| 2 | Mua bảo hiểm và phát hành thẻ NFT | Bệnh nhân | Chọn gói, trả phí bằng ETH, nhận thẻ NFT | `purchasePolicy` |
| 3 | Khám bệnh và gửi yêu cầu bồi thường | Bệnh viện (hoặc bệnh nhân) | Kiểm tra thẻ NFT, nhập chi phí, tải hóa đơn và hồ sơ (đã mã hóa) lên IPFS, bệnh viện xác nhận chi phí | `verifyInsurance`, `submitClaim`, `confirmClaim` |
| 4 | Duyệt và chi trả | Công ty bảo hiểm gọi, **contract tự quyết** | Contract tự kiểm tra điều kiện rồi chuyển ETH cho bệnh nhân (hoặc từ chối) | `approveClaim`, `rejectClaim` |
| 5 | Giám sát | Công ty bảo hiểm | Xem lịch sử sự kiện và thống kê | đọc sự kiện (`getEvents`, `getStats`) |

### Ba người làm gì (nói ngắn)
| Người | Phụ trách chính | Màn hình phụ trách |
|---|---|---|
| **A — Trâm** | **Smart contract** (nghiệp vụ 1–4 phía blockchain), test, đưa lên Sepolia, verify Etherscan | Màn hình **Bệnh viện** (nghiệp vụ 3) |
| **B — Phương Anh** | **IPFS (Pinata) và mã hóa AES/RSA**, dữ liệu mẫu, sơ đồ BPMN | Màn hình **Công ty bảo hiểm** (nghiệp vụ 1, 4, 5) |
| **C — Lan Anh** | **Khung ứng dụng web, kết nối ví, thông báo lỗi tiếng Việt**, kiểm thử toàn luồng, ghép báo cáo/slide/video | Màn hình **Bệnh nhân** (nghiệp vụ 2) |

### 5 tiêu chí Rubric ↔ ai làm chính ↔ khi nào xong
| Tiêu chí Rubric | Điểm cần đạt | Ai làm chính | Xong khi |
|---|---|---|---|
| 1. Smart contract | ≥ 3 hàm nghiệp vụ, ≥ 2 ràng buộc logic, triển khai testnet | A (Trâm) | Local: tuần 2 · Sepolia: tuần 4 |
| 2. Web3.py / Frontend | ≥ 3 hàm on-chain, ≤ 1 giao dịch lỗi khi demo, có mã hóa AES/RSA | C (Lan Anh: khung và Bệnh nhân), A (Trâm: Bệnh viện), B (Phương Anh: Công ty BH và mã hóa) | Tuần 3 (local), tuần 5 (3 lần chạy sạch) |
| 3. IPFS | ≥ 3 loại dữ liệu, có upload và truy xuất, phân quyền theo vai trò | B (Phương Anh) | Tuần 2 (thật), tuần 4 (minh chứng) |
| 4. NFT (ERC-721) | ≥ 2 thao tác token (mint, xác minh) | A (contract, xác minh ở màn Bệnh viện), C (hiển thị thẻ) | Tuần 2 và tuần 4 |
| 5. Báo cáo và thuyết trình | Đúng hình thức: không lỗi chính tả, đánh số, caption, bảng chữ viết tắt, tài liệu tham khảo, cỡ chữ, video có phụ đề | C ghép; cả ba viết chương | Tuần 6–7 |

### Vài từ hay gặp
- **Mock (bản giả lập):** một bản chạy trong bộ nhớ, trả dữ liệu mẫu giống hệt thật, để mình làm việc được khi phần thật của người khác chưa xong.
- **Local:** chạy thử trên máy mình (blockchain giả do Hardhat dựng), chưa tốn tiền, chưa cần mạng.
- **`dryRun` (chạy thử trước khi gửi):** hỏi contract "giao dịch này có bị từ chối không?" mà chưa gửi lên chain, để báo lỗi sớm và **không tạo giao dịch lỗi** (Rubric yêu cầu tối đa 1).
- **PR (Pull Request):** cách đưa code của mình vào nhánh chính `main` để người khác xem rồi gộp.
- **Mốc bàn giao (H1–H6):** lúc một người đẩy lên Git thứ mà người khác sẽ dùng (mục 1.1).

---

## 0. CÁCH DÙNG FILE NÀY

### 0.1. Với người
- Mỗi tuần có: **Mục tiêu chung của tuần (đang làm nghiệp vụ nào)** → **Ai đang làm gì (nói bằng lời thường, kèm liên quan Rubric nào)** → **bảng việc chi tiết kỹ thuật** → **mốc bàn giao (nếu có)** → **xong khi nào + ảnh cần chụp**.
- Người không dùng AI chỉ cần đọc hai phần đầu của mỗi tuần; bảng chi tiết kỹ thuật phía dưới dành cho người code và cho AI.
- Mỗi việc nhỏ có một **mã việc** (A-05, B-04, C-06...) để gọi tên cho gọn. Nếu có dùng AI, mỗi lần chỉ giao **đúng một mã việc**.
- Nhãn ưu tiên: **P1** = bắt buộc (rubric hoặc luồng chính), **P2** = nên có, **P3** = tùy chọn. Khi trễ, cắt P3 trước rồi P2 (mục 5). **Không bao giờ cắt P1.**
- Ước lượng tải: mỗi người khoảng **8–12 giờ/tuần**. Tuần nào bận thi hoặc bài khác thì nói trong chat, kéo P2/P3 sang tuần sau, **giữ nguyên P1 và các mốc có ngày**.

### 0.2. Nếu bạn dùng AI hỗ trợ (AI đọc kỹ phần này trước khi làm)
1. Đọc **file 00** trước. Rồi đọc `docs/progress/PROGRESS_<vai trò>.md`.
2. Người dùng sẽ cho bạn **một mã việc**. Tìm đúng dòng đó trong file này. **Chỉ làm việc đó.** Không làm việc có mã khác dù thấy "tiện".
3. Chỉ tạo/sửa file ghi ở cột "Việc". Nếu cần file ngoài danh sách đó hoặc ngoài thư mục vai trò (file 00 mục 3): **dừng và hỏi**.
4. Tên hàm, tham số, số liệu: **chép nguyên văn từ file 00** (mục 4 và mục 6). Không đổi, không thêm.
5. Cột "Xong khi" là điều kiện hoàn thành. Chạy đúng lệnh ghi ở đó và báo kết quả thật. Không tuyên bố "xong" khi chưa chạy.
6. Cuối phiên cập nhật `PROGRESS_<vai trò>.md`.
7. Việc có ghi **"Tra tài liệu chính thức trước"** (ví dụ cách gọi API của Pinata, cách cấu hình Hardhat): **không đoán từ trí nhớ**. Hãy yêu cầu người dùng mở trang tài liệu chính thức, chép đoạn liên quan dán cho bạn, rồi mới làm.

### 0.3. Câu lệnh mẫu để giao một việc cho AI (chỉ cần nếu bạn dùng AI; điền vào chỗ trống)
```text
Bạn là trợ lý của thành viên <A|B|C>. Đọc docs/00_AI_RULES_AND_CONTRACTS.md và docs/progress/PROGRESS_<A|B|C>.md.
Việc cần làm: <mã việc, ví dụ A-05>. Tìm dòng đó trong docs/plan/00_MASTER_PLAN.md (hoặc file chi tiết trong docs/plan/<A|B|C>/ nếu có) và chỉ làm việc đó.
Trước khi code, nhắc lại: vai trò, thư mục được sửa, file sẽ tạo/sửa. Cuối phiên cập nhật PROGRESS.
```

---

## 1. THIẾT KẾ ĐỂ KHÔNG AI PHẢI CHỜ AI

**Ba cách giữ cho mỗi người chạy độc lập:**

1. **Quy ước đã chốt sẵn trong file 00.** Tên hàm, kiểu dữ liệu, mã lỗi, số liệu mẫu và thư mục của từng người đều đã viết sẵn nên ai cũng biết trước phần của người kia trông ra sao. Không ai cần "xem code của bạn" mới làm được việc của mình. (Muốn đổi một quy ước thì cả ba phải đồng ý, theo file 00 mục 8.1.)
2. **Mỗi người có một bản giả lập (mock) riêng để làm việc trước, không cần chờ phần thật của người khác:**
   - **C** tự viết `contractService.mock.js` (bộ nhớ trong, dữ liệu theo file 00 mục 6.7). Khi `VITE_USE_MOCK=true`, **không cần blockchain** vẫn chạy được mọi màn hình. Giao diện có ô chọn "ví mẫu" (ADMIN/HOSPITAL/PATIENT/OUTSIDER) thay cho MetaMask. **A và B cũng dùng mock này** để dựng màn hình của mình trước khi contract xong.
   - **B** viết `mockIpfs.js`, `mockCrypto.js` (hình dạng dữ liệu y hệt bản thật, theo file 00 mục 4.5–4.6, 6.4–6.6).
   - **A** test contract bằng Hardhat local, không cần ai.
3. **Mỗi màn hình có một `KeySetup.jsx` riêng** nằm trong thư mục trang của chính người đó (cùng hành vi: tạo khóa RSA, đăng ký lên contract, xuất/nhập khóa). Chấp nhận trùng một đoạn code ngắn để **không phải chờ component dùng chung**.

**Thứ tự công việc theo tầng:** Tuần 1–2 mỗi người xây **lõi của mình độc lập hoàn toàn**. Tuần 3 mới cắm vào nhau (local). Tuần 4 lên Sepolia. Tuần 5 ổn định. Tuần 6–7 báo cáo, video, tập dượt.

### 1.1. Các mốc bàn giao giữa 3 người (chỉ có 6; ngoài 6 mốc này không ai phải chờ ai)

**Mốc bàn giao** = lúc một người đẩy (`git push`) thứ mà người khác sẽ dùng. Người nhận chỉ cần `git pull`, không cần họp.


| Mã | Hạn | Ai → Ai | Giao gì | Nếu giao trễ thì sao |
|---|---|---|---|---|
| **H1** | Thứ 4 21/10 | B → A, C | `frontend/src/services/index.js` + `mock/` (mockIpfs, mockCrypto, fixtures) đã `push` | A, C không cần dùng cho tới tuần 2. C có thể tạm dùng mock của mình |
| **H2** | Thứ 5 22/10 | A → C, B | Contract khung **biên dịch được** + `abi.json`, `address.json` (địa chỉ local) | C vẫn chạy bằng `contractService.mock.js`, chưa cần ABI thật tới tuần 2 |
| **H3** | CN 01/11 | A → B, C | Contract **hoàn chỉnh trên local** + `seed.js` chạy được + ABI cuối | Tuần 3 mới cần. Nếu trễ, B và C tiếp tục bằng mock, nhưng **E2E 07/11 bị đe dọa**, báo ngay |
| **H4** | CN 01/11 | B → A, C | `ipfsService.js` + `cryptoService.js` **bản thật** chạy được | Tuần 3 mới cần. Trễ thì A, C vẫn dùng mock, nhưng E2E 07/11 bị đe dọa |
| **H5** | Thứ 7 07/11 | Mỗi người tự làm, không cần họp | **Chạy thử toàn luồng trên local:** mỗi người tự chạy `E2E_CHECKLIST.md` trên máy mình (Hardhat có sẵn 4 ví mẫu nên một mình chạy được cả 3 vai), báo kết quả vào `PROGRESS` và chat nhóm | Không dời quá thứ 2 09/11 |
| **H6** | Thứ 2 09/11 | A → B, C | Contract trên **Sepolia** + `address.json` mới, đã commit | Cả nhóm chờ 1 việc này nên A ưu tiên số 1 cuối tuần 3 |

Ngoài 6 mốc này, mọi việc trao đổi chỉ qua `git pull` / `git push`. **Không họp để "bàn giao"**; người nhận chỉ cần đọc `PROGRESS` của người giao.

### 1.2. Cách phối hợp (không có lịch họp)
- **Git: mỗi người đúng 1 nhánh cố định cho cả dự án:** A (Trâm) = `tram`, B (Phương Anh) = `phuong-anh`, C (Lan Anh) = `lan-anh`. Quy trình: làm trên nhánh của mình → `git pull origin main` (gộp `main` mới nhất về nhánh mình, xử lý conflict nếu có) → `git push` nhánh mình → mở Pull Request vào `main`. Sau khi PR được merge, quay lại nhánh mình và `git pull origin main` trước khi làm tiếp. Không tạo nhánh phụ, không push thẳng `main`.
- Phối hợp **chỉ qua 3 thứ:** chat nhóm, Git (`push`/`pull`/PR), và file `PROGRESS_<vai trò>.md` của mỗi người.
- Cuối mỗi ngày làm việc, cập nhật `PROGRESS` của mình (xong gì, đang kẹt gì).
- Kẹt quá 1 ngày: nhắn chat nhóm kèm **mã việc** và nội dung kẹt.
- Mọi lần "chạy thử cả nhóm" (H5, Sepolia, 3 lần chạy sạch) đều **mỗi người tự chạy trên máy mình** và báo kết quả, không cần cùng giờ.

---

## 2. VIỆC LÀM TRONG LÚC RẢNH (khi chờ hoặc xong sớm; không phụ thuộc ai)

| Ai | Việc làm trong lúc rảnh (không phụ thuộc ai) |
|---|---|
| **A (Trâm)** | Viết nháp báo cáo 2.1–2.4 (blockchain, Solidity, ERC-721, bảo hiểm tham số); viết bản nháp 3.6 (bảng struct, bảng hàm từ file 00 mục 4.2); chuẩn bị bảng test case cho báo cáo (file 03 mục 2); đọc docs OpenZeppelin v5 `AccessControl`, `ERC721` |
| **B (Phương Anh)** | Vẽ BPMN (file 01 mục 8); viết nháp Chương 1, 2.5–2.6, 3.1, 3.2, 3.5, 3.7; làm đẹp dữ liệu mẫu (PDF, hóa đơn); viết `tools/web3py/monitor.py` (P3) |
| **C (Lan Anh)** | Viết `README.md`; vẽ sơ đồ kiến trúc 3.3; viết nháp 2.7, 4.1; tạo mẫu slide (nền sáng, chữ ≥ 20pt); tạo mẫu Word (chữ 15pt, caption, mục lục tự động); xin ETH Sepolia cho ví Bệnh nhân |

---

## 3. TỔNG QUAN 7 TUẦN

| Tuần | Ngày | Cả nhóm đang làm gì (nói đơn giản) | Mốc cuối tuần |
|---|---|---|---|
| 1 | 19/10 – 25/10 | **Dựng khung:** kho code chung, khung web, khung smart contract, các bản giả lập để mỗi người làm độc lập | Repo chạy; contract khung biên dịch; app React chạy với ví mẫu |
| 2 | 26/10 – 01/11 | **Xây lõi từng phần:** contract đủ nghiệp vụ 2, 3, 4 và 32 test; IPFS và mã hóa thật; màn hình Bệnh nhân | Contract + test pass; ipfs/crypto thật; màn Bệnh nhân chạy bằng mock |
| 3 | 02/11 – 08/11 | **Hoàn thiện 2 màn hình còn lại và ghép tất cả lại:** Bệnh viện, Công ty bảo hiểm; chạy cả luồng trên máy local | **Luồng chuẩn chạy trên local** (H5) |
| 4 | 09/11 – 15/11 | **Đưa lên mạng thử nghiệm Sepolia:** deploy, verify Etherscan, tạo gói thật, chạy với ví MetaMask thật | Contract trên Sepolia; chạy luồng trên Sepolia |
| 5 | 16/11 – 22/11 | **Chạy lặp cho ổn định, chụp ảnh minh chứng, khóa code** | **3 lần chạy sạch** trên Sepolia; đủ ảnh; **code freeze 22/11** |
| 6 | 23/11 – 29/11 | **Chuyển sang giấy tờ:** báo cáo Word, slide, kịch bản video | Báo cáo + slide bản đầy đủ; kịch bản video |
| 7 | 30/11 – 08/12 | **Hoàn thiện và nộp:** quay video có phụ đề, tự chấm Rubric, tập dượt; 04/12 sẵn sàng thuyết trình; 08/12 nộp Word + video | Video có phụ đề; **nộp Word + video trước 08/12** |

---

## 4. CHI TIẾT TỪNG TUẦN

---

### TUẦN 1 — 19/10 → 25/10 · DỰNG KHUNG

**🎯 Mục tiêu chung của tuần (nghiệp vụ):** **Chưa làm hoàn chỉnh nghiệp vụ nào.** Tuần này dựng "bộ khung" để 3 người làm song song mà không dẫm chân nhau: kho code chung, khung ứng dụng web chạy được bằng ví giả lập, khung smart contract (đã có đủ tên hàm nhưng thân hàm chưa làm), và các bản giả lập. Giống như xây móng và chia phòng trước khi xây từng phòng. Chạm bước đầu của **nghiệp vụ 1 (thiết lập hệ thống)**.

**Ai đang làm gì (nói bằng lời thường):**

- **Trâm (A)** — **dựng khung smart contract** rồi làm thật phần đầu của nghiệp vụ 1. *Liên quan Rubric 1 (smart contract).*
  - **A-01** — Cài Hardhat (công cụ viết, test và triển khai smart contract), cấu hình mạng local và Sepolia.
  - **A-02** — Viết file khung `HealthInsuranceNFT.sol`: khai báo đủ cấu trúc dữ liệu, sự kiện, tên hàm theo file 00; thân hàm để trống.
  - **A-03** — Viết script tự xuất ABI và địa chỉ contract cho giao diện dùng (mốc H2).
  - **A-04** — Làm thật nghiệp vụ 1: tạo gói bảo hiểm, bật/tắt gói, cấp quyền cho bệnh viện, đăng ký khóa mã hóa, nạp quỹ; viết 9 test đầu.
- **Phương Anh (B)** — **chuẩn bị dữ liệu mẫu và nền tảng IPFS/mã hóa.** *Liên quan Rubric 3 (IPFS) và Rubric 2 (mã hóa).*
  - **B-01** — Tạo tài khoản Pinata (nơi lưu file IPFS), làm file mẫu: PDF điều khoản, hóa đơn giả, bệnh án JSON (khớp số liệu file 00).
  - **B-02** — Viết các bản giả lập `mockIpfs`, `mockCrypto` để A và C dùng ngay (mốc H1).
  - **B-03** — Viết phần mã hóa RSA thật (tạo cặp khóa, mã hóa mã số bảo hiểm của bệnh nhân để chỉ công ty bảo hiểm đọc được).
- **Lan Anh (C)** — **dựng khung ứng dụng web và bản giả lập contract.** *Liên quan Rubric 2 (Frontend).*
  - **C-01** — *(Đã do A (Trâm) làm ở M0-A1: repo, cây thư mục, file gốc. C (Lan Anh) bỏ qua C-01 và bắt đầu từ C-02.)*
  - **C-02** — Tạo ứng dụng React (Vite) với 3 trang: Bệnh nhân, Bệnh viện, Công ty bảo hiểm, cùng các thành phần giao diện dùng chung.
  - **C-03** — Kết nối ví (MetaMask, hoặc ô chọn "ví mẫu" khi chạy giả lập), bảng dịch lỗi sang tiếng Việt.
  - **C-04** — Viết bản giả lập contract (`contractService.mock.js`) để cả nhóm chạy giao diện mà không cần blockchain; tự điều hướng theo vai trò của ví.

**Milestone:** repo đúng cấu trúc file 00 mục 3; contract khung biên dịch được; mock service có sẵn; app React chạy được bằng ví mẫu.

#### Thứ 2 19/10 — M0 (khởi động, làm trong ngày, không cần họp; mỗi người tự làm phần mình)
Thứ tự bắt buộc: **C trước, A và B sau** (vì A và B cần thư mục của C).

| ID | Ai | Việc | Xong khi |
|---|---|---|---|
| M0-A1 | **A (Trâm)** | **Trâm đảm nhận việc dựng repo (thay cho C).** Repo GitHub **Private** đã đăng ký với giảng viên: `https://github.com/TramNguyen2412/IS355.R11_BlockChain.git` (thư mục local đặt là `MediChain`; tên sản phẩm trên giao diện và báo cáo là **MediChain**; tên smart contract vẫn là `HealthInsuranceNFT`). Mời **B (Phương Anh)** và **C (Lan Anh)** làm cộng tác viên. Tạo đúng cây thư mục file 00 mục 3.1 (thư mục rỗng thêm file `.gitkeep`) và các file gốc: `.gitignore`, `.env.example` (file 00 mục 4.3), `.github/CODEOWNERS` (theo bảng file 00 mục 3.2), `AGENTS.md` và `CLAUDE.md` (3 dòng, file 00 mục 0.3), `README.md` tối thiểu, `docs/progress/PROGRESS_A/B/C.md`. Copy `docs/00_AI_RULES_AND_CONTRACTS.md` và file này vào `docs/` và `docs/plan/`. Dùng script `docs/plan/A/tools/bootstrap_repo.sh` (xem A00). Bảo vệ nhánh `main` (bắt buộc Pull Request). Tạo 3 nhánh cố định `tram`, `phuong-anh`, `lan-anh`. | `git clone` được, thấy đủ thư mục; B và C chuyển được sang nhánh của mình |
| M0-A2 | **A (Trâm)** | Tạo `frontend/src/pages/hospital/HospitalPage.jsx` chỉ chứa `export default function HospitalPage() { return <div>Màn hình Bệnh viện đang phát triển</div>; }` (script ở M0-A1 đã tạo sẵn). Làm việc trên nhánh `tram`, PR vào `main`. | PR được merge |
| M0-B | **B (Phương Anh)** | Sau khi A đã push repo: `git pull`, chuyển sang nhánh `phuong-anh`, thêm `docs/progress/PROGRESS_B.md`, `docs/plan/B/`, và `frontend/src/pages/insurer/InsurerPage.jsx` (`export default function InsurerPage()` với dòng chữ tương tự). PR từ nhánh `phuong-anh` vào `main`. | PR được merge |
| M0-ALL | Cả ba: A (Trâm), B (Phương Anh), C (Lan Anh) | Cài Node.js LTS, Git, VS Code, MetaMask. **Ví demo Sepolia:** A (Trâm) tạo ví **ADMIN** và **OUTSIDER**, B (Phương Anh) tạo ví **HOSPITAL**, C (Lan Anh) tạo ví **PATIENT** (4 ví này là **ví thử nghiệm không chứa tiền thật**). Vì nhóm không họp nên **cả ba cùng nhập 4 ví này vào MetaMask của mình** (chia sẻ khóa riêng của 4 ví thử nghiệm này qua tin nhắn riêng trong nhóm, **không ghi vào repo**), để ai cũng tự chạy được toàn luồng. Ngoài ra mỗi người có **ví cá nhân riêng** làm "Bệnh nhân thử" cho các lần chạy thử. Xin ETH Sepolia từ faucet đang hoạt động (ví ADMIN khoảng 0.3 ETH; mỗi ví còn lại khoảng 0.05 ETH). | Ví đã có ETH Sepolia (kiểm tra trong MetaMask) |

> **Không** ghi khóa riêng ví vào bất cứ file nào của repo, và **chỉ chia sẻ khóa của ví thử nghiệm Sepolia**, không bao giờ chia sẻ ví có tiền thật. Địa chỉ ví Sepolia điền vào cột "Địa chỉ Sepolia" của file 00 mục 6.1 **trong tuần 3** qua quy trình file 00 mục 8.1 (một lần).

#### Việc của A (Trâm) — tuần 1

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **A-01** | Thứ 3 20/10 | Khởi tạo `contracts-hardhat/`: dự án Hardhat (JavaScript), cài đúng thư viện file 00 mục 2.3 (Hardhat + plugin chính thức, `@openzeppelin/contracts` v5, `dotenv`). Sửa `hardhat.config.js`: compiler Solidity tương thích `^0.8.20`; mạng `hardhat` (local) và `sepolia` (đọc `SEPOLIA_RPC_URL`, `DEPLOYER_PRIVATE_KEY` từ `.env`); khóa Etherscan từ `ETHERSCAN_API_KEY`. Tạo `contracts-hardhat/.env` (không commit). **Ghi phiên bản các công cụ đã cài vào `PROGRESS_A.md` mục "Quyết định đã chốt"** (C sẽ chép vào README). *Tra tài liệu chính thức của Hardhat trước khi cấu hình.* | `npx hardhat compile` chạy không lỗi (với contract mẫu rỗng) | P1 |
| **A-02** | Thứ 5 22/10 | Viết **bản KHUNG** `contracts-hardhat/contracts/HealthInsuranceNFT.sol`: kế thừa `ERC721("Health Insurance Card","HIC")`, `AccessControl`, `ReentrancyGuard`; khai báo `HOSPITAL_ROLE`; **chép đúng** struct `Plan`, `Policy`, `Claim`, enum `ClaimStatus`, 10 event, **toàn bộ chữ ký hàm** của file 00 mục 4.2; hai mapping công khai `activePolicyOf`, `encryptionKeyOf`; các biến đếm `totalPlans/totalPolicies/totalClaims`. Hàm ghi: thân `revert("TODO")`. Hàm đọc: trả giá trị mặc định. **Không thêm hàm công khai nào ngoài file 00 mục 4.2.** | Biên dịch được; ABI chứa đúng các tên hàm/event của file 00 | P1 |
| **A-03** | Thứ 5 22/10 | Viết `scripts/exportAbi.js` (đọc artifact, ghi `frontend/src/contracts/abi.json` và `address.json` đúng mẫu file 00 mục 4.3, gồm trường `insurer` và `deployBlock`). Viết `scripts/deploy.js` (deploy, gọi `exportAbi`, in địa chỉ). | `npx hardhat node` + `npx hardhat run scripts/deploy.js --network localhost` ghi được 2 file JSON. **Push → H2** | P1 |
| **A-04** | CN 25/10 | Làm thật **bước 1** của contract: `constructor` (cấp `DEFAULT_ADMIN_ROLE` cho deployer), `createPlan`, `setPlanActive`, `getPlans`, `totalPlans`, `authorizeHospital` (grant/revoke `HOSPITAL_ROLE`), `registerEncryptionKey`, `fundPool`, `poolBalance`. Viết test **T01–T08 và T32** (file 03 mục 2) trong `test/HealthInsuranceNFT.test.js`. | `npx hardhat test` pass cho T01–T08, T32 | P1 |

#### Việc của B (Phương Anh) — tuần 1

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **B-01** | Thứ 3 20/10 | Tạo tài khoản Pinata (gói miễn phí), tạo API key/JWT, lưu vào `frontend/.env` (`VITE_PINATA_JWT`, **không commit**). Tạo thư mục `sample-data/` với: `Policy_Basic.pdf`, `Policy_Premium.pdf` (điều khoản gói; số tiền, hạn mức, thời hạn **khớp file 00 mục 6.2**), `Medical_Bill_01.png` (hóa đơn giả, tổng tiền **0.012 ETH tương đương 12 triệu đồng giả định**, ghi rõ "DỮ LIỆU GIẢ"), `Lab_Result_01.pdf`, `Medical_Record_01.json` (bản rõ đúng file 00 mục 6.6), `DEMO_SCENARIO.md` (chép bảng file 00 mục 6.3). **Không dùng thông tin người thật.** | File mở được, nội dung khớp số liệu file 00 | P1 |
| **B-02** | Thứ 4 21/10 | Tạo `frontend/src/services/mock/fixtures.js` (chép **nguyên văn** giá trị file 00 mục 6, số tiền dạng `BigInt`), `mock/mockIpfs.js` và `mock/mockCrypto.js` với **đúng chữ ký** file 00 mục 4.5–4.6 (`uploadFile`, `uploadJSON`, `fetchJSON`, `fetchBlob`, `gatewayUrl`; các hàm crypto). CID giả bắt đầu bằng `mock-`. `mockIpfs.fetchJSON("mock-cid-record-01")` trả `EncryptedRecord` mẫu mục 6.6. Tạo `services/index.js`: xuất `ipfsService` và `cryptoService` (mock khi `import.meta.env?.VITE_USE_MOCK === "true"`, nếu không thì bản thật). Bản thật chưa có thì file thật tạm ném lỗi "Chưa cài đặt". Test bằng `node --test` (trình chạy test có sẵn của Node, **không cài thêm thư viện**). **Push → H1** | `node --test frontend/src/services/tests/` pass; import được `services/index.js` | P1 |
| **B-03** | CN 25/10 | **`cryptoService.js` phần RSA** (WebCrypto thuần): `generateRsaKeyPair` (RSA-OAEP 2048, SHA-256, exponent 65537, xuất PEM: SPKI cho public, PKCS8 cho private), `rsaEncrypt`, `rsaDecrypt` (ném lỗi nếu bản rõ > 190 byte UTF-8, thông báo "Ma so bao hiem qua dai" theo file 00 mục 4.7). Test `node --test`: mã hóa rồi giải mã ra đúng chuỗi; sai khóa riêng thì lỗi. | Test pass | P1 |

#### Việc của C (Lan Anh) — tuần 1

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **C-01** | Thứ 2 19/10 | **Bỏ qua:** việc này do A (Trâm) đã làm ở M0-A1 (repo, cây thư mục, file gốc). C chỉ cần `git clone`, chuyển sang nhánh `lan-anh` và đọc file 00. | Đã xong (A làm) | P1 |
| **C-02** | Thứ 4 21/10 | Tạo dự án Vite + React (JavaScript) trong `frontend/`. `package.json` **chỉ** có các gói file 00 mục 2.3. `src/main.jsx`, `src/app/App.jsx` có router với 3 route: `/patient` → `pages/patient/PatientPage.jsx`, `/hospital` → `pages/hospital/HospitalPage.jsx`, `/insurer` → `pages/insurer/InsurerPage.jsx`. `src/styles/global.css`: nền sáng, chữ tối, cỡ chữ ≥ 16px. Components trong `components/shared/`: `Layout.jsx`, `Loading.jsx`, `Address.jsx` (rút gọn + nút sao chép), `ErrorBox.jsx`, `TxToast.jsx` (trạng thái: đang xử lý, thành công kèm hash, lỗi). | `npm install` và `npm run dev` chạy, thấy được 3 route (sau khi A, B merge stub của họ) | P1 |
| **C-03** | Thứ 5 22/10 | `src/app/errors.js` (xuất `toVietnameseError(err)` theo **đúng bảng** file 00 mục 4.7, nhận biết `ACTION_REJECTED`/mã 4001 và `AccessControlUnauthorizedAccount`); `src/app/format.js` (`formatEth`, `formatDate`, `shortAddress`); `src/app/WalletProvider.jsx` (context: `address`, `signer`, `provider`, `chainId`, `connect()`, `error`; dùng `BrowserProvider`; kiểm tra `chainId` so với `VITE_CHAIN_ID`, sai thì yêu cầu chuyển mạng; lắng nghe `accountsChanged`, `chainChanged`). **Khi `VITE_USE_MOCK=true`:** thay MetaMask bằng ô chọn 4 "ví mẫu" (ADMIN, HOSPITAL, PATIENT, OUTSIDER theo file 00 mục 6.1). | Chuyển ví mẫu → `address` đổi theo | P1 |
| **C-04** | CN 25/10 | `src/app/contractService.mock.js`: **bộ nhớ trong** (biến JS), khởi tạo theo file 00 mục 6.2 (2 gói), mục 6.7 (Policy 1, 3 claim), quỹ 0.1 ETH, HOSPITAL có role. Cài **đủ mọi hàm** của file 00 mục 4.4 với cùng chữ ký, đổi trạng thái thật trong bộ nhớ (ví dụ `purchasePolicy` tạo Policy mới; `approveClaim` kiểm tra hạn mức và đổi trạng thái; `getEvents` trả danh sách sự kiện đã phát sinh). `src/app/contractService.js`: chọn mock hay thật theo `VITE_USE_MOCK`; bản thật chưa viết thì ném "Chưa cài đặt". `src/app/roleDetection.js`: `detectRole(address)` → `"insurer" | "hospital" | "patient"` qua `getRoles`; tự điều hướng tới route tương ứng. `README.md`: cách chạy; chép phiên bản công cụ từ `PROGRESS_A.md`. | Mock: chọn ví HOSPITAL → vào `/hospital`; chọn ADMIN → `/insurer`; PATIENT hoặc OUTSIDER → `/patient`. **Push** (để A, B dùng mock) | P1 |

#### Mốc bàn giao tuần 1
- **H1 (B → A, C), thứ 4 21/10:** mock services.
- **H2 (A → C, B), thứ 5 22/10:** contract khung + ABI.
- *(Hai mốc này không chặn ai trong tuần 1; chỉ để các bạn có sẵn từ tuần 2.)*

#### Xong khi (cuối tuần 1) và ảnh cần chụp (nền sáng, lưu `docs/report/images/<A|B|C>/`)
| Ai | Lệnh chạy | Ảnh |
|---|---|---|
| A (Trâm) | `cd contracts-hardhat && npx hardhat test` | Ảnh terminal test pass T01–T08 |
| B (Phương Anh) | `node --test frontend/src/services/tests/` | Ảnh terminal test pass; ảnh 3 file mẫu mở ra |
| C (Lan Anh) | `cd frontend && npm run dev` | Ảnh giao diện với ô chọn ví mẫu và 3 trang |

---

### TUẦN 2 — 26/10 → 01/11 · LÕI CỦA MỖI NGƯỜI (độc lập hoàn toàn)

**🎯 Mục tiêu chung của tuần (nghiệp vụ):** **Làm xong phần lõi của từng người, độc lập nhau.** (1) Smart contract hoàn chỉnh cho **nghiệp vụ 2** (mua bảo hiểm, phát hành NFT), **nghiệp vụ 3** (gửi và xác nhận yêu cầu bồi thường) và **nghiệp vụ 4** (duyệt và chi trả tự động), có 32 test. (2) Lưu hồ sơ lên IPFS thật và mã hóa AES + RSA hoàn chỉnh. (3) Màn hình Bệnh nhân chạy được trên dữ liệu giả lập.

**Ai đang làm gì (nói bằng lời thường):**

- **Trâm (A)** — **viết trọn smart contract và test.** Đây là phần ăn điểm Rubric 1 và Rubric 4.
  - **A-05** — **Nghiệp vụ 2:** hàm mua bảo hiểm (nhận tiền, kiểm tra gói hợp lệ, mỗi ví chỉ một thẻ còn hạn), phát hành thẻ NFT không chuyển nhượng được (soulbound), hàm xác minh thẻ; test T09–T15.
  - **A-06** — **Nghiệp vụ 3:** hàm gửi yêu cầu bồi thường (kiểm tra thẻ còn hạn, không vượt hạn mức) và hàm xác nhận chi phí **chỉ ví bệnh viện mới gọi được** (ràng buộc logic số 1); test T16–T23.
  - **A-07** — **Nghiệp vụ 4:** hàm duyệt và chi trả tự động (ràng buộc logic số 2: kiểm tra hạn mức, hạn dùng, bệnh viện đã xác nhận, quỹ đủ tiền; chống tấn công rút tiền lặp); hàm từ chối; test T24–T31. Tổng 32 test.
  - **A-08** — Script nạp dữ liệu mẫu `seed.js` (tạo 2 gói, cấp quyền bệnh viện, nạp quỹ) và đẩy ABI cuối (mốc H3).
  - **A-09, A-10** — (P2) Bảng gas; nháp phần lý thuyết của báo cáo.
- **Phương Anh (B)** — **hoàn thiện mã hóa và nối IPFS thật.** *Liên quan Rubric 2 (AES/RSA) và Rubric 3 (upload + truy xuất ≥ 3 loại dữ liệu).*
  - **B-04** — Mã hóa hồ sơ bằng AES-256-GCM và "bọc khóa" bằng RSA cho từng người được phép xem (bệnh nhân, bệnh viện, công ty BH); ai ngoài danh sách thì không mở được. Có 4 test.
  - **B-05** — Nối Pinata thật: tải lên và lấy lại file PDF, ảnh, JSON.
  - **B-06** — Tải lên 3 file mẫu thật, ghi lại CID; tải thêm 2 PDF điều khoản dùng cho tuần 4 (mốc H4).
  - **B-07, B-08** — (P2) Vẽ 2 sơ đồ BPMN đầu; nháp chương 1.
- **Lan Anh (C)** — **nối giao diện với contract thật và làm màn hình Bệnh nhân.** *Liên quan Rubric 2 (≥ 3 thao tác on-chain) và Rubric 4 (hiển thị thẻ NFT).*
  - **C-05** — Viết `contractService.js` bản thật (đọc ABI, gọi hàm, chuyển lỗi sang tiếng Việt, chạy thử trước khi gửi).
  - **C-06** — **Nghiệp vụ 2 và theo dõi claim:** màn hình Bệnh nhân gồm đăng ký khóa, xem danh sách gói, mua bảo hiểm (mã số bảo hiểm được mã hóa RSA), xem thẻ NFT và hạn mức còn lại, gửi yêu cầu bồi thường kèm hóa đơn, xem trạng thái claim (Chờ / Đã duyệt / Từ chối). Chạy bằng bản giả lập.
  - **C-07** — (P2) README đầy đủ, nháp báo cáo, mẫu Word.

**Milestone:** contract **hoàn chỉnh** và 32 test pass trên local; `ipfsService` + `cryptoService` **bản thật** chạy được; màn hình Bệnh nhân chạy đầy đủ bằng mock.

#### Việc của A — tuần 2

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **A-05** | Thứ 3 27/10 | `purchasePolicy(planId, encryptedHealthId)` payable: kiểm tra `Goi bao hiem khong ton tai`, `Goi bao hiem khong hoat dong`, `Sai so tien thanh toan` (`msg.value == price`), `Da co goi bao hiem con han`; tạo `Policy` (sao chép `coverageLimit`, tính `startDate`, `expiryDate = start + durationDays*1 days`), `_safeMint`, ghi `activePolicyOf`, tăng `totalPolicies`, emit `PolicyPurchased`. Soulbound qua override `_update` (revert `Soulbound: khong the chuyen nhuong` khi cả `from` và `to` khác `address(0)`). Override `supportsInterface` (ERC721 + AccessControl). `tokenURI` = `"ipfs://" + policyDocCID`. `getPolicy`, `totalPolicies`, `verifyInsurance` (đúng hành vi file 00 mục 4.2, **không bao giờ revert**). Test **T09–T15**. | Test T09–T15 pass | P1 |
| **A-06** | Thứ 5 29/10 | `submitClaim` (chủ NFT hoặc `HOSPITAL_ROLE`; revert `Khong phai chu the hoac benh vien`, `So tien khong hop le`, `Bao hiem da het han`, `Vuot qua han muc bao hiem`; hành vi theo file 00 mục 4.2), `confirmClaim` (`onlyRole(HOSPITAL_ROLE)`; revert `So tien xac nhan vuot so tien yeu cau`, `Khong tim thay yeu cau boi thuong`, `Claim da xu ly`), `getClaim`, `getClaimsByPatient`, `totalClaims`. Test **T16–T23**. | Test T16–T23 pass | P1 |
| **A-07** | Thứ 7 31/10 | `approveClaim` (`nonReentrant`; đúng thứ tự Checks → Effects → Interactions; chi trả bằng `call`; revert `Claim da xu ly`, `Benh vien chua xac nhan`, `Bao hiem da het han`, `Vuot qua han muc bao hiem`, `Quy bao hiem khong du`, `Chuyen tien that bai`; emit `ClaimApproved`). `rejectClaim` (admin; emit `ClaimRejected`). Tạo `contracts/mocks/ReentrancyAttacker.sol` (chỉ dùng cho test). Test **T24–T31**. | Test T24–T31 pass; **tổng 32 test pass** | P1 |
| **A-08** | CN 01/11 | `scripts/seed.js`: nếu mạng là `hardhat/localhost` → tạo 2 gói đúng file 00 mục 6.2 (CID mock), cấp quyền ví HOSPITAL (tài khoản #1), nạp quỹ 0.1 ETH. Nếu mạng là `sepolia` → **chỉ** cấp quyền bệnh viện (địa chỉ lấy từ biến môi trường `HOSPITAL_ADDRESS`) và nạp quỹ (số lượng từ `POOL_FUND_ETH`); **không tạo gói** (gói do Admin tạo qua Console của B bằng PDF thật). Chạy lại `deploy.js` → ABI cuối. **Push → H3.** | `npx hardhat node`; `deploy.js`; `seed.js` chạy trọn vẹn; `getPlans()` trả 2 gói đúng số liệu | P1 |
| **A-09** | Trong tuần | (P2) Cài plugin báo cáo gas chính thức của Hardhat để có bảng gas từng hàm. | Có bảng gas | P2 |
| **A-10** | Trong tuần | (Điền chỗ trống) nháp báo cáo 2.1–2.4 và 3.6 (mục 2 của file này). | Có file trong `docs/report/` | P2 |

#### Việc của B — tuần 2

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **B-04** | Thứ 3 27/10 | **`cryptoService.js` phần AES + phong bì**: `aesEncrypt/aesDecrypt` (nội bộ, AES-256-GCM, IV 12 byte), bọc/mở khóa AES bằng RSA-OAEP (nội bộ), `buildEncryptedRecord(record, recipients)` và `openEncryptedRecord(encrypted, myAddress, myPrivateKeyPem)` theo **đúng định dạng** file 00 mục 4.6 (khóa `keyWraps` là địa chỉ **chữ thường**), `saveKeyPair/loadKeyPair/exportKeyPair/importKeyPair` (localStorage, khóa theo địa chỉ chữ thường). Test `node --test`: (1) mã hóa → giải mã ra đúng `record`; (2) người không có trong `recipients` mở bị lỗi; (3) sửa 1 byte `cipher.data` thì lỗi; (4) sai khóa riêng thì lỗi. | 4 test pass | P1 |
| **B-05** | Thứ 5 29/10 | **`ipfsService.js` bản thật** bằng `fetch` tới REST của Pinata, JWT từ `VITE_PINATA_JWT`: `uploadFile`, `uploadJSON`, `fetchJSON`, `fetchBlob`, `gatewayUrl`. Lỗi luôn là `Error` tiếng Việt. *Tra tài liệu chính thức của Pinata trước* (AI: không đoán đường dẫn API từ trí nhớ, hãy xin người dùng dán đoạn tài liệu). | Script `frontend/src/services/tests/ipfs.manual.mjs` upload thành công 3 loại (PDF, PNG, JSON), in ra 3 CID | P1 |
| **B-06** | Thứ 7 31/10 | Ghi 3 CID thật vào `sample-data/REAL_CIDS.md` (kèm tên file). Upload thêm 2 PDF điều khoản thật để dùng tạo gói ở tuần 4. Kiểm tra mở được qua gateway. **Push bản thật → H4** (công tắc `VITE_USE_MOCK=false` dùng bản thật). | Mở link gateway thấy file | P1 |
| **B-07** | Trong tuần | (P2) Vẽ **BPMN 1 và 2** (file 01 mục 8: thiết lập hệ thống; mua bảo hiểm và mint NFT). PNG nền trắng, chữ lớn, trong `docs/bpmn/`, kèm đoạn mô tả 3–5 câu. | 2 file PNG | P2 |
| **B-08** | Trong tuần | (Điền chỗ trống) nháp Chương 1, 2.5–2.6 (mục 2 của file này). | Có file | P2 |

#### Việc của C — tuần 2

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **C-05** | Thứ 5 29/10 | **`contractService.js` bản thật** theo **đúng chữ ký** file 00 mục 4.4: dùng `BrowserProvider`, đọc `abi.json`/`address.json`; chuyển struct trả về thành object thuần (có `remainingLimit`, `statusLabel`); hàm ghi trả `{hash, receipt}`; `options.dryRun` dùng `.staticCall`, lỗi chuyển qua `toVietnameseError`; `getEvents` dùng `queryFilter` từ `deployBlock`; `getStats` tính từ event. Chạy thử với contract khung của A (A-02) ở mức đọc. | Khi `VITE_USE_MOCK=false`, `getPlans()` gọi được contract local không lỗi cú pháp | P1 |
| **C-06** | CN 01/11 | **Màn hình Bệnh nhân (chế độ mock)** trong `pages/patient/`: `PatientPage.jsx` ghép các phần `KeySetup.jsx` (tạo khóa RSA, `registerEncryptionKey`, nút Xuất/Nhập khóa), `PlanList.jsx` (từ `getPlans`, link PDF qua `gatewayUrl`), `PurchaseForm.jsx` (nhập mã số bảo hiểm → `rsaEncrypt` bằng khóa công khai của công ty bảo hiểm lấy qua `getEncryptionKey(getInsurerAddress())` → `purchasePolicy`; nếu chưa có khóa thì hiện lỗi `Cong ty bao hiem chua dang ky khoa ma hoa`), `PolicyCard.jsx` (mã thẻ, gói, hạn mức tối đa, **hạn mức còn lại**, hạn dùng, hiệu lực), `ClaimForm.jsx` (nhập số tiền, chọn hóa đơn → `uploadFile` → `buildEncryptedRecord` → `uploadJSON` → `submitClaim`), `ClaimList.jsx` (3 trạng thái PENDING/APPROVED/REJECTED màu khác nhau, kèm số tiền và hash), `RecordViewer.jsx` (giải mã hồ sơ của mình). Mọi giao dịch qua `TxToast`; trước khi gửi gọi `{dryRun: true}`. | Chạy được trọn vẹn với `VITE_USE_MOCK=true`; thấy đủ 3 trạng thái claim | P1 |
| **C-07** | Trong tuần | (Điền chỗ trống) `README.md` đầy đủ; nháp 2.7, 3.3, 4.1; mẫu Word (chữ 15pt, caption, mục lục tự động). | Có file | P2 |

#### Mốc bàn giao tuần 2
- **H3 (A → B, C), CN 01/11:** contract hoàn chỉnh local + `seed.js` + ABI cuối.
- **H4 (B → A, C), CN 01/11:** services bản thật.

#### Xong khi (cuối tuần 2) và ảnh cần chụp
| Ai | Lệnh chạy | Ảnh |
|---|---|---|
| A (Trâm) | `npx hardhat test` (32 test) | Ảnh terminal toàn bộ **passing** (nền sáng, chữ lớn) |
| B (Phương Anh) | `node --test frontend/src/services/tests/`; mở trang Pinata | Ảnh test pass; ảnh bảng điều khiển Pinata có 3 loại file; ảnh 1 bản mã (chuỗi trước/sau mã hóa) |
| C (Lan Anh) | `npm run dev` với `VITE_USE_MOCK=true` | Ảnh màn hình Bệnh nhân đủ 3 trạng thái claim |

---

### TUẦN 3 — 02/11 → 08/11 · CẮM VÀO NHAU (LOCAL)

**🎯 Mục tiêu chung của tuần (nghiệp vụ):** **Hoàn thành hai màn hình còn lại rồi ghép cả hệ thống lại.** Bệnh viện (**nghiệp vụ 3**) và Công ty bảo hiểm (**nghiệp vụ 1, 4, 5**) xong; sau đó cả ba màn hình chạy với contract thật và IPFS thật, đi hết luồng *mua bảo hiểm → khám bệnh → gửi claim → duyệt → nhận tiền* trên máy local (mốc H5). Đồng thời A thử deploy Sepolia sớm để phát hiện trục trặc.

**Ai đang làm gì (nói bằng lời thường):**

- **Trâm (A)** — **làm màn hình Bệnh viện (nghiệp vụ 3) và thử Sepolia.** *Liên quan Rubric 2, 4 (xác minh thẻ), 1 (ràng buộc phân quyền).*
  - **A-11** — Bệnh viện nhập ví bệnh nhân để **kiểm tra thẻ NFT còn hiệu lực** (thao tác Verification). Ví không có quyền bệnh viện bị chặn, nút bị vô hiệu.
  - **A-12** — Form gửi claim: nhập số tiền, chẩn đoán, chọn hóa đơn và kết quả xét nghiệm; hồ sơ được mã hóa cho 3 người nhận rồi tải lên IPFS, sau đó gửi claim lên contract.
  - **A-13** — Danh sách claim do bệnh nhân tự gửi, chờ bệnh viện **xác nhận chi phí**.
  - **A-14** — Đổi từ bản giả lập sang contract và service thật trên local, sửa lỗi.
  - **A-15, A-16** — Thử deploy Sepolia sớm (chưa dùng chính thức) và chuẩn bị ví, ETH cho lần deploy chính thức.
- **Phương Anh (B)** — **làm màn hình Công ty bảo hiểm (nghiệp vụ 1, 4, 5).** *Liên quan Rubric 2, 3 (Retrieve hồ sơ từ IPFS), 1.*
  - **B-09** — **Nghiệp vụ 1:** đăng ký khóa mã hóa (phải làm trước khi bệnh nhân mua), tạo gói bảo hiểm mới kèm PDF điều khoản, bật/tắt gói.
  - **B-10** — Cấp/thu hồi quyền cho bệnh viện; nạp quỹ chi trả và xem số dư quỹ.
  - **B-11** — **Nghiệp vụ 4:** bảng claim, nút **xem hồ sơ IPFS đã giải mã** (thao tác Retrieve), nút duyệt và chi trả, nút từ chối.
  - **B-12** — **Nghiệp vụ 5:** bảng sự kiện và thống kê (tổng thu, tổng chi, số claim theo trạng thái).
  - **B-13, B-14** — Đổi sang contract/service thật; (P2) vẽ 3 BPMN còn lại.
- **Lan Anh (C)** — **ghép giao diện, kiểm thử toàn luồng.** *Liên quan Rubric 2 (độ ổn định) và Rubric 5 (minh chứng).*
  - **C-08** — Đổi màn hình Bệnh nhân sang contract và service thật; chạy: đăng ký khóa → mua gói → xem thẻ → gửi claim.
  - **C-09** — Viết `E2E_CHECKLIST.md`: từng bước của luồng chuẩn (ai làm, ví nào, kỳ vọng thấy gì) để mỗi người tự kiểm tra.
  - **C-10** — Thông báo giao dịch có link Etherscan; (P2) trang kiểm tra trước demo.
  - **C-11** — Điều phối mốc H5: tổng hợp kết quả chạy thử của 3 người, gắn tag `v0-local`.
  - **C-12** — (P2) Nháp slide, nháp báo cáo.

**Milestone:** hai màn hình còn lại hoàn chỉnh; **luồng chuẩn chạy trên local** với contract thật và service thật (H5, thứ 7 07/11). Gắn tag `v0-local`.

**Cách làm tuần này:** sáng thứ 2 mỗi người `git pull`; A và B dựng màn hình của mình **bằng mock của C trước**, sau đó đổi sang `VITE_USE_MOCK=false` khi đã chạy tốt. Không ai chờ ai.

#### Việc của A — tuần 3: Màn hình Bệnh viện

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **A-11** | Thứ 4 04/11 | `pages/hospital/KeySetup.jsx` (tạo khóa RSA, đăng ký, xuất/nhập — cùng hành vi như C-06) và `pages/hospital/VerifyCard.jsx`: ô nhập địa chỉ ví bệnh nhân + nút "Kiểm tra thẻ bảo hiểm" → `verifyInsurance` → hiện "✅ Thẻ #id hợp lệ, hạn mức còn X ETH, hết hạn dd/mm/yyyy" hoặc "❌ Không có thẻ còn hiệu lực". **Chỉ khi hợp lệ mới cho hiện form gửi claim.** Nếu ví đang kết nối không có `HOSPITAL_ROLE` (`getRoles`): hiện thông báo từ chối, vô hiệu mọi nút. | Với mock: ví HOSPITAL + địa chỉ PATIENT cho kết quả hợp lệ; ví OUTSIDER bị chặn | P1 |
| **A-12** | Thứ 6 06/11 | `pages/hospital/SubmitClaimForm.jsx`: nhập số tiền, chẩn đoán, chọn hóa đơn và kết quả xét nghiệm → `uploadFile` (hóa đơn) → `buildEncryptedRecord` với 3 người nhận (bệnh nhân, bệnh viện đang đăng nhập, công ty bảo hiểm; lấy khóa công khai bằng `getEncryptionKey`, thiếu khóa nào thì hiện lỗi rõ tên người đó) → `uploadJSON` → `submitClaim` (`{dryRun:true}` trước). Hiện CID và hash giao dịch. | Chạy với mock; claim mới xuất hiện trong danh sách | P1 |
| **A-13** | Thứ 7 07/11 | `pages/hospital/PendingConfirmList.jsx`: danh sách claim do bệnh nhân tự gửi, chưa xác nhận (`getAllClaims` lọc `hospitalConfirmed === false` và `status === PENDING`) + nút "Xác nhận chi phí" (`confirmClaim`, cho chỉnh số tiền xác nhận ≤ số tiền yêu cầu). `HospitalPage.jsx` ghép 3 phần. | Chạy với mock | P1 |
| **A-14** | Thứ 7 07/11 | Đổi sang `VITE_USE_MOCK=false` trên local với contract thật + `seed.js`; sửa lỗi phía mình. Gắn nhãn khi chuẩn bị H5. | Màn hình Bệnh viện chạy với contract và service thật | P1 |
| **A-15** | Thứ 5 05/11 | **Thử deploy Sepolia sớm bằng contract hiện tại** (chỉ để thử RPC, gas, faucet, verify Etherscan; chưa dùng chính thức): `npx hardhat run scripts/deploy.js --network sepolia`, chạy verify theo plugin. Ghi các vấn đề vào PROGRESS_A. | Có địa chỉ thử trên Sepolia; verify được hoặc biết rõ lỗi cần sửa | P1 |
| **A-16** | CN 08/11 | Chuẩn bị **H6**: kiểm tra `.env` Sepolia, số dư ví Admin ≥ 0.15 ETH. Điền cột "Địa chỉ Sepolia" file 00 mục 6.1 qua quy trình file 00 mục 8.1 (cả nhóm nhắn địa chỉ ví của mình trong chat, **A** gửi yêu cầu đổi). | Sẵn sàng deploy sáng 09/11 | P1 |

#### Việc của B — tuần 3: Màn hình Công ty bảo hiểm

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **B-09** | Thứ 4 04/11 | `pages/insurer/KeySetup.jsx` (như các màn hình khác; **Admin phải đăng ký khóa trước khi bệnh nhân mua**, file 00 mục 5 bước 3), `PlansAdmin.jsx`: form tạo gói (nhập tên, giá ETH, hạn mức ETH, số ngày, chọn PDF → `uploadFile` → `createPlan` với `ethers.parseEther`), danh sách gói, nút bật/tắt (`setPlanActive`). | Với mock: tạo gói mới, thấy trong danh sách | P1 |
| **B-10** | Thứ 5 05/11 | `HospitalAdmin.jsx`: nhập địa chỉ → `authorizeHospital(address, true/false)`, danh sách ví đã cấp (lấy từ event `HospitalAuthorized`). `FundPanel.jsx`: hiển thị `getPoolBalance` và `fundPool`. | Với mock | P1 |
| **B-11** | Thứ 6 06/11 | `ClaimsTable.jsx`: `getAllClaims` hiển thị id, bệnh nhân, số tiền, trạng thái, đã xác nhận chưa. Mỗi dòng: nút **"Xem hồ sơ IPFS"** (lấy `recordCID` → `fetchJSON` → `openEncryptedRecord` bằng khóa riêng của Admin → hiện chẩn đoán/xét nghiệm; `billCID` → `fetchBlob` hiện hóa đơn) — **đây là thao tác Retrieve**; nút **"Duyệt và chi trả"** (`approveClaim`, `{dryRun:true}` trước), nút "Từ chối" (`rejectClaim` kèm lý do). | Với mock | P1 |
| **B-12** | Thứ 7 07/11 | `Monitor.jsx`: bảng sự kiện (`getEvents`: thời gian, loại, hash) và thẻ thống kê (`getStats`: tổng phí thu, tổng đã chi, số claim theo 3 trạng thái, số dư quỹ). `InsurerPage.jsx` ghép các phần, chỉ ví có quyền Admin vào được. | Với mock | P1 |
| **B-13** | Thứ 7 07/11 | Đổi sang `VITE_USE_MOCK=false` trên local; sửa lỗi phía mình. | Chạy với contract và service thật | P1 |
| **B-14** | Trong tuần | (P2) Vẽ **BPMN 3, 4, 5**. | 3 file PNG | P2 |

#### Việc của C — tuần 3: Tích hợp và điều phối

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **C-08** | Thứ 3 03/11 | Đổi màn hình Bệnh nhân sang `VITE_USE_MOCK=false` với contract local của A (đã có từ H3) và service thật của B (H4). Chạy: đăng ký khóa → mua gói → xem thẻ → gửi claim → xem trạng thái. Sửa lỗi ở phần của mình. | Chạy trơn tru trên local | P1 |
| **C-09** | Thứ 5 05/11 | Viết `docs/plan/C/E2E_CHECKLIST.md`: từng bước **luồng chuẩn** (file 03 mục 3.3) gồm cả thứ tự khởi tạo file 00 mục 5, mỗi bước ghi "ai làm, ví nào, kỳ vọng thấy gì". Dùng để mỗi người tự chạy kiểm tra ở mốc H5. | File xong | P1 |
| **C-10** | Thứ 6 06/11 | `TxToast`: nếu `chainId` là Sepolia thì hiện link `https://sepolia.etherscan.io/tx/<hash>`. Màn hình "Kiểm tra trước khi demo" (P2): `pages/patient/` hoặc `app/PreflightPage.jsx` (đường dẫn `/preflight`) kiểm tra đúng mạng, số dư ví, contract trả lời, gọi thử Pinata. | Hiện link; (P2) trang preflight chạy | P1 / P2 |
| **C-11** | Thứ 7 07/11 | **Điều phối mốc H5** (mục 1.1): mỗi người tự chạy `E2E_CHECKLIST.md` trên local với 4 tài khoản Hardhat (không cần họp), ghi kết quả vào chat nhóm; lỗi nào thì ghi vào `PROGRESS` của người chịu trách nhiệm, mục "Yêu cầu gửi người khác". C tổng hợp và gắn tag `v0-local` khi cả ba chạy xong luồng chuẩn. | Cả ba báo đã chạy trọn luồng chuẩn trên local | P1 |
| **C-12** | Trong tuần | (Điền chỗ trống) nháp slide mẫu; nháp 3.3 và 4.1. | | P2 |

#### Mốc bàn giao tuần 3
- **H5 (mỗi người tự chạy, không họp), thứ 7 07/11.** Chuẩn bị: mỗi người đã `pull` main, `VITE_USE_MOCK=false`, tự chạy Hardhat node và `seed.js` trên máy mình (luồng giống hệt nhau vì ví và dữ liệu giống nhau theo file 00).
- **H6 (A → B, C), thứ 2 09/11:** sang tuần 4.

#### Xong khi (cuối tuần 3) và ảnh cần chụp
| Ai | Ảnh |
|---|---|
| A (Trâm) | Màn hình Bệnh viện: kết quả "Thẻ hợp lệ", form gửi claim, danh sách chờ xác nhận |
| B (Phương Anh) | Console công ty BH: tạo gói, bảng claim, popup **hồ sơ đã giải mã**, bảng sự kiện + thống kê |
| C (Lan Anh) | Màn hình Bệnh nhân với contract thật; ảnh checklist E2E đã tick |

---

### TUẦN 4 — 09/11 → 15/11 · LÊN SEPOLIA

**🎯 Mục tiêu chung của tuần (nghiệp vụ):** **Đưa hệ thống lên Sepolia (đáp ứng yêu cầu "triển khai testnet" của Rubric 1).** Deploy contract chính thức, verify mã nguồn trên Etherscan, tạo 2 gói bảo hiểm thật bằng Console, rồi chạy cả luồng nghiệp vụ 1 → 4 bằng ví MetaMask thật. Chụp ảnh Etherscan và IPFS làm minh chứng.

**Ai đang làm gì (nói bằng lời thường):**

- **Trâm (A)** — **deploy chính thức và verify.** *Rubric 1.*
  - **A-17** — Sáng 09/11: deploy lên Sepolia, nạp quỹ, cấp quyền bệnh viện, verify mã nguồn trên Etherscan, báo cả nhóm `git pull` (mốc H6).
  - **A-18** — Chạy các thao tác Bệnh viện trên mạng thật; từ 12/11 không đổi contract trừ lỗi nghiêm trọng.
  - **A-19** — Chụp ảnh Etherscan: contract, tab Code verified, giao dịch deploy, `authorizeHospital`, `fundPool`.
- **Phương Anh (B)** — **tạo gói thật và chụp minh chứng IPFS.** *Rubric 3.*
  - **B-15** — **Nghiệp vụ 1 trên Sepolia:** Admin đăng ký khóa, tạo 2 gói thật với PDF thật; sao lưu khóa Admin ngoài repo.
  - **B-16** — Chạy duyệt, từ chối, xem hồ sơ giải mã, bảng sự kiện trên Sepolia.
  - **B-17** — Chụp minh chứng IPFS: bảng Pinata đủ 3 loại file; mở JSON qua gateway thấy **bản mã**; Etherscan thấy `encryptedHealthId` là chuỗi mã hóa.
  - **B-18, B-19** — (P3) công cụ Python `web3`; (P2) hoàn chỉnh BPMN và nháp chương.
- **Lan Anh (C)** — **mua bảo hiểm thật trên Sepolia và kiểm thử toàn luồng.** *Rubric 2 và 4.*
  - **C-13** — **Nghiệp vụ 2 trên Sepolia:** bệnh nhân mua gói thật, nhận NFT, xem trên Etherscan, gửi claim; kiểm tra thông báo lỗi tiếng Việt.
  - **C-14** — (P2) Trang kiểm tra trước demo; xử lý khi sai mạng, MetaMask từ chối, hết ETH.
  - **C-15** — Điều phối ngày 14/11: mỗi người tự chạy luồng chuẩn trên Sepolia theo `E2E_CHECKLIST.md`, tổng hợp lỗi.
  - **C-16** — (P2) Slide mẫu, nháp báo cáo.

**Milestone:** contract chính thức trên Sepolia, đã verify mã nguồn; cả hệ thống chạy trên Sepolia; thứ 7 14/11 mỗi người tự chạy luồng chuẩn trên Sepolia.

#### Việc của A — tuần 4

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **A-17** | **Thứ 2 09/11 sáng** | **Deploy Sepolia chính thức**: `deploy.js --network sepolia` (ghi `address.json` có `chainId` 11155111 và `deployBlock`), chạy `seed.js --network sepolia` (chỉ cấp quyền bệnh viện + nạp quỹ), **verify mã nguồn Etherscan**. Commit `abi.json`, `address.json`; gắn tag `v1-sepolia`. Nhắn cả nhóm `git pull`. **= H6** | Link `https://sepolia.etherscan.io/address/<địa chỉ>` thấy tab Code đã verify, Read/Write Contract mở được | P1 |
| **A-18** | Thứ 3–4 | Chạy trên Sepolia các thao tác của màn hình Bệnh viện; sửa lỗi riêng của mình. Nếu phải sửa **contract**: sửa, chạy lại toàn bộ 32 test, deploy bản mới, cập nhật `address.json`, **nhắn ngay cả nhóm**. Từ thứ 5 12/11 **không đổi contract** trừ lỗi nghiêm trọng. | Màn hình Bệnh viện chạy trên Sepolia | P1 |
| **A-19** | Thứ 6 13/11 | Chụp minh chứng Etherscan: trang contract, tab Code verified, giao dịch deploy, giao dịch `authorizeHospital`, `fundPool`. Cập nhật bảng gas (nếu có A-09). | Có ảnh trong `docs/report/images/A/` | P1 |

#### Việc của B — tuần 4

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **B-15** | Thứ 3 10/11 | Trên Sepolia: Admin mở Console → đăng ký khóa RSA; **tạo 2 gói thật** bằng form tạo gói (B-09) dùng 2 PDF thật (B-06), số liệu **đúng file 00 mục 6.2**. Sao lưu file khóa Admin (xuất khóa) vào chỗ an toàn **ngoài repo**. | `getPlans()` trên Sepolia trả 2 gói; link PDF mở được | P1 |
| **B-16** | Thứ 4–5 | Chạy các thao tác Console trên Sepolia (duyệt, từ chối, xem hồ sơ giải mã, bảng sự kiện); sửa lỗi phía mình. | Console chạy trên Sepolia | P1 |
| **B-17** | Thứ 6 13/11 | Chụp minh chứng IPFS: bảng Pinata có đủ 3 loại (PDF điều khoản, hóa đơn, JSON bệnh án) và CID; mở file JSON qua gateway thấy **bản mã**; Etherscan input data của `purchasePolicy` thấy `encryptedHealthId` là **chuỗi đã mã hóa**. | Có ảnh trong `docs/report/images/B/` | P1 |
| **B-18** | Trong tuần | (P3) `tools/web3py/monitor.py`: dùng gói `web3`, đọc event từ RPC Sepolia, in thống kê. Chụp ảnh chạy. | Có ảnh | P3 |
| **B-19** | Trong tuần | (P2) Hoàn chỉnh BPMN và các nháp chương 1, 2.5–2.6, 3.1–3.5, 3.7. | | P2 |

#### Việc của C — tuần 4

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **C-13** | Thứ 3 10/11 | Đặt `VITE_CHAIN_ID=11155111`, `VITE_USE_MOCK=false`; Bệnh nhân (ví C giữ) đăng ký khóa → **mua gói thật** → xem NFT trên Etherscan (token tracker) → gửi claim (qua màn hình của mình). Sửa lỗi phần mình, kiểm tra thông báo lỗi tiếng Việt hiện đúng khi dryRun chặn. | Bệnh nhân hoàn thành mua + xem thẻ trên Sepolia | P1 |
| **C-14** | Thứ 4–5 | `/preflight` hoàn chỉnh (P2); trường hợp mạng sai, MetaMask từ chối, hết ETH: thông báo rõ. | | P2 |
| **C-15** | **Thứ 7 14/11** | **Điều phối ngày chạy Sepolia** (không họp): mỗi người tự chạy `E2E_CHECKLIST.md` trên Sepolia bằng 4 ví thử nghiệm (và ví Bệnh nhân thử cá nhân), ghi lỗi vào `PROGRESS` người chịu trách nhiệm. C tổng hợp. | Luồng chuẩn chạy **ít nhất 1 lần** trọn vẹn trên Sepolia | P1 |
| **C-16** | Trong tuần | (P2) Slide mẫu hoàn chỉnh, nháp 3.3 và 4.1 | | P2 |

#### Xong khi (cuối tuần 4)
Luồng chuẩn chạy ít nhất 1 lần trên Sepolia. Gắn tag `v1-sepolia` còn nguyên.

---

### TUẦN 5 — 16/11 → 22/11 · ỔN ĐỊNH + MINH CHỨNG + KHÓA CODE

**🎯 Mục tiêu chung của tuần (nghiệp vụ):** **Chạy lặp cho chắc, chụp đủ ảnh, khóa code.** Chạy lại cả luồng nghiệp vụ 1 → 4 nhiều lần để đạt **3 lần chạy sạch liên tiếp** (mỗi lần không có giao dịch nào bị lỗi trên chain; Rubric 2 cho phép tối đa 1 lỗi khi demo). Chụp đủ 17 ảnh minh chứng. Tối Chủ Nhật 22/11 khóa code (code freeze).

**Ai đang làm gì (nói bằng lời thường):**

- **Trâm (A)** — **sửa lỗi contract, chụp minh chứng, viết phần contract của báo cáo.** *Rubric 1, 4, 5.*
  - **A-20** — Sửa lỗi tồn đọng, chạy lại 32 test.
  - **A-21** — Chụp ảnh Etherscan: `purchasePolicy` có NFT, `submitClaim`, `confirmClaim`, `approveClaim` có chuyển ETH; ảnh test nền sáng.
  - **A-22** — Viết bảng test case và mục "kỹ thuật thực hiện các ràng buộc logic" (cắt đoạn code `onlyRole` và đoạn kiểm tra hạn mức, giải thích từng dòng).
  - **A-23** — Tự chạy 1 lần luồng chuẩn (lần chạy sạch số 1).
- **Phương Anh (B)** — **chụp minh chứng phân quyền IPFS và viết phần IPFS/mã hóa của báo cáo.** *Rubric 3, 5.*
  - **B-20** — Sửa lỗi tồn đọng, chạy lại test.
  - **B-21** — Chụp: ví Admin giải mã được hồ sơ; ví người ngoài có CID nhưng **giải mã thất bại** (chứng minh phân quyền); ảnh bản rõ → bản mã.
  - **B-22** — Viết nháp mục 4.3, 4.4 và chương 3.
  - **B-23** — Tự chạy 1 lần luồng chuẩn (lần chạy sạch số 2).
- **Lan Anh (C)** — **điều phối 3 lần chạy sạch, chụp ảnh giao diện, khóa code.** *Rubric 2, 5.*
  - **C-17** — Tự chạy luồng chuẩn trên Sepolia để tìm lỗi.
  - **C-18** — Tự chạy lần cuối (lần chạy sạch số 3) và xác nhận 3 lần liên tiếp không lỗi.
  - **C-19** — Chụp ảnh giao diện; bắt đầu viết kịch bản video.
  - **C-20** — Tối 22/11: gộp các PR cuối, gắn tag `v1-sepolia-freeze`, sao lưu khóa demo.

**Milestone:** **3 lần chạy sạch liên tiếp** trên Sepolia; đủ bộ ảnh minh chứng; **code freeze tối Chủ Nhật 22/11**. Sau mốc này **chỉ sửa lỗi nghiêm trọng**, mọi thay đổi code phải báo cả nhóm.

#### Việc của A — tuần 5

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **A-20** | Thứ 3 17/11 | Sửa lỗi tồn đọng trong danh sách lỗi (PROGRESS_A). Chạy lại `npx hardhat test`. | 32 test pass | P1 |
| **A-21** | Thứ 5 19/11 | Chụp **đủ ảnh Etherscan**: giao dịch `purchasePolicy` (có NFT mint); giao dịch `submitClaim`; `confirmClaim`; `approveClaim` (có chuyển ETH nội bộ về ví bệnh nhân); NFT trong ví/token tracker. Chụp ảnh `npx hardhat test` **nền sáng**. | Có ảnh trong `docs/report/images/A/` | P1 |
| **A-22** | Thứ 6 20/11 | Viết **bảng test case** (mục 5.1) từ file 03 mục 2 với cột: mã, mô tả, mong đợi, kết quả thực tế. Viết nháp 4.2 (gồm mục **"Kỹ thuật thực hiện các ràng buộc logic"**: cắt đúng đoạn `onlyRole(HOSPITAL_ROLE)` và đoạn kiểm tra hạn mức/hạn dùng/quỹ trong `approveClaim`, giải thích từng dòng) và 4.6. | Có file trong `docs/report/` | P1 |
| **A-23** | Thứ 5 19/11 | **Lần chạy sạch số 1:** tự chạy trọn `E2E_CHECKLIST.md` trên Sepolia bằng ví Bệnh nhân thử của mình (mỗi ví chỉ được một thẻ còn hạn nên mỗi lần chạy dùng một ví Bệnh nhân khác nhau). Phải có **0 giao dịch lỗi** trên Etherscan. Báo kết quả vào chat nhóm và `PROGRESS_A`. | 0 giao dịch lỗi | P1 |

#### Việc của B — tuần 5

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **B-20** | Thứ 3 17/11 | Sửa lỗi tồn đọng (PROGRESS_B). Chạy `node --test` lại. | Pass | P1 |
| **B-21** | Thứ 5 19/11 | Chụp ảnh **minh chứng RBAC cho IPFS**: (1) ví Admin giải mã được hồ sơ; (2) ví OUTSIDER có CID nhưng **giải mã thất bại**, hiện thông báo; (3) ảnh test crypto (bản rõ → bản mã); (4) ảnh Console với bảng thống kê. | Có ảnh trong `docs/report/images/B/` | P1 |
| **B-22** | Thứ 6 20/11 | Hoàn thành nháp **4.3 và 4.4** (code upload/retrieve, mã hóa, ảnh) và chương 3 (BPMN đã chèn). | Có file | P1 |
| **B-23** | Thứ 6 20/11 | **Lần chạy sạch số 2** (sau lần của A), cách làm như A-23, bằng ví Bệnh nhân thử của B. | 0 giao dịch lỗi | P1 |

#### Việc của C — tuần 5

| ID | Hạn | Việc (cụ thể) | Xong khi | Ưu tiên |
|---|---|---|---|---|
| **C-17** | Thứ 3–5 | Chạy lại luồng chuẩn trên Sepolia **một mình** (đổi ví để đóng cả 3 vai nếu cần) để tìm lỗi; ghi lỗi; sửa phần mình. | Danh sách lỗi đã xử lý | P1 |
| **C-18** | **Thứ 7 21/11** | **Lần chạy sạch số 3** (sau lần của B), cách làm như A-23, bằng ví Bệnh nhân thử của C. C ghi nhận **3 lần liên tiếp đều 0 giao dịch lỗi** vào `PROGRESS_C` (kèm ảnh Etherscan). Nếu có lỗi ở bất kỳ lần nào: sửa, rồi làm lại từ lần 1 theo thứ tự A → B → C. | 3 lần liền sạch | P1 |
| **C-19** | Thứ 6 20/11 | Chụp ảnh **giao diện** (nền sáng, zoom để chữ lớn): 3 màn hình, định tuyến theo vai trò, `TxToast` thành công, **thông báo lỗi tiếng Việt do dryRun chặn** (không có giao dịch lỗi on-chain). Tạo thư mục `docs/video/` và nháp **kịch bản video** (theo file 03 mục 3.3). | Có ảnh và file kịch bản | P1 |
| **C-20** | **CN 22/11 tối** | **Code freeze:** merge các PR cuối, gắn tag `v1-sepolia-freeze`, ghi vào `README.md` hướng dẫn chạy bản cuối, ghi tình trạng ví demo. Chép khóa RSA demo (xuất khóa) của 3 vai trò vào chỗ an toàn ngoài repo. | Tag đã tạo, `main` ổn định | P1 |

#### Bộ ảnh minh chứng bắt buộc (tối thiểu 17 ảnh, tất cả nền sáng)

| # | Ảnh | Ai | Dùng cho |
|---|---|---|---|
| 1 | `npx hardhat test` toàn bộ passing | A (Trâm) | 5.1 |
| 2 | Etherscan: trang contract + tab Code đã verify | A (Trâm) | 4.6 |
| 3 | Giao dịch deploy | A (Trâm) | 4.6 |
| 4 | Giao dịch `purchasePolicy` + NFT mint | A (Trâm) | 4.6, Tiêu chí 4 |
| 5 | Giao dịch `confirmClaim` | A (Trâm) | 4.6 |
| 6 | Giao dịch `approveClaim` (chuyển ETH) | A (Trâm) | 4.6 |
| 7 | Pinata: 3 loại file + CID | B (Phương Anh) | 4.3 |
| 8 | Gateway mở JSON thấy bản mã | B (Phương Anh) | 4.4 |
| 9 | Etherscan input `encryptedHealthId` | B (Phương Anh) | 4.4 |
| 10 | Test crypto (bản rõ → bản mã) | B (Phương Anh) | 4.4 |
| 11 | OUTSIDER giải mã thất bại | B (Phương Anh) | 4.3 |
| 12 | Console: bảng sự kiện + thống kê | B (Phương Anh) | 4.5 |
| 13 | Màn hình Bệnh nhân (thẻ NFT, hạn mức, 3 trạng thái claim) | C (Lan Anh) | 4.5 |
| 14 | Màn hình Bệnh viện (kiểm tra thẻ hợp lệ, form claim) | A (Trâm) | 4.5 |
| 15 | `TxToast` thành công có hash | C (Lan Anh) | 4.5 |
| 16 | Lỗi tiếng Việt do dryRun chặn | C (Lan Anh) | 4.5, 5.3 |
| 17 | 3 lần chạy sạch (ghi nhận trong PROGRESS_C, kèm ảnh Etherscan) | C (Lan Anh) | 5.2 |

---

### TUẦN 6 — 23/11 → 29/11 · BÁO CÁO + SLIDE

**🎯 Mục tiêu chung của tuần (nghiệp vụ):** **Chuyển từ code sang giấy tờ.** Hoàn thành báo cáo Word, slide thuyết trình và kịch bản video (**Rubric 5**: không lỗi chính tả, đánh số trang/hình/bảng, caption, bảng chữ viết tắt, tài liệu tham khảo, chữ Word > 14pt, slide > 18pt). **Không thêm tính năng mới.**

**Ai đang làm gì (nói bằng lời thường):**

- **Trâm (A)** — **viết chương lý thuyết và thiết kế contract, làm slide phần contract và Bệnh viện.**
  - **A-24** — Hoàn thành các chương của A (2.1–2.4, 3.6, 4.2, 4.5 phần Bệnh viện, 4.6, 5.1, 5.3, 5.4).
  - **S-A** — Slide phần smart contract và NFT, phần Bệnh viện.
- **Phương Anh (B)** — **viết chương mở đầu, thiết kế nghiệp vụ, IPFS và mã hóa; làm slide phần đó.**
  - **B-24** — Hoàn thành các chương của B (chương 1, 2.5–2.6, 3.x, 4.3, 4.4, 4.5 phần Công ty BH, 5.3).
  - **S-B** — Slide phần IPFS, mã hóa và Công ty bảo hiểm; viết phụ đề video.
- **Lan Anh (C)** — **ghép toàn bộ báo cáo vào một file Word, hợp nhất slide, chốt kịch bản video.**
  - **C-21, C-22** — Làm mẫu Word chuẩn và ghép chương của 3 người, kiểm tra chính tả và tính nhất quán.
  - **ALL-1** — Cả ba đọc chéo chương của nhau (không cần họp, ghi lỗi vào file chung).
  - **C-23, C-24, S-C** — Hợp nhất slide, đánh số, kịch bản video.

**Milestone:** báo cáo hoàn chỉnh (một file Word), slide hoàn chỉnh, kịch bản video xong, **chỉ sửa lỗi nghiêm trọng của code**.

**Phân chương** (đúng file 02 cũ mục 8, nội dung gợi ý ở file 01 mục 10):
| Ai | Chương |
|---|---|
| **A (Trâm)** | 2.1–2.4, 3.6, 4.2 (+ mục kỹ thuật ràng buộc), 4.5 (phần Bệnh viện), 4.6, 5.1, 5.3 (phần contract), 5.4 |
| **B (Phương Anh)** | 1, 2.5–2.6, 3.1, 3.2, 3.4, 3.5, 3.7, 4.3, 4.4, 4.5 (phần Công ty BH), 5.3 (phần dữ liệu/mã hóa) |
| **C (Lan Anh)** | Mở đầu (bìa, mục lục, danh mục hình/bảng, bảng chữ viết tắt), 2.7, 3.3, 4.1, 4.5 (phần Bệnh nhân + kết nối ví), 5.2, 5.5, Chương 6, tài liệu tham khảo |

| ID | Hạn | Ai | Việc (cụ thể) | Xong khi |
|---|---|---|---|---|
| **A-24 / B-24** | **Thứ 4 25/11 tối** | A (Trâm), B (Phương Anh) | Hoàn thành **tất cả chương của mình** (file Word hoặc Markdown riêng trong `docs/report/`, hậu tố `_A`/`_B`), đã chèn ảnh, đã đánh số hình/bảng, đã có caption. Chữ **15pt**, **cả bảng và caption cũng > 14pt**. **Push → C lấy.** | File chương trong `docs/report/` |
| **C-21** | Thứ 4 25/11 tối | C (Lan Anh) | Hoàn thành chương của C và **mẫu Word chuẩn** (mục lục tự động, đánh số trang, danh mục hình/bảng, bảng chữ viết tắt từ file 03 mục 6). | Có file |
| **C-22** | Thứ 5–6 26–27/11 | C (Lan Anh) | **Ghép** toàn bộ chương vào **một file Word**: thống nhất kiểu chữ, đánh số hình/bảng liên tục theo chương, cập nhật mục lục, chạy kiểm tra chính tả tiếng Việt, kiểm tra tên contract/hàm/số liệu **nhất quán** với file 00. Tài liệu tham khảo (gom từ A, B). | `docs/report/BaoCao_IS355_v1.docx` |
| **ALL-1** | Thứ 7 28/11 | Cả ba | **Đọc chéo**: A đọc chương của B, B đọc chương của C, C đọc chương của A. Ghi lỗi chính tả, lỗi số liệu, hình thiếu caption, chữ ≤ 14pt. Sửa trong ngày. | Danh sách lỗi đã xử lý |
| **S-A / S-B / S-C** | **Thứ 6 27/11** | Mỗi người | Slide **phần mình** (xem phân chia ở file 03 mục 7) trong `docs/slides/`: chữ **≥ 20pt**, nền sáng, mỗi slide một ý chính. | Có file |
| **C-23** | Thứ 7 28/11 | C (Lan Anh) | **Hợp nhất slide**, đánh số slide, kiểm tra cỡ chữ và tương phản. | `docs/slides/Slide_IS355_v1.pptx` |
| **C-24** | CN 29/11 | C + B | **Kịch bản video** hoàn chỉnh: từng cảnh, thời lượng, lời phụ đề (B viết phụ đề). | `docs/video/KICH_BAN.md` |

> Trong tuần 6 **không thêm tính năng**. Nếu phát hiện lỗi hiển thị nhỏ, ghi lại, chỉ sửa nếu không ảnh hưởng luồng chuẩn.

---

### TUẦN 7 — 30/11 → 08/12 · VIDEO + HOÀN THIỆN + NỘP

**🎯 Mục tiêu chung của tuần (nghiệp vụ):** **Hoàn thiện, thuyết trình và nộp.** Quay video demo có phụ đề tiếng Việt, tự chấm theo Rubric để vá thiếu sót, chốt báo cáo, tập dượt. **Thuyết trình trực tiếp cần slide và demo xong hẳn trước 04/12**; **báo cáo Word và video demo hoàn thiện thêm và nộp trước hạn chốt 08/12**.

**Ai đang làm gì (nói bằng lời thường):**

- **Trâm (A)** — **cùng cả nhóm: kiểm tra Rubric phần contract, tập dượt phần của mình.**
  - **R-01, FIX-1** — Cả ba tự chấm Rubric, sửa báo cáo và slide.
  - **P-01, P-02** — Tự tập phần thuyết trình của mình (có bấm giờ), luyện trả lời câu hỏi phần contract.
- **Phương Anh (B)** — **hỗ trợ quay video, viết phụ đề, tập dượt phần IPFS/mã hóa.**
  - **V-01** — Hỗ trợ quay video và viết phụ đề.
  - **P-01, P-02** — Tự tập phần của mình, luyện trả lời câu hỏi phần IPFS và mã hóa.
- **Lan Anh (C)** — **quay video, kiểm tra tổng thể, nộp bài.**
  - **V-01** — Quay video demo trọn luồng trên Sepolia, chèn phụ đề tiếng Việt.
  - **SUB-1** — Kiểm tra slide và demo sẵn sàng thuyết trình (04/12).
  - **SUB-2** — Nộp báo cáo Word và video (hạn chốt 08/12).

**Milestone:** **04/12** slide + demo sẵn sàng thuyết trình trực tiếp; **báo cáo Word + video nộp trước hạn chốt Thứ Ba 08/12** (mục tiêu xong từ 06/12); 05–07/12 là thời gian dự phòng và chỉnh bản cuối.

| ID | Hạn | Ai | Việc (cụ thể) | Xong khi |
|---|---|---|---|---|
| **V-01** | Thứ 2 30/11 | C quay, B hỗ trợ | **Quay video demo** trọn luồng chuẩn trên Sepolia theo kịch bản (chạy trang kiểm tra trước demo trước, dùng đủ 4 ví). **Chèn phụ đề tiếng Việt** (chữ đủ lớn, đọc kịp). Video là bản nộp và cũng là phương án dự phòng khi thuyết trình trực tiếp. | `docs/video/Demo_IS355.mp4` |
| **R-01** | Thứ 2 30/11 | Cả ba | **Tự chấm theo rubric**: bảng file 03 mục 10 + checklist file 03 mục 1; mỗi dòng cần minh chứng. Liệt kê thiếu sót. | Danh sách thiếu sót còn lại |
| **FIX-1** | Thứ 3 01/12 | A, B, C | Sửa báo cáo/slide theo R-01 và ALL-1. **Chốt slide bản cuối** (slide dùng khi thuyết trình trực tiếp). **Chốt báo cáo `v2-final`**, xuất **PDF** để kiểm tra bố cục. Báo cáo Word còn được chỉnh nhỏ tới 07/12 nếu cần. | `BaoCao_IS355_final.docx` + `.pdf` |
| **P-01** | Thứ 4 02/12 | Mỗi người tự làm | **Tập dượt lần 1:** tự tập phần thuyết trình của mình có bấm giờ (có thể thu âm gửi chat nhóm cho cả nhóm nghe). Mỗi người luyện trả lời 3 câu hỏi file 03 mục 5 thuộc phần mình. | Ghi lại những chỗ vấp |
| **P-02** | Thứ 5 03/12 | Mỗi người tự làm | **Tập dượt lần 2** + luyện câu hỏi chéo (hỏi phần của người khác qua chat). Chuẩn bị phương án dự phòng (file 03 mục 3.5): video đã chép vào máy, ví phụ, mạng dự phòng. Kiểm tra demo chạy được. | Chạy trơn tru |
| **SUB-1** | **Thứ 6 04/12** | Cả ba | **Sẵn sàng thuyết trình trực tiếp:** slide bản cuối đã chép vào máy; demo trên Sepolia chạy thử xong (đúng ví, đủ ETH); video dự phòng đã chép vào máy. | Slide + demo sẵn sàng |
| **SUB-2** | **Hạn chốt Thứ 3 08/12** (mục tiêu xong từ 06/12) | C nộp, A và B kiểm tra | **Nộp báo cáo Word + video demo** theo đúng cách nộp mà thầy/cô quy định (kèm slide, link GitHub, địa chỉ contract nếu được yêu cầu). Kiểm tra file mở được, font không đổi, video có tiếng và phụ đề. **Thu hồi JWT Pinata và API key** sau khi chấm xong (không thu hồi trước demo). Gắn tag `v2-final`. | Đã nộp |
| **BUF** | 05–07/12 | | Dự phòng: chỉnh nhỏ báo cáo, quay lại video nếu cần. Không làm thêm tính năng. | |

**Ghi vào `README.md`:** thuyết trình trực tiếp (slide + demo xong trước 04/12) và hạn nộp Word + video (08/12).

---

## 5. KHI BỊ TRỄ: CẮT GÌ, GIỮ GÌ

**Giữ bằng mọi giá (P1):**
- Contract chạy trên Sepolia, verify Etherscan, có `purchasePolicy`, `submitClaim`, `approveClaim`, 2 ràng buộc, test pass.
- Giao diện đủ 3 chức năng tương tác on-chain, mã hóa dữ liệu nhạy cảm, tối đa 1 lỗi giao dịch khi demo.
- IPFS đủ 3 loại dữ liệu + upload + retrieve + kiểm soát truy cập theo vai trò.
- NFT: Minting + Verification.
- Báo cáo đúng hình thức (cỡ chữ > 14, slide > 18, caption, bảng chữ viết tắt, tài liệu tham khảo), video có phụ đề.

**Cắt theo thứ tự (từ trên xuống):**
1. P3: `tools/web3py/monitor.py`.
2. P2: trang `/preflight`; bảng gas; BPMN thừa (giữ tối thiểu 4 sơ đồ); `Monitor.jsx` rút gọn chỉ còn bảng sự kiện.
3. Nếu trễ lớn: `rejectClaim` và `PendingConfirmList.jsx` (nhưng giữ `confirmClaim` vì là ràng buộc rubric; có thể chỉ cho bệnh viện **gửi** claim với `confirmed` luôn).
4. Phương án mã hóa dự phòng (file 01 mục 7): một khóa AES chung trong biến môi trường **chỉ khi** B báo không kịp, ghi rõ hạn chế trong báo cáo.

**Mốc không dời:** H5 (07/11), H6 (09/11), freeze (22/11), sẵn sàng thuyết trình (04/12), nộp Word + video (08/12).
