# BÁO CÁO CHẶNG A11 — Màn hình Bệnh viện, phần 2: form gửi yêu cầu bồi thường
- Ngày giờ: 2026-11-10 12:49
- Mô hình/công cụ AI: Gemini 3.8 Flash (High) / Antigravity
- Nhánh git: `tram`

## 1. Kết luận một dòng
HOÀN THÀNH — Đã tạo `SubmitClaimForm.jsx`, cập nhật `HospitalPage.jsx` để hiển thị form khi thẻ hợp lệ, tích hợp đầy đủ quy trình dryRun -> mã hóa phong bì AES+RSA 3 bên -> upload IPFS -> submitClaim on-chain, và build Vite thành công 100%.

## 2. File đã tạo/sửa
Output `git status --short`:
```text
 M docs/progress/PROGRESS_A.md
 M frontend/src/pages/hospital/HospitalPage.jsx
?? docs/plan/A/reports/REPORT_A11.md
?? frontend/src/pages/hospital/SubmitClaimForm.jsx
```

Độ dài từng file (số dòng):
- `frontend/src/pages/hospital/SubmitClaimForm.jsx`: 156 dòng
- `frontend/src/pages/hospital/HospitalPage.jsx`: 21 dòng

## 3. Lệnh kiểm tra và kết quả THẬT

### 1. Lệnh `npm run build`:
```text
cmd /c "cd frontend && npm run build"
> medichain-frontend@1.0.0 build
> vite build

vite v7.3.7 building client environment for production...
transforming...
✓ 212 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                          0.54 kB │ gzip:   0.35 kB
dist/assets/HospitalPage-DoR1jthi.css    0.70 kB │ gzip:   0.34 kB
dist/assets/index-Ckaj7kWt.css           1.74 kB │ gzip:   0.75 kB
dist/assets/PatientPage-CCRrwFxr.js      0.38 kB │ gzip:   0.30 kB
dist/assets/InsurerPage-CsKcI9Bv.js      0.64 kB │ gzip:   0.43 kB
dist/assets/HospitalPage-BzsrKOTW.js    23.74 kB │ gzip:   8.23 kB
dist/assets/index-BDblgyNc.js          544.89 kB │ gzip: 183.60 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 3.31s
```

### 2. Kiểm tra mẫu lệnh cấm:
```powershell
Get-ChildItem -Path frontend/src/pages/hospital -Recurse | Select-String -Pattern "ethers\.(providers|utils|constants|BigNumber)|new ethers\.Contract|parseFloat|alert\(|console\.log|crypto\.subtle|fetch\(|services/mock|pages/(patient|insurer)"
```
Kết quả: Rỗng (Không có dòng nào vi phạm).

## 4. Tự kiểm theo checklist
- [x] Chỉ sửa trong `frontend/src/pages/hospital/`.
- [x] Thứ tự luồng chuẩn: kiểm tra đầu vào -> chạy thử `dryRun` -> lấy khóa công khai của 3 bên -> tải hóa đơn lên IPFS -> mã hóa bệnh án phong bì lai -> tải bệnh án mã hóa lên IPFS -> gửi `submitClaim` on-chain.
- [x] Đủ 3 người nhận trong `recipients`: Bệnh nhân, Bệnh viện, Công ty bảo hiểm; địa chỉ đã chuẩn hóa chữ thường (`.toLowerCase()`).
- [x] Cấu trúc `EncryptedRecord`: `meta` chữ rõ (`visitDate`, `hospitalName`, `billCID`), `secret` mã hóa (`patientName`, `healthId`, `diagnosis`, `treatment`, `labResults`, `doctor`, `totalCost`) đúng File 00 mục 6.6.
- [x] Tiền dùng `ethers.parseEther` để đổi sang `bigint` wei; so sánh hạn mức bằng `BigInt(verified.remainingLimit)`.
- [x] Tích hợp `TxToast` hiển thị hash giao dịch thành công và mã CID của hóa đơn, hồ sơ bệnh án.
- [x] Không `console.log` dữ liệu nhạy cảm, không gọi `crypto.subtle` hay `fetch` trực tiếp (chỉ qua `services/index.js`).

## 5. Chỗ KHÁC với file chặng
- Không có khác biệt về mặt logic; tích hợp `TxToast` vào phần hiển thị kết quả thành công đúng theo gợi ý tại mục 4 Bước 1 của file chặng.

## 6. Điều chưa chắc / câu hỏi cho người dùng
- Không có.

## 7. Việc cần người khác làm (luật R16 file 00)
- Không có.

## 8. Đề xuất cải tiến (chỉ ghi, KHÔNG làm)
- Có thể thêm nút xem trước file hóa đơn (preview image/PDF) trước khi bấm gửi.

## 9. Bước tiếp theo
- Chặng **A12** — Màn hình Bệnh viện, phần 3: Xác nhận chi phí, ghép trang, chuyển sang contract thật (`docs/plan/A/A12_bv_xac_nhan_va_ghep.md`).
