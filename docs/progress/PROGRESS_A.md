# PROGRESS — Thành viên A (Trâm)
Cập nhật lần cuối: 24/10/2026

## Đã xong
- [x] M0 — Khởi tạo repo MediChain, cây thư mục, luật chung (do A (Trâm) làm). Nhánh làm việc của mình: `tram`
- [x] A01 — Khởi tạo Hardhat v2, OpenZeppelin v5, biên dịch thành công evm cancun. Báo cáo: docs/plan/A/reports/REPORT_A01.md
- [x] A02 — Viết bản khung Smart Contract HealthInsuranceNFT.sol (10 event, 17 hàm, struct, khớp dấu vân tay d453413b0dc38f64). Báo cáo: docs/plan/A/reports/REPORT_A02.md
- [x] A03 — Script xuất ABI và deploy (exportAbi.js, deploy.js, sinh abi.json và address.json, mốc H2). Báo cáo: docs/plan/A/reports/REPORT_A03.md

## Bước tiếp theo
- Chặng A04: Nghiệp vụ 1: Thiết lập hệ thống (`docs/plan/A/A04_nghiep_vu1_thiet_lap.md`).

## Đang làm / dừng ở đâu
- Task hiện tại: A03 đã hoàn thành
- Bước tiếp theo (làm ngay): Chặng A04

## File đã tạo / sửa (liệt kê theo đường dẫn)
- `contracts-hardhat/scripts/exportAbi.js` — tạo mới
- `contracts-hardhat/scripts/deploy.js` — tạo mới
- `frontend/src/contracts/abi.json` — sinh tự động qua script
- `frontend/src/contracts/address.json` — sinh tự động qua script
- `docs/plan/A/reports/REPORT_A03.md` — tạo mới
- `docs/progress/PROGRESS_A.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- Mốc H2 sẵn sàng bàn giao cho C (Lan Anh) và B (Phương Anh).

## Vấn đề đang kẹt / cần người khác
- Không có.

## Yêu cầu gửi người khác
- [ ] Gửi cả nhóm (B, C): "H2 xong: contract khung + abi.json + address.json (local), git pull nhé".

## Cách chạy / kiểm tra phần đã làm
- Lệnh: `cd contracts-hardhat && npx hardhat run scripts/deploy.js --network localhost`  Kết quả: Deploy thành công, ghi abi.json và address.json.
