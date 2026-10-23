# A00 — BƯỚC 0: A (Trâm) dựng repo MediChain cho cả nhóm + CÁCH DÙNG bộ file này

> Làm **trước A01**. Hạn: Thứ 2 19/10 (trễ nhất sáng Thứ 3 20/10). Vì A (Trâm) đứng ra dựng repo nên Trâm làm **cả việc M0-A1 (trước đây ghi là của C) lẫn M0-A2**. **C (Lan Anh) bỏ qua C-01**, bắt đầu từ C-02. Các bước dưới là Trâm tự gõ, không giao cho AI.

**Thông tin chốt của nhóm:**
| Mục | Giá trị |
|---|---|
| Tên sản phẩm (giao diện, báo cáo) | **MediChain** |
| Tên smart contract (code, **không đổi**) | `HealthInsuranceNFT` |
| Repo GitHub (đã đăng ký với giảng viên) | `https://github.com/TramNguyen2412/IS355.R11_BlockChain.git` |
| Thư mục local | `MediChain` |
| Nhánh cố định | A (Trâm): `tram` · B (Phương Anh): `phuong-anh` · C (Lan Anh): `lan-anh` |

**Quy tắc Git (file 00 mục 8.3):** mỗi người chỉ dùng **một nhánh cố định**. Làm trên nhánh của mình → `git pull origin main` (gộp `main` mới nhất, kiểm tra không conflict) → `git push origin <nhánh của mình>` → Pull Request vào `main`. Không tạo nhánh phụ theo từng chặng, không push thẳng `main` (trừ lần khởi tạo repo ở dưới).

## PHẦN 1 — Dựng repo, thư mục, file ban đầu, 3 nhánh, rồi báo nhóm

### 1.1 Cài công cụ (một lần)
Node.js **LTS ≥ 18**, Git, VS Code, MetaMask. Trên Windows dùng **Git Bash** để chạy script. Kiểm tra:
```bash
node -v      # >= v18
git --version
bash --version
```

### 1.2 Chuẩn bị 3 thứ cần copy vào repo
1. `00_AI_RULES_AND_CONTRACTS.md` (file luật bản mới nhất, đã cập nhật nhánh `tram`/`phuong-anh`/`lan-anh`).
2. `00_MASTER_PLAN.md` (bản mới nhất).
3. Thư mục `A/` (giải nén `plan_A.zip`: `README_A.md`, `RULES_A.md`, `A00…A14`, `tools/`).

### 1.3 Repo GitHub và mời B, C
Repo `IS355.R11_BlockChain` (Private) đã tạo sẵn dưới tài khoản `TramNguyen2412`. Vào repo → **Settings → Collaborators → Add people**: mời **B (Phương Anh)** và **C (Lan Anh)** bằng tên tài khoản GitHub; nhắn hai bạn nhận lời mời.

### 1.4 Clone về thư mục `MediChain` và chạy script dựng khung
```bash
git clone https://github.com/TramNguyen2412/IS355.R11_BlockChain.git MediChain
cd MediChain
```
(Nếu repo đã có sẵn vài file như README do GitHub tạo, vẫn làm tiếp bình thường; script không ghi đè `README.md` có sẵn.)
Đặt file vào đúng chỗ:
```bash
mkdir -p docs/plan
cp <đường dẫn>/00_AI_RULES_AND_CONTRACTS.md docs/
cp <đường dẫn>/00_MASTER_PLAN.md docs/plan/
cp -r <đường dẫn>/A docs/plan/A          # thư mục A đã giải nén (có cả tools/)
```
Chạy script (tạo cây thư mục theo file 00 mục 3.1, `.gitignore`, `.env.example`, `AGENTS.md`, `CLAUDE.md`, `.github/CODEOWNERS`, `README.md` MediChain, 3 file `PROGRESS_A/B/C.md`, trang `HospitalPage.jsx` tạm):
```bash
bash docs/plan/A/tools/bootstrap_repo.sh
```
→ in `XONG`. **Chưa commit.**

### 1.5 Sửa CODEOWNERS (bắt buộc)
Mở `.github/CODEOWNERS`: `@USER_A` đã thay sẵn bằng `@TramNguyen2412`. Thay `@USER_B` bằng tên GitHub của **Phương Anh**, `@USER_C` bằng tên GitHub của **Lan Anh** (giữ ký tự `@`). Kiểm tra:
```bash
grep -n "USER_" .github/CODEOWNERS      # phải rỗng
```

