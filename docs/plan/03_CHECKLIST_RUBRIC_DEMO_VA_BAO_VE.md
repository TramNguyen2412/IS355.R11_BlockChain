# FILE 3 — CHECKLIST RUBRIC, TEST CASE, KỊCH BẢN DEMO, BẢO VỆ

> **CẬP NHẬT 23/10/2026:** Sản phẩm tên **MediChain** (contract trong code vẫn là `HealthInsuranceNFT`). Phân công: A = Trâm, B = Phương Anh, C = Lan Anh. Mốc ngày thực tế theo `docs/plan/00_MASTER_PLAN.md` (thuyết trình trực tiếp xong trước 04/12; nộp Word + video hạn chốt 08/12/2026). Số liệu mẫu và hợp đồng giao tiếp theo `docs/00_AI_RULES_AND_CONTRACTS.md`; nếu khác file này thì theo file 00.

Dùng file này **ở cuối mỗi giai đoạn** để tự chấm. Rubric chia 5 tiêu chí × 10 điểm. Làm đủ mới có điểm, thiếu một ý nhỏ cũng mất điểm ý đó.

---

## 1. CHECKLIST CHẤM ĐIỂM THEO RUBRIC (tick từng ô trước khi nộp)

### Tiêu chí 1 — Smart contract (10đ)
- [ ] ≥ 3 nghiệp vụ chính: `purchasePolicy`, `submitClaim`, `approveClaim` (đúng tên như đề). Có thêm `confirmClaim`, `verifyInsurance`.
- [ ] ≥ 2 ràng buộc logic: (1) chỉ ví bệnh viện được ủy quyền mới xác nhận chi phí (`onlyRole(HOSPITAL_ROLE)`); (2) tiền bồi thường không vượt hạn mức gói (`usedAmount + amount <= coverageLimit`), cộng thêm kiểm tra hạn dùng và quỹ.
- [ ] Dùng `struct` để lưu gói bảo hiểm và `mapping` để quản lý claim (đề bài Bước 2 nhắc rõ).
- [ ] **Báo cáo có mục riêng "Kỹ thuật thực hiện ràng buộc logic"**, cắt đúng đoạn code, giải thích từng dòng. (Rubric ghi: *"các nhóm nhớ trình bày kỹ thuật thực hiện ràng buộc"*)
- [ ] **Deploy lên Sepolia** (Goerli đã ngừng, dùng Sepolia). Có địa chỉ contract ghi trong báo cáo + slide.
- [ ] Có ảnh/giao dịch minh chứng trên Etherscan; contract đã **verify mã nguồn**.
- [ ] Có kiểm thử (unit test) và ảnh kết quả `passing`.
- [ ] Có phần **minh họa và giải thích chức năng** từng hàm (bảng hàm: ai gọi, làm gì, kiểm tra gì, event gì).

### Tiêu chí 2 — Frontend / Web3 (10đ)
- [ ] ≥ 3 chức năng tương tác on-chain gồm: **gửi giao dịch** (mua gói, gửi claim, xác nhận, duyệt), **đọc dữ liệu** (xem thẻ, hạn mức), **hiển thị trạng thái** (Pending/Approved/Rejected).
- [ ] **Dashboard Bệnh nhân** xem được số dư bảo hiểm (hạn mức còn lại) và trạng thái claim.
- [ ] **Console Công ty bảo hiểm** theo dõi giao dịch on-chain và thống kê bồi thường.
- [ ] **Mã hóa** thông tin mã số bảo hiểm và tình trạng bệnh lý nhạy cảm **trước khi** gửi đi (RSA-OAEP và AES-256-GCM). Có ảnh minh họa "bản rõ → bản mã".
- [ ] **Demo tối đa 1 lỗi giao dịch** (xem mục 3 để tránh lỗi).
- [ ] Hiển thị hash giao dịch/trạng thái pending → confirmed cho người dùng.
- [ ] (Tùy chọn, củng cố tên tiêu chí) Script Web3.py nhỏ đọc event.

