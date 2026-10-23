# KẾ HOẠCH RIÊNG CỦA A (TRÂM) — CHIA THÀNH CÁC CHẶNG NHỎ

**Thư mục:** `docs/plan/A/` · **Đọc kèm:** `docs/00_AI_RULES_AND_CONTRACTS.md` (file 00) và `docs/plan/00_MASTER_PLAN.md`.
**Mục đích:** việc của A (Trâm) rất nhiều (contract, test, deploy, màn hình Bệnh viện, minh chứng). Mỗi lần chỉ đưa **một chặng** cho AI. Mỗi chặng là **một file riêng, tự chứa đủ**: làm gì, file nào được đụng, code chuẩn, lệnh kiểm tra, mẫu báo cáo.

> **Điểm quan trọng:** mã contract và test trong các chặng A02–A08 **đã được chạy thử thật** (Hardhat, từng chặng một, kết quả test ghi trong từng file). AI chỉ cần **chép đúng và chạy**, không phải tự nghĩ logic. Như vậy AI "yếu" cũng khó làm sai.

---

## 1. Mình đã sửa gì so với gợi ý "6 chặng" ban đầu (và vì sao)

| Gợi ý cũ | Mình làm | Lý do |
|---|---|---|
| Thư mục `docs/plan_A/` | **`docs/plan/A/`** | File 00 (mục 3.1, 3.2) và master plan đã chốt đường dẫn này. Dùng tên khác thì vi phạm luật R1/R15 và AI nào đọc file 00 sẽ bối rối. |
| 6 chặng | **14 chặng** nhỏ hơn | Chặng A2 và A3 cũ (toàn bộ logic contract) và A6 cũ (cả màn hình Bệnh viện) quá to cho một phiên. 14 chặng khớp từng mã việc A-01…A-22 trong master plan và đúng mốc ngày. |
| Chặng 4 mới viết test | **Code và test đi cùng một chặng** | Viết code cả tuần rồi mới test thì AI dễ viết sai mà không biết. Mỗi chặng contract kết thúc bằng "test pass" nên lỗi lộ ngay. |
| Gộp deploy Sepolia + chụp ảnh vào một chặng | Tách **thử Sepolia (A10)**, **deploy chính thức (A13)**, **minh chứng và báo cáo (A14)** | Deploy Sepolia cần khóa ví thật và ETH thật: **AI không được thấy khóa**, do Trâm gõ lệnh. Chụp ảnh là việc của người, AI không làm được. |
| Màn hình Bệnh viện một chặng | **Ba chặng (A09, A11, A12)** | Gồm 4 thành phần, có dùng service của B (Phương Anh) và C (Lan Anh), nên cần chia nhỏ. |
| (chưa có) | **Mẫu báo cáo bắt buộc cho AI** | Để Trâm dán cho mình (Claude) kiểm tra từng chặng. Xem mục 4. |
| (chưa có) | Khóa **Hardhat phiên bản 2** và `evmVersion: "cancun"` | Hardhat 3 (mặc định khi `npm install hardhat`) **không dùng được** cấu hình `hardhat.config.js` kiểu cũ trong file 00. OpenZeppelin bản mới cần `cancun` nếu không compile lỗi `mcopy`. Cả hai lỗi này mình đã gặp khi thử thật. |

## 2. Danh sách chặng (làm đúng thứ tự; xong chặng nào mới sang chặng kế)

