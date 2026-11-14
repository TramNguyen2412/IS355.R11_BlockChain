# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ NỀN TẢNG (PHẦN THÀNH VIÊN A)

---

## 2.1. Tổng quan Blockchain, mạng Ethereum, máy ảo EVM, cơ chế phí Gas và tính bất biến

### 2.1.1. Công nghệ chuỗi khối (Blockchain) và mạng Ethereum
Công nghệ chuỗi khối (Blockchain) là một sổ cái phân tán (distributed ledger) phi tập trung, trong đó dữ liệu được tổ chức thành các khối (blocks) liên kết chặt chẽ với nhau thông qua các hàm băm mật mã học (cryptographic hash functions). Mỗi khối bao gồm mã băm của khối trước đó, nhãn thời gian (timestamp) và danh sách các giao dịch đã được mạng lưới đồng thuận xác thực. Cấu trúc liên kết này đảm bảo rằng khi một khối đã được ghi nhận vào chuỗi, dữ liệu bên trong không thể bị thay đổi hoặc giả mạo nếu không tính toán lại toàn bộ các khối tiếp theo—điều bất khả thi về mặt tính toán trong một mạng lưới phân tán đủ lớn.

Ethereum là nền tảng blockchain thế hệ thứ hai, được đề xuất bởi Vitalik Buterin vào năm 2013 và chính thức đi vào hoạt động vào năm 2015. Khác biệt cốt lõi giữa Ethereum và Bitcoin nằm ở việc Ethereum không chỉ đơn thuần là một mạng lưới thanh toán tiền mã hóa ngang hàng, mà là một "máy tính toàn cầu" (World Computer) có tính toán Turing hoàn chỉnh (Turing-complete). Ethereum cho phép các nhà phát triển triển khai và thực thi các chương trình tự động hóa phức tạp, được gọi là hợp đồng thông minh (Smart Contract).

Trong dự án **MediChain**, mạng thử nghiệm Ethereum Sepolia (Sepolia Testnet) được lựa chọn làm môi trường triển khai thực tế. Mạng Sepolia sử dụng cơ chế đồng thuận Proof-of-Stake (PoS) tương tự như mạng chính (Mainnet) của Ethereum, cung cấp môi trường thử nghiệm với đầy đủ các thuộc tính kỹ thuật, cấu trúc giao dịch và phản hồi trạng thái thực tế mà không phát sinh chi phí tiền tệ thật.

---

### 2.1.2. Máy ảo Ethereum (Ethereum Virtual Machine - EVM)
Máy ảo Ethereum (EVM) là môi trường thực thi máy ảo dựa trên ngăn xếp (stack-based architecture), đảm nhận việc xử lý các chỉ lệnh bytecode của hợp đồng thông minh trên toàn bộ các nút mạng (nodes) của Ethereum. 

EVM có các đặc tính kiến trúc kỹ thuật nổi bật:
1. **Tính cô lập hoàn toàn (Sandboxed Execution):** Mã thực thi trong EVM hoàn toàn bị cô lập khỏi mạng ngoài, hệ thống tập tin cục bộ hoặc các tiến trình của máy chủ vận hành nút. Điều này đảm bảo an toàn tuyệt đối cho các nút tham gia mạng lưới.
2. **Tính tất định (Determinism):** Với cùng một trạng thái đầu vào (world state) và cùng một giao dịch (transaction), mọi nút EVM độc lập trên toàn cầu đều thực thi và cho ra cùng một kết quả trạng thái đầu ra duy nhất. Tính tất định là nền tảng để đạt được sự đồng thuận phân tán.
3. **Cơ chế lưu trữ dữ liệu trong EVM:**
   - **Storage:** Bộ nhớ lưu trữ vĩnh viễn trên blockchain. Đây là vùng lưu các biến trạng thái (state variables) của smart contract, có chi phí đọc/ghi gas cao nhất do dữ liệu phải được lưu giữ vĩnh viễn bởi mọi nút mạng.
   - **Memory:** Vùng nhớ tạm thời chỉ tồn tại trong suốt quá trình một hàm thực thi và bị giải phóng ngay sau khi giao dịch kết thúc. Chi phí gas cho Memory tăng theo hàm bậc hai của dung lượng cấp phát.
   - **Calldata:** Vùng nhớ chỉ đọc (read-only), không thể chỉnh sửa, chứa dữ liệu đối số được truyền từ giao dịch vào hàm. Sử dụng `calldata` cho các tham số kiểu mảng hoặc chuỗi giúp tối ưu hóa đáng kể chi phí gas.
   - **Stack:** Ngăn xếp 1024 phần tử, mỗi phần tử có kích thước 256-bit (32 bytes), được EVM sử dụng để thực hiện các phép tính số học và logic.

