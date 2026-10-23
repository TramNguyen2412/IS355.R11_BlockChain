# CHẶNG A12 — Màn hình Bệnh viện, phần 3: xác nhận chi phí, ghép trang, chuyển sang contract thật

> **Mã master:** A-13 và A-14 · **Hạn:** Thứ 7 07/11 (mốc **H5**) · **Rubric:** 2, 1 (ràng buộc số 1: chỉ bệnh viện xác nhận) · **Nhánh:** `tram` · **Cần trước:** A11 đã merge; A08 (H3) và B (H4: `ipfsService`/`cryptoService` bản thật) đã có.

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Hai việc: **(1) Danh sách claim chờ xác nhận:** những claim do **bệnh nhân tự gửi** chưa có xác nhận của bệnh viện. Bệnh viện xem, chỉnh số tiền (không vượt số tiền yêu cầu) và bấm **"Xác nhận chi phí"** (gọi `confirmClaim`, đây chính là **ràng buộc số 1** của Rubric nhìn từ giao diện). **(2) Chuyển từ dữ liệu giả lập sang contract + dịch vụ thật** trên máy local, chạy trọn luồng và sửa lỗi phía bệnh viện. Sau chặng này màn hình Bệnh viện hoàn chỉnh.

## 1. Nạp ngữ cảnh
File 00 mục 1, 2.4, 4.4 (`getAllClaims`, `confirmClaim`, `getRoles`), 5 (thứ tự khởi tạo), 6.1, 6.7 · `RULES_A.md` (mục 3) · `PROGRESS_A.md` · `REPORT_A09.md` (bảng cách dùng thành phần của C/B).

## 2. File được phép tạo/sửa
- `frontend/src/pages/hospital/PendingConfirmList.jsx` (mới)
- `frontend/src/pages/hospital/HospitalPage.jsx` (sửa)
- `frontend/src/pages/hospital/hospital.css` (thêm class nếu cần)
- Các file khác **trong `pages/hospital/`** nếu phải sửa lỗi phát hiện khi chạy thật
- `docs/plan/A/reports/REPORT_A12.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** sửa file của B/C khi gặp lỗi (ghi vào báo cáo mục 7 và `PROGRESS_A` mục "Yêu cầu gửi người khác" để người đó sửa); đổi contract (đổi contract = đổi ABI của cả nhóm, phải báo ngay theo mục 8.1).

## 3. Kiểm tra trước khi làm
`git pull origin main`; `cd frontend && npm run build` thành công; có `SubmitClaimForm.jsx`.

## 4. Các bước

**Bước 1 — Viết `PendingConfirmList.jsx`** (chỉ thay dòng `ADAPT`):
```jsx
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../app/WalletProvider.jsx"; // ADAPT
import * as contractService from "../../app/contractService.js"; // ADAPT
import ErrorBox from "../../components/shared/ErrorBox.jsx"; // ADAPT

function shortAddr(a) {
  return a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "";
}

