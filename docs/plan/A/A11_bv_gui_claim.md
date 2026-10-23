# CHẶNG A11 — Màn hình Bệnh viện, phần 2: form gửi yêu cầu bồi thường

> **Mã master:** A-12 · **Hạn:** Thứ 6 06/11 · **Rubric:** 2, **3 (IPFS: upload hóa đơn + JSON bệnh án mã hóa)**, 1 · **Nhánh:** `tram` · **Cần trước:** A09 đã merge.

> **Git:** làm trên nhánh cố định **`tram`**. Trước khi bắt đầu: `git checkout tram && git pull origin main`, rồi kiểm tra `git branch --show-current` phải in ra **`tram`** (sai thì dừng, không làm tiếp). Khi ĐẠT: commit → `git pull origin main` (không conflict) → `git push origin tram` → Pull Request từ `tram` vào `main`. Sau khi PR merge: `git checkout tram && git pull origin main`.

## 0. Chặng này làm gì (lời thường)
Làm **form gửi claim** (nghiệp vụ 3, phía bệnh viện). Bác sĩ nhập số tiền, chẩn đoán, điều trị, kết quả xét nghiệm, chọn **file hóa đơn**. Hệ thống: (1) chạy thử giao dịch trước (`dryRun`) để báo lỗi sớm; (2) tải **hóa đơn lên IPFS** (lấy mã CID); (3) **mã hóa hồ sơ bệnh án** bằng AES, rồi "bọc khóa" bằng RSA cho **3 người được phép đọc** (bệnh nhân, bệnh viện, công ty bảo hiểm); (4) tải **hồ sơ đã mã hóa lên IPFS**; (5) gửi `submitClaim` lên blockchain kèm hai mã CID. Dữ liệu y tế nhạy cảm **không bao giờ nằm dạng chữ rõ** trên IPFS hay blockchain. Chỉ hiện form khi bệnh nhân có thẻ **hợp lệ** (kết quả từ chặng A09).

## 1. Nạp ngữ cảnh
File 00 mục 1, 2.4, **4.4 (submitClaim, getEncryptionKey, getInsurerAddress), 4.5, 4.6 (EncryptedRecord), 6.6 (bản ghi mẫu)** · `RULES_A.md` (mục 3) · `PROGRESS_A.md` · báo cáo `REPORT_A09.md` (bảng "Cách dùng thành phần của C (Lan Anh) và B": **dùng lại đúng những tên đó**).

## 2. File được phép tạo/sửa
- `frontend/src/pages/hospital/SubmitClaimForm.jsx` (mới)
- `frontend/src/pages/hospital/HospitalPage.jsx` (sửa)
- `frontend/src/pages/hospital/hospital.css` (thêm class nếu cần)
- `docs/plan/A/reports/REPORT_A11.md`, `docs/progress/PROGRESS_A.md`

**CẤM:** gọi Pinata/`fetch`/`crypto.subtle` trực tiếp; thêm trường vào `meta` hay `secret` ngoài mục 6.6; tự đổi tên hàm của B/C.

## 3. Kiểm tra trước khi làm
`git pull origin main`; `cd frontend && npm run build` thành công; có `pages/hospital/VerifyCard.jsx` từ A09.

## 4. Các bước

