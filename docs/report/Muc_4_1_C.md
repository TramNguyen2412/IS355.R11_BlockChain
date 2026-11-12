# 4.1. Tổng quan triển khai hệ thống

Chương này trình bày quá trình xây dựng ứng dụng MediChain từ các thành phần đã được phân công trong nhóm. Hệ thống gồm giao diện web cho ba vai trò, smart contract quản lý nghiệp vụ bảo hiểm, dịch vụ lưu trữ IPFS và chức năng mã hóa dữ liệu y tế.

## 4.1.1. Môi trường triển khai

Frontend được xây dựng bằng React và Vite, sử dụng JavaScript/JSX. ethers v6 đảm nhiệm giao tiếp với Ethereum thông qua MetaMask. Smart contract được phát triển bằng Solidity ^0.8.20, sử dụng OpenZeppelin Contracts v5 và công cụ Hardhat. Các tệp được tải lên IPFS thông qua Pinata; mã hóa và giải mã được thực hiện bằng Web Crypto API trong trình duyệt.

Hệ thống có hai môi trường sử dụng chính:

| Môi trường | Chain ID | Mục đích |
|---|---:|---|
| Hardhat Local | 31337 | Phát triển và kiểm thử trên máy cá nhân |
| Sepolia | 11155111 | Mạng thử nghiệm để kiểm tra triển khai và giao dịch bằng ví MetaMask |

Frontend có công tắc cấu hình VITE_USE_MOCK. Khi bật Mock, giao diện sử dụng service giả lập để kiểm tra luồng và trạng thái mà không ghi giao dịch lên blockchain. Khi tắt Mock, frontend sử dụng contract service thật và cần ABI, địa chỉ contract, đúng Chain ID cùng cấu hình dịch vụ tương ứng.

## 4.1.2. Tổ chức các thành phần

Các thành phần được tổ chức theo trách nhiệm:

- **Frontend:** hiển thị giao diện và tiếp nhận thao tác theo vai trò; quản lý trạng thái ví, điều hướng, kiểm tra trước giao dịch và hiển thị thông báo.
- **Smart contract:** quản lý gói bảo hiểm, quyền truy cập, thẻ NFT, yêu cầu bồi thường, quỹ và điều kiện chi trả.
- **IPFS/Pinata:** lưu tệp điều khoản, hóa đơn và dữ liệu hồ sơ đã mã hóa; trả về CID để tham chiếu.
- **Mã hóa:** bảo vệ nội dung hồ sơ bằng AES-256-GCM và phân phối khóa AES cho các ví được phép bằng RSA-OAEP.

Việc phân chia thành các lớp giúp giao diện không phụ thuộc trực tiếp vào chi tiết triển khai contract hoặc API lưu trữ. Các trang gọi contract thông qua contractService và gọi IPFS/mã hóa thông qua services/index.js.

## 4.1.3. Quy trình khởi tạo và sử dụng

Quy trình khởi tạo hệ thống cần thực hiện theo đúng thứ tự đã quy định:

1. Admin triển khai HealthInsuranceNFT và xuất ABI cùng địa chỉ contract.
2. Nạp dữ liệu gói, cấp quyền cho ví Bệnh viện và nạp quỹ theo môi trường đang chạy.
3. Admin đăng ký khóa mã hóa công khai trước khi bệnh nhân mua bảo hiểm.
4. Bệnh nhân và Bệnh viện tạo, đăng ký khóa mã hóa của mình.
5. Bệnh nhân chọn gói và mua bảo hiểm; contract phát hành NFT gắn với ví bệnh nhân.
6. Khi phát sinh khám chữa bệnh, hóa đơn và hồ sơ được mã hóa, tải lên IPFS và sử dụng CID trong yêu cầu bồi thường.
7. Bệnh viện xác nhận chi phí; Công ty bảo hiểm khởi tạo thao tác duyệt hoặc từ chối.
8. Contract tự kiểm tra các điều kiện nghiệp vụ trước khi cập nhật trạng thái và thực hiện chi trả.

## 4.1.4. Kiểm tra giao dịch và phản hồi giao diện

Đối với thao tác ghi, frontend thực hiện mô phỏng bằng staticCall khi phù hợp để phát hiện sớm trường hợp giao dịch sẽ bị contract từ chối. Nếu mô phỏng thành công, ứng dụng mới gửi giao dịch thật. Giao diện hiển thị trạng thái đang xử lý, kết quả thành công kèm transaction hash hoặc lỗi bằng tiếng Việt.

Cách xử lý này giúp người dùng nhận biết kết quả thao tác và giảm nguy cơ tạo giao dịch thất bại không cần thiết. Tuy nhiên, dryRun không đảm bảo giao dịch chắc chắn thành công sau đó, vì trạng thái blockchain có thể thay đổi trước khi giao dịch được đưa vào block.

## 4.1.5. Phạm vi xác nhận

Các kết quả kiểm thử phải được ghi đúng theo môi trường đã chạy. Kiểm thử Mock chỉ xác nhận hành vi của giao diện và service giả lập; kiểm thử Hardhat Local xác nhận tích hợp trên blockchain cục bộ; kiểm thử Sepolia cần có transaction hash, địa chỉ contract hoặc bằng chứng tương ứng.

Tại thời điểm chuẩn bị bản nháp này, nhật ký C ghi nhận frontend đã build thành công, contract service đã được kiểm thử trên Hardhat Local và phần lớn luồng Bệnh nhân đã được kiểm tra trong chế độ Mock. Một số nội dung vẫn cần xác nhận tiếp, gồm trạng thái APPROVED/REJECTED qua giao diện Insurer, khả năng truy xuất PDF qua gateway và kết quả kiểm thử toàn hệ thống trên Sepolia. Vì vậy, không sử dụng các kết quả Mock hoặc Local để khẳng định hệ thống đã hoàn tất kiểm thử Sepolia.

> **Ghi chú hoàn thiện báo cáo:** cập nhật phiên bản công cụ từ môi trường thực tế, chèn ảnh giao diện và ảnh giao dịch tương ứng; thay mô tả trạng thái bằng kết quả mới nhất sau khi nhóm hoàn thành kiểm thử.