---

### 2.1.3. Cơ chế phí Gas và mô hình kinh tế giao dịch
Trong một hệ thống tính toán Turing hoàn chỉnh, nguy cơ xảy ra vòng lặp vô tận (infinite loop) hoặc các cuộc tấn công từ chối dịch vụ (DoS) làm tê liệt hệ thống là hiện hữu (bài toán dừng - Halting Problem). Để giải quyết triệt để vấn đề này, Ethereum thiết kế cơ chế phí **Gas**.

Gas là đơn vị đo lường khối lượng tài nguyên tính toán (CPU, bộ nhớ, lưu trữ) cần thiết để thực thi từng lệnh bytecode cụ thể trong EVM. Ví dụ, phép cộng đơn giản `ADD` tiêu tốn 3 gas, trong khi lệnh ghi dữ liệu mới vào vùng lưu trữ `SSTORE` có thể tiêu tốn tới 20.000 gas.

Chi phí giao dịch thực tế mà người dùng phải trả bằng Ether (ETH) được tính theo công thức chuẩn EIP-1559:

$$\text{Phí giao dịch (ETH)} = \text{Gas Used} \times (\text{Base Fee} + \text{Priority Fee})$$

Trong đó:
- **Gas Limit:** Lượng gas tối đa mà người khởi tạo giao dịch chấp nhận chi trả cho việc thực thi. Nếu giao dịch chạy hết Gas Limit mà chưa hoàn thành, trạng thái sẽ bị hoàn tác (`revert`), nhưng lượng gas đã tiêu thụ vẫn bị trừ để bù đắp cho thợ đào/người xác thực.
- **Base Fee:** Mức phí cơ sở được thuật toán của giao thức tự động điều chỉnh dựa trên độ tắc nghẽn của khối trước đó. Mức phí này sẽ bị đốt cháy (burn).
- **Priority Fee (Tip):** Khoản tiền thưởng tự nguyện trả thêm cho người xác thực khối (validator) để giao dịch được ưu tiên đóng gói nhanh hơn.

Đối với hệ thống MediChain, việc tối ưu hóa mức tiêu thụ Gas là yêu cầu sống còn. Từng cấu trúc dữ liệu (`struct`), kiểu dữ liệu (`uint256`, `uint64`), vị trí lưu trữ (`memory`, `calldata`, `storage`) và số lần gọi hàm `SSTORE` đều được thiết kế chặt chẽ nhằm giảm thiểu chi phí giao dịch cho người bệnh và bệnh viện khi tham gia hệ thống.

---

### 2.1.4. Tính bất biến của Blockchain: Phân biệt mã lệnh và trạng thái
Một trong những nguyên lý căn bản cần được định nghĩa chính xác trong đề tài là **tính bất biến (Immutability)** của công nghệ blockchain:

