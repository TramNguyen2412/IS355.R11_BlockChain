# CHẶNG A14 — Minh chứng, bảng gas, bảng test case và nháp báo cáo phần của Trâm

> **Mã master:** A-19 đến A-22 · **Hạn:** theo file 00 (tuần 6–7, xong trước 04/12) · **Rubric:** 1, 4, 5 (tài liệu) · **Nhánh:** `tram` · **Cần trước:** A13 xong (đã có link Etherscan), A07 (test), A08 (gas, nếu làm).

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Gom **bằng chứng** cho báo cáo Word và buổi bảo vệ: ảnh chụp, bảng gas, bảng test case lấy từ **kết quả test thật**, bảng "ràng buộc logic" lấy từ **code contract thật**. AI soạn **bản nháp** các bảng dựa trên kết quả thật; Trâm đọc, sửa văn, rồi dán vào Word. **Không bịa số liệu**: mọi con số phải đến từ output lệnh hoặc từ file code.

## 1. Nạp ngữ cảnh
File 00 mục 1, 2.4 (hai ràng buộc), 4.7 (chuỗi lỗi) · `RULES_A.md` · `REPORT_A07.md` (output 34 test) · `REPORT_A13.md` (link Etherscan) · `contracts-hardhat/contracts/HealthInsuranceNFT.sol` · `contracts-hardhat/test/HealthInsuranceNFT.test.js` · đề bài + Rubric trong repo (nếu có).

