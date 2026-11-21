import { useEffect, useState } from "react";
import { useWallet } from "../../app/WalletProvider.jsx";
import * as contractService from "../../app/contractService.js";
import { cryptoService, ipfsService } from "../../services/index.js";
import { toVietnameseError } from "../../app/errors.js";
import { formatEth, shortAddress } from "../../app/format.js";
import TxToast from "../../components/shared/TxToast.jsx";

const STATUS_VI = { PENDING: "Chờ xử lý", APPROVED: "Đã duyệt", REJECTED: "Đã từ chối" };
const STATUS_CLASS = {
  PENDING: "insurer-badge insurer-badge-pending",
  APPROVED: "insurer-badge insurer-badge-approved",
  REJECTED: "insurer-badge insurer-badge-rejected",
};

export default function ClaimsTable() {
  const { address } = useWallet();
  const [claims, setClaims] = useState([]);
  const [busy, setBusy] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [toast, setToast] = useState({ status: null, hash: null, message: "" });

  async function loadClaims() {
    setClaims(await contractService.getAllClaims());
  }

  useEffect(() => {
    loadClaims().catch((e) =>
      setToast({ status: "error", hash: null, message: toVietnameseError(e) })
    );
  }, []);

  async function handleView(claim) {
    setBusy(true);
    setToast({ status: "processing", hash: null, message: "Đang tải và giải mã hồ sơ từ IPFS..." });
    try {
      const pair = await cryptoService.loadKeyPair(address);
      if (!pair) {
        throw new Error("Chưa có khóa riêng của công ty bảo hiểm. Hãy tạo hoặc nhập khóa ở khối khóa mã hóa.");
      }
      const encrypted = await ipfsService.fetchJSON(claim.recordCID);
      let record;
      try {
        record = await cryptoService.openEncryptedRecord(encrypted, address, pair.privateKeyPem);
      } catch {
        throw new Error("Không giải mã được hồ sơ. Ví hoặc khóa của bạn không nằm trong danh sách được phép.");
      }
      const blob = await ipfsService.fetchBlob(claim.billCID);
      if (viewing?.billUrl) URL.revokeObjectURL(viewing.billUrl);
      setViewing({
        claimId: claim.claimId,
        record,
        billUrl: URL.createObjectURL(blob),
        billType: blob.type || "",
      });
      setToast({ status: null, hash: null, message: "" });
    } catch (e) {
      setToast({ status: "error", hash: null, message: e.message || toVietnameseError(e) });
    } finally {
      setBusy(false);
    }
  }

  async function handleApprove(claim) {
    setBusy(true);
    setToast({ status: "processing", hash: null, message: "" });
    try {
      await contractService.approveClaim(claim.claimId, { dryRun: true });
      const tx = await contractService.approveClaim(claim.claimId);
      setToast({ status: "success", hash: tx.hash, message: "Đã duyệt và chi trả." });
      await loadClaims();
    } catch (e) {
      setToast({ status: "error", hash: null, message: e.message || toVietnameseError(e) });
    } finally {
      setBusy(false);
    }
  }

  async function handleReject(claim) {
    const reason = window.prompt("Nhập lý do từ chối:");
    if (!reason) return;
    setBusy(true);
    setToast({ status: "processing", hash: null, message: "" });
    try {
      await contractService.rejectClaim(claim.claimId, reason, { dryRun: true });
      const tx = await contractService.rejectClaim(claim.claimId, reason);
      setToast({ status: "success", hash: tx.hash, message: "Đã từ chối yêu cầu." });
      await loadClaims();
    } catch (e) {
      setToast({ status: "error", hash: null, message: e.message || toVietnameseError(e) });
    } finally {
      setBusy(false);
    }
  }

  const secret = viewing?.record?.secret;

  return (
    <section className="insurer-card">
      <h2>5. Yêu cầu bồi thường</h2>
      <div className="insurer-row">
        <button className="insurer-btn insurer-btn-secondary" onClick={() => loadClaims()} disabled={busy}>Làm mới danh sách</button>
      </div>
      <TxToast status={toast.status} hash={toast.hash} message={toast.message} />

      {claims.length === 0 ? (
        <p className="insurer-muted">Chưa có yêu cầu bồi thường nào.</p>
      ) : (
        <div className="insurer-table-wrap">
          <table className="insurer-table">
            <thead>
              <tr>
                <th>Mã</th><th>Bệnh nhân</th><th>Số tiền yêu cầu</th>
                <th>Số tiền xác nhận</th><th>Bệnh viện xác nhận</th><th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={String(c.claimId)}>
                  <td>#{String(c.claimId)}</td>
                  <td title={c.patient}>{shortAddress(c.patient)}</td>
                  <td>{formatEth(c.amount)}</td>
                  <td>{formatEth(c.confirmedAmount)}</td>
                  <td>{c.hospitalConfirmed ? "✅ Đã xác nhận" : "⏳ Chưa"}</td>
                  <td><span className={STATUS_CLASS[c.statusLabel]}>{STATUS_VI[c.statusLabel] ?? c.statusLabel}</span></td>
                  <td>
                    <div className="insurer-actions">
                      <button className="insurer-btn insurer-btn-secondary insurer-btn-sm" onClick={() => handleView(c)} disabled={busy}>Xem hồ sơ IPFS</button>
                      {c.statusLabel === "PENDING" && (
                        <>
                          <button className="insurer-btn insurer-btn-success insurer-btn-sm" onClick={() => handleApprove(c)} disabled={busy}>Duyệt và chi trả</button>
                          <button className="insurer-btn insurer-btn-danger insurer-btn-sm" onClick={() => handleReject(c)} disabled={busy}>Từ chối</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <div className="insurer-record">
          <h3>Hồ sơ đã giải mã của yêu cầu #{String(viewing.claimId)}</h3>
          <p>Ngày khám: <b>{viewing.record.meta?.visitDate}</b> | Bệnh viện: <b>{viewing.record.meta?.hospitalName}</b></p>
          {secret && (
            <>
              <p>Bệnh nhân: <b>{secret.patientName}</b></p>
              <p>Chẩn đoán: <b>{secret.diagnosis}</b></p>
              <p>Điều trị: <b>{secret.treatment}</b></p>
              <p>Bác sĩ: <b>{secret.doctor}</b></p>
              {(secret.labResults || []).length > 0 && (
                <>
                  <h3>Kết quả xét nghiệm</h3>
                  <ul>
                    {secret.labResults.map((l, i) => (
                      <li key={i}>{l.test}: {l.value} {l.unit}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
          <h3>Hóa đơn</h3>
          {viewing.billType.startsWith("image/") ? (
            <img src={viewing.billUrl} alt="Hóa đơn viện phí" />
          ) : (
            <a className="insurer-link" href={viewing.billUrl} target="_blank" rel="noreferrer">Mở hóa đơn</a>
          )}
          <div className="insurer-row">
            <button className="insurer-btn insurer-btn-secondary" onClick={() => setViewing(null)}>Đóng</button>
          </div>
        </div>
      )}
    </section>
  );
}