1. **Bất biến về mã lệnh (Code Immutability):**
   Khi một hợp đồng thông minh đã được biên dịch thành bytecode và triển khai (deploy) thành công lên mạng Ethereum tại một địa chỉ xác định, mã lệnh của hợp đồng đó là cố định vĩnh viễn. Không một cá nhân, tổ chức hay kể cả quản trị viên (Deployer/Admin) có thể chỉnh sửa, chắp vá hay xóa bỏ các dòng mã logic đã triển khai. Đặc tính này loại bỏ hoàn toàn nguy cơ gian lận từ phía công ty bảo hiểm trong việc đơn phương sửa đổi điều khoản hợp đồng sau khi người dùng đã đóng phí.

2. **Khả năng biến đổi trạng thái thông qua giao dịch (State Transition):**
   Tính bất biến **không đồng nghĩa** với việc dữ liệu trong hợp đồng bị đóng băng cố định. Ngược lại, trạng thái của hợp đồng (State) liên tục được cập nhật thông qua các giao dịch hợp lệ. 
   - Ví dụ: Số tiền đã bồi thường `usedAmount` của một hợp đồng bảo hiểm ban đầu có giá trị là `0`. Khi một yêu cầu bồi thường trị giá `0.5 ETH` được phê duyệt thành công, trạng thái `usedAmount` sẽ biến đổi thành `0.5 ETH`. Giá trị cũ không bị ghi đè hay xóa mất khỏi lịch sử, mà lịch sử biến đổi trạng thái từ `0` lên `0.5 ETH` được ghi nhận vĩnh viễn trên sổ cái blockchain thông qua giao dịch và sự kiện phát ra (`ClaimApproved`).

3. **Nguyên lý thực thi bị động (Passive Execution):**
   Hợp đồng thông minh trên blockchain là các thực thể tính toán bị động. Hợp đồng **không thể tự động kích hoạt** theo thời gian (ví dụ: tự động thức dậy lúc 0h để duyệt chi trả). Mọi hành động biến đổi trạng thái đều bắt buộc phải có một tài khoản bên ngoài (Externally Owned Account - EOA) hoặc một hợp đồng khác gửi giao dịch đến để kích hoạt. 
   - Do đó, thuật ngữ "tự động phê duyệt" (automatic approval) trong MediChain được hiểu chính xác là: *Khi một tác nhân hợp lệ (bệnh viện hoặc công ty bảo hiểm) gửi giao dịch gọi hàm phê duyệt, mã lệnh hợp đồng sẽ tự động thực thi các kiểm tra logic (tính hợp lệ của gói, thời hạn, hạn mức khả dụng, xác nhận viện phí) và tự động chuyển ngân quỹ bảo hiểm cho người bệnh mà không có sự can thiệp chủ quan hay tùy tiện của con người.*

---

## 2.2. Hợp đồng thông minh (Smart Contract) và ngôn ngữ Solidity

### 2.2.1. Khái niệm và vai trò của Smart Contract
Hợp đồng thông minh (Smart Contract) là thuật ngữ được nhà khoa học máy tính Nick Szabo đề xuất vào năm 1994, định nghĩa là một giao thức giao dịch trên máy tính nhằm tự động thực thi các điều khoản của một thỏa thuận. Trên nền tảng Ethereum, smart contract là một chương trình phần mềm được cài đặt tại một địa chỉ tài khoản hợp đồng (Contract Account), sở hữu số dư quỹ riêng và quản lý một vùng lưu trữ dữ liệu trạng thái độc lập.

Trong nghiệp vụ bảo hiểm y tế truyền thống, quy trình bồi thường thường chịu nhiều điểm nghẽn:
- Thủ tục giấy tờ phức tạp, kéo dài nhiều tuần hoặc nhiều tháng.
- Nguy cơ trục lợi bảo hiểm thông qua việc sửa chữa hóa đơn, chứng từ viện phí.
- Thiếu minh bạch trong khâu xét duyệt, công ty bảo hiểm có thể từ chối chi trả dựa trên các điều khoản mập mờ.

Smart contract đóng vai trò là "trọng tài số" khách quan, tự động hóa toàn bộ quy trình: thu phí bảo hiểm, phát hành thẻ bảo hiểm số, ghi nhận viện phí từ cơ sở y tế và tự động giải ngân viện phí ngay khi các điều kiện xác thực được thỏa mãn.