### Tiêu chí 3 — IPFS (10đ)
- [ ] **3 loại dữ liệu**: (1) PDF hợp đồng/điều khoản, (2) hóa đơn viện phí (ảnh hoặc PDF), (3) kết quả xét nghiệm/bệnh án (JSON hoặc file).
- [ ] **2 thao tác**: Upload (khi gửi claim) và Retrieve (công ty BH lấy CID từ chain, tải về xem).
- [ ] **Kiểm soát truy cập RBAC** với tài nguyên: mã hóa + chỉ đúng vai trò mới thấy nút/giải mã. Có demo ví thứ 4 bị chặn.
- [ ] Demo **truy xuất thành công**.
- [ ] Có ảnh trang Pinata liệt kê file đã tải lên, ghi CID vào báo cáo.

### Tiêu chí 4 — Token ERC-20/NFT (10đ)
- [ ] Tạo thành công NFT **ERC-721** thẻ bảo hiểm (thông tin thời hạn, hạn mức, quyền lợi nằm trong `Policy` gắn `tokenId`).
- [ ] **Nghiệp vụ 1 — Minting:** NFT được phát hành khi thanh toán phí thành công.
- [ ] **Nghiệp vụ 2 — Verification:** bệnh viện kiểm tra NFT của ví bệnh nhân để biết gói còn hiệu lực.
- [ ] Có kiểm thử hoặc demo giao dịch (cả hai).
- [ ] (Điểm cộng) soulbound, `tokenURI` trỏ IPFS, hiển thị NFT trên Etherscan token tracker.

### Tiêu chí 5 — Báo cáo & thuyết trình (10đ)
**Hình thức (những mục "cho không", dễ bị trừ vì quên):**
- [ ] **Không lỗi chính tả** (đọc lại 2 vòng, nhờ người khác đọc; chú ý tiếng Việt có dấu và tên riêng).
- [ ] **Số trang** (Word) và **số slide** đều có.
- [ ] **Caption cho mọi hình ảnh và bảng biểu** (ví dụ *Hình 3.1. Sơ đồ BPMN quy trình mua bảo hiểm*, *Bảng 3.2. Phân loại dữ liệu on-chain và off-chain*). Đánh số theo chương.
- [ ] **Bảng chữ viết tắt** (mục 6).
- [ ] **Tài liệu tham khảo** (chuẩn trích dẫn thống nhất, có link và ngày truy cập).
- [ ] **Cỡ chữ Word > 14** và **cỡ chữ slide > 18**. Lưu ý quy định này nên áp dụng cho **mọi chữ**, kể cả:
  - chữ trong bảng, caption, chú thích dưới hình, tiêu đề mục (đừng để 11–12pt trong bảng)
  - chữ trong slide: bảng, chú thích, số trang, footer
  - Đặt bảng/hình sao cho chữ vẫn đọc được. Nếu bảng quá rộng thì tách bảng hoặc xoay trang ngang, đừng giảm cỡ chữ.
  - Đề xuất: Word nội dung **15pt** (hoặc 14.5pt), caption **14.5–15pt**; slide tối thiểu **20pt**.
- [ ] **Màu sắc tương phản:** nền sáng + chữ tối (hoặc ngược lại), không dùng chữ xám nhạt, không chữ vàng trên nền trắng. Ảnh chụp màn hình nên ở **chế độ sáng**.
- [ ] **Video demo (nếu dùng) có phụ đề (caption).** Phụ đề tiếng Việt, đủ lớn, đọc kịp.
- [ ] Số trang, số slide hợp lý: không nhồi chữ; slide mỗi trang 1 ý chính, chủ yếu hình + từ khóa.
- [ ] Tên contract, tên hàm, tên biến, số liệu **nhất quán toàn bộ báo cáo** (khác lỗi của báo cáo trễ chuyến bay: bị lẫn LOGI/FLC/Charity Token). Không để sót tên đồ án khác.

---

## 2. DANH SÁCH TEST CASE (cho A viết, cho C/B kiểm tra chéo)

Dùng Hardhat + Chai. Chia theo nhóm. Mỗi test ghi rõ mong đợi. (≥ 25 case là rất đủ.)

