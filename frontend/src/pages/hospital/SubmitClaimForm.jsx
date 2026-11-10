import { useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../app/WalletProvider.jsx";
import * as contractService from "../../app/contractService.js";
import { ipfsService, cryptoService } from "../../services/index.js";
import ErrorBox from "../../components/shared/ErrorBox.jsx";
import TxToast from "../../components/shared/TxToast.jsx";

const emptyLab = () => ({ test: "", value: "", unit: "" });

// Props: verified = { patient, tokenId, remainingLimit, expiryDate } (từ VerifyCard, chỉ khi thẻ hợp lệ)
export default function SubmitClaimForm({ verified }) {
  const { address } = useWallet();
  const [amountEth, setAmountEth] = useState("");
  const [hospitalName, setHospitalName] = useState("Bệnh viện Mẫu");
  const [patientName, setPatientName] = useState("");
  const [healthId, setHealthId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [labs, setLabs] = useState([emptyLab()]);
  const [billFile, setBillFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);
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
      setAmountEth(""); setPatientName(""); setHealthId(""); setDiagnosis(""); setTreatment(""); setDoctor("");
      setLabs([emptyLab()]); setBillFile(null); setFileKey((k) => k + 1);
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
          <label>Hóa đơn (ảnh hoặc PDF): <input key={fileKey} type="file" accept="image/*,application/pdf" onChange={(e) => setBillFile(e.target.files[0] || null)} disabled={busy} /></label>
        </div>
        <div className="hospital-row">
          <button type="submit" className="hospital-btn" disabled={busy}>Gửi yêu cầu bồi thường</button>
          {status && <span className="hospital-warn">{status}</span>}
        </div>
      </form>
      {done && (
        <div className="hospital-ok">
          <TxToast status="success" hash={done.hash} message="Đã gửi yêu cầu bồi thường thành công." />
          <div>Hóa đơn (IPFS): {done.billCID}</div>
          <div>Hồ sơ mã hóa (IPFS): {done.recordCID}</div>
        </div>
      )}
      {error && <ErrorBox message={error} />}
    </section>
  );
}