### 1.6 Kiểm tra trước khi commit
```bash
ls                                  # có AGENTS.md CLAUDE.md README.md contracts-hardhat docs frontend sample-data tools ...
ls docs docs/plan docs/progress     # có 00_AI_RULES..., plan/00_MASTER_PLAN.md, plan/A, PROGRESS_A/B/C.md
head -5 .gitignore
git status --short
git status --short | grep -E "\.env$|\.pem|\.key"   # phải rỗng
```

### 1.7 Commit và đẩy `main` (lần khởi tạo duy nhất được đẩy thẳng `main`)
```bash
git add .
git commit -m "[M0] Init MediChain repo: folders, rules, master plan, plan A, PROGRESS"
git branch -M main
git push -u origin main
```
(`git add .` chỉ dùng **đúng lần này**, khi repo còn sạch và đã kiểm `.gitignore`.)

### 1.8 Tạo 3 nhánh cố định và đẩy lên GitHub
```bash
git branch tram
git branch phuong-anh
git branch lan-anh
git push -u origin tram phuong-anh lan-anh
git checkout tram
git branch --show-current            # phải in: tram
```

### 1.9 Bảo vệ nhánh `main` (sau khi đã đẩy xong 1.7 và 1.8)
GitHub → Settings → Branches → **Add branch protection rule** → Branch name `main` → tick **Require a pull request before merging** (số người duyệt: 1). **Đừng** tick "Require review from Code Owners" (dễ làm kẹt PR của chính chủ). Lưu.

### 1.10 Việc còn lại của M0-ALL
- Tạo ví MetaMask **ADMIN** và **OUTSIDER** (ví thử nghiệm, **không chứa tiền thật**), xin ETH Sepolia từ faucet (ADMIN ~0.3 ETH). Khóa riêng **không** dán vào repo hay chat với AI.
- Nhập 4 ví chung theo master plan M0-ALL.

### 1.11 Cập nhật PROGRESS_A
Mở `docs/progress/PROGRESS_A.md` (script đã tạo), ghi thêm dòng "Đã xong": `- [x] A00 — Dựng repo MediChain, cây thư mục, 3 nhánh cố định`. Commit trên nhánh `tram` cùng với A01 (không commit thẳng `main` nữa).

### 1.12 Nhắn nhóm (mẫu, dán vào chat nhóm)
```text
[M0 XONG] Repo MediChain đã dựng: https://github.com/TramNguyen2412/IS355.R11_BlockChain.git (Private).
Mình đã mời B (Phương Anh) và C (Lan Anh), nhớ nhận lời mời.
Mỗi người dùng ĐÚNG 1 NHÁNH CỐ ĐỊNH suốt dự án:
  - A (Trâm): tram
  - B (Phương Anh): phuong-anh
  - C (Lan Anh): lan-anh
Cách làm: git clone https://github.com/TramNguyen2412/IS355.R11_BlockChain.git MediChain
          cd MediChain && git checkout <nhánh của bạn>
Mỗi lần làm: làm trên nhánh mình -> git pull origin main (kiểm tra không conflict) -> git push origin <nhánh mình> -> mở Pull Request vào main.
Không tạo nhánh phụ, không push thẳng main.
Mình (A) đã làm xong C-01 (repo, cây thư mục, .gitignore, .env.example, CODEOWNERS, AGENTS.md/CLAUDE.md), nên C bỏ qua C-01, bắt đầu từ C-02.
.env.example đã có thêm 2 biến HOSPITAL_ADDRESS và POOL_FUND_ETH (đã ghi vào file 00 mục 4.3).
Mỗi người đã có sẵn docs/progress/PROGRESS_<vai trò>.md và docs/plan/<vai trò>/ (B, C tự thêm kế hoạch chi tiết vào đó).
Đọc trước: docs/00_AI_RULES_AND_CONTRACTS.md và docs/plan/00_MASTER_PLAN.md. Chỉ sửa trong thư mục của mình (file 00 mục 3.2).
Tên sản phẩm là MediChain; tên smart contract trong code vẫn là HealthInsuranceNFT.
Ví thử nghiệm: mình sẽ gửi riêng khóa 4 ví thử qua tin nhắn riêng (KHÔNG ghi vào repo).
```

✅ **Xong A00 khi:** B (Phương Anh) và C (Lan Anh) `git clone` được, thấy đủ thư mục và 3 nhánh; `main` đã bật bảo vệ; `docs/progress/PROGRESS_A.md` có trong repo.

