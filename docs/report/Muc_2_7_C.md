# 2.7. Công nghệ phát triển giao diện và tích hợp Web3

MediChain được xây dựng dưới dạng ứng dụng web, trong đó giao diện người dùng đảm nhận việc hiển thị dữ liệu bảo hiểm, tiếp nhận thao tác và kết nối với các thành phần blockchain, lưu trữ và mã hóa. Phần giao diện sử dụng React kết hợp Vite và JavaScript. React tổ chức giao diện thành các component, giúp chia nhỏ màn hình theo chức năng và tái sử dụng những thành phần chung. Vite hỗ trợ khởi chạy môi trường phát triển và đóng gói ứng dụng.

## 2.7.1. React và tổ chức giao diện

React được sử dụng để xây dựng các trang theo ba vai trò: Bệnh nhân, Bệnh viện và Công ty bảo hiểm. Mỗi trang được chia thành các component nhỏ theo nghiệp vụ. Ví dụ, khu vực Bệnh nhân gồm phần thiết lập khóa, danh sách gói bảo hiểm, biểu mẫu mua bảo hiểm, thẻ NFT, biểu mẫu gửi yêu cầu bồi thường, danh sách yêu cầu và phần xem hồ sơ.

Cách tổ chức này giúp mỗi component tập trung vào một nhiệm vụ, thuận tiện kiểm thử và cập nhật giao diện. Các thành phần dùng chung như bố cục, thông báo giao dịch, hiển thị địa chỉ và hộp lỗi được đặt riêng để nhiều trang có thể sử dụng.

## 2.7.2. Vite và JavaScript

Vite được dùng làm công cụ phát triển và build frontend. Mã nguồn giao diện sử dụng JavaScript và JSX, không sử dụng TypeScript. Cấu hình môi trường được cung cấp thông qua các biến có tiền tố VITE_. Các giá trị cấu hình cục bộ, đặc biệt là thông tin xác thực dịch vụ, không được đưa vào repository.

Ứng dụng có thể chạy với dữ liệu Mock để kiểm tra giao diện độc lập hoặc chuyển sang service kết nối contract thật khi đã có ABI, địa chỉ contract và cấu hình mạng phù hợp.

## 2.7.3. React Router và điều hướng theo vai trò

React Router quản lý các đường dẫn chính của ứng dụng. Hệ thống có ba khu vực tương ứng với Bệnh nhân, Bệnh viện và Công ty bảo hiểm. Sau khi xác định quyền của địa chỉ ví, ứng dụng điều hướng người dùng đến khu vực phù hợp. Việc điều hướng không thay thế cơ chế phân quyền trên smart contract; contract vẫn là nơi kiểm tra quyền đối với các thao tác on-chain.

## 2.7.4. ethers v6 và MetaMask

Frontend sử dụng ethers v6 để giao tiếp với Ethereum. Ứng dụng khởi tạo BrowserProvider từ đối tượng window.ethereum do MetaMask cung cấp, lấy signer của tài khoản đang kết nối và tạo đối tượng contract từ địa chỉ cùng ABI đã được xuất.

Các thao tác đọc dữ liệu và gửi giao dịch được đóng gói trong contractService.js. Với thao tác ghi, ứng dụng có thể gọi staticCall để mô phỏng trước khi gửi giao dịch thật. Kết quả giao dịch được xử lý theo dạng gồm transaction hash và receipt. Cách tổ chức này giúp các trang không gọi contract trực tiếp, đồng thời tập trung việc chuyển đổi dữ liệu và xử lý lỗi.

## 2.7.5. Thành phần IPFS và mã hóa

Các thao tác lưu trữ IPFS và mã hóa được cung cấp qua services/index.js. Theo phân công của dự án, phần dịch vụ này do thành viên B phụ trách. Frontend sử dụng các hàm dịch vụ để tải tệp, lấy dữ liệu JSON và tạo/mở bản ghi đã mã hóa, thay vì tự gọi Pinata hoặc Web Crypto API từ từng trang.

Dữ liệu y tế được mã hóa bằng AES-256-GCM; khóa AES được bọc bằng RSA-OAEP cho các địa chỉ ví được phép. Cách làm này tách dữ liệu công khai dùng để tra cứu khỏi nội dung y tế cần bảo vệ. Người có CID nhưng không có khóa riêng phù hợp không thể giải mã nội dung bản ghi.

## 2.7.6. Vai trò của CSS và giao diện phản hồi

Giao diện sử dụng CSS thông thường, ưu tiên nền sáng, độ tương phản rõ và cỡ chữ dễ đọc. Các thao tác ghi cần thể hiện trạng thái đang xử lý, thành công hoặc thất bại. Khi thành công, giao diện hiển thị transaction hash; khi lỗi, thông báo được chuyển sang tiếng Việt để người dùng hiểu nguyên nhân và cách xử lý.

Như vậy, công nghệ frontend của MediChain không chỉ tạo giao diện mà còn đóng vai trò kết nối các thành phần: ví MetaMask, smart contract, dịch vụ IPFS và chức năng mã hóa. Việc tách lớp giúp mã nguồn dễ bảo trì và giữ đúng ranh giới trách nhiệm giữa các thành viên.

> **Ghi chú hoàn thiện báo cáo:** bổ sung phiên bản chính xác của các package từ package-lock.json nếu cần nêu trong bảng môi trường; chỉ bổ sung số liệu triển khai hoặc kết quả Sepolia khi đã có bằng chứng thực tế.