### Nhóm Triển khai và phân quyền
| # | Test | Mong đợi |
|---|---|---|
| T01 | Deploy contract | Deployer có `DEFAULT_ADMIN_ROLE`, tên/ký hiệu NFT đúng |
| T02 | Admin cấp quyền bệnh viện | `hasRole(HOSPITAL_ROLE, hospital) == true`, phát event `HospitalAuthorized` |
| T03 | Ví không phải admin gọi `authorizeHospital` | Revert (AccessControl) |
| T04 | Admin thu hồi quyền bệnh viện | `hasRole` trả false |

### Nhóm Gói bảo hiểm (Plan)
| # | Test | Mong đợi |
|---|---|---|
| T05 | Admin tạo gói hợp lệ | Gói lưu đúng giá, hạn mức, thời hạn, CID; event `PlanCreated` |
| T06 | Ví lạ tạo gói | Revert |
| T07 | Tạo gói với giá = 0 hoặc hạn mức = 0 | Revert |
| T08 | Tắt gói rồi mua | Revert (gói không còn hoạt động) |

### Nhóm Mua bảo hiểm và NFT (Tiêu chí 4)
| # | Test | Mong đợi |
|---|---|---|
| T09 | Bệnh nhân mua đúng giá | Mint NFT, `ownerOf(tokenId) == patient`, `Policy` đúng hạn mức và hạn dùng, event `PolicyPurchased` |
| T10 | Gửi sai số ETH (thiếu/thừa) | Revert |
| T11 | Mua khi đã có gói còn hạn | Revert |
| T12 | Chuyển nhượng NFT (`transferFrom`) | Revert "Soulbound" |
| T13 | `verifyInsurance` ví có thẻ còn hạn | `isValid = true`, đúng `tokenId`, `remainingLimit`, `expiryDate` |
| T14 | `verifyInsurance` ví không có thẻ | `isValid = false` |
| T15 | `verifyInsurance` sau khi hết hạn (tăng thời gian bằng `time.increase`) | `isValid = false` |

### Nhóm Claim và ràng buộc (Tiêu chí 1)
| # | Test | Mong đợi |
|---|---|---|
| T16 | Bệnh viện hợp lệ gọi `submitClaim` đúng hạn mức | Tạo claim PENDING, `hospitalConfirmed = true`, event `ClaimSubmitted` |
| T17 | Bệnh nhân gọi `submitClaim` | Tạo claim PENDING, `hospitalConfirmed = false` |
| T18 | Ví lạ (không phải chủ NFT, không phải bệnh viện) `submitClaim` | Revert |
| T19 | **`submitClaim` với số tiền > hạn mức còn lại** | Revert "Vuot qua han muc bao hiem" |
| T20 | **Ví lạ gọi `confirmClaim`** | Revert (AccessControl): ràng buộc 1 |
| T21 | Bệnh viện hợp lệ `confirmClaim` | `hospitalConfirmed = true`, `confirmedAmount` đúng |
| T22 | `confirmClaim` với `confirmedAmount > amount` | Revert |
| T23 | `submitClaim` khi gói đã hết hạn | Revert "Bao hiem da het han" |

### Nhóm Duyệt và chi trả (Tiêu chí 1, 4)
| # | Test | Mong đợi |
|---|---|---|
| T24 | `approveClaim` khi bệnh viện chưa xác nhận | Revert "Benh vien chua xac nhan" |
| T25 | **`approveClaim` hợp lệ** | Trạng thái APPROVED, `usedAmount` tăng, **số dư ví bệnh nhân tăng đúng số tiền**, số dư contract giảm đúng, event `ClaimApproved` |
| T26 | `approveClaim` lần 2 trên cùng claim | Revert "Claim da xu ly" (chống trả hai lần) |
| T27 | Hai claim cùng chờ, tổng vượt hạn mức | Claim đầu được duyệt; claim sau revert "Vuot qua han muc bao hiem" khi duyệt |
| T28 | Quỹ không đủ | Revert "Quy bao hiem khong du" |
| T29 | `rejectClaim` bởi admin | Trạng thái REJECTED, không mất tiền quỹ |
| T30 | `rejectClaim` bởi ví lạ | Revert |

