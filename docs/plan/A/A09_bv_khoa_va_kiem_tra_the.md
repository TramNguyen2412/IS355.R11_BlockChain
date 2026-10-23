# CHẶNG A09 — Màn hình Bệnh viện, phần 1: đăng ký khóa và kiểm tra thẻ NFT

> **Mã master:** A-11 · **Hạn:** Thứ 4 04/11 · **Rubric:** 2 (≥3 thao tác on-chain), 4 (thao tác **Verification** của NFT), 1 (phân quyền ở giao diện) · **Nhánh:** `tram` · **Cần trước:** A08 (H3) và C-04 (mock service), B-02 (mock IPFS/crypto) đã có trên `main`.

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Làm **hai khối đầu của màn hình Bệnh viện** (`/hospital`): (1) **Đăng ký khóa mã hóa** (tạo cặp khóa RSA trong trình duyệt, đăng ký khóa công khai lên blockchain, xuất/nhập khóa để không mất); (2) **Kiểm tra thẻ bảo hiểm**: bệnh viện nhập địa chỉ ví bệnh nhân, hệ thống đọc blockchain xem bệnh nhân có **thẻ NFT còn hiệu lực** không (nghiệp vụ 3, bước đầu). Ví không có quyền bệnh viện thì bị **chặn ngay trên giao diện**. Chạy bằng **dữ liệu giả lập** (`VITE_USE_MOCK=true`), chưa cần blockchain.

## 1. Nạp ngữ cảnh
File 00 mục 1, **2.2, 2.4 (hành vi cấm), 3.2, 3.3, 4.4, 4.5, 4.6, 4.7, 6.1** · `RULES_A.md` (mục 3 Giao diện) · `PROGRESS_A.md`.
Và **đọc code thật** của C (Lan Anh) và B (chỉ đọc, không sửa): `frontend/src/app/WalletProvider.jsx`, `app/contractService.js`, `app/format.js`, `app/App.jsx`, `components/shared/*.jsx`, `services/index.js`.

