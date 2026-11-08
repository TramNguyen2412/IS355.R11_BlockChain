# MediChain – DEMO SCENARIO

> DỮ LIỆU GIẢ – dùng cho demo và kiểm thử. Các số tiền wei được giữ dưới dạng chuỗi để tránh mất độ chính xác.

## 6.2. Hai gói bảo hiểm mẫu

| Thuộc tính | Gói 1 – Gói Cơ bản | Gói 2 – Gói Nâng cao |
|---|---:|---:|
| id | 1 | 2 |
| price | 0.002 ETH = `2000000000000000` wei | 0.005 ETH = `5000000000000000` wei |
| coverageLimit | 0.02 ETH = `20000000000000000` wei | 0.05 ETH = `50000000000000000` wei |
| durationDays | 30 | 90 |
| policyDocCID | `mock-cid-policy-basic` | `mock-cid-policy-premium` |
| active | `true` | `true` |

**Quỹ nạp ban đầu:** 0.1 ETH = `100000000000000000` wei.

## 6.3. Kịch bản số tiền chuẩn

| Bước | Số tiền | Kết quả mong đợi |
|---|---|---|
| Claim 1 (hợp lệ) | 0.012 ETH = `12000000000000000` wei | Duyệt thành công. `usedAmount = 0.012`, `remainingLimit = 0.008 ETH = 8000000000000000 wei` |
| Claim 2 (cố ý vượt hạn mức) | 0.015 ETH = `15000000000000000` wei | Bị từ chối bởi `Vuot qua han muc bao hiem` |

## Ghi chú đối chiếu

- Claim 1 được duyệt: hạn mức gói Cơ bản là 0.02 ETH, sử dụng 0.012 ETH, còn lại 0.008 ETH.
- Claim 2 là tình huống cố ý yêu cầu vượt hạn mức còn lại sau Claim 1.
- CID trong tài liệu là CID mock; không dùng CID bắt đầu bằng `mock-` khi chạy Sepolia thật.
- Số tiền trong JSON/fixture phải giữ dạng chuỗi; khi nạp vào JavaScript dùng `BigInt("...")`.