**Bước 1 — Viết `SubmitClaimForm.jsx`.** Dùng mẫu, **chỉ thay các dòng `ADAPT`** theo bảng khảo sát ở `REPORT_A09.md`:
```jsx
import { useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../app/WalletProvider.jsx"; // ADAPT
import * as contractService from "../../app/contractService.js"; // ADAPT
import { ipfsService, cryptoService } from "../../services/index.js"; // ADAPT
import ErrorBox from "../../components/shared/ErrorBox.jsx"; // ADAPT

const emptyLab = () => ({ test: "", value: "", unit: "" });

// Props: verified = { patient, tokenId, remainingLimit, expiryDate } (từ VerifyCard, chỉ khi thẻ hợp lệ)
export default function SubmitClaimForm({ verified }) {
  const { address } = useWallet(); // ADAPT
  const [amountEth, setAmountEth] = useState("");
  const [hospitalName, setHospitalName] = useState("Bệnh viện Mẫu");
  const [patientName, setPatientName] = useState("");
  const [healthId, setHealthId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [labs, setLabs] = useState([emptyLab()]);
  const [billFile, setBillFile] = useState(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  function setLab(i, field, value) {
    setLabs((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setDone(null);
    // ---- 1. Kiểm tra đầu vào ----
    let amount;
    try { amount = ethers.parseEther(amountEth.trim()); } catch { setError("Số tiền không hợp lệ."); return; }
    if (amount <= 0n) { setError("Số tiền phải lớn hơn 0."); return; }
    if (amount > BigInt(verified.remainingLimit)) {
      setError(`Số tiền vượt hạn mức còn lại (${ethers.formatEther(verified.remainingLimit)} ETH).`);
      return;
    }
    if (!billFile) { setError("Hãy chọn file hóa đơn."); return; }
    if (!diagnosis.trim()) { setError("Hãy nhập chẩn đoán."); return; }

    setBusy(true);
    try {
      // ---- 2. Chạy thử giao dịch (không tốn phí, không tạo giao dịch lỗi) ----
      setStatus("Đang kiểm tra điều kiện trên blockchain...");
      await contractService.submitClaim(
        { tokenId: verified.tokenId, amount, billCID: "dry-run", recordCID: "dry-run" },
        { dryRun: true }
      );

      // ---- 3. Lấy khóa công khai của 3 người nhận (bệnh nhân, bệnh viện, công ty bảo hiểm) ----
      setStatus("Đang lấy khóa mã hóa của các bên...");
      const insurer = await contractService.getInsurerAddress();
      const people = [
        { label: "Bệnh nhân", addr: verified.patient },
        { label: "Bệnh viện", addr: address },
        { label: "Công ty bảo hiểm", addr: insurer },
      ];
      const recipients = [];
      const seen = new Set();
      for (const p of people) {
        const key = p.addr.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const pem = await contractService.getEncryptionKey(p.addr);
        if (!pem) throw new Error(`${p.label} chưa đăng ký khóa mã hóa. Hãy nhờ họ đăng ký trước.`);
        recipients.push({ address: key, publicKeyPem: pem });
      }

      // ---- 4. Tải hóa đơn lên IPFS ----
      setStatus("Đang tải hóa đơn lên IPFS...");
      const bill = await ipfsService.uploadFile(billFile);
      const billCID = bill.cid;

      // ---- 5. Mã hóa hồ sơ rồi tải lên IPFS (định dạng đúng file 00 mục 6.6) ----
      setStatus("Đang mã hóa hồ sơ bệnh án...");
      const record = {
        meta: { visitDate: new Date().toISOString().slice(0, 10), hospitalName: hospitalName.trim(), billCID },
        secret: {
          patientName: patientName.trim(),
          healthId: healthId.trim(),
          diagnosis: diagnosis.trim(),
          treatment: treatment.trim(),
          labResults: labs.filter((l) => l.test.trim()).map((l) => ({ test: l.test.trim(), value: l.value.trim(), unit: l.unit.trim() })),
          doctor: doctor.trim(),
          totalCost: amount.toString(),
        },
      };
      const encrypted = await cryptoService.buildEncryptedRecord(record, recipients);
      setStatus("Đang tải hồ sơ đã mã hóa lên IPFS...");
      const rec = await ipfsService.uploadJSON(encrypted, `record-${Date.now()}.json`);
      const recordCID = rec.cid;

      // ---- 6. Gửi claim lên blockchain ----
      setStatus("Đang gửi yêu cầu bồi thường lên blockchain (hãy xác nhận trong MetaMask)...");
      const tx = await contractService.submitClaim({ tokenId: verified.tokenId, amount, billCID, recordCID });
      setDone({ hash: tx.hash, billCID, recordCID });
      setStatus("");
    } catch (err) {
      setError(err.message);
      setStatus("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="hospital-card">
      <h2>3. Gửi yêu cầu bồi thường cho thẻ #{String(verified.tokenId)}</h2>
      <p>Hạn mức còn lại: <b>{ethers.formatEther(verified.remainingLimit)} ETH</b></p>
      <form onSubmit={handleSubmit}>
        <div className="hospital-row">
          <input className="hospital-input" placeholder="Số tiền yêu cầu (ETH), ví dụ 0.005" value={amountEth} onChange={(e) => setAmountEth(e.target.value)} disabled={busy} />
          <input className="hospital-input" placeholder="Tên bệnh viện" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} disabled={busy} />
        </div>
        <div className="hospital-row">
          <input className="hospital-input" placeholder="Họ tên bệnh nhân" value={patientName} onChange={(e) => setPatientName(e.target.value)} disabled={busy} />
          <input className="hospital-input" placeholder="Mã số bảo hiểm (nếu có)" value={healthId} onChange={(e) => setHealthId(e.target.value)} disabled={busy} />
        </div>
        <div className="hospital-row">
          <input className="hospital-input" placeholder="Chẩn đoán" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} disabled={busy} />
          <input className="hospital-input" placeholder="Phương pháp điều trị" value={treatment} onChange={(e) => setTreatment(e.target.value)} disabled={busy} />
          <input className="hospital-input" placeholder="Bác sĩ" value={doctor} onChange={(e) => setDoctor(e.target.value)} disabled={busy} />
        </div>
        <h3>Kết quả xét nghiệm</h3>
        {labs.map((l, i) => (
          <div className="hospital-row" key={i}>
            <input className="hospital-input" placeholder="Tên xét nghiệm" value={l.test} onChange={(e) => setLab(i, "test", e.target.value)} disabled={busy} />
            <input className="hospital-input" placeholder="Giá trị" value={l.value} onChange={(e) => setLab(i, "value", e.target.value)} disabled={busy} />
            <input className="hospital-input" placeholder="Đơn vị" value={l.unit} onChange={(e) => setLab(i, "unit", e.target.value)} disabled={busy} />
          </div>
        ))}
        <button type="button" className="hospital-btn" disabled={busy} onClick={() => setLabs((p) => [...p, emptyLab()])}>+ Thêm dòng xét nghiệm</button>
        <div className="hospital-row">
          <label>Hóa đơn (ảnh hoặc PDF): <input type="file" accept="image/*,application/pdf" onChange={(e) => setBillFile(e.target.files[0] || null)} disabled={busy} /></label>
        </div>
        <div className="hospital-row">
          <button type="submit" className="hospital-btn" disabled={busy}>Gửi yêu cầu bồi thường</button>
          {status && <span className="hospital-warn">{status}</span>}
        </div>
      </form>
      {done && (
        <div className="hospital-ok">
          ✅ Đã gửi yêu cầu bồi thường. Mã giao dịch: {done.hash}
          <div>Hóa đơn (IPFS): {done.billCID}</div>
          <div>Hồ sơ mã hóa (IPFS): {done.recordCID}</div>
        </div>
      )}
      {error && <ErrorBox message={error} /> /* ADAPT: tên prop thật */}
    </section>
  );
}
```
Nếu `TxToast` của C (Lan Anh) dùng để hiện giao dịch (xem bảng khảo sát), hãy hiện `done.hash` bằng `TxToast` **thay cho** đoạn `{done && ...}` hiển thị hash thô; giữ phần hiển thị hai CID.

