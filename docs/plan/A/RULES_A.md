# LUẬT CHUNG CHO MỌI CHẶNG CỦA A (Trâm)

> AI phải đọc file này **sau** `docs/00_AI_RULES_AND_CONTRACTS.md` và **trước** file chặng. File này **bổ sung**, không thay thế file 00. Có mâu thuẫn thì file 00 thắng; hãy báo người dùng.

## 1. Luật làm việc (A-R1 … A-R10)

| # | Luật |
|---|---|
| **A-R1** | **Chỉ làm đúng một chặng**, đúng chặng người dùng giao. Làm xong thì **dừng**. Không mở đầu chặng kế tiếp dù thấy "tiện". |
| **A-R2** | **Chép nguyên văn code trong file chặng.** Code đó đã được chạy thử thật. Thấy "có thể cải tiến" thì **không tự sửa**, ghi vào mục "Đề xuất" của báo cáo. Không đổi tên biến, không thêm bớt dòng, không đổi chuỗi `revert`. |
| **A-R3** | **Chỉ chạy lệnh có ghi trong file chặng.** Cấm: `npx hardhat init`, `npm audit fix`, `npm update`, cài thêm gói, nâng cấp Hardhat lên bản 3, đổi `evmVersion`, tạo file ngoài danh sách "được phép". |
| **A-R4** | **Bí mật:** cấm mở, đọc, in nội dung `contracts-hardhat/.env`. Cấm hỏi hay nhận private key / API key từ người dùng trong chat. Người dùng tự điền `.env` bằng tay. Nếu lệnh cần khóa, người dùng tự chạy lệnh đó. |
| **A-R5** | **Test đỏ:** không được sửa test cho khớp code, không xóa hay bỏ qua test (`it.skip`, `.only`). Nếu test đỏ: kiểm tra mình chép đúng chưa; vẫn đỏ thì **dừng và báo** kèm output thật. |
| **A-R6** | **Không đoán.** Thiếu thông tin, tên hàm lạ, file của C/B không như mô tả: **dừng và hỏi** (file 00 R8, R16). |
| **A-R7** | **Báo cáo trung thực:** dán output **nguyên văn** của lệnh. Không viết "pass" nếu chưa chạy. Lệnh lỗi thì dán lỗi. Không tóm tắt thay output. |
| **A-R8** | **Git:** chỉ làm trên nhánh cố định **`tram`** (kiểm tra `git branch --show-current` phải in `tram`; **không** tạo nhánh mới); **không** `git push` lên `main`; trước khi push luôn `git pull origin main` và không được có conflict; **không** `--force`; **không** `git add .` hay `git add -A`; chỉ `git add` từng file trong danh sách "được phép". Commit bắt đầu bằng mã module: `[M1] ...` (contract) hoặc `[M4] ...` (màn hình Bệnh viện). |
| **A-R9** | **Lỗi ở file người khác** (C (Lan Anh), B): không sửa, ghi vào báo cáo mục 7 và `PROGRESS_A.md` mục "Yêu cầu gửi người khác". |
| **A-R10** | **Trước khi code, nhắc lại** (ngắn): vai trò A (Trâm); chặng nào; file sẽ tạo/sửa; tên hàm đóng băng mà chặng phụ thuộc. Cuối phiên: viết báo cáo, cập nhật `PROGRESS_A.md`. |

## 2. Bộ kiểm tra Solidity (cho chặng A02 → A08)

AI tự rà trước khi báo xong; kết quả ghi vào báo cáo mục 4:

- [ ] `pragma solidity ^0.8.20;` và import đúng OpenZeppelin v5 (`@openzeppelin/contracts/...`).
- [ ] Không có: `transfer(`, `.send(`, `tx.origin`, `selfdestruct`, `delegatecall`, `ERC721Enumerable`, `ERC721URIStorage`, `_beforeTokenTransfer`, `console.log`.
- [ ] Chuỗi `revert`/`require` **chỉ** nằm trong bảng file 00 mục 4.7 (và `TODO` ở bản khung A02).
- [ ] Chi trả ETH bằng `call{value: ...}("")`, có `require(ok, "Chuyen tien that bai")`, và đặt **sau** khi đã cập nhật trạng thái (Checks → Effects → Interactions).
- [ ] Mọi hàm ghi của Admin dùng `onlyRole(DEFAULT_ADMIN_ROLE)`; `confirmClaim` dùng `onlyRole(HOSPITAL_ROLE)`.
- [ ] Không thêm hàm công khai nào ngoài danh sách file 00 mục 4.2 (ngoài `tokenURI`, `supportsInterface` là override bắt buộc).
- [ ] Mọi ID bắt đầu từ 1 (tăng bộ đếm **trước** rồi mới dùng làm ID).
- [ ] Lệnh grep nhanh (chạy trong `contracts-hardhat/`; **kết quả phải rỗng**):

