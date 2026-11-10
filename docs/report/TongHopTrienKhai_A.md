# BÁO CÁO KỸ THUẬT TỔNG HỢP TRIỂN KHAI PHÂN HỆ SMART CONTRACT VÀ GIAO DIỆN BỆNH VIỆN
**Dự án:** Hệ thống Quản lý Bảo hiểm Y tế Phi tập trung (MediChain)  
**Phân hệ chuyên trách:** Hợp đồng thông minh `HealthInsuranceNFT` và Giao diện Bệnh viện (`/hospital`)  

---

## 1. Tổng quan phân hệ Smart Contract và Giao diện Bệnh viện

### 1.1. Mục tiêu phát triển
Phân hệ đảm nhiệm vai trò nền tảng hạ tầng chuỗi khối (Blockchain) và giao diện tác nghiệp y tế trong hệ thống MediChain, giải quyết bài toán quản lý bảo hiểm y tế minh bạch, chống gian lận và tự động hóa chi trả:
- Thiết lập hợp đồng thông minh định danh thẻ bảo hiểm y tế dưới dạng tài sản số không thể thay thế và không thể chuyển nhượng (Soulbound NFT), tự động hóa thẩm định hồ sơ và giải ngân chi trả bồi thường trực tiếp bằng tiền mã hóa.
- Cung cấp giao diện trực quan cho cơ sở y tế đối tác nhằm xác thực thẻ bảo hiểm, mã hóa hồ sơ bệnh án kết hợp bảo mật đa tầng trên hệ thống lưu trữ phi tập trung (IPFS), lập và xác nhận chi phí yêu cầu bồi thường.

### 1.2. Khung công nghệ và tiêu chuẩn kỹ thuật
- **Ngôn ngữ hợp đồng thông minh:** Solidity phiên bản `0.8.28` (thiết lập trình biên dịch `optimizer: { enabled: true, runs: 200 }`, kiến trúc EVM target `cancun`).
- **Thư viện tiêu chuẩn:** OpenZeppelin Contracts phiên bản 5 (`ERC721`, `AccessControl`, `ReentrancyGuard`).
- **Môi trường phát triển & kiểm thử:** Hardhat v2, Hardhat Toolbox, Ethers.js v6, Mocha, Chai, Hardhat Gas Reporter.
- **Mạng triển khai thực tế:** Ethereum Sepolia Testnet (Chain ID `11155111`).
- **Công nghệ giao diện và mật mã ngoài chuỗi:** React 18, Vite, Ethers.js v6, WebCrypto API trình duyệt (`window.crypto.subtle`) cho thuật toán mã hóa đối xứng AES-256-GCM và bất đối xứng RSA-OAEP 2048-bit (SHA-256).

---

## 2. Thiết kế Hợp đồng Thông minh

### 2.1. Các thành phần và cấu trúc dữ liệu chính
Hợp đồng `HealthInsuranceNFT` quản lý dữ liệu trên chuỗi thông qua các cấu trúc định hình:
- `struct Plan`: Chứa thông số gói bảo hiểm gồm định danh (`id`), tên gói (`name`), giá mua (`price`), hạn mức bảo hiểm tối đa (`coverageLimit`), thời hạn hiệu lực tính theo ngày (`durationDays`), mã băm nội dung tài liệu điều khoản trên IPFS (`policyDocCID`) và trạng thái mở bán (`active`).
- `struct Policy`: Đại diện cho thẻ bảo hiểm đã phát hành, tương ứng với mã định danh Token ID của chuẩn ERC-721, lưu trữ địa chỉ chủ sở hữu (`holder`), chuỗi định danh y tế mã hóa (`encryptedHealthId`), hạn mức bảo hiểm, số tiền đã chi trả tích lũy (`usedAmount`), thời điểm bắt đầu và thời điểm hết hạn (`expiryDate`).
- `struct Claim`: Đại diện cho yêu cầu bồi thường gồm mã hồ sơ (`claimId`), Token ID thẻ, địa chỉ bệnh nhân, địa chỉ cơ sở y tế điều trị, số tiền yêu cầu (`amount`), số tiền viện phí được cơ sở y tế xác nhận (`confirmedAmount`), cờ xác nhận chi phí (`hospitalConfirmed`), mã CID hóa đơn viện phí (`billCID`), mã CID bệnh án mã hóa (`recordCID`), trạng thái xử lý (`ClaimStatus`: `PENDING`, `APPROVED`, `REJECTED`), thời điểm lập và thời điểm giải quyết.

