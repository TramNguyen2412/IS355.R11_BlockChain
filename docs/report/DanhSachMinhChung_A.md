# DANH SÁCH MINH CHỨNG NGHIỆM THU ĐỒ ÁN (EVIDENCE CHECKLIST)
- Thành viên phụ trách: Thành viên A (Trâm) — Smart Contract & Hospital UI
- Mạng triển khai: Ethereum Sepolia Testnet (Chain ID `11155111`)
- Hợp đồng chính thức: `0x9B5868254c31818320d2DDCBb5B28f15af265b62` (Deploy block: `12103715`)

---

## Bảng theo dõi minh chứng báo cáo và bảo vệ đồ án

| # | Hạng mục minh chứng | Mô tả chi tiết | Đường dẫn / Minh chứng thực tế | Đã có? |
|:---:|---|---|---|:---:|
| 1 | **Mã nguồn Smart Contract đã Verify trên Etherscan** | Trang hợp đồng `HealthInsuranceNFT` có dấu tích xanh ✅ (Contract Source Code Verified) trên Etherscan Sepolia. | [https://sepolia.etherscan.io/address/0x9B5868254c31818320d2DDCBb5B28f15af265b62#code](https://sepolia.etherscan.io/address/0x9B5868254c31818320d2DDCBb5B28f15af265b62#code) | [x] |
| 2 | **Giao dịch Mua bảo hiểm & Mint NFT Soulbound** | Giao dịch `purchasePolicy` của bệnh nhân trên Sepolia và tab ERC-721 Tokens (NFT Token ID #1). | *Link tx hash trên Sepolia:* | [ ] |
| 3 | **Giao dịch Bệnh viện Xác nhận viện phí** | Giao dịch `confirmClaim` của ví Bệnh viện (`0xb381e33456e08F79cdeA9722506dabbdF2933F12`) trên Etherscan Sepolia. | *Link tx hash trên Sepolia:* | [ ] |
| 4 | **Giao dịch Chi trả bồi thường chuyển ETH** | Giao dịch `approveClaim` tự động chuyển ETH từ quỹ hợp đồng cho bệnh nhân (tab *Internal Txns* trên Sepolia Etherscan). | *Link tx hash trên Sepolia:* | [ ] |
| 5 | **Kết quả Kiểm thử tự động (Unit Test)** | Ảnh chụp terminal chạy lệnh `npx hardhat test` đạt 34/34 passing (2s). | `docs/report/test_output.txt` (34 passing) | [x] |
| 6 | **Bảng đo lường tiêu thụ Gas** | Bảng chi tiết lượng gas min, max, avg của 10 hàm nghiệp vụ và phí triển khai hợp đồng từ `hardhat-gas-reporter`. | `docs/report/BangGas_A.md` | [x] |
| 7 | **Giao diện Màn hình Bệnh viện (UI)** | Ảnh chụp 4 khối chức năng: Khóa RSA, Kiểm tra thẻ NFT, Form gửi bồi thường (IPFS + mã hóa), Bảng xác nhận viện phí. | `docs/report/images/C/Trang HOSPITAL.png` | [x] |
| 8 | **Mốc phát hành mã nguồn Git Tag** | Mã băm commit của git tag `v1-sepolia` đánh dấu mốc bàn giao hợp đồng chính thức trên GitHub. | *Git tag hash:* | [ ] |

---
*Ghi chú: Các ô đánh dấu `[ ]` là giao dịch thực hiện trực tiếp trong phiên chạy demo liên luồng với các thành viên B và C, sẽ được điền bổ sung mã hash cụ thể.*