---

### 2.2.2. Ngôn ngữ lập trình Solidity và lý do lựa chọn thay vì Vyper
Solidity là ngôn ngữ lập trình cấp cao, hướng đối tượng (object-oriented), có kiểu dữ liệu tĩnh (statically typed), được thiết kế riêng để phát triển hợp đồng thông minh trên EVM. Solidity sở hữu cú pháp chịu ảnh hưởng sâu sắc từ C++, Python và JavaScript, hỗ trợ đầy đủ các tính năng nâng cao như tính kế thừa (inheritance), thư viện (libraries) và các kiểu cấu trúc phức tạp.

Bên cạnh Solidity, Vyper là ngôn ngữ phát triển hợp đồng thông minh phổ biến thứ hai trên EVM, sử dụng cú pháp tương tự Python và hướng đến sự an toàn tối đa bằng cách loại bỏ các tính năng phức tạp như kế thừa, đệ quy hay vòng lặp không giới hạn. 

Nhóm thực hiện dự án MediChain đã tiến hành phân tích, so sánh toàn diện giữa Solidity và Vyper để đưa ra lựa chọn công nghệ phù hợp nhất cho bài toán:

| Tiêu chí kỹ thuật | Ngôn ngữ Solidity (Được chọn) | Ngôn ngữ Vyper | Phân tích trong khuôn khổ MediChain |
|---|---|---|---|
| **Cú pháp ngôn ngữ** | Tương đồng C++/JavaScript, cấu trúc khối `{ }`, linh hoạt, biểu cảm cao. | Tương đồng Python, phân cấp bằng thụt lề (indentation). | Solidity mang lại sự quen thuộc cho lập trình viên web/hệ thống, dễ đọc hiểu các luồng logic phức tạp. |
| **Tính kế thừa (Inheritance)** | Hỗ trợ đa kế thừa mạnh mẽ (`is ERC721, AccessControl, ReentrancyGuard`). | Không hỗ trợ kế thừa, khuyến khích sử dụng module hoặc import trực tiếp. | MediChain kế thừa các chuẩn bảo mật đã được kiểm toán nghiêm ngặt từ thư viện OpenZeppelin v5. |
| **Hệ sinh thái & Thư viện** | Cực kỳ phong phú, là tiêu chuẩn công nghiệp với OpenZeppelin, Hardhat, Foundry. | Ít thư viện sẵn có hơn, phần lớn logic phải tự xây dựng từ đầu. | Tận dụng được OpenZeppelin v5 giúp hạn chế tối đa các lỗ hổng bảo mật phổ biến. |
| **Kiểm soát bảo mật** | Từ phiên bản 0.8.0, trình biên dịch tích hợp sẵn cơ chế chống tràn số (Overflow/Underflow). | Kiểm soát chặt chẽ giới hạn mảng, chống tràn số ngay từ thiết kế lõi. | Solidity 0.8.20 đáp ứng hoàn toàn yêu cầu an toàn toán học mà không cần thư viện `SafeMath` bên ngoài. |
| **Công cụ gỡ lỗi & Kiểm thử** | Tích hợp hoàn hảo với Hardhat, Mocha, Chai, Etherscan Verification. | Thường sử dụng kết hợp với Ape Framework, Brownie hoặc Titanoboa. | Quy trình kiểm thử và verify mã nguồn trên Etherscan của Solidity được hỗ trợ toàn diện nhất. |

**Kết luận lựa chọn:** Dự án MediChain quyết định sử dụng **Solidity phiên bản `^0.8.20`** (cụ thể là `0.8.28` trong môi trường phát triển Hardhat). Lựa chọn này cho phép tận dụng trọn vẹn bộ khung bảo mật tiêu chuẩn OpenZeppelin Contracts v5, cơ chế kiểm soát truy cập phân quyền dựa trên vai trò (Role-Based Access Control - RBAC) và bảo vệ giao dịch chống tấn công tái nhập (Reentrancy Protection).