### Nhóm Bảo mật nâng cao (nên có, điểm cộng)
| # | Test | Mong đợi |
|---|---|---|
| T31 | Reentrancy: contract độc hại có hàm `receive()` gọi lại `approveClaim` | Lần gọi lại bị chặn; số tiền chỉ nhận 1 lần |
| T32 | `fundPool` cộng đúng vào `poolBalance` | Đúng số dư |

**Cách báo cáo test:** chụp ảnh kết quả `npx hardhat test` (nền sáng), kèm bảng test case (số thứ tự, mô tả, kết quả mong đợi, kết quả thực tế: Pass). Giải thích 2–3 test quan trọng (T19, T20, T25).

---

## 3. KỊCH BẢN DEMO CHUẨN (và cách giữ "tối đa 1 lỗi giao dịch")

### 3.1. Số liệu cố định (dùng cho cả A, B, C)
Dùng số tiền nhỏ vì ETH Sepolia hạn chế (nên mua/chuẩn bị đủ trước ngày demo, các giá trị dưới đây là gợi ý, nhóm tự chỉnh):

| Mục | Giá trị gợi ý |
|---|---|
| Gói "Cơ bản": giá / hạn mức / thời hạn | 0.002 ETH / 0.02 ETH / 30 ngày |
| Gói "Nâng cao": giá / hạn mức / thời hạn | 0.005 ETH / 0.05 ETH / 90 ngày |
| Quỹ bảo hiểm nạp trước | 0.1 ETH (đủ trả vài claim) |
| Claim 1 (hợp lệ) | 0.012 ETH → còn hạn mức 0.008 |
| Claim 2 (cố ý vượt hạn mức) | 0.015 ETH |

Cần chuẩn bị ví: Admin (deployer, cần nhiều ETH nhất cho gas + quỹ), Bệnh viện (ít gas), Bệnh nhân (đủ trả phí 0.002–0.005 + gas), Người ngoài (chỉ cần chút gas hoặc không cần).

### 3.2. Trước giờ demo (pre-flight, 20 phút trước)
- [ ] Mạng MetaMask đã ở **Sepolia**, mỗi ví đủ ETH (có thể kiểm tra số dư).
- [ ] RPC chạy bình thường (mở Etherscan Sepolia xem có block mới).
- [ ] Contract đã deploy, **quỹ đã nạp**, **bệnh viện đã được cấp quyền**, **gói đã tạo** (seed).
- [ ] Pinata JWT còn hiệu lực, thử upload một file nhỏ.
- [ ] Khóa RSA của 3 vai trò đã tạo, đã đăng ký lên contract, **đã sao lưu** (xuất file).
- [ ] File dữ liệu mẫu để sẵn trên màn hình/thư mục.
- [ ] Trình duyệt dùng hồ sơ (profile) riêng chỉ có MetaMask, tắt thông báo, phóng to giao diện (zoom 125%).
- [ ] Video dự phòng đã chép sẵn vào máy trình chiếu.
- [ ] Mạng dự phòng (hotspot điện thoại).

