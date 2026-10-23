#!/usr/bin/env bash
# Chạy MỘT LẦN, từ thư mục GỐC của repo MediChain
# (git clone https://github.com/TramNguyen2412/IS355.R11_BlockChain.git MediChain).
# Cần: bash (Git Bash trên Windows được), plan_A đã giải nén ở ./docs/plan/A hoặc đặt cạnh.
set -e
[ -d .git ] || { echo "LOI: hay chay trong thu muc repo (co .git)"; exit 1; }

# 1) Cây thư mục theo file 00 mục 3.1 (thư mục rỗng có .gitkeep)
for d in \
  .github docs/plan/A docs/plan/B docs/plan/C docs/plan/A/reports docs/progress \
  docs/report/images/A docs/report/images/B docs/report/images/C \
  docs/bpmn docs/slides docs/video \
  contracts-hardhat frontend/src/app frontend/src/components/shared frontend/src/styles \
  frontend/src/contracts frontend/src/services/mock \
  frontend/src/pages/patient frontend/src/pages/hospital frontend/src/pages/insurer \
  sample-data tools/web3py
do
  mkdir -p "$d"
  [ -n "$(ls -A "$d" 2>/dev/null)" ] || touch "$d/.gitkeep"
done

# 2) .gitignore (file 02, M0.3)
cat > .gitignore <<'EOT'
node_modules/
.env
.env.local
*.pem
*.key
artifacts/
cache/
typechain-types/
dist/
.DS_Store
EOT

# 3) .env.example (file 00 mục 4.3)
cat > .env.example <<'EOT'
# contracts-hardhat/.env  (A)
SEPOLIA_RPC_URL=
DEPLOYER_PRIVATE_KEY=       # vi demo chi dung cho testnet, tuyet doi khong dung vi co tien that
ETHERSCAN_API_KEY=
HOSPITAL_ADDRESS=
POOL_FUND_ETH=

# frontend/.env  (B, C)
VITE_USE_MOCK=true
VITE_PINATA_JWT=
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
VITE_CHAIN_ID=31337
EOT

# 4) AGENTS.md và CLAUDE.md (file 00 mục 0.3, đúng 3 dòng)
for f in AGENTS.md CLAUDE.md; do
cat > "$f" <<'EOT'
Đọc docs/00_AI_RULES_AND_CONTRACTS.md trước mọi việc. Đây là luật bắt buộc.
Hỏi người dùng họ là thành viên A, B hay C nếu chưa biết. Chỉ sửa thư mục của vai trò đó.
Cuối phiên làm việc, cập nhật docs/progress/PROGRESS_<vai trò>.md.
EOT
done

# 5) CODEOWNERS (file 00 mục 3.2). SỬA 3 tên GitHub bên dưới trước khi commit!
cat > .github/CODEOWNERS <<'EOT'
# A = Trâm (@TramNguyen2412). Hãy đổi hai tên giữ chỗ của B (Phương Anh) và C (Lan Anh) thành tên GitHub thật.
/contracts-hardhat/                      @TramNguyen2412
/frontend/src/contracts/                 @TramNguyen2412
/frontend/src/pages/hospital/            @TramNguyen2412
/docs/plan/A/                            @TramNguyen2412
/docs/progress/PROGRESS_A.md             @TramNguyen2412
/frontend/src/services/                  @anhanhpng
/frontend/src/pages/insurer/             @anhanhpng
/sample-data/                            @anhanhpng
/tools/web3py/                           @anhanhpng
/docs/bpmn/                              @anhanhpng
/docs/plan/B/                            @anhanhpng
/docs/progress/PROGRESS_B.md             @anhanhpng
/frontend/package.json                   @23520052
/frontend/vite.config.js                 @23520052
/frontend/index.html                     @23520052
/frontend/src/main.jsx                   @23520052
/frontend/src/app/                       @23520052
/frontend/src/components/shared/         @23520052
/frontend/src/styles/                    @23520052
/frontend/src/pages/patient/             @23520052
/README.md /AGENTS.md /CLAUDE.md /.gitignore /.env.example /.github/ @23520052
/docs/plan/C/                            @23520052
/docs/progress/PROGRESS_C.md             @23520052
/docs/video/                             @23520052
EOT

# 6) README.md tối thiểu (C sẽ viết đầy đủ sau)
[ -f README.md ] || cat > README.md <<'EOT'
# MediChain
Hệ thống quản lý bảo hiểm y tế phi tập trung (IS355.R11). Tên sản phẩm: **MediChain**; tên smart contract trong code: `HealthInsuranceNFT`.
Repo: https://github.com/TramNguyen2412/IS355.R11_BlockChain.git. Nhánh cố định: `tram` (A, Trâm), `phuong-anh` (B, Phương Anh), `lan-anh` (C, Lan Anh). Luật chung: docs/00_AI_RULES_AND_CONTRACTS.md. Kế hoạch: docs/plan/00_MASTER_PLAN.md.
EOT

# 7) PROGRESS_A/B/C theo mẫu file 00 mục 8.2
for r in A B C; do
case $r in A) BR=tram; NM="Trâm";; B) BR=phuong-anh; NM="Phương Anh";; C) BR=lan-anh; NM="Lan Anh";; esac
cat > docs/progress/PROGRESS_$r.md <<EOT
# PROGRESS — Thành viên $r ($NM)
Cập nhật lần cuối: (chưa làm)

## Đã xong
- [x] M0 — Khởi tạo repo MediChain, cây thư mục, luật chung (do A (Trâm) làm). Nhánh làm việc của mình: \`$BR\`

## Đang làm / dừng ở đâu
- Task hiện tại: (chưa bắt đầu)
- Bước tiếp theo (làm ngay): xem docs/plan/00_MASTER_PLAN.md, việc đầu tiên của $r

## File đã tạo / sửa (liệt kê theo đường dẫn)
- (chưa có)

## Quyết định đã chốt trong phiên (không đổi nếu chưa họp)
- (chưa có)

## Vấn đề đang kẹt / cần người khác
- (chưa có)

## Yêu cầu gửi người khác
- (chưa có)

## Cách chạy / kiểm tra phần đã làm
- (chưa có)
EOT
done


# 8) Trang Bệnh viện tạm (A) – các trang Bệnh nhân/Công ty BH để C và B tự tạo
cat > frontend/src/pages/hospital/HospitalPage.jsx <<'EOT'
export default function HospitalPage() { return <div>Màn hình Bệnh viện đang phát triển</div>; }
EOT
rm -f frontend/src/pages/hospital/.gitkeep

echo "XONG. Kiem tra: git status --short"