---

## 2.3. Tiêu chuẩn ERC-721, Non-Fungible Token (NFT) và thẻ định danh Soulbound Token (SBT)

### 2.3.1. Phân biệt Token có thể thay thế (Fungible) và Không thể thay thế (Non-Fungible)
Trong hệ sinh thái blockchain, token kỹ thuật số được chia thành hai nhóm chính:
- **Token có thể thay thế (Fungible Token - tiêu chuẩn ERC-20):** Các đơn vị token hoàn toàn đồng nhất và có thể hoán đổi tương đương 1:1 cho nhau. Ví dụ: 1 đồng USDT của người A hoàn toàn có giá trị và chức năng giống hệt 1 đồng USDT của người B, có thể chia nhỏ thành các số thập phân.
- **Token không thể thay thế (Non-Fungible Token - NFT - tiêu chuẩn ERC-721):** Mỗi token là một thực thể kỹ thuật số duy nhất, được phân biệt bằng một mã định danh độc nhất vô nhị (`tokenId`). Mỗi NFT có thể gắn liền với các thuộc tính dữ liệu riêng biệt (metadata), đại diện cho quyền sở hữu đối với một tài sản độc bản (tác phẩm nghệ thuật, chứng chỉ số, bất động sản số).

Trong bài toán bảo hiểm y tế, một hợp đồng bảo hiểm không thể là một token ERC-20 thông thường vì mỗi hợp đồng gắn liền với một cá nhân người bệnh cụ thể, có mã số y tế riêng, hạn mức chi trả riêng, thời gian hiệu lực và lịch sử bồi thường hoàn toàn khác biệt. Do đó, việc ứng dụng chuẩn **ERC-721** để đại diện cho thẻ bảo hiểm số là giải pháp kỹ thuật tối ưu.

---

### 2.3.2. Tiêu chuẩn ERC-721 và cấu trúc Metadata
Tiêu chuẩn EIP-721 định nghĩa giao diện tối thiểu mà một hợp đồng thông minh quản lý token không thể thay thế phải tuân thủ, bao gồm các hàm quản lý quyền sở hữu (`ownerOf`), chuyển giao quyền sở hữu (`transferFrom`, `safeTransferFrom`), ủy quyền giao dịch (`approve`, `setApprovalForAll`) và siêu dữ liệu (`tokenURI`).

Hàm `tokenURI(uint256 tokenId)` trả về một định danh tài nguyên (URI) trỏ tới một tập tin JSON chứa các thuộc tính mô tả chi tiết của thẻ bảo hiểm. Trong MediChain, tập tin metadata này được phân tán trên mạng IPFS thông qua dịch vụ Pinata, đảm bảo tính bất biến của thông tin thẻ mà không tốn kém chi phí lưu trữ on-chain:

```json
{
  "name": "MediChain Health Card #1",
  "description": "The bao hiem y te phi tap trung tren nen tang Blockchain",
  "image": "ipfs://QmZ8.../card.png",
  "attributes": [
    { "trait_type": "Plan ID", "value": 1 },
    { "trait_type": "Coverage Limit", "value": "2.0 ETH" },
    { "trait_type": "Status", "value": "Active" }
  ]
}
```

---

### 2.3.3. Khái niệm Soulbound Token (SBT) và kỹ thuật khóa chuyển nhượng
Khái niệm **Soulbound Token (SBT)** được Vitalik Buterin, Glen Weyl và Puja Ohlhaver đề xuất vào năm 2022 trong tài luận *"Decentralized Society: Finding Web3's Soul"*. SBT là các token không thể chuyển nhượng (non-transferable), được gắn kết vĩnh viễn với "Soul" (đại diện bởi một địa chỉ ví blockchain cụ thể). SBT được ứng dụng để định danh, lưu trữ văn bằng chứng chỉ, lịch sử tín dụng hoặc hồ sơ y tế cá nhân.