## 2. File được phép tạo/sửa
- `docs/report/BangTestCase_A.md` (mới)
- `docs/report/Muc4_2_RangBuoc_A.md` (mới)
- `docs/report/BangGas_A.md` (mới)
- `docs/report/DanhSachMinhChung_A.md` (mới)
- `docs/plan/A/reports/REPORT_A14.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** sửa contract/test/script; bịa số gas, số test, địa chỉ, tx hash.

## 3. Các bước

**Bước 1 — Chạy lại để lấy số liệu thật (Trâm hoặc AI, local, không cần khóa):**
```bash
cd contracts-hardhat
npx hardhat test 2>&1 | tee ../docs/report/test_output.txt
REPORT_GAS=true npx hardhat test 2>&1 | tee ../docs/report/gas_output.txt
```
→ `34 passing`. Nếu gas reporter không in bảng: ghi rõ vào báo cáo, **không** tự ước lượng. (Hai file `*_output.txt` chỉ để AI đọc; có thể không commit.)

**Bước 2 — `BangGas_A.md`:** AI chép bảng gas **nguyên văn số** từ `gas_output.txt` thành bảng Markdown (hàm, gas min/avg/max, số lần gọi), thêm cột "Nhận xét" ngắn (ví dụ: `purchasePolicy` tốn nhất vì mint NFT + lưu struct). Không làm tròn trừ khi ghi chú.

**Bước 3 — `BangTestCase_A.md` (Tiêu chí 4):** Bảng 34 dòng, mỗi dòng một test trong `test/HealthInsuranceNFT.test.js`:

| Mã | Nghiệp vụ | Mô tả | Điều kiện/đầu vào | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|

Quy tắc: mã (T01…T32 và các test phụ) và mô tả **lấy từ tên test trong file**; "Kết quả thực tế" lấy từ `test_output.txt` (✔ = Pass); "Kết quả mong đợi" lấy từ `expect(...)`/`revertedWith(...)` trong test (nêu chuỗi lỗi thật). Có đúng số dòng bằng số test; không thêm dòng không có trong file.

**Bước 4 — `Muc4_2_RangBuoc_A.md`:** Giải thích **hai ràng buộc logic** theo cấu trúc: (a) Phát biểu luật (1 câu); (b) Đoạn code liên quan (trích **nguyên văn** từ contract, ghi số dòng); (c) Lý do thiết kế; (d) Test chứng minh (mã T…); (e) Hậu quả nếu thiếu.
- **Ràng buộc 1:** chỉ ví có `HOSPITAL_ROLE` mới `confirmClaim` được (`onlyRole`).
- **Ràng buộc 2:** `approveClaim` tự kiểm tra hạn mức, thời hạn, quỹ, rồi chi trả (Checks→Effects→Interactions, `nonReentrant`).
Thêm một đoạn ngắn "Bảo mật": soulbound (`_update`), AccessControl, reentrancy (T31).

**Bước 5 — `DanhSachMinhChung_A.md`:** Bảng ảnh/đường link cần có, cột "Đã có?" Trâm tự tick:
1. Etherscan contract ✅ verified (ảnh + link).
2. Etherscan: một giao dịch `purchasePolicy` (mint NFT) và tab NFT/Token.
3. Etherscan: giao dịch `confirmClaim` của bệnh viện.
4. Etherscan: giao dịch `approveClaim` có **chuyển ETH** (tab Internal Txns).
5. Output `npx hardhat test` 34 passing (ảnh).
6. Bảng gas (ảnh hoặc bảng).
7. Giao diện Bệnh viện: kiểm tra thẻ, gửi claim, xác nhận (ảnh từ A12).
8. Hash tag Git `v1-sepolia`.
AI **không điền** link/hash mà chưa có; để trống ô "Link" cho Trâm.

**Bước 6 — Nháp mục 4.6 (phần Smart Contract, ≤ 1 trang):** thêm vào cuối `Muc4_2_RangBuoc_A.md` dưới tiêu đề "Nháp 4.6": kiến trúc contract (các thành phần, vai trò, sự kiện), luồng 4 nghiệp vụ, **dựa trên code thật**, không thêm tính năng không có.

**Bước 7 — Kiểm tra chéo:** AI chạy
```bash
grep -c "it(" contracts-hardhat/test/HealthInsuranceNFT.test.js
grep -c "^|" docs/report/BangTestCase_A.md
```
→ số `it(` = số dòng dữ liệu bảng test (bảng có 2 dòng tiêu đề/phân cách, trừ đi 2). Ghi hai số vào báo cáo.

## 4. Lỗi hay gặp
- AI "đẹp hóa" số gas hoặc bịa mô tả test không có trong file: kiểm bằng bước 7 và đối chiếu ngẫu nhiên 5 dòng.
- Trích code từ trí nhớ thay vì từ file: bắt buộc `Read` file contract rồi mới trích, ghi số dòng.
- Dán tx hash/link giả: cấm; ô chưa có để trống.

## 5. Lệnh kiểm tra và kết quả mong đợi
`34 passing`; 4 file docs mới có trong `docs/report/`; bước 7 hai số khớp; `grep -rn "0x_DIEN_KHI_CO\|TODO\|bịa" docs/report/*_A.md` không in gì ngoài ô trống có chủ đích.

## 6. Mục riêng trong báo cáo
Hai số ở bước 7; `git status --short`; ghi chú những ô chưa có minh chứng (Trâm tự bổ sung); danh sách số dòng đã trích trong `Muc4_2_RangBuoc_A.md`.

## 7. Gửi mình kiểm
Báo cáo + `Muc4_2_RangBuoc_A.md` + 10 dòng đầu và 10 dòng cuối của `BangTestCase_A.md` + `BangGas_A.md`.

**Mình sẽ soi:** trích code khớp file thật; số gas khớp output; số dòng test khớp; hai ràng buộc giải thích đúng bản chất (không nói contract "tự chạy"); không có số/hash bịa.

## 8. Sau chặng này
Trâm đã xong toàn bộ phần A (Trâm) trên kế hoạch. Cập nhật `PROGRESS_A.md`: "A hoàn tất; chờ ghép slide/báo cáo chung (SUB-1 04/12, SUB-2 08/12)". Hỗ trợ B/C sửa lỗi nếu nhóm nhờ; tag `v2-final` do cả nhóm thống nhất (file 00 mục 8).

## 9. Prompt dán cho AI
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A14_minh_chung_va_bao_cao.md.
Chỉ làm ĐÚNG chặng A14 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A14.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