## 2. File được phép tạo/sửa
- `frontend/src/pages/hospital/KeySetup.jsx` (mới)
- `frontend/src/pages/hospital/VerifyCard.jsx` (mới)
- `frontend/src/pages/hospital/HospitalPage.jsx` (sửa bản chỗ trống của M0-A)
- `frontend/src/pages/hospital/hospital.css` (mới)
- `docs/plan/A/reports/REPORT_A09.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** sửa bất cứ file nào ngoài `pages/hospital/` (kể cả "chỉ thêm một prop" vào component của C); gọi `ethers.Contract` trực tiếp; import `services/mock/*`; import từ `pages/patient` hay `pages/insurer`. Thiếu component hoặc hàm mà chặng cần: **dừng và báo** (luật A-R9).

## 3. Kiểm tra trước khi làm
```bash
git pull origin main
ls frontend/src/app frontend/src/components/shared frontend/src/services
cd frontend && npm install && npm run build   # phải build được trước khi bắt đầu
```
Các file của C (`WalletProvider.jsx`, `contractService.js`, `format.js`) và B (`services/index.js`) phải **tồn tại**. Nếu chưa: dừng, báo người dùng nhắn C/B.

## 4. Các bước

**Bước 1 — Khảo sát (chưa viết code).** Mở các file C/B ở mục 1 và **điền bảng sau vào báo cáo mục 5** (mục "Cách dùng thành phần của C (Lan Anh) và B"; ghi đúng như đọc thấy, không đoán):

| Cần biết | Ghi lại |
|---|---|
| Hook/hàm lấy `address` của ví đang kết nối: tên, đường dẫn import | |
| `contractService`: export dạng nào (từng hàm `export`, hay `export default {...}`)? Có đủ `getRoles`, `verifyInsurance`, `getEncryptionKey`, `registerEncryptionKey`? | |
| `services/index.js` xuất `cryptoService` ra sao? Có đủ `generateRsaKeyPair`, `saveKeyPair`, `loadKeyPair`, `exportKeyPair`, `importKeyPair`? Hàm nào trả `Promise`? | |
| `format.js`: các hàm có sẵn và tham số của `formatEth`/`formatDate`/`shortAddress` (đơn vị giây hay mili-giây?) | |
| `ErrorBox`, `Loading`, `Address`, `TxToast`: kiểu export (default/named) và **tên prop** | |
| `App.jsx` đã bọc `Layout` cho mỗi trang chưa? | |

**Bước 2 — Viết `hospital.css`:**
```css
.hospital-page { max-width: 960px; margin: 0 auto; padding: 16px; }
.hospital-card { border: 1px solid #c9ced6; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #ffffff; }
.hospital-card h2 { margin-top: 0; font-size: 20px; }
.hospital-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0; }
.hospital-input { flex: 1; min-width: 260px; padding: 10px; font-size: 16px; border: 1px solid #8a93a0; border-radius: 6px; }
.hospital-btn { padding: 10px 16px; font-size: 16px; border: 0; border-radius: 6px; background: #1f5fbf; color: #ffffff; cursor: pointer; }
.hospital-btn:disabled { background: #9aa3b0; cursor: not-allowed; }
.hospital-ok { color: #11672b; font-weight: 600; }
.hospital-bad { color: #a11a1a; font-weight: 600; }
.hospital-warn { color: #7a4b00; }
```

**Bước 3 — Viết `KeySetup.jsx`.** Dùng mẫu sau, **chỉ thay các dòng có `ADAPT`** theo kết quả khảo sát (không thay logic):
```jsx
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "../../app/WalletProvider.jsx"; // ADAPT: tên hook/đường dẫn thật
import * as contractService from "../../app/contractService.js"; // ADAPT nếu export default
import { cryptoService } from "../../services/index.js"; // ADAPT nếu export khác
import ErrorBox from "../../components/shared/ErrorBox.jsx"; // ADAPT: kiểu export và prop

export default function KeySetup() {
  const { address } = useWallet(); // ADAPT
  const [localPair, setLocalPair] = useState(null);   // khóa lưu trong trình duyệt
  const [onChainKey, setOnChainKey] = useState("");   // khóa công khai đã đăng ký trên blockchain
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [importText, setImportText] = useState("");

  const refresh = useCallback(async () => {
    if (!address) return;
    try {
      setLocalPair((await cryptoService.loadKeyPair(address)) || null);
      setOnChainKey(await contractService.getEncryptionKey(address));
    } catch (e) {
      setError(e.message);
    }
  }, [address]);

  useEffect(() => {
    setError("");
    setInfo("");
    refresh();
  }, [refresh]);

  async function handleCreate() {
    setBusy(true); setError(""); setInfo("");
    try {
      const pair = await cryptoService.generateRsaKeyPair();
      await cryptoService.saveKeyPair(address, pair);
      setInfo("Đã tạo khóa mã hóa. Hãy đăng ký khóa lên blockchain và xuất file khóa để sao lưu.");
      await refresh();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  async function handleRegister() {
    setBusy(true); setError(""); setInfo("");
    try {
      await contractService.registerEncryptionKey(localPair.publicKeyPem, { dryRun: true });
      await contractService.registerEncryptionKey(localPair.publicKeyPem);
      setInfo("Đã đăng ký khóa lên blockchain.");
      await refresh();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  async function handleExport() {
    try {
      const text = await cryptoService.exportKeyPair(address);
      const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "khoa-ma-hoa-benh-vien.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { setError(e.message); }
  }

  async function handleImport() {
    setBusy(true); setError(""); setInfo("");
    try {
      await cryptoService.importKeyPair(address, importText);
      setImportText("");
      setInfo("Đã nhập khóa.");
      await refresh();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  const registeredOk = localPair && onChainKey && onChainKey === localPair.publicKeyPem;

  return (
    <section className="hospital-card">
      <h2>1. Khóa mã hóa của bệnh viện</h2>
      {!localPair && (
        <div className="hospital-row">
          <span className="hospital-warn">Chưa có khóa trong trình duyệt này.</span>
          <button className="hospital-btn" disabled={busy || !address} onClick={handleCreate}>Tạo khóa mã hóa</button>
        </div>
      )}
      {localPair && !registeredOk && (
        <div className="hospital-row">
          <span className="hospital-warn">Khóa chưa được đăng ký (hoặc khác khóa trên blockchain).</span>
          <button className="hospital-btn" disabled={busy} onClick={handleRegister}>Đăng ký khóa lên blockchain</button>
        </div>
      )}
      {registeredOk && <p className="hospital-ok">✅ Khóa đã được đăng ký trên blockchain.</p>}
      {localPair && (
        <div className="hospital-row">
          <button className="hospital-btn" onClick={handleExport}>Xuất khóa để sao lưu</button>
          <span>Giữ file này an toàn. Mất khóa thì không giải mã được hồ sơ.</span>
        </div>
      )}
      <details>
        <summary>Nhập khóa từ file sao lưu</summary>
        <textarea className="hospital-input" rows={4} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Dán nội dung file khóa (JSON) vào đây" />
        <button className="hospital-btn" disabled={busy || !importText.trim()} onClick={handleImport}>Nhập khóa</button>
      </details>
      {info && <p className="hospital-ok">{info}</p>}
      {error && <ErrorBox message={error} /> /* ADAPT: tên prop thật của ErrorBox */}
    </section>
  );
}
```
Quy tắc: **không** hiện khóa riêng lên màn hình, **không** `console.log` khóa.

**Bước 4 — Viết `VerifyCard.jsx`:**
```jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../app/WalletProvider.jsx"; // ADAPT
import * as contractService from "../../app/contractService.js"; // ADAPT
import ErrorBox from "../../components/shared/ErrorBox.jsx"; // ADAPT