| Chặng | File | Mã master | Hạn | Làm gì (lời thường) | Rubric |
|---|---|---|---|---|---|
| **A01** | `A01_khoi_tao_hardhat.md` | A-01 | Thứ 3 20/10 | Cài Hardhat, cấu hình mạng local và Sepolia, kiểm tra biên dịch được | 1 |
| **A02** | `A02_khung_contract.md` | A-02 | Thứ 5 22/10 | Viết **bản khung** contract: đủ tên hàm, struct, event, chưa có logic | 1 |
| **A03** | `A03_script_xuat_abi_deploy.md` | A-03 | Thứ 5 22/10 | Script tự xuất ABI + địa chỉ cho B (Phương Anh), C (Lan Anh) dùng. **= mốc H2** | 1 |
| **A04** | `A04_nghiep_vu1_thiet_lap.md` | A-04 | CN 25/10 | **Nghiệp vụ 1:** tạo gói, cấp quyền bệnh viện, đăng ký khóa, nạp quỹ + test | 1 |
| **A05** | `A05_nghiep_vu2_mua_bao_hiem_nft.md` | A-05 | Thứ 3 27/10 | **Nghiệp vụ 2:** mua bảo hiểm, mint NFT không chuyển nhượng, xác minh thẻ + test | 1, 4 |
| **A06** | `A06_nghiep_vu3_claim.md` | A-06 | Thứ 5 29/10 | **Nghiệp vụ 3:** gửi claim, bệnh viện xác nhận (ràng buộc 1) + test | 1 |
| **A07** | `A07_nghiep_vu4_duyet_chi_tra.md` | A-07 | Thứ 7 31/10 | **Nghiệp vụ 4:** duyệt và chi trả tự động (ràng buộc 2), chống reentrancy + test. Đủ 32 test | 1 |
| **A08** | `A08_seed_va_ban_giao_H3.md` | A-08, A-09 | CN 01/11 | Script nạp dữ liệu mẫu `seed.js`, xuất ABI cuối. **= mốc H3** | 1 |
| **A09** | `A09_bv_khoa_va_kiem_tra_the.md` | A-11 | Thứ 4 04/11 | Màn hình Bệnh viện phần 1: đăng ký khóa, kiểm tra thẻ NFT | 2, 4 |
| **A10** | `A10_thu_sepolia.md` | A-15, A-16 | Thứ 5 05/11 (+ CN 08/11) | Thử deploy Sepolia sớm, chuẩn bị ví và ETH | 1 |
| **A11** | `A11_bv_gui_claim.md` | A-12 | Thứ 6 06/11 | Màn hình Bệnh viện phần 2: form gửi claim (mã hóa, tải IPFS) | 2, 3 |
| **A12** | `A12_bv_xac_nhan_va_ghep.md` | A-13, A-14 | Thứ 7 07/11 | Màn hình Bệnh viện phần 3: danh sách chờ xác nhận, ghép trang, chuyển sang contract thật | 2 |
| **A13** | `A13_deploy_sepolia_chinh_thuc.md` | A-17, A-18 | Thứ 2 09/11 | Deploy Sepolia chính thức, verify Etherscan. **= mốc H6** | 1 |
| **A14** | `A14_minh_chung_va_bao_cao.md` | A-19…A-22 | 13/11 → 20/11 | Ảnh minh chứng, bảng gas, bảng test case, mục 4.2 báo cáo | 1, 5 |

Việc điền chỗ trống (nháp chương lý thuyết 2.1–2.4, 3.6) và việc báo cáo tuần 6 nằm ở master plan (A-10, A-24), không cần chặng riêng.

## 3. Quy trình cho MỖI chặng (8 bước, làm đúng thứ tự)

1. Mở terminal ở thư mục gốc repo (`MediChain`): `git checkout tram` (nhánh cố định của A (Trâm), **không tạo nhánh mới**), rồi `git pull origin main` để gộp code mới nhất của `main` về nhánh `tram`.
2. Mở **một cuộc trò chuyện AI mới** (không dùng lại cuộc cũ, để AI không bị rối ngữ cảnh).
3. Dán **khối "Prompt dán cho AI"** ở cuối file chặng. Nếu AI không tự đọc được file trong repo, dán thêm nội dung file `RULES_A.md` và file chặng.
4. AI sẽ **nhắc lại** vai trò, file sẽ sửa, tên hàm. Đọc nhanh: có file nào ngoài danh sách "được phép" không? Có thì bảo AI dừng.
5. AI làm xong và **viết báo cáo** vào `docs/plan/A/reports/REPORT_A<NN>.md`.
6. **Tự chạy** các lệnh ở mục "Lệnh kiểm tra" (không chỉ tin AI) và so với "kết quả mong đợi".
7. **Gửi cho mình (Claude) để kiểm tra:** dán (a) nội dung file báo cáo, (b) nội dung file code chính của chặng, (c) output lệnh kiểm tra nếu báo cáo thiếu. Mình trả lời: *ĐẠT* / *SỬA những điểm sau*. Mình sẽ soi theo mục "Mình sẽ soi gì" trong từng chặng.
8. Khi ĐẠT: `git add` **đúng các file trong danh sách** (không dùng `git add .`), commit `[M1] <mô tả>` (module M4 cho màn hình Bệnh viện), `git pull origin main` (kiểm tra không conflict), `git push origin tram`, mở Pull Request từ `tram` vào `main`, sau khi merge thì `git checkout tram && git pull origin main`, cập nhật `docs/progress/PROGRESS_A.md` (AI đã làm sẵn, chỉ cần đọc lại), rồi mới sang chặng kế.

