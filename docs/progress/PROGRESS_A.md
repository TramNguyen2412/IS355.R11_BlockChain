# PROGRESS — Thành viên A (Trâm)
Cập nhật lần cuối: 24/10/2026

## Đã xong
- [x] M0 — Khởi tạo repo MediChain, cây thư mục, luật chung (do A (Trâm) làm). Nhánh làm việc của mình: `tram`
- [x] A01 — Khởi tạo Hardhat v2, OpenZeppelin v5, biên dịch thành công evm cancun. Báo cáo: docs/plan/A/reports/REPORT_A01.md
- [x] A02 — Viết bản khung Smart Contract HealthInsuranceNFT.sol (10 event, 17 hàm, struct, khớp dấu vân tay d453413b0dc38f64). Báo cáo: docs/plan/A/reports/REPORT_A02.md

## Bước tiếp theo
- Chặng A03: Viết script tự xuất ABI và deploy (`docs/plan/A/A03_script_xuat_abi_deploy.md`, mốc H2).

## Đang làm / dừng ở đâu
- Task hiện tại: A02 đã hoàn thành
- Bước tiếp theo (làm ngay): Chặng A03

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `contracts-hardhat/contracts/HealthInsuranceNFT.sol` — sửa (ghi đè bản khung)
- `docs/plan/A/reports/REPORT_A02.md` — tạo mới
- `docs/progress/PROGRESS_A.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Bản khung giữ nguyên 100% 17 hàm và 10 event đóng băng theo file 00 mục 4.2.

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- Không có.

## Cách chạy / kiểm tra phần đã làm
- Lệnh: `cd contracts-hardhat && npx hardhat compile`  Kết quả: Compiled 1 Solidity file successfully (evm target: cancun).
