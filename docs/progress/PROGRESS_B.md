# PROGRESS — Thành viên B (Phương Anh)

Cập nhật lần cuối: 18/11/2026

## Đã xong

* [x] M0 — Khởi tạo repo MediChain, cây thư mục, luật chung. Nhánh làm việc của mình: `phuong-anh`.
* [x] B-01 — Tạo tài khoản Pinata, cấu hình `frontend/.env`, chuẩn bị thư mục `sample-data/` với đầy đủ file mẫu (`Policy_Basic.pdf`, `Policy_Premium.pdf`, `Medical_Bill_01.png`, `Lab_Result_01.pdf`, `Medical_Record_01.json`, `DEMO_SCENARIO.md`).
* [x] B-02 — Viết các bản giả lập `fixtures.js`, `mockIpfs.js`, `mockCrypto.js` và `services/index.js` (Mốc H1).
* [x] B-03 — Viết dịch vụ mã hóa RSA thật (WebCrypto thuần: `generateRsaKeyPair`, `rsaEncrypt`, `rsaDecrypt`).
* [x] B-04 — Hoàn thiện mã hóa AES-256-GCM và phong bì khóa RSA (`buildEncryptedRecord`, `openEncryptedRecord`).
* [x] B-05, B-06 — Nối Pinata REST API thật (`ipfsService.js`), test upload thành công các loại file và lưu trữ CID thật tại `sample-data/REAL_CIDS.md`.
* [x] B-09 đến B-12 — Xây dựng và hoàn thiện phân hệ giao diện Công ty bảo hiểm (`/insurer`): Quản lý KeySetup, tạo gói bảo hiểm (`PlansAdmin.jsx`), phân quyền bệnh viện (`HospitalAdmin.jsx`), quản lý quỹ (`FundPanel.jsx`), bảng quản lý bồi thường (`ClaimsTable.jsx`), giải mã hồ sơ IPFS (Retrieve) và giám sát sự kiện/thống kê (`Monitor.jsx`).
* [x] B-15 đến B-17 — Đăng ký khóa mã hóa Admin trên Sepolia, tạo 2 gói bảo hiểm thật on-chain (Plan #1: 0.002 ETH; Plan #2: 0.005 ETH) tại contract `0x9B5868254c31818320d2DDCBb5B28f15af265b62`, thực hiện kiểm thử E2E phân hệ bảo hiểm trên Sepolia với ví Admin (`0x3FBBa628dC4C30DCE74Eb38d015D409125750639`).
* [x] Hoàn tất kiểm thử E2E Phần B (`E2E_B_INSURER.md`) và cập nhật tiến độ vào bảng `PROGRESS_B_E2E_SECTION.md` với kết quả đạt 100% (Pass).

## Bước tiếp theo

* Hỗ trợ Lan Anh (C) và Trâm (A) kiểm tra các luồng tương tác tích hợp cuối cùng trước khi ghi hình video demo.
* Chuẩn bị tài liệu và slide sẵn sàng cho buổi thuyết trình trực tiếp (trước 04/12).

## Đang làm / dừng ở đâu

* Toàn bộ các nhiệm vụ kỹ thuật và kiểm thử E2E phần B (Công ty bảo hiểm + IPFS + mã hóa) đã hoàn thành 100%.

## File đã tạo / sửa (liệt kê theo đường dẫn)

* `frontend/src/services/cryptoService.js` — sửa / hoàn thiện
* `frontend/src/services/ipfsService.js` — sửa / hoàn thiện
* `frontend/src/pages/insurer/InsurerPage.jsx` và các component con (`KeySetup.jsx`, `PlansAdmin.jsx`, `HospitalAdmin.jsx`, `FundPanel.jsx`, `ClaimsTable.jsx`, `Monitor.jsx`) — tạo mới / hoàn thiện
* `sample-data/REAL_CIDS.md` — tạo mới
* `docs/plan/B/E2E_B_INSURER.md` — sửa (cập nhật kết quả Pass)
* `docs/progress/PROGRESS_B.md` — sửa

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)

* Sử dụng mô hình mã hóa bọc khóa RSA-OAEP kết hợp AES-256-GCM thuần WebCrypto hoàn toàn không phụ thuộc thư viện ngoài.
* Sử dụng Pinata API để quản lý lưu trữ phi tập trung trên IPFS, đảm bảo phân quyền chặt chẽ thông qua cấu trúc `keyWraps`.
* Hoàn tất cấu hình ví Admin trên Sepolia (`0x3FBBa628dC4C30DCE74Eb38d015D409125750639`) để thực hiện thành công các nghiệp vụ 1, 4, 5.

## Vấn đề đang kẹt / cần người khác

* Không có.

## Yêu cầu gửi người khác

* C (Lan Anh) và A (Trâm): Sẵn sàng phối hợp kiểm tra lần cuối cho video demo tổng thể.
