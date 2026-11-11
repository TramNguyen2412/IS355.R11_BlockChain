import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../app/WalletProvider.jsx";
import * as contractService from "../../app/contractService.js";
import ErrorBox from "../../components/shared/ErrorBox.jsx";

function shortAddr(a) {
  return a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "";
}

export default function PendingConfirmList() {
  const { address } = useWallet();
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
      await contractService.confirmClaim(claim.claimId, value, { dryRun: true, from: address });
      const tx = await contractService.confirmClaim(claim.claimId, value, { from: address });
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
      <p className="hospital-warn">Danh sách này chỉ gồm yêu cầu do bệnh nhân tự gửi. Yêu cầu do bệnh viện gửi đã được xác nhận sẵn và chờ công ty bảo hiểm duyệt.</p>
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
      {error && <ErrorBox message={error} />}
    </section>
  );
}