### 3.3. Luồng chạy chuẩn (khoảng 8–10 phút)
1. **Giới thiệu nhanh** (30 giây): vấn đề, giải pháp, 3 tác nhân.
2. **Công ty BH (ví Admin):** mở Console, cho xem gói đã tạo (PDF điều khoản trên IPFS), danh sách bệnh viện được cấp quyền, số dư quỹ. *(Tiêu chí 1, 3)*
3. **Bệnh nhân (ví Bệnh nhân):** chọn Gói Cơ bản → nhập mã số BH (mã hóa) → mua → ký MetaMask → **NFT xuất hiện**, hiển thị hạn mức 0.02 ETH. Mở Etherscan xem giao dịch + token. *(Tiêu chí 2, 4: Minting)*
4. **Bệnh viện (ví Bệnh viện):** nhập ví bệnh nhân → **Kiểm tra thẻ → "Thẻ #1 hợp lệ, còn 0.02 ETH"**. *(Tiêu chí 4: Verification)*
5. Bệnh viện nhập chi phí 0.012 ETH, chẩn đoán (hiển thị bản mã sau khi mã hóa), chọn hóa đơn và xét nghiệm → upload IPFS (hiện CID) → `submitClaim`. *(Tiêu chí 2, 3: Upload)*
6. **Công ty BH:** thấy claim mới ở trạng thái Pending → bấm **Xem hồ sơ IPFS** (giải mã được, thấy hóa đơn và chẩn đoán) *(Tiêu chí 3: Retrieve)* → bấm **Duyệt và chi trả** → contract kiểm tra và chuyển tiền → trạng thái Approved, thống kê thay đổi. *(Tiêu chí 1: nghiệp vụ 3)*
7. **Bệnh nhân:** dashboard cập nhật Approved, hạn mức còn 0.008, số dư ví tăng.
8. **Chứng minh ràng buộc (chọn 1 cách, xem 3.4):** Claim 0.015 > 0.008 bị chặn; ví người ngoài không giải mã được hồ sơ và không bấm được nút xác nhận.
9. **Tổng kết** 30 giây + trỏ vào link Etherscan contract đã verify.

### 3.4. Cách chứng minh ràng buộc mà KHÔNG tạo giao dịch lỗi on-chain
Rubric chỉ cho **tối đa 1 lỗi giao dịch**. Để an toàn:
- Giao diện **kiểm tra trước** bằng `staticCall`/`estimateGas`: nếu sẽ revert thì hiện lỗi tiếng Việt ngay, **không gửi giao dịch**, nên không có giao dịch thất bại trên chain.
- Nếu muốn cho thầy thấy một revert thật: chỉ làm **một lần**, báo trước "đây là lỗi cố ý để minh họa ràng buộc hạn mức", và để đó là lỗi duy nhất.
- Các test revert còn lại (T19, T20, T26...) để cho phần unit test trong báo cáo và video.

### 3.5. Nếu có sự cố khi demo
| Sự cố | Cách xử lý |
|---|---|
| MetaMask không bật cửa sổ ký | Bấm biểu tượng MetaMask để mở thủ công, hoặc tải lại trang |
| Giao dịch pending lâu | Đợi tối đa 1–2 phút (Sepolia thường vài giây). Có thể mở Etherscan xem hash. Nếu quá lâu: chuyển sang video dự phòng |
| Pinata upload lỗi | Dùng CID đã upload sẵn từ trước (có để sẵn trong ghi chú), hoặc phát video |
| RPC chậm | Đổi RPC dự phòng đã chuẩn bị |
| Hết ETH ở một ví | Có ví phụ có ETH |
| Giải mã báo lỗi | Kiểm tra đúng ví/đúng khóa RSA; nhập lại khóa từ file sao lưu |

---

## 4. CHI PHÍ VÀ NGUỒN LỰC CẦN CHUẨN BỊ

| Việc | Ghi chú |
|---|---|
| ETH Sepolia | Xin từ các faucet đang hoạt động; faucet có thể giới hạn theo ngày/ví. Xin sớm, chia nhiều ví, giữ dự phòng. Kiểm tra faucet nào còn chạy tại thời điểm làm |
| RPC | Alchemy/Infura miễn phí đủ dùng |
| Pinata | Gói miễn phí đủ dùng, chú ý giới hạn dung lượng/số file |
| Etherscan API | Miễn phí, dùng cho verify |
| Gas | Mỗi hàm ghi tốn gas; số liệu gas thực tế A đo bằng gas reporter hoặc xem trên Etherscan |

---

## 5. CÂU HỎI BẢO VỆ CÓ THỂ GẶP (mỗi người học phần của mình, nắm sơ lược phần người khác)