// Đổi giây -> chuỗi ngày. ADAPT: nếu app/format.js đã có hàm phù hợp thì dùng hàm đó thay cho hàm này.
function dateFromSeconds(sec) {
  return new Date(Number(sec) * 1000).toLocaleDateString("vi-VN");
}

export default function VerifyCard({ onVerified }) {
  const { address } = useWallet(); // ADAPT
  const [isHospital, setIsHospital] = useState(null); // null = đang kiểm tra
  const [patient, setPatient] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setIsHospital(null);
    setResult(null);
    if (onVerified) onVerified(null);
    if (!address) return undefined;
    contractService.getRoles(address)
      .then((r) => { if (alive) setIsHospital(r.isHospital); })
      .catch((e) => { if (alive) { setError(e.message); setIsHospital(false); } });
    return () => { alive = false; };
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleVerify() {
    setError(""); setResult(null);
    if (!ethers.isAddress(patient.trim())) { setError("Địa chỉ ví không hợp lệ."); return; }
    setBusy(true);
    try {
      const addr = patient.trim();
      const r = await contractService.verifyInsurance(addr);
      setResult(r);
      if (r.isValid && onVerified) {
        onVerified({ patient: addr, tokenId: r.tokenId, remainingLimit: r.remainingLimit, expiryDate: r.expiryDate });
      } else if (onVerified) {
        onVerified(null);
      }
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  if (isHospital === false) {
    return (
      <section className="hospital-card">
        <h2>2. Kiểm tra thẻ bảo hiểm của bệnh nhân</h2>
        <p className="hospital-bad">⛔ Ví này chưa được cấp quyền Bệnh viện. Hãy liên hệ công ty bảo hiểm để được cấp quyền.</p>
      </section>
    );
  }

  const hadCard = result && BigInt(result.tokenId) !== 0n;
  return (
    <section className="hospital-card">
      <h2>2. Kiểm tra thẻ bảo hiểm của bệnh nhân</h2>
      <div className="hospital-row">
        <input className="hospital-input" value={patient} onChange={(e) => setPatient(e.target.value)} placeholder="Địa chỉ ví bệnh nhân (0x...)" disabled={busy || !isHospital} />
        <button className="hospital-btn" disabled={busy || !isHospital || !patient.trim()} onClick={handleVerify}>Kiểm tra thẻ bảo hiểm</button>
      </div>
      {result && result.isValid && (
        <p className="hospital-ok">
          ✅ Thẻ #{String(result.tokenId)} hợp lệ. Hạn mức còn lại: {ethers.formatEther(result.remainingLimit)} ETH. Hết hạn: {dateFromSeconds(result.expiryDate)}.
        </p>
      )}
      {result && !result.isValid && hadCard && (
        <p className="hospital-bad">❌ Thẻ #{String(result.tokenId)} đã hết hạn ngày {dateFromSeconds(result.expiryDate)}.</p>
      )}
      {result && !result.isValid && !hadCard && (
        <p className="hospital-bad">❌ Không có thẻ bảo hiểm còn hiệu lực.</p>
      )}
      {error && <ErrorBox message={error} /> /* ADAPT */}
    </section>
  );
}
```
Chỉ khi thẻ **hợp lệ** thì `onVerified` mới truyền dữ liệu (chặng A11 dùng để mở form gửi claim).

**Bước 5 — Sửa `HospitalPage.jsx`:**
```jsx
import { useState } from "react";
import KeySetup from "./KeySetup.jsx";
import VerifyCard from "./VerifyCard.jsx";
import "./hospital.css";

export default function HospitalPage() {
  const [verified, setVerified] = useState(null); // { patient, tokenId, remainingLimit, expiryDate } | null
  return (
    <div className="hospital-page">
      <h1>Bệnh viện</h1>
      <KeySetup />
      <VerifyCard onVerified={setVerified} />
      {verified && <p className="hospital-ok">Đã chọn bệnh nhân có thẻ #{String(verified.tokenId)}. (Form gửi yêu cầu bồi thường sẽ thêm ở chặng A11.)</p>}
    </div>
  );
}
```
(ADAPT: nếu `App.jsx` chưa bọc `Layout` cho trang, bọc nội dung bằng `<Layout>`; nếu đã bọc rồi thì **không** bọc lại.)

## 5. Lỗi hay gặp
- Dùng `ethers.utils.isAddress`, `ethers.providers.Web3Provider`, `BigNumber`: **cấm** (ethers v5). Dùng `ethers.isAddress`, `ethers.formatEther`.
- So `tokenId !== 0` khi `tokenId` là `bigint`: sai; so với `0n` (dùng `BigInt(x) !== 0n`).
- Gọi `contractService` trước khi có `address`: kiểm tra `address` trước khi gọi.
- Dùng `crypto.subtle` hay `fetch` trong trang: **cấm** (chỉ qua `services`).
- Đổi `Layout.jsx` hay thêm prop cho `ErrorBox`: **cấm**.

## 6. Lệnh kiểm tra (người dùng tự chạy) và kết quả mong đợi
```bash
cd frontend
npm run build
```
→ build thành công, **không lỗi**.

```bash
grep -rnE "ethers\.(providers|utils|constants|BigNumber)|new ethers\.Contract|parseFloat|alert\(|console\.log|crypto\.subtle|fetch\(|services/mock|pages/(patient|insurer)" src/pages/hospital
```
→ **không in ra dòng nào**.

**Chạy bằng tay (dữ liệu giả lập):** đặt `frontend/.env`: `VITE_USE_MOCK=true`, rồi `npm run dev`, mở `http://localhost:5173/hospital` (cổng có thể khác):
1. Chọn ví mẫu **HOSPITAL** → trang hiện khối "Khóa mã hóa" và "Kiểm tra thẻ".
2. Bấm "Tạo khóa mã hóa" → hiện nút "Đăng ký khóa..." → bấm → hiện "✅ Khóa đã được đăng ký".
3. Dán địa chỉ PATIENT `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` → bấm "Kiểm tra thẻ bảo hiểm" → "✅ Thẻ #1 hợp lệ. Hạn mức còn lại: 0.008 ETH. Hết hạn: 31/1/2030" (đúng dữ liệu mẫu file 00 mục 6.7).
4. Dán địa chỉ OUTSIDER `0x90F79bf6EB2c4f870365E785982E1f101E93b906` → "❌ Không có thẻ bảo hiểm còn hiệu lực."
5. Chọn ví **OUTSIDER** → trang hiện "⛔ Ví này chưa được cấp quyền Bệnh viện" (hoặc bị điều hướng khỏi `/hospital` theo `roleDetection`; cả hai đều chấp nhận được).
6. Nhập chuỗi bậy `abc` → "Địa chỉ ví không hợp lệ."

## 7. Mục riêng trong báo cáo
Bảng khảo sát (mục 4 bước 1) điền đủ; output `npm run build`; output grep; 6 bước thử tay: ✅/❌ mỗi bước; **ảnh chụp** (chụp thật bởi người dùng, nền sáng): ảnh bước 3 và bước 5 (làm minh chứng báo cáo Tiêu chí 4 "Verification" và phân quyền).

## 8. Gửi mình kiểm
Báo cáo, `VerifyCard.jsx`, `KeySetup.jsx`.

**Mình sẽ soi:** không có import cấm; mọi lệnh ghi có `dryRun` trước; `isHospital` chặn giao diện; tiền hiện bằng `formatEther`; không lộ khóa riêng; bảng khảo sát khớp code C.

## 9. Prompt dán cho AI
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A09_bv_khoa_va_kiem_tra_the.md.
Chỉ làm ĐÚNG chặng A09 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A09.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