**Nếu AI báo lỗi hoặc bị kẹt:** không bảo AI "tự sửa cho được". Dán lỗi cho mình. Hầu hết lỗi là do phiên bản thư viện hoặc AI tự ý thêm thứ ngoài chặng.

## 4. Báo cáo của AI để mình kiểm

Mỗi chặng AI **bắt buộc** ghi `docs/plan/A/reports/REPORT_A<NN>.md` theo mẫu trong `RULES_A.md` mục 4: file đã sửa, **output thật** của lệnh kiểm tra, checklist tự kiểm có bằng chứng, chỗ khác với hướng dẫn, câu hỏi còn lại. Nhờ vậy khi bạn dán cho mình, mình biết AI đã làm gì mà không cần xem hết code.

Mỗi chặng contract còn có **"dấu vân tay"** (số dòng và mã băm) của file đúng chuẩn, để bạn tự kiểm nhanh xem AI có chép nguyên văn không. Lệch dấu vân tay **không nhất thiết là sai** (AI có thể đã sửa chút), nhưng cần dán cho mình xem.

## 5. Những quyết định mình đã chốt thay bạn (bạn có thể phản đối trước khi bắt đầu)

1. **Hardhat 2 (CommonJS), không dùng Hardhat 3; `evmVersion: "cancun"`; Solidity 0.8.28.** Sepolia hỗ trợ cancun. Phiên bản thật được ghi vào PROGRESS lúc A01.
2. **Test T08** ("tắt gói rồi mua → revert") chuyển từ A-04 sang chặng A05, vì cần hàm `purchasePolicy`. Tổng vẫn 32 test (cộng thêm 2 test phụ: đăng ký khóa; hết hạn rồi mua gói mới).
3. **Chuỗi lỗi chỉ dùng đúng bảng file 00 mục 4.7.** Vì vậy: `createPlan` với `price`, `coverageLimit` hoặc `durationDays` bằng 0 → revert `So tien khong hop le`; **không** kiểm tra địa chỉ 0 trong `authorizeHospital`, khóa rỗng trong `registerEncryptionKey`, CID rỗng trong `submitClaim` (chưa có chuỗi lỗi tương ứng; thêm thì phải sửa file 00 theo mục 8.1).
4. **`poolBalance()` = toàn bộ ETH trong contract** (tiền phí bệnh nhân mua gói cũng vào quỹ chi trả). Khớp thiết kế file 01.
5. **`verifyInsurance` khi thẻ đã hết hạn:** trả `isValid = false` nhưng vẫn kèm `tokenId`, `remainingLimit`, `expiryDate` thật (để giao diện hiện "đã hết hạn ngày ..."). Ví chưa từng có thẻ trả `(false, 0, 0, 0)` đúng file 00.
6. **Hết hạn thì được mua gói mới** (thẻ cũ vẫn còn trong ví, nhưng `activePolicyOf` trỏ sang thẻ mới).
7. **Form gửi claim của Bệnh viện (A11):** kết quả xét nghiệm **nhập tay** thành bảng (tên xét nghiệm, giá trị, đơn vị) đúng định dạng file 00 mục 6.6; chỉ **hóa đơn** là file tải lên IPFS. Muốn thêm file kết quả xét nghiệm thì phải đổi định dạng bản ghi (cần cả nhóm đồng ý).
8. **`seed.js` chạy lại nhiều lần không nạp quỹ trùng** trên local (chỉ nạp khi quỹ đang bằng 0).
9. **Báo cáo chặng nằm trong `docs/plan/A/reports/`** (thuộc lãnh địa A (Trâm), không vi phạm R15). `PROGRESS_A.md` vẫn cập nhật cuối mỗi chặng nhưng chỉ ghi ngắn.

## 6. Việc cần báo cho B (Phương Anh) và C (Lan Anh)

- Sau **A03** (mốc **H2**): nhắn nhóm `git pull`; C (Lan Anh) dùng `abi.json`/`address.json` để thử `contractService.js`.
- Sau **A08** (mốc **H3**): nhắn nhóm; B (Phương Anh) và C (Lan Anh) chuyển sang contract thật.
- Sau **A13** (mốc **H6**): nhắn nhóm `git pull`, địa chỉ Sepolia mới.
- `.env.example` ở thư mục gốc **đã có sẵn** `HOSPITAL_ADDRESS` và `POOL_FUND_ETH` (A (Trâm) tạo lúc dựng repo, cũng đã ghi vào file 00 mục 4.3). Không cần nhờ ai.
- Thêm hàm, đổi chữ ký, đổi chuỗi lỗi: theo file 00 mục 8.1 (cả 3 đồng ý).