**Bước 2 — Sửa `HospitalPage.jsx`** (thay thế phần hiển thị tạm của A09):
```jsx
import { useState } from "react";
import KeySetup from "./KeySetup.jsx";
import VerifyCard from "./VerifyCard.jsx";
import SubmitClaimForm from "./SubmitClaimForm.jsx";
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
    </div>
  );
}
```

**Ghi chú thiết kế (đáng đưa vào báo cáo):**
- Chạy thử (`dryRun`) **trước** khi tải IPFS để không tốn công tải rồi mới phát hiện giao dịch sẽ bị từ chối; cũng nhờ vậy Rubric "tối đa 1 giao dịch lỗi khi demo" được giữ.
- Mã hóa kiểu **phong bì**: AES-256-GCM mã hóa nội dung một lần, RSA-OAEP bọc khóa AES cho từng người. Thêm người xem = thêm một "bọc khóa", không mã hóa lại nội dung.
- `meta` (ngày khám, tên bệnh viện, `billCID`) để **chữ rõ** theo file 00; mọi thông tin y tế nằm trong `secret` (được mã hóa).

## 5. Lỗi hay gặp
- Quên `BigInt(...)` khi so sánh `amount > verified.remainingLimit`: nếu `remainingLimit` là `bigint` thì so trực tiếp được; dùng `BigInt()` cho chắc.
- `new Date(...).toISOString().slice(0,10)` cho ngày khám (kiểu `yyyy-mm-dd` như file 00).
- Quên đổi `recipients[].address` sang **chữ thường** (luật R12; khóa `keyWraps` luôn chữ thường).
- Tải IPFS **trước** `dryRun`: sai thứ tự.
- Thêm trường mới vào `meta`/`secret`: cấm.

