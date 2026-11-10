# BẢNG TỔNG HỢP CA KIỂM THỬ SMART CONTRACT (TEST CASES)
- Hợp đồng: `HealthInsuranceNFT.sol`
- File kiểm thử: `contracts-hardhat/test/HealthInsuranceNFT.test.js`
- Tổng số ca kiểm thử: **34/34 passing (100%)**
- Khung kiểm thử: Mocha + Chai + Hardhat Ethers v6

| Mã | Nghiệp vụ | Mô tả | Điều kiện/đầu vào | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|:---:|
| T01 | Quản trị | deploy: deployer la admin, ten/ky hieu NFT dung | Deploy contract | Deployer có `DEFAULT_ADMIN_ROLE`, name="Health Insurance Card", symbol="HIC" | Name/symbol đúng, admin đúng | Pass |
| T02 | Quản trị | admin cap quyen benh vien + event | Admin gọi `authorizeHospital(outsider, true)` | Phát event `HospitalAuthorized(outsider, true)`, `hasRole(HOSPITAL_ROLE)=true` | Event phát đúng, role được cấp | Pass |
| T03 | Quản trị | vi khong phai admin goi authorizeHospital bi revert | Outsider gọi `authorizeHospital` | Revert lỗi AccessControl `AccessControlUnauthorizedAccount` | Revert đúng mã lỗi phân quyền | Pass |
| T04 | Quản trị | admin thu hoi quyen benh vien | Admin gọi `authorizeHospital(hospital, false)` | `hasRole(HOSPITAL_ROLE, hospital)=false` | Thu hồi quyền thành công | Pass |
| T05 | Gói bảo hiểm | admin tao goi hop le | Admin gọi `createPlan("Gói Cơ bản", 0.002 ETH, 0.02 ETH, 30 ngày, CID)` | Phát `PlanCreated`, `totalPlans=1`, lưu trữ thông tin đúng | Tạo gói thành công, dữ liệu đúng | Pass |
| T06 | Gói bảo hiểm | vi la tao goi bi revert | Outsider gọi `createPlan` | Revert lỗi AccessControl `AccessControlUnauthorizedAccount` | Bị từ chối do không có quyền | Pass |
| T07 | Gói bảo hiểm | tao goi gia = 0 hoac han muc = 0 bi revert | Gọi `createPlan` với price=0 hoặc coverageLimit=0 | Revert với thông báo lỗi `"So tien khong hop le"` | Revert đúng chuỗi lỗi | Pass |
| T08 | Gói bảo hiểm | tat goi roi mua bi revert | Admin tắt gói (`setPlanActive(1, false)`), bệnh nhân mua | Revert với thông báo lỗi `"Goi bao hiem khong hoat dong"` | Chặn mua gói đã tắt thành công | Pass |
| T09 | Thẻ NFT | mua dung gia: mint NFT, Policy dung, event | Bệnh nhân gửi 0.002 ETH mua Gói 1 | Mint NFT #1, phát `PolicyPurchased`, lưu Policy, `activePolicyOf=1` | Mint NFT thành công, Policy đúng | Pass |
| T10 | Thẻ NFT | gui sai so ETH (thieu/thua) bi revert | Gửi thiếu (price - 1 wei) hoặc thừa (price + 1 wei) | Revert với thông báo lỗi `"Sai so tien thanh toan"` | Chặn sai số tiền chuẩn xác | Pass |
| T11 | Thẻ NFT | mua khi da co goi con han bi revert | Bệnh nhân đã có thẻ còn hạn tiếp tục mua gói mới | Revert với thông báo lỗi `"Da co goi bao hiem con han"` | Chặn mua trùng gói còn hạn | Pass |
| T12 | Thẻ NFT | chuyen nhuong NFT bi revert Soulbound | Bệnh nhân gọi `transferFrom` hoặc `safeTransferFrom` chuyển thẻ | Revert với thông báo lỗi `"Soulbound: khong the chuyen nhuong"` | Chặn chuyển nhượng (Soulbound) | Pass |
| T13 | Xác minh | verifyInsurance: vi co the con han | Tra cứu ví bệnh nhân có thẻ còn hạn | Trả về `(isValid=true, tokenId=1, remainingLimit=0.02 ETH, expiryDate)` | Thẻ hợp lệ, hạn mức đủ | Pass |
| T14 | Xác minh | verifyInsurance: vi khong co the | Tra cứu ví người ngoài không mua bảo hiểm | Không revert, trả về `(isValid=false, tokenId=0, remainingLimit=0, expiryDate=0)` | Xác định đúng ví chưa có thẻ | Pass |
| T15 | Xác minh | verifyInsurance sau khi het han | Tăng thời gian blockchain qua 31 ngày (`time.increase`) | `verifyInsurance` trả về `isValid=false` | Xác định đúng thẻ hết hạn | Pass |
| T15-b | Thẻ NFT | Them: het han roi duoc mua goi moi | Thẻ cũ hết hạn (31 ngày), bệnh nhân mua gói mới #2 | Mua thành công, `activePolicyOf=2`, `isValid=true` | Cho phép gia hạn/mua gói mới | Pass |
| T16 | Bồi thường | benh vien submitClaim: PENDING, da xac nhan, event | Bệnh viện gọi `submitClaim(1, 0.012 ETH, billCID, recordCID)` | Phát `ClaimSubmitted`, claim có `status=PENDING`, `hospitalConfirmed=true` | Bệnh viện nộp tự xác nhận | Pass |
| T17 | Bồi thường | benh nhan submitClaim: PENDING, chua xac nhan | Bệnh nhân tự gọi `submitClaim(1, 0.012 ETH, bill, record)` | Claim tạo thành công, `status=PENDING`, `hospitalConfirmed=false` | Tạo claim chờ bệnh viện duyệt | Pass |
| T18 | Bồi thường | vi la submitClaim bi revert | Outsider không sở hữu thẻ gửi claim cho thẻ #1 | Revert với thông báo lỗi `"Khong phai chu the hoac benh vien"` | Chặn người lạ gửi claim | Pass |
| T19 | Bồi thường | submitClaim vuot han muc con lai bi revert | Gửi claim với số tiền > hạn mức còn lại hoặc amount=0 | Revert `"Vuot qua han muc bao hiem"` hoặc `"So tien khong hop le"` | Chặn vượt hạn mức khi nộp | Pass |
| T20 | Xác nhận | vi la confirmClaim bi revert (RBAC) | Bệnh nhân hoặc người ngoài gọi `confirmClaim` | Revert lỗi AccessControl `AccessControlUnauthorizedAccount` | Chặn ví không có HOSPITAL_ROLE | Pass |
| T21 | Xác nhận | benh vien confirmClaim hop le | Bệnh viện gọi `confirmClaim(1, 0.012 ETH)` cho claim của BN | Phát `ClaimConfirmed`, cập nhật `confirmedAmount`, `hospitalConfirmed=true` | Xác nhận chi phí thành công | Pass |
| T22 | Xác nhận | confirmedAmount > amount bi revert | Bệnh viện xác nhận số tiền lớn hơn số tiền yêu cầu | Revert `"So tien xac nhan vuot so tien yeu cau"` (hoặc id sai) | Chặn xác nhận vượt mức yêu cầu | Pass |
| T23 | Bồi thường | submitClaim khi het han bi revert | Tăng thời gian qua 31 ngày rồi gửi claim | Revert với thông báo lỗi `"Bao hiem da het han"` | Chặn bồi thường thẻ hết hạn | Pass |
| T24 | Chi trả | approveClaim khi benh vien chua xac nhan bi revert | Duyệt claim do bệnh nhân gửi mà BV chưa xác nhận | Revert với thông báo lỗi `"Benh vien chua xac nhan"` | Chặn chi trả khi chưa xác nhận | Pass |
| T25 | Chi trả | approveClaim hop le: chi tra dung so tien | Duyệt claim đã xác nhận (người gọi là bên thứ ba) | Chuyển đúng 0.012 ETH vào ví BN, trừ quỹ, `usedAmount=0.012`, emit `ClaimApproved` | Chi trả tự động chính xác | Pass |
| T26 | Chi trả | approveClaim lan 2 bi revert | Gọi `approveClaim` lần hai cho claim đã duyệt | Revert với thông báo lỗi `"Claim da xu ly"` | Chặn chi trả lặp (Double Payout) | Pass |
| T27 | Chi trả | hai claim, tong vuot han muc: claim sau bi revert khi duyet | Claim 1 (0.012 ETH) duyệt xong; duyệt claim 2 (0.015 ETH) | Revert với thông báo lỗi `"Vuot qua han muc bao hiem"` | Kiểm soát chặt chẽ hạn mức còn lại | Pass |
| T28 | Chi trả | quy khong du bi revert | Hợp đồng không nạp quỹ, duyệt claim cần 0.012 ETH | Revert với thông báo lỗi `"Quy bao hiem khong du"` | Chặn chi trả khi quỹ cạn | Pass |
| T29 | Quản trị | rejectClaim boi admin: REJECTED, khong mat tien quy | Admin gọi `rejectClaim(1, "nghi ngo gian lan")` | Phát `ClaimRejected`, status=REJECTED, số dư quỹ giữ nguyên | Từ chối bồi thường thành công | Pass |
| T30 | Quản trị | rejectClaim boi vi la bi revert | Outsider gọi `rejectClaim` | Revert lỗi AccessControl `AccessControlUnauthorizedAccount` | Chặn người lạ từ chối claim | Pass |
| T31 | Bảo mật | reentrancy: goi lai approveClaim bi chan, chi nhan tien 1 lan | Attacker contract gọi đệ quy `approveClaim` trong hàm `receive` | Nhận tiền đúng 1 lần, lần đệ quy bị chặn (`reentryBlocked=true`), `usedAmount` chuẩn | Chống Reentrancy hoàn hảo | Pass |
| T32 | Quản trị | fundPool cong dung vao poolBalance | Admin nạp ETH qua `fundPool({value: ...})` | Phát `PoolFunded`, `poolBalance()` tăng đúng số lượng nạp, nạp 0 revert | Nạp quỹ bảo hiểm chuẩn xác | Pass |
| T32-b | Bảo mật | Them: registerEncryptionKey luu khoa va phat event | Người dùng gọi `registerEncryptionKey(pemKey)` | Phát `EncryptionKeyRegistered`, `encryptionKeyOf` lưu đúng chuỗi PEM | Đăng ký khóa mã hóa RSA thành công | Pass |