### 2.2. Bốn nghiệp vụ cốt lõi
1. **Nghiệp vụ 1 — Thiết lập hệ thống (Quản trị):**
   - Quản trị viên khởi tạo gói bảo hiểm mới qua hàm `createPlan`, cập nhật trạng thái bật/tắt gói qua `setPlanActive`, ủy quyền hoặc thu hồi tư cách cơ sở y tế đối tác qua hàm `authorizeHospital`.
   - Nạp quỹ thanh khoản chi trả bồi thường thông qua hàm `fundPool`, tiếp nhận nguồn vốn thanh toán bằng ETH.
   - Người tham gia hệ thống đăng ký khóa công khai mã hóa ngoài chuỗi lên hợp đồng thông qua hàm `registerEncryptionKey`.
2. **Nghiệp vụ 2 — Mua bảo hiểm và Phát hành Thẻ NFT Soulbound:**
   - Người tham gia thanh toán chính xác mức phí quy định của gói thông qua hàm `purchasePolicy`.
   - Hợp đồng kiểm tra điều kiện tiên quyết (gói đang hoạt động, người mua không nắm giữ gói bảo hiểm nào còn hạn), tự động đúc (mint) một thẻ NFT Soulbound ERC-721 định danh duy nhất cho ví người mua, thiết lập thời hạn và hạn mức bảo hiểm tương ứng.
3. **Nghiệp vụ 3 — Khám bệnh và Yêu cầu Bồi thường:**
   - Cơ sở y tế hoặc người bệnh kiểm tra tính hợp lệ và hạn mức khả dụng của thẻ thông qua hàm `verifyInsurance`.
   - Lập và ký gửi hồ sơ bồi thường qua hàm `submitClaim` kèm các mã CID lưu trữ tài liệu đã mã hóa trên mạng lưới IPFS.
   - Đối với hồ sơ do người bệnh tự nộp, cơ sở y tế điều trị thực hiện thẩm định và xác nhận viện phí thực tế qua hàm `confirmClaim`.
4. **Nghiệp vụ 4 — Phê duyệt và Chi trả Tự động:**
   - Hàm `approveClaim` tự động đối soát điều kiện toàn vẹn trên chuỗi, cập nhật hạn mức tích lũy đã dùng và trực tiếp giải ngân chuyển ETH từ quỹ thanh khoản về ví người bệnh.
   - Quản trị viên thực hiện từ chối các hồ sơ không hợp lệ kèm lý do giải trình thông qua hàm `rejectClaim`.

### 2.3. Hai ràng buộc logic nghiệp vụ
- **Ràng buộc logic 1 — Phân quyền xác nhận chi phí viện phí (Role-Based Access Control):** Chỉ tài khoản sở hữu vai trò `HOSPITAL_ROLE` mới được quyền gọi hàm `confirmClaim`. Đồng thời, số tiền viện phí xác nhận (`confirmedAmount`) bị giới hạn không được vượt quá số tiền người bệnh đã yêu cầu (`amount`), bảo vệ hệ thống trước hành vi xác nhận sai lệch chi phí.
- **Ràng buộc logic 2 — Kiểm soát điều kiện tự động và Chi trả an toàn (Checks-Effects-Interactions):** Hàm `approveClaim` độc lập thẩm định 4 điều kiện bất biến trước khi giải ngân:
  1. Thẻ bảo hiểm còn trong thời hạn hiệu lực: `block.timestamp <= p.expiryDate`.
  2. Tổng mức bồi thường tích lũy không vượt hạn mức gói: `p.usedAmount + amt <= p.coverageLimit`.
  3. Quỹ thanh khoản của hợp đồng bảo đảm khả năng thanh toán: `address(this).balance >= amt`.
  4. Cơ sở y tế điều trị đã xác nhận viện phí hợp lệ: `c.hospitalConfirmed == true`.
  Hợp đồng cập nhật trạng thái `APPROVED` và ghi tăng `usedAmount` trước khi thực hiện chuyển tiền ETH thông qua lệnh gọi cấp thấp `payable.call{value: amt}("")`.