### 1.13 Nếu có sự cố
| Sự cố | Cách xử lý |
|---|---|
| `bash` không chạy được trên Windows | Mở **Git Bash** (cài cùng Git), không dùng PowerShell/CMD |
| Script báo `LOI: hay chay trong thu muc repo` | Bạn chưa `cd` vào thư mục `MediChain` đã clone |
| `git push` bị từ chối (đã bật bảo vệ trước) | Tạm tắt bảo vệ, push, bật lại |
| `git clone` đòi đăng nhập | Dùng GitHub Desktop/Git Credential Manager hoặc Personal Access Token |
| Lỡ commit `.env`/khóa | Coi như lộ: đổi khóa mới; nhắn Claude để xử lý lịch sử Git |
| `git pull origin main` báo conflict | Dừng, không xóa bừa; dán lỗi cho Claude; giữ cả hai thay đổi hợp lý |

---

## PHẦN 2 — CÁCH DÙNG các file .md (đọc kỹ một lần)

### 2.1 Mỗi file chặng là gì?
Một "phiếu giao việc" cho AI: nó chứa ngữ cảnh cần đọc, file được phép sửa, code đã kiểm chứng, lệnh kiểm tra, và **prompt dán sẵn ở mục 9 cuối file**. Trâm **không phải tự soạn prompt**.

### 2.2 Vòng lặp cho MỖI chặng (A01 → A14, đi lần lượt, không nhảy)
1. `git checkout tram && git pull origin main` (nhánh cố định của A (Trâm); **không** tạo nhánh mới).
2. Mở **cuộc trò chuyện AI mới** (Claude Code, Cursor, Copilot Agent... loại đọc được file trong repo). Mở đúng thư mục repo.
3. Mở file chặng, **kéo xuống mục 9 "Prompt dán cho AI"**, copy cả khối, dán vào AI. Chỉ cần vậy.
4. AI sẽ nhắc lại vai trò/file sẽ sửa. Có file nằm ngoài mục 2 "File được phép" → bảo AI dừng.
5. AI làm xong, ghi `docs/plan/A/reports/REPORT_A<NN>.md` và cập nhật `PROGRESS_A.md`.
6. **Tự gõ lại** các lệnh ở mục 6 của file chặng, so với kết quả mong đợi.
7. **Nhắn cho Claude** (cuộc chat này hoặc mới) đúng mẫu:
```text
Kiểm chặng A<NN>.
[dán toàn bộ REPORT_A<NN>.md]
[dán file code chính ghi ở mục "Gửi mình kiểm"]
```
Claude trả lời **ĐẠT** hoặc **SỬA những điểm sau**.
8. Chỉ khi **ĐẠT**: `git add` đúng các file ở mục 2 (không `git add .`), commit `[M1] ...`, `git pull origin main` (không conflict), `git push origin tram`, mở Pull Request từ `tram` vào `main`, merge xong thì `git checkout tram && git pull origin main`, rồi sang chặng sau.

### 2.3 Nếu AI của Trâm KHÔNG đọc được file trong repo (chat web thường)
Dán lần lượt vào một cuộc chat mới, theo thứ tự: (1) nội dung `docs/00_AI_RULES_AND_CONTRACTS.md`, (2) `RULES_A.md`, (3) `PROGRESS_A.md`, (4) file chặng, (5) khối prompt mục 9. Sau đó bảo AI xuất từng file code để Trâm tự tạo file.

### 2.4 Prompt mẫu chung (dùng khi muốn tự gõ, thay `<NN>` và tên file)
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/<TÊN_FILE_CHẶNG>.md.
Chỉ làm ĐÚNG chặng A<NN> trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A<NN>.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
Ví dụ A01: `<TÊN_FILE_CHẶNG>` = `A01_khoi_tao_hardhat`. (Prompt thật trong từng file đã điền sẵn, ưu tiên dùng cái đó.)

### 2.5 Ba quy tắc sống còn
- **Mỗi chặng một cuộc chat AI mới.** Đừng dùng lại.
- **AI không bao giờ thấy khóa riêng/`.env`.** Chặng A10, A13: Trâm tự gõ lệnh có khóa.
- **AI kẹt hoặc báo lỗi thì dừng và dán lỗi cho Claude**, đừng bảo AI "tự sửa cho được".

### 2.6 Lộ trình tóm tắt
A01 Hardhat → A02 khung contract → A03 xuất ABI/deploy local (H2) → A04–A07 bốn nghiệp vụ + test → A08 seed (H3) → A09, A11, A12 màn hình Bệnh viện → A10 thử Sepolia → A13 deploy chính thức (H6) → A14 minh chứng/báo cáo. Ngày cụ thể ở `README_A.md` mục 2.