```bash
grep -nE "tx\.origin|selfdestruct|delegatecall|\.transfer\(|\.send\(|console\.log|ERC721Enumerable|ERC721URIStorage|_beforeTokenTransfer" contracts/HealthInsuranceNFT.sol
```

## 3. Bộ kiểm tra giao diện (cho chặng A09, A11, A12)

- [ ] Chỉ sửa trong `frontend/src/pages/hospital/` (file 00 mục 3.2). **Không** sửa `app/`, `components/shared/`, `services/`, `package.json`.
- [ ] Chỉ gọi blockchain qua `src/app/contractService.js`; chỉ gọi IPFS/mã hóa qua `src/services/index.js` (không import trực tiếp thư mục `mock/` hay file thật).
- [ ] Không `import` từ `pages/patient` hay `pages/insurer`.
- [ ] Tiền là `bigint`; đổi sang chữ bằng `ethers.formatEther`, đọc từ ô nhập bằng `ethers.parseEther`. Cấm `Number`, `parseFloat` cho tiền.
- [ ] So sánh địa chỉ bằng `.toLowerCase()`.
- [ ] Mọi thao tác ghi: gọi `{ dryRun: true }` trước, rồi mới gửi thật; hiển thị trạng thái đang xử lý / thành công / lỗi tiếng Việt.
- [ ] Văn bản hiển thị: tiếng Việt có dấu. Chữ ≥ 16px. Nền sáng. Không `console.log` dữ liệu nhạy cảm.
- [ ] CSS để trong chính thư mục `pages/hospital/` (`hospital.css`), không sửa `global.css`.
- [ ] Không có `alert()`; dùng component của C (`ErrorBox`, `TxToast`, `Loading`, `Address`) **đúng cách C (Lan Anh) đã viết** (mở file xem prop, không đoán). Nếu thiếu component hoặc prop không rõ: **dừng và hỏi**.

## 4. Mẫu báo cáo (AI tạo file `docs/plan/A/reports/REPORT_A<NN>.md`)

Sao chép khung dưới đây, điền đầy đủ, **không bỏ mục nào**:

```markdown
# BÁO CÁO CHẶNG A<NN> — <tên chặng>
- Ngày giờ: 
- Mô hình/công cụ AI (nếu biết): 
- Nhánh git (phải là `tram`): 

## 1. Kết luận một dòng
HOÀN THÀNH | CHƯA HOÀN THÀNH | BỊ CHẶN (chọn một, nêu lý do ngắn)

## 2. File đã tạo/sửa
(dán output của: `git status --short` và `wc -l` cho từng file chính)

## 3. Lệnh kiểm tra và kết quả THẬT
(với mỗi lệnh trong mục "Lệnh kiểm tra" của chặng: ghi lệnh, rồi dán output nguyên văn, tối đa 60 dòng cuối)

## 4. Tự kiểm theo checklist
(chép checklist của chặng + checklist Solidity/Giao diện liên quan; mỗi dòng ✅ hoặc ❌ kèm bằng chứng: tên file:dòng hoặc output grep)

## 5. Chỗ KHÁC với file chặng
(ghi "không có" nếu chép nguyên văn; nếu có: sửa gì, vì sao, ở dòng nào)

## 6. Điều chưa chắc / câu hỏi cho người dùng

## 7. Việc cần người khác làm (luật R16 file 00)

## 8. Đề xuất cải tiến (chỉ ghi, KHÔNG làm)

## 9. Bước tiếp theo
(ghi tên chặng kế; không bắt đầu làm)
```

**Người dùng gửi cho Claude kiểm tra:** (1) toàn bộ file báo cáo này; (2) file code chính của chặng (ghi ở mục "Gửi mình kiểm" của chặng); (3) output lệnh kiểm tra nếu báo cáo thiếu.

## 5. Mẫu cập nhật `docs/progress/PROGRESS_A.md` cuối chặng

Theo đúng mẫu file 00 mục 8.2, giữ **dưới một trang**: thêm một dòng vào "Đã xong" (`- [x] A<NN> — <1 dòng>. Báo cáo: docs/plan/A/reports/REPORT_A<NN>.md`), cập nhật "Bước tiếp theo" thành tên chặng kế, ghi quyết định mới (nếu có) vào "Quyết định đã chốt".