## 6. Lệnh kiểm tra và kết quả mong đợi
```bash
cd frontend
npm run build
grep -rnE "ethers\.(providers|utils|constants|BigNumber)|new ethers\.Contract|parseFloat|alert\(|console\.log|crypto\.subtle|fetch\(|services/mock|pages/(patient|insurer)" src/pages/hospital
```
→ build thành công; grep **rỗng**.

**Chạy tay với dữ liệu giả lập** (`VITE_USE_MOCK=true`, `npm run dev`, ví **HOSPITAL**):
1. Kiểm tra thẻ PATIENT → hiện **form** gửi claim.
2. Điền số tiền `0.005`, chẩn đoán, chọn một file ảnh bất kỳ → **Gửi** → thấy các dòng trạng thái lần lượt, cuối cùng "✅ Đã gửi yêu cầu bồi thường" kèm hash và 2 CID (giá trị `mock-...`).
3. Số tiền `0.01` (lớn hơn hạn mức còn lại 0.008 của dữ liệu mẫu) → báo "Số tiền vượt hạn mức còn lại (0.008 ETH)." và **không tải gì lên IPFS**.
4. Không chọn hóa đơn → báo "Hãy chọn file hóa đơn."
5. Số tiền `abc` → "Số tiền không hợp lệ."

## 7. Mục riêng trong báo cáo
Output build, output grep, 5 bước thử tay ✅/❌. **Ảnh chụp** (người dùng, nền sáng): form đã điền và màn hình "Đã gửi" (làm minh chứng Tiêu chí 2).

## 8. Gửi mình kiểm
Báo cáo, `SubmitClaimForm.jsx`.

**Mình sẽ soi:** thứ tự: kiểm tra → `dryRun` → khóa → upload hóa đơn → mã hóa → upload JSON → gửi thật; đúng 3 người nhận; địa chỉ chữ thường; `meta`/`secret` đúng mục 6.6; tiền dạng `bigint`; không lộ dữ liệu thật ra `console`.

## 9. Prompt dán cho AI
```text
Bạn là trợ lý lập trình cho thành viên A (Trâm) của nhóm đồ án IS355.
Hãy đọc theo thứ tự: (1) docs/00_AI_RULES_AND_CONTRACTS.md, (2) docs/plan/A/RULES_A.md, (3) docs/progress/PROGRESS_A.md, (4) docs/plan/A/A11_bv_gui_claim.md.
Chỉ làm ĐÚNG chặng A11 trong file (4). Chép nguyên văn code trong đó, không làm thêm, không cài thêm gói, không đọc file .env, không bắt đầu chặng khác.
Trước khi code, nhắc lại: vai trò, chặng, danh sách file sẽ tạo/sửa, tên hàm đóng băng liên quan.
Làm xong thì chạy các lệnh ở mục "Lệnh kiểm tra" và dán output THẬT vào docs/plan/A/reports/REPORT_A11.md theo mẫu trong RULES_A.md mục 4, cập nhật PROGRESS_A.md, rồi DỪNG.
```
