import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../app/WalletProvider.jsx";
import * as contractService from "../../app/contractService.js";
import ErrorBox from "../../components/shared/ErrorBox.jsx";

// Đổi giây -> chuỗi ngày. ADAPT: nếu app/format.js đã có hàm phù hợp thì dùng hàm đó thay cho hàm này.
function dateFromSeconds(sec) {
  return new Date(Number(sec) * 1000).toLocaleDateString("vi-VN");
}

export default function VerifyCard({ onVerified }) {
  const { address } = useWallet();
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
    if (onVerified) onVerified(null);
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
      {error && <ErrorBox message={error} />}
    </section>
  );
}