### Về blockchain và thiết kế
1. **Dữ liệu trên blockchain không sửa được, vậy nếu nhập sai thì sao?** → Không sửa được bản ghi cũ; ghi giao dịch mới để đính chính (ví dụ `rejectClaim`, tạo claim mới). Lịch sử luôn truy vết được.
2. **"Tự động duyệt" nghĩa là gì? Contract có tự chạy không?** → Không tự chạy. Cần giao dịch gọi `approveClaim`, nhưng khi được gọi thì contract tự kiểm tra điều kiện và tự chi trả, không có quyết định của con người. Ai cũng có thể gọi, kết quả như nhau.
3. **Vì sao chọn Solidity trong khi lab dùng Vyper?** → Đề bài yêu cầu Solidity; có OpenZeppelin ERC-721 và AccessControl đã được kiểm toán; hệ sinh thái Hardhat/ethers mạnh. Vyper đơn giản và an toàn hơn nhưng ít thư viện chuẩn.
4. **Vì sao dùng NFT chứ không chỉ mapping địa chỉ → gói bảo hiểm?** → NFT là chuẩn ERC-721, ví và explorer hiểu được, có thể kiểm tra "sở hữu thẻ" độc lập với hệ thống của ta, mở rộng tương lai (tương tác với hệ thống khác). Mình khóa chuyển nhượng để tránh mua bán thẻ.
5. **Vì sao NFT khóa chuyển nhượng?** → Thẻ bảo hiểm y tế gắn với người; nếu chuyển được thì người khác có thể dùng thẻ của người khác, mất ý nghĩa xác minh.

### Về bảo mật
6. **Bệnh án công khai trên IPFS à?** → Có thể ai cũng tải được tệp nếu biết CID, nhưng nội dung đã mã hóa AES-256-GCM; chỉ người có khóa riêng RSA tương ứng mới mở được khóa AES.
7. **Ai giữ khóa? Mất khóa thì sao?** → Khóa riêng RSA nằm ở trình duyệt người dùng, có chức năng xuất/nhập sao lưu. Mất khóa là mất quyền giải mã (hạn chế đã nêu, hướng giải quyết: khôi phục khóa qua ví hoặc lưu giữ ủy thác).
8. **Chống reentrancy thế nào?** → `nonReentrant` + cập nhật trạng thái (`APPROVED`, `usedAmount`) **trước** khi chuyển ETH (Checks-Effects-Interactions); chi trả bằng `call` kiểm tra kết quả.
9. **Tràn số?** → Solidity ≥ 0.8 tự kiểm tra.
10. **Bệnh viện gian lận (khai khống chi phí) thì sao?** → Chỉ bệnh viện được admin ủy quyền mới xác nhận; mọi xác nhận có event truy vết; admin có `rejectClaim`; thu hồi quyền khi phát hiện. Đây cũng là hạn chế: dữ liệu đầu vào phụ thuộc bên đáng tin (bài toán oracle), hướng phát triển: đối chiếu nhiều nguồn, chữ ký số của bác sĩ.
11. **Ai cũng gọi được `approveClaim`, có nguy hiểm không?** → Hàm chỉ chi trả khi mọi điều kiện đúng và chỉ trả cho `claim.patient`, trả đúng một lần, nên người gọi khác không hưởng lợi.

### Về IPFS và lưu trữ
12. **Vì sao không lưu file trên blockchain?** → Chi phí gas rất cao và giới hạn dữ liệu; IPFS lưu file, contract chỉ lưu CID.
13. **CID là gì? Vì sao chống sửa?** → Mã định danh theo nội dung (băm). Sửa file → CID đổi, nên CID lưu trên chain chứng minh nội dung không bị thay.
14. **File có mất không nếu Pinata ngừng?** → Pinata "pin" giúp giữ file; nếu mất cần pin lại ở nơi khác vì CID không đổi (nội dung giống nhau).

### Về token
15. **Hai nghiệp vụ token của nhóm là gì?** → Minting (mua gói → mint NFT) và Verification (bệnh viện kiểm tra thẻ qua `verifyInsurance`).

### Về triển khai
16. **Sepolia khác mạng thật thế nào?** → Cùng cơ chế (Proof-of-Stake), ETH thử nghiệm miễn phí, không giá trị tiền thật, dùng để kiểm thử.
17. **Chi phí gas?** → Mỗi hàm ghi tốn gas, mua gói tốn nhiều nhất vì mint NFT và lưu struct; hàm đọc (`view`) miễn phí. Có bảng gas ở chương 5.