### 2.4. Cơ chế bảo mật nâng cao
- **Cơ chế Soulbound NFT:** Hợp đồng ghi đè (override) phương thức nội bộ `_update` của chuẩn OpenZeppelin ERC-721 v5. Mọi thao tác chuyển nhượng thẻ giữa các ví người dùng thông thường (`from != address(0) && to != address(0)`) đều bị hủy bỏ với thông báo `"Soulbound: khong the chuyen nhuong"`, ngăn ngừa việc chuyển nhượng trái phép thẻ bảo hiểm định danh cá nhân.
- **Kiểm soát truy cập dựa trên vai trò (AccessControl):** Quản lý nghiêm ngặt các hàm đặc quyền bằng các vai trò định danh chuẩn hóa: `DEFAULT_ADMIN_ROLE` (Công ty bảo hiểm) và `HOSPITAL_ROLE` (Bệnh viện đối tác).
- **Phòng chống tấn công tái nhập (ReentrancyGuard):** Áp dụng modifier `nonReentrant` trên toàn bộ các hàm luân chuyển tài sản (`purchasePolicy`, `approveClaim`), vô hiệu hóa mọi nỗ lực chiếm đoạt quỹ qua lệnh gọi đệ quy ngược.

---

## 3. Kết quả Kiểm thử Tự động (Unit Testing)

### 3.1. Tổng quan kết quả kiểm thử
Hệ thống hoàn thành toàn bộ **34 ca kiểm thử chuyên biệt (34/34 passing, tỷ lệ đạt 100%)** trên môi trường Hardhat EVM Cancun. Thời gian thực thi toàn bộ kịch bản kiểm thử dao động từ 1 đến 2 giây.

### 3.2. Phân nhóm các ca kiểm thử
- **Nhóm 1 — Khởi tạo và Phân quyền (T01 – T04):** Xác thực tài khoản triển khai nắm giữ quyền quản trị tối cao, kiểm tra tên gọi và ký hiệu token, kiểm tra quy trình cấp quyền và thu hồi quyền cơ sở y tế đối tác, xác nhận việc chặn các tài khoản không có thẩm quyền truy cập.
- **Nhóm 2 — Quản lý Gói bảo hiểm (T05 – T08):** Xác thực quy trình khởi tạo gói bảo hiểm hợp lệ, chặn tài khoản không có quyền tạo gói, chặn tạo gói có đơn giá hoặc hạn mức bằng 0, chặn việc mua các gói bảo hiểm đã bị vô hiệu hóa.
- **Nhóm 3 — Mua bảo hiểm và Phát hành Thẻ NFT (T09 – T15b):** Xác thực thanh toán chính xác, chặn việc nộp thừa hoặc thiếu phí ETH, chặn mua trùng lặp khi đang sở hữu thẻ còn hạn, chặn hành vi chuyển nhượng thẻ Soulbound, kiểm tra toàn diện hàm xác minh thẻ `verifyInsurance` trong các trạng thái (thẻ hợp lệ, ví chưa có thẻ, thẻ hết hạn và quy trình mua gói mới sau khi thẻ cũ hết hạn).
- **Nhóm 4 — Hồ sơ Yêu cầu Bồi thường (T16 – T23):** Xác thực hồ sơ do bệnh viện gửi (tự động gắn cờ xác nhận chi phí), hồ sơ do bệnh nhân gửi (ở trạng thái chờ xác nhận), chặn ví lạ gửi hồ sơ mạo danh, chặn hồ sơ yêu cầu vượt hạn mức, chặn phân quyền xác nhận viện phí đối với tài khoản không có `HOSPITAL_ROLE`, kiểm tra xác nhận viện phí hợp lệ và chặn xác nhận số tiền vượt quá yêu cầu.
- **Nhóm 5 — Phê duyệt và Chi trả Bồi thường (T24 – T30):** Chặn phê duyệt khi bệnh viện chưa đối soát chi phí, thực hiện giải ngân chính xác ETH về ví bệnh nhân, chặn phê duyệt lần hai (Double-payout), chặn giải ngân khi hai hồ sơ đồng thời có tổng chi phí vượt hạn mức còn lại, chặn chi trả khi quỹ thanh khoản không đủ số dư, kiểm tra quy trình quản trị viên từ chối bồi thường bảo toàn nguồn quỹ.
- **Nhóm 6 — Bảo mật Nâng cao và Tiện ích (T31 – T32b):** Kiểm thử hợp đồng tấn công `ReentrancyAttacker` gọi đệ quy ngược hàm `approveClaim` bị chặn hoàn toàn, kiểm tra tích lũy quỹ bảo hiểm `fundPool` và kiểm tra đăng ký lưu trữ chuỗi khóa RSA.