export default function PendingConfirmList() {
  const { address } = useWallet(); // ADAPT
  const [isHospital, setIsHospital] = useState(null);
  const [claims, setClaims] = useState([]);
  const [amounts, setAmounts] = useState({}); // claimId -> số tiền xác nhận (chuỗi ETH)
  const [busyId, setBusyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const load = useCallback(async () => {
    if (!address) return;
    setLoading(true); setError("");
    try {
      const roles = await contractService.getRoles(address);
      setIsHospital(roles.isHospital);
      if (!roles.isHospital) { setClaims([]); return; }
      const all = await contractService.getAllClaims();
      const pending = all.filter((c) => c.statusLabel === "PENDING" && !c.hospitalConfirmed);
      setClaims(pending);
      const init = {};
      pending.forEach((c) => { init[String(c.claimId)] = ethers.formatEther(c.amount); });
      setAmounts(init);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => { setInfo(""); load(); }, [load]);

  async function handleConfirm(claim) {
    const key = String(claim.claimId);
    setError(""); setInfo("");
    let value;
    try { value = ethers.parseEther((amounts[key] || "").trim()); } catch { setError("Số tiền xác nhận không hợp lệ."); return; }
    if (value <= 0n) { setError("Số tiền xác nhận phải lớn hơn 0."); return; }
    if (value > claim.amount) { setError("Số tiền xác nhận không được lớn hơn số tiền yêu cầu."); return; }
    setBusyId(key);
    try {
      await contractService.confirmClaim(claim.claimId, value, { dryRun: true });
      const tx = await contractService.confirmClaim(claim.claimId, value);
      setInfo(`✅ Đã xác nhận yêu cầu #${key}. Mã giao dịch: ${tx.hash}`);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  if (isHospital === false) return null; // ví không có quyền: VerifyCard đã báo, không hiện thêm

  return (
    <section className="hospital-card">
      <h2>4. Yêu cầu chờ bệnh viện xác nhận chi phí</h2>
      <button className="hospital-btn" onClick={load} disabled={loading}>Tải lại danh sách</button>
      {loading && <p>Đang tải...</p>}
      {!loading && claims.length === 0 && <p>Không có yêu cầu nào đang chờ xác nhận.</p>}
      {claims.length > 0 && (
        <table className="hospital-table">
          <thead>
            <tr><th>Mã</th><th>Bệnh nhân</th><th>Số tiền yêu cầu (ETH)</th><th>Số tiền xác nhận (ETH)</th><th></th></tr>
          </thead>
          <tbody>
            {claims.map((c) => {
              const key = String(c.claimId);
              return (
                <tr key={key}>
                  <td>#{key}</td>
                  <td title={c.patient}>{shortAddr(c.patient)}</td>
                  <td>{ethers.formatEther(c.amount)}</td>
                  <td><input className="hospital-input" value={amounts[key] ?? ""} onChange={(e) => setAmounts((p) => ({ ...p, [key]: e.target.value }))} disabled={busyId !== null} /></td>
                  <td><button className="hospital-btn" disabled={busyId !== null} onClick={() => handleConfirm(c)}>{busyId === key ? "Đang xử lý..." : "Xác nhận chi phí"}</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {info && <p className="hospital-ok">{info}</p>}
      {error && <ErrorBox message={error} /> /* ADAPT */}
    </section>
  );
}
```
Thêm vào `hospital.css`:
```css
.hospital-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
.hospital-table th, .hospital-table td { border: 1px solid #c9ced6; padding: 8px; text-align: left; font-size: 16px; }
.hospital-table th { background: #eef1f5; }
```

**Bước 2 — Hoàn thiện `HospitalPage.jsx`:**
```jsx
import { useState } from "react";
import KeySetup from "./KeySetup.jsx";
import VerifyCard from "./VerifyCard.jsx";
import SubmitClaimForm from "./SubmitClaimForm.jsx";
import PendingConfirmList from "./PendingConfirmList.jsx";
import "./hospital.css";

export default function HospitalPage() {
  const [verified, setVerified] = useState(null);
  return (
    <div className="hospital-page">
      <h1>Bệnh viện</h1>
      <KeySetup />
      <VerifyCard onVerified={setVerified} />
      {verified ? (
        <SubmitClaimForm key={String(verified.tokenId)} verified={verified} />
      ) : (
        <p className="hospital-warn">Hãy kiểm tra thẻ bảo hiểm hợp lệ trước khi gửi yêu cầu bồi thường.</p>
      )}
      <PendingConfirmList />
    </div>
  );
}
```

**Bước 3 — Thử với giả lập (`VITE_USE_MOCK=true`):** ví HOSPITAL → thấy danh sách; dữ liệu mẫu file 00 mục 6.7 có claim #2 `PENDING` chưa xác nhận (5000000000000000 wei = 0.005 ETH) → hiện **đúng 1 dòng** (#2). Bấm "Xác nhận chi phí" → thành công, dòng biến mất sau khi tải lại.

**Bước 4 — Chuyển sang contract + dịch vụ thật (local).** Làm đúng thứ tự:
1. Terminal 1: `cd contracts-hardhat && npx hardhat node` (giữ chạy).
2. Terminal 2: `cd contracts-hardhat && npx hardhat run scripts/deploy.js --network localhost && npx hardhat run scripts/seed.js --network localhost`.
3. Sửa `frontend/.env` (không commit): `VITE_USE_MOCK=false`, `VITE_CHAIN_ID=31337` (cần thêm `VITE_PINATA_JWT` của B (Phương Anh) nếu dùng IPFS thật; chưa có thì nhờ B hoặc đặt mock IPFS theo hướng dẫn của B).
4. MetaMask: thêm mạng **Hardhat Local** (RPC `http://127.0.0.1:8545`, chainId `31337`, ETH) và **nhập 3 tài khoản mặc định của Hardhat** (#0 ADMIN, #1 HOSPITAL, #2 PATIENT). Khóa riêng của các tài khoản mặc định Hardhat là **công khai** (in ra khi chạy `npx hardhat node`), tuyệt đối **không bao giờ dùng chúng trên mạng thật**.
5. Chạy `npm run dev`, thử đúng thứ tự (file 00 mục 5):
   1. Ví **ADMIN (#0)** mở `/insurer` (trang của B) → đăng ký khóa mã hóa.
   2. Ví **PATIENT (#2)** mở `/patient` (trang của C) → đăng ký khóa → **mua Gói Cơ bản**.
   3. Ví **HOSPITAL (#1)** mở `/hospital` → tạo khóa và đăng ký → nhập địa chỉ PATIENT → **thẻ #1 hợp lệ, hạn mức 0.02 ETH** → gửi claim `0.012` với một ảnh hóa đơn → thành công.
   4. Ví PATIENT gửi thêm một claim tự gửi (qua trang C) → ví HOSPITAL tải lại danh sách → thấy claim → **Xác nhận chi phí** → thành công.
   5. Ví **OUTSIDER (#3)** mở `/hospital` → bị chặn (hoặc điều hướng đi).
6. Ghi vào báo cáo từng lỗi gặp (của mình thì sửa trong `pages/hospital/`; của B/C thì ghi mục 7). Chưa có trang B/C để làm bước 5.1–5.2: ghi rõ "chờ B/C" và vẫn thử các bước còn lại trên mock.

## 5. Lỗi hay gặp
- `claim.amount > value`: cả hai là `bigint`, so trực tiếp được; **không** dùng `Number`.
- Quên lọc `statusLabel === "PENDING"`: hiện cả claim đã duyệt.
- Danh sách dùng `claim.claimId` (bigint) làm `key` React: đổi sang `String(...)`.
- MetaMask báo "nonce too high" sau khi **khởi động lại Hardhat node**: vào MetaMask → Cài đặt → Nâng cao → **Xóa dữ liệu tab hoạt động** (Clear activity tab data) cho tài khoản.
- Đổi tài khoản MetaMask mà trang không đổi: dùng đúng `address` từ context của C (Lan Anh), không lưu địa chỉ vào biến riêng.

## 6. Lệnh kiểm tra và kết quả mong đợi
```bash
cd frontend
npm run build
grep -rnE "ethers\.(providers|utils|constants|BigNumber)|new ethers\.Contract|parseFloat|alert\(|console\.log|crypto\.subtle|fetch\(|services/mock|pages/(patient|insurer)" src/pages/hospital
```
→ build thành công; grep rỗng.

**Danh sách nghiệm thu bằng tay** (bước 3 với mock, rồi bước 4 với thật): ghi ✅/❌ từng dòng:
1. Mock: danh sách hiện đúng claim #2. 2. Mock: xác nhận được. 3. Mock: nhập số tiền lớn hơn yêu cầu → "không được lớn hơn". 4. Thật: gửi claim 0.012 từ bệnh viện thành công. 5. Thật: claim tự gửi của bệnh nhân xuất hiện và xác nhận được. 6. Thật: ví OUTSIDER bị chặn. 7. Không có giao dịch nào **thất bại trên chain** trong cả phiên thử (mọi lỗi dự kiến phải bị `dryRun` chặn trước).

## 7. Mục riêng trong báo cáo
Output build + grep; bảng nghiệm thu 7 dòng; danh sách lỗi của B/C (nếu có); **ảnh chụp** (người dùng, nền sáng): danh sách chờ xác nhận, kết quả "Thẻ hợp lệ", form gửi claim (minh chứng Tiêu chí 2 cho báo cáo mục 4.5 phần Bệnh viện).

## 8. Gửi mình kiểm
Báo cáo, `PendingConfirmList.jsx`, `HospitalPage.jsx`.

**Mình sẽ soi:** lọc đúng (PENDING và chưa xác nhận); `dryRun` trước khi gửi thật; chặn số tiền vượt yêu cầu ở cả giao diện lẫn contract; không có dữ liệu giả lập lọt vào đường chạy thật; sau chặng này ghi `PROGRESS_A.md`: "Màn hình Bệnh viện xong; sẵn sàng H5 (07/11)".

## 9. Prompt dán cho AI
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A12_bv_xac_nhan_va_ghep.md.
Chỉ làm ĐÚNG chặng A12 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A12.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