> Mẹo: chuẩn bị **một câu trả lời trung thực** cho câu "hệ thống còn hạn chế gì?" (phụ thuộc bệnh viện, mất khóa, JWT ở frontend, mới testnet). Nhóm nhận hạn chế rõ ràng thường được đánh giá cao hơn nhóm nói "không có gì".

---

## 6. BẢNG CHỮ VIẾT TẮT (đưa vào báo cáo, chữ >14pt)

| Viết tắt | Đầy đủ | Nghĩa |
|---|---|---|
| DApp | Decentralized Application | Ứng dụng phi tập trung |
| EVM | Ethereum Virtual Machine | Máy ảo Ethereum |
| ETH | Ether | Đơn vị tiền của Ethereum |
| ERC | Ethereum Request for Comments | Chuẩn kỹ thuật cho token Ethereum |
| ERC-721 | — | Chuẩn NFT |
| NFT | Non-Fungible Token | Token không thể thay thế |
| IPFS | InterPlanetary File System | Hệ thống tệp phân tán |
| CID | Content Identifier | Mã định danh nội dung IPFS |
| RBAC | Role-Based Access Control | Kiểm soát truy cập theo vai trò |
| AES | Advanced Encryption Standard | Mã hóa đối xứng |
| GCM | Galois/Counter Mode | Chế độ mã hóa AES có xác thực |
| RSA | Rivest–Shamir–Adleman | Mã hóa bất đối xứng |
| OAEP | Optimal Asymmetric Encryption Padding | Kiểu đệm cho RSA |
| JWT | JSON Web Token | Mã thông báo xác thực (dùng với Pinata) |
| ABI | Application Binary Interface | Mô tả giao diện hàm của contract |
| RPC | Remote Procedure Call | Giao thức gọi từ xa đến node |
| BPMN | Business Process Model and Notation | Chuẩn vẽ sơ đồ quy trình nghiệp vụ |
| API | Application Programming Interface | Giao diện lập trình ứng dụng |
| UI | User Interface | Giao diện người dùng |
| RF | Requirement Functional | Yêu cầu chức năng |
| RNF | Requirement Non-Functional | Yêu cầu phi chức năng |
| PoS | Proof of Stake | Cơ chế đồng thuận bằng cổ phần |
| DID | Decentralized Identifier | Định danh phi tập trung (hướng phát triển) |
| ZKP | Zero-Knowledge Proof | Chứng minh không tiết lộ (hướng phát triển) |
| PDF | Portable Document Format | Định dạng tài liệu |
| JSON | JavaScript Object Notation | Định dạng dữ liệu |
| SPA | Single Page Application | Ứng dụng một trang |

*(Chỉ giữ những từ có xuất hiện thật trong báo cáo.)*

---

## 7. DÀN SLIDE GỢI Ý (đồ án nên 15–20 slide, chữ ≥ 20pt)

1. Trang bìa: tên đề tài, nhóm, GVHD.
2. Mục lục / nội dung trình bày.
3. Vấn đề của bảo hiểm y tế hiện nay.
4. Mục tiêu và giải pháp (DApp, NFT, IPFS, mã hóa, bảo hiểm tham số).
5. 3 tác nhân và phân quyền RBAC.
6. Kiến trúc tổng thể (1 sơ đồ).
7. Luồng nghiệp vụ chính (BPMN rút gọn).
8. Smart contract: các hàm và dữ liệu (1 bảng).
9. **Hai ràng buộc logic** (cắt code `onlyRole` và `require hạn mức`).
10. NFT thẻ bảo hiểm: Minting và Verification.
11. IPFS: 3 loại dữ liệu, upload/retrieve.
12. Mã hóa phong bì AES + RSA và RBAC cho hồ sơ.
13. Giao diện: Bệnh nhân, Bệnh viện, Công ty bảo hiểm (3 ảnh).
14. Kết quả triển khai Sepolia: địa chỉ + Etherscan.
15. Kiểm thử: ảnh `passing` + bảng test case.
16. Bảo mật và chi phí gas.
17. **DEMO** (trực tiếp hoặc video có phụ đề).
18. Hạn chế và hướng phát triển.
19. Đối chiếu rubric (tùy chọn) và kết luận.
20. Cảm ơn / Hỏi đáp.