### 3.3. Đo lường chi phí tiêu thụ Gas thực nghiệm
Theo kết quả từ `hardhat-gas-reporter`:
- **Chi phí triển khai hợp đồng:** `3,176,363 gas` (chiếm 5.3% giới hạn khối 60,000,000 gas).
- **Hàm mua thẻ bảo hiểm (`purchasePolicy`):** Trung bình `304,771 gas` (tiêu tốn nhiều gas nhất do thực hiện đúc NFT và ghi nhận cấu trúc dữ liệu mới).
- **Hàm gửi yêu cầu bồi thường (`submitClaim`):** Trung bình `281,444 gas`.
- **Hàm tạo gói bảo hiểm (`createPlan`):** Trung bình `202,989 gas`.
- **Hàm phê duyệt giải ngân (`approveClaim`):** Trung bình `117,178 gas`.
- **Hàm xác nhận viện phí (`confirmClaim`):** Trung bình `98,913 gas`.
- **Hàm nạp quỹ (`fundPool`):** Trung bình `22,686 gas`.

---

## 4. Báo cáo Triển khai Mạng Thử nghiệm Sepolia

Hợp đồng thông minh đã được triển khai chính thức trên mạng Ethereum Sepolia Testnet với các thông số định danh:
- **Địa chỉ hợp đồng:** `0x9B5868254c31818320d2DDCBb5B28f15af265b62`
- **Khối triển khai (Deploy Block):** `12103715`
- **Địa chỉ ví Quản trị viên (Insurer / Admin):** `0x81D07c2F407c4450c8920980dBBFd6997AD015C4`
- **Địa chỉ ví Bệnh viện đối tác:** `0xb381e33456e08F79cdeA9722506dabbdF2933F12`
- **Tình trạng chứng thực mã nguồn:** Đã hoàn tất xác minh mã nguồn (Verified) trên hệ thống Sepolia Etherscan với trạng thái dấu tích xanh:  
  [https://sepolia.etherscan.io/address/0x9B5868254c31818320d2DDCBb5B28f15af265b62#code](https://sepolia.etherscan.io/address/0x9B5868254c31818320d2DDCBb5B28f15af265b62#code)
- **Quỹ bảo hiểm khởi tạo:** Đã nạp thành công `0.03 ETH` vào quỹ hợp đồng thông qua hàm `fundPool`.
- **Cấu hình phân quyền hệ thống:** Đã cấp vai trò `HOSPITAL_ROLE` cho ví bệnh viện đối tác; tệp cấu hình máy khách `address.json` được thiết lập đồng bộ với Chain ID `11155111` và tệp `abi.json` gồm 69 mục giao tiếp.

---

## 5. Phân hệ Giao diện Bệnh viện (`/hospital`)

Giao diện Bệnh viện được thiết kế thành 4 khối chức năng liên hoàn đáp ứng toàn diện luồng nghiệp vụ y tế:
1. **Khối 1 — Thiết lập Khóa mã hóa (`KeySetup`):** Khởi tạo cặp khóa RSA-OAEP 2048-bit trên trình duyệt thông qua WebCrypto API, lưu trữ khóa riêng tư an toàn trong bộ nhớ cục bộ (`localStorage`) và ký gửi khóa công khai dạng PEM lên hợp đồng thông minh.
2. **Khối 2 — Tra cứu và Kiểm tra Thẻ bảo hiểm (`VerifyCard`):** Cho phép nhập địa chỉ ví của bệnh nhân để kiểm tra tính hợp lệ qua hàm `verifyInsurance`. Giao diện phản hồi mã Token ID, hạn mức bồi thường còn lại và ngày hết hạn. Chỉ khi thẻ được xác nhận hợp lệ, giao diện mới kích hoạt khối lập hồ sơ bồi thường.
3. **Khối 3 — Biểu mẫu Gửi Yêu cầu Bồi thường (`SubmitClaimForm`):** Tiếp nhận thông tin bệnh án, phác đồ điều trị, kết quả xét nghiệm và tệp hóa đơn viện phí. Quy trình xử lý bao gồm:
   - Mô phỏng giao dịch cục bộ (`dryRun: true`) để bắt lỗi sớm trước khi gửi lên mạng lưới.
   - Tải tệp hóa đơn gốc lên mạng lưu trữ IPFS qua dịch vụ Pinata.
   - Thu thập khóa công khai của 3 bên tham gia (Bệnh nhân, Bệnh viện, Công ty bảo hiểm) để thực hiện mã hóa phong bì lai (Hybrid Encryption: sinh khóa đối xứng ngẫu nhiên AES-256-GCM để mã hóa hồ sơ bệnh án, sau đó mã hóa khóa AES này bằng từng khóa công khai RSA tương ứng).
   - Đưa tệp JSON mã hóa lên IPFS và ký gửi giao dịch `submitClaim` qua ví MetaMask.
4. **Khối 4 — Danh sách Xác nhận Viện phí (`PendingConfirmList`):** Hiển thị danh sách các yêu cầu bồi thường do người bệnh tự nộp đang chờ cơ sở y tế thẩm định chi phí. Cán bộ y tế kiểm tra hồ sơ và nhập số tiền viện phí thực tế để thực hiện ký giao dịch `confirmClaim`.

---

## 6. Rà soát Kỹ thuật và Tinh chỉnh Hệ thống

### 6.1. Các điểm kỹ thuật đã xử lý và hoàn thiện
1. **Đồng bộ trạng thái biểu mẫu khi thay đổi địa chỉ tra cứu (`VerifyCard.jsx`):**
   - *Vấn đề phát hiện:* Khi người dùng thay đổi địa chỉ ví kiểm tra sang một địa chỉ không hợp lệ hoặc gặp sự cố gián đoạn kết nối mạng, giao diện vẫn duy trì trạng thái thẻ hợp lệ của bệnh nhân tra cứu trước đó.
   - *Biện pháp xử lý:* Bổ sung lệnh thiết lập trạng thái thẻ về giá trị rỗng (`onVerified(null)`) ngay tại đầu hàm xử lý tra cứu, đảm bảo biểu mẫu lập hồ sơ lập tức bị đóng lại cho đến khi có kết quả xác minh mới hợp lệ.
2. **Làm mới dữ liệu biểu mẫu sau khi gửi hồ sơ thành công (`SubmitClaimForm.jsx`):**
   - *Vấn đề phát hiện:* Biểu mẫu vẫn lưu giữ các trường thông tin cũ và tệp hóa đơn sau khi hoàn tất giao dịch, dẫn đến rủi ro người dùng bấm gửi lặp lại giao dịch gây trùng lặp yêu cầu bồi thường.
   - *Biện pháp xử lý:* Bổ sung cơ chế tự động xóa trắng toàn bộ các trường nhập liệu và làm mới ô chọn tệp hóa đơn thông qua khóa định danh trạng thái (`fileKey`) ngay sau khi giao dịch gửi claim được xác nhận thành công.
3. **Bổ sung chú thích nghiệp vụ tại danh sách xác nhận viện phí (`PendingConfirmList.jsx`):**
   - *Vấn đề phát hiện:* Bộ lọc `!c.hospitalConfirmed` loại bỏ các hồ sơ do bệnh viện tự gửi (do các hồ sơ này đã được hệ thống tự động xác thực chi phí ngay tại thời điểm khởi tạo), có thể gây thắc mắc khi danh sách hiển thị rỗng.
   - *Biện pháp xử lý:* Bổ sung thông báo giải thích rõ ràng danh sách này chuyên trách tiếp nhận các hồ sơ do người bệnh tự nộp, phục vụ việc đối soát và phân định rõ luồng xử lý của hệ thống.

### 6.2. Các điểm kiến trúc giữ nguyên có chủ đích
1. **Hàm `approveClaim` không giới hạn phân quyền vai trò:** Thiết kế cho phép bên thứ ba thực thi giao dịch phê duyệt được giữ nguyên có chủ đích nhằm tăng cường tính phi tập trung hóa và tự động hóa; dòng tiền bồi thường được đảm bảo bằng mã nguồn chỉ chuyển duy nhất về địa chỉ ví người bệnh sở hữu thẻ (`claim.patient`).
2. **Phương thức khai báo biến trạng thái `public` đối với `totalPlans`, `totalPolicies`, `totalClaims`:** Trình biên dịch Solidity tự sinh hàm getter có kiểu trả về tương đương với hàm `external view`, đảm bảo tương thích tuyệt đối về mặt giao tiếp nhị phân (ABI) với các thư viện phía máy khách.
3. **Cơ chế kiểm soát hạn mức tại thời điểm phê duyệt:** Trường hợp có nhiều hồ sơ bồi thường nộp đồng thời, hợp đồng bảo đảm an toàn quỹ bằng cách thẩm định lại hạn mức tích lũy tại thời điểm gọi `approveClaim`, từ chối bất kỳ giao dịch nào dẫn đến việc vượt quá hạn mức cam kết ban đầu.

---

## 7. Kết luận

Phân hệ Hợp đồng thông minh `HealthInsuranceNFT` và Giao diện Bệnh viện của hệ thống MediChain đã được xây dựng, kiểm thử và triển khai hoàn chỉnh theo đúng chuẩn mực kỹ thuật:
- **Đảm bảo tính bất biến và an toàn:** Logic hợp đồng thông minh được đóng băng ổn định trên mạng Ethereum Sepolia Testnet, đạt tỷ lệ vượt qua kiểm thử tự động 100% (34/34 ca kiểm thử) và được chứng thực công khai trên Etherscan.
- **Bảo mật dữ liệu y tế toàn diện:** Tích hợp mô hình mã hóa phong bì lai ngoài chuỗi kết hợp lưu trữ phân tán IPFS, bảo đảm chỉ các bên có thẩm quyền mới có khả năng giải mã hồ sơ bệnh án.
- **Sẵn sàng tích hợp toàn hệ thống:** Phân hệ cung cấp đầy đủ các giao thức giao tiếp chuẩn hóa, sẵn sàng kết nối liên luồng với phân hệ Công ty bảo hiểm và phân hệ Bệnh nhân nhằm phục vụ công tác nghiệm thu và bảo vệ đồ án.