Trong hệ thống MediChain, thẻ bảo hiểm y tế bắt buộc phải là một **Soulbound Token**:
- **Ý nghĩa nghiệp vụ:** Thẻ bảo hiểm y tế là tài sản định danh cá nhân gắn liền với lịch sử bệnh lý của một cá nhân duy nhất. Người bệnh tuyệt đối không được phép bán, chuyển nhượng hoặc tặng thẻ bảo hiểm của mình cho người khác để trục lợi viện phí.
- **Hiện thực kỹ thuật trên OpenZeppelin v5:**
  Trong OpenZeppelin Contracts v5, quy trình chuyển dịch token (bao gồm cả mint, transfer, burn) đều đi qua hàm hook nội bộ duy nhất là `_update(address to, uint256 tokenId, address auth)`. 
  Hợp đồng `HealthInsuranceNFT` hiện thực tính chất Soulbound bằng cách ghi đè (override) hàm `_update` này:

```solidity
function _update(
    address to,
    uint256 tokenId,
    address auth
) internal virtual override returns (address) {
    address from = _ownerOf(tokenId);
    
    // Nếu 'from' khác address(0), đây là hành động chuyển nhượng sau khi mint -> BỊ CHẶN HOÀN TOÀN
    if (from != address(0) && to != address(0)) {
        revert("The bao hiem khong the chuyen nhuong");
    }
    
    return super._update(to, tokenId, auth);
}
```

Nhờ cơ chế này:
- Khi phát hành thẻ mới (`from == address(0)`), hàm thực thi bình thường.
- Khi người dùng hoặc bên thứ ba cố tình gọi `transferFrom` hoặc `safeTransferFrom` (`from != address(0)` và `to != address(0)`), giao dịch sẽ ngay lập tức bị chặn lại và hoàn tác (`revert`) với thông điệp `"The bao hiem khong the chuyen nhuong"`.

---

## 2.4. Bảo hiểm tham số (Parametric Insurance) và mô hình chi trả tự động trên Blockchain

### 2.4.1. Nguyên lý hoạt động của Bảo hiểm tham số
Bảo hiểm truyền thống (Indemnity Insurance) hoạt động dựa trên nguyên tắc bồi thường thiệt hại thực tế: sau khi sự kiện bảo hiểm xảy ra, người mua phải nộp hồ sơ, hóa đơn gốc và chờ giám định viên của công ty bảo hiểm trực tiếp điều tra, đánh giá tổn thất rồi mới ra quyết định chi trả. Quá trình này tốn nhiều chi phí thẩm định, dễ phát sinh tranh chấp pháp lý và thường kéo dài thời gian chờ đợi của người bệnh.

Ngược lại, **Bảo hiểm tham số (Parametric Insurance)** là mô hình bảo hiểm trong đó việc bồi thường được kích hoạt tự động dựa trên việc thỏa mãn các tham số hoặc chỉ số khách quan đã được xác định trước (pre-defined triggers), thay vì phụ thuộc vào việc đánh giá tổn thất chủ quan kéo dài. Khi các điều kiện tham số đo lường được xác nhận trùng khớp với điều khoản thỏa thuận, hợp đồng thông minh sẽ tự động giải ngân quyền lợi bảo hiểm ngay lập tức.

---

### 2.4.2. Cơ chế kích hoạt tự động (Triggers) trong MediChain
Trong hệ thống y tế phi tập trung MediChain, mô hình bảo hiểm tham số được cụ thể hóa thông qua cơ chế kích hoạt hai lớp (Dual-Trigger Mechanism):