Chia người trình bày: mỗi người nói phần mình làm (A: 8–10, 14–16; B: 3–5, 11–12; C: 6, 13, 17–19), mọi người đều phải trả lời được câu hỏi tổng quát.

---

## 8. RỦI RO VÀ CÁCH GIẢM

| Rủi ro | Xác suất | Cách giảm |
|---|---|---|
| Tiến độ lệch vì A chậm contract | Trung bình | A1 (khung ABI) ra sớm; B, C làm bằng mock; A ưu tiên 3 nghiệp vụ lõi trước rồi mới làm phần phụ |
| Mã hóa RSA/AES khó với B | Trung bình | Làm bản AES trước, RSA sau; có phương án dự phòng ở file 01 mục 7; nhờ A review |
| Xung đột git | Thấp nếu theo quy tắc | Mỗi người một thư mục, PR nhỏ, merge nhanh |
| Lộ key lên GitHub | Trung bình | `.gitignore`, `.env.example`, quét lại trước khi push; lộ là đổi key |
| Hết ETH Sepolia | Cao | Xin sớm và nhiều ví, dùng số tiền nhỏ |
| Faucet ngừng | Thấp–Trung bình | Chuẩn bị nhiều nguồn faucet khác nhau, xin dư |
| Lỗi giao dịch khi demo | Trung bình | Pre-flight, staticCall kiểm tra trước, tập dượt ≥ 3 lần, video dự phòng |
| Mất khóa RSA | Trung bình | Nút xuất/nhập, sao lưu file khóa demo vào chỗ an toàn (ngoài repo) |
| Phát hiện lỗi contract sau khi deploy Sepolia | Thấp | Test kỹ trước, nếu có lỗi thì deploy bản mới, cập nhật `address.json` |
| Báo cáo dồn cuối, sai định dạng | Cao | Viết song song từ đầu; checklist mục 1; C ghép sớm để kiểm tra định dạng |
| Thiếu minh chứng (ảnh) | Cao | Chụp ảnh ngay khi chạy, đặt tên có nghĩa, lưu trong `docs/report/images/` |

---

## 9. LỖI THƯỜNG GẶP KHI LÀM (tham khảo khi bị kẹt)

- **`nonce too high / replacement transaction underpriced` trong MetaMask** khi chạy lại mạng local: Settings → Advanced → xóa dữ liệu hoạt động (Clear activity tab data) cho tài khoản.
- **Hardhat local chainId** thường 31337; cấu hình MetaMask đúng khi thử local.
- **`insufficient funds for gas`:** ví hết ETH.
- **ABI cũ sau khi deploy mới:** quên chạy `exportAbi.js` hoặc quên pull `main`.
- **`CORS`/mạng khi gọi Pinata:** kiểm tra JWT, endpoint, header, gateway; thử bằng `curl` hoặc Postman trước.
- **WebCrypto chỉ chạy trên `https` hoặc `localhost`:** demo trên localhost là ổn.
- **GCM giải mã lỗi:** sai `iv`, sai khóa, hoặc dữ liệu bị đổi; kiểm tra lưu/đọc base64 đúng.
- **Contract verify Etherscan thất bại:** sai phiên bản compiler hoặc tham số constructor; dùng đúng cấu hình khi deploy.
- **`BigInt` trong JavaScript:** ethers v6 trả `bigint`; đừng trộn với `number` khi tính tiền.

---

## 10. TỰ CHẤM ĐIỂM (làm 2 lần: sau Giai đoạn 4 và trước ngày nộp)

| Tiêu chí | Điểm tối đa | Tự chấm | Thiếu gì cần bù |
|---|---|---|---|
| 1. Smart contract | 10 | | |
| 2. Frontend/Web3 | 10 | | |
| 3. IPFS | 10 | | |
| 4. Token/NFT | 10 | | |
| 5. Báo cáo & thuyết trình | 10 | | |

Quy tắc chấm: mỗi dòng trong checklist mục 1 mà **chưa có minh chứng (ảnh/link/test pass) thì coi như chưa làm**.