```text
    ┌──────────────────────┐
    │  Người bệnh / BV     │
    │  Tạo Claim viện phí  │
    └──────────┬───────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  TRIGGER 1: Xác thực chuyên môn y tế │ ──► Bệnh viện được ủy quyền xác nhận
│  (Hospital Medical Trigger)          │     chi phí thực tế khớp hồ sơ bệnh án
└──────────────┬───────────────────────┘
               │ hospitalConfirmed == true
               ▼
┌──────────────────────────────────────┐
│  TRIGGER 2: Tham số hợp đồng On-chain│
│  - Thẻ bảo hiểm còn hạn sử dụng      │ ──► Kiểm tra tự động 100% bằng mã code
│  - Chi phí <= Hạn mức còn lại        │     Smart Contract, không phụ thuộc
│  - Số dư quỹ thanh khoản đủ trả      │     vào ý chí chủ quan của con người
└──────────────┬───────────────────────┘
               │ Thỏa mãn toàn bộ tham số
               ▼
┌──────────────────────────────────────┐
│     TỰ ĐỘNG GIẢI NGÂN (PAYOUT)       │ ──► Chuyển ETH thẳng về ví bệnh nhân
│     Cập nhật hạn mức on-chain        │     và kích hoạt Event ClaimApproved
└──────────────────────────────────────┘
```

1. **Trigger xác thực y tế (Hospital Authorization Trigger):** Bệnh viện được cơ quan quản lý ủy quyền kiểm tra tính xác thực của việc khám chữa bệnh và xác nhận chi phí viện phí phát sinh (`hospitalConfirmed = true`).
2. **Trigger tham số toán học trên Smart Contract (Parametric Evaluation Trigger):** Hợp đồng thông minh tự động kiểm tra hệ điều kiện:
   - Thời điểm bồi thường nằm trong thời hạn bảo hiểm: `block.timestamp <= policy.expiryDate`.
   - Tổng chi phí bồi thường không vượt quá quyền lợi tối đa: `policy.usedAmount + amount <= policy.coverageLimit`.
   - Quỹ thanh khoản của hệ thống bảo đảm khả năng chi trả: `address(this).balance >= amount`.

---

### 2.4.3. Ưu điểm, Thách thức và Vấn đề Oracle trong hệ sinh thái
Mô hình bảo hiểm tham số trên blockchain mang lại những ưu thế vượt trội:
- **Tốc độ xử lý tức thì:** Loại bỏ hoàn toàn quy trình xử lý giấy tờ thủ công; việc thanh toán diễn ra trong vài giây ngay khi khối giao dịch được xác thực.
- **Tính minh bạch tuyệt đối:** Mọi quy tắc và điều khoản chi trả đều được công khai dưới dạng mã nguồn mở trên blockchain, loại bỏ hoàn toàn việc công ty bảo hiểm tự ý diễn giải điều khoản có lợi cho mình.
- **Tiết kiệm chi phí vận hành:** Việc tự động hóa giúp các công ty bảo hiểm cắt giảm tới 80% chi phí hành chính và thẩm định, từ đó có thể hạ giá thành các gói bảo hiểm cho cộng đồng.

**Thách thức về bài toán Oracle:**
Hợp đồng thông minh trên blockchain vốn không thể tự kết nối trực tiếp ra thế giới Internet bên ngoài (Internet-isolated). Do đó, hệ thống bắt buộc phải dựa vào nguồn cấp dữ liệu ngoại vi (Oracle) để xác thực các sự kiện thực tế. 
- Trong khuôn khổ dự án MediChain, các **bệnh viện được ủy quyền (Authorized Hospitals)** đóng vai trò là các "Human/Entity Oracles". Bệnh viện ký duyệt chi phí viện phí bằng chữ ký số thông qua ví Web3 được gán vai trò `HOSPITAL_ROLE`. 
- Để giảm thiểu rủi ro gian lận từ Oracle (ví dụ bệnh viện thông đồng với bệnh nhân kê khống viện phí), hệ thống áp dụng cơ chế xác thực hai chữ ký (bệnh nhân ký yêu cầu bồi thường và bệnh viện ký xác nhận viện phí), kết hợp với việc lưu trữ hồ sơ bệnh án mã hóa bất biến trên IPFS để phục vụ kiểm toán độc lập hậu kiểm.
