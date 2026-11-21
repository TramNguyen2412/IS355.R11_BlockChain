import { useEffect, useState } from "react";
import { parseEther } from "ethers";
import * as contractService from "../../app/contractService.js";
import { ipfsService } from "../../services/index.js";
import { toVietnameseError } from "../../app/errors.js";
import { formatEth } from "../../app/format.js";
import TxToast from "../../components/shared/TxToast.jsx";

export default function PlansAdmin() {
  const [plans, setPlans] = useState([]);
  const [name, setName] = useState("");
  const [priceEth, setPriceEth] = useState("");
  const [limitEth, setLimitEth] = useState("");
  const [days, setDays] = useState("");
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ status: null, hash: null, message: "" });

  async function loadPlans() {
    setPlans(await contractService.getPlans());
  }

  useEffect(() => {
    loadPlans().catch((e) =>
      setToast({ status: "error", hash: null, message: toVietnameseError(e) })
    );
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (busy) return;
    if (!name || !priceEth || !limitEth || !days || !file) {
      setToast({ status: "error", hash: null, message: "Vui lòng điền đủ thông tin và chọn file PDF điều khoản." });
      return;
    }
    setBusy(true);
    setToast({ status: "processing", hash: null, message: "Đang tải PDF lên IPFS và gửi giao dịch..." });
    try {
      const { cid } = await ipfsService.uploadFile(file);
      const params = {
        name,
        price: parseEther(priceEth),
        coverageLimit: parseEther(limitEth),
        durationDays: BigInt(days),
        policyDocCID: cid,
      };
      await contractService.createPlan(params, { dryRun: true });
      const tx = await contractService.createPlan(params);
      setToast({ status: "success", hash: tx.hash, message: "Tạo gói thành công." });
      setName(""); setPriceEth(""); setLimitEth(""); setDays(""); setFile(null);
      setFileKey((k) => k + 1);
      await loadPlans();
    } catch (err) {
      setToast({ status: "error", hash: null, message: err.message || toVietnameseError(err) });
    } finally {
      setBusy(false);
    }
  }

  async function handleToggle(plan) {
    setBusy(true);
    setToast({ status: "processing", hash: null, message: "" });
    try {
      await contractService.setPlanActive(plan.id, !plan.active, { dryRun: true });
      const tx = await contractService.setPlanActive(plan.id, !plan.active);
      setToast({ status: "success", hash: tx.hash, message: "Đã đổi trạng thái gói." });
      await loadPlans();
    } catch (err) {
      setToast({ status: "error", hash: null, message: err.message || toVietnameseError(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="insurer-card">
      <h2>2. Quản lý gói bảo hiểm</h2>
      <p className="insurer-warn">Kiểm tra danh sách bên dưới trước khi tạo gói mới để tránh tạo trùng. Gói đã tạo không thể xóa, chỉ tắt được.</p>
      <form onSubmit={handleCreate}>
        <div className="insurer-form-grid">
          <label className="insurer-field">Tên gói
            <input className="insurer-input" placeholder="Ví dụ: Gói Cơ bản" value={name} onChange={(e) => setName(e.target.value)} disabled={busy} />
          </label>
          <label className="insurer-field">Giá (ETH)
            <input className="insurer-input" placeholder="Ví dụ 0.002" value={priceEth} onChange={(e) => setPriceEth(e.target.value)} disabled={busy} />
          </label>
          <label className="insurer-field">Hạn mức (ETH)
            <input className="insurer-input" placeholder="Ví dụ 0.02" value={limitEth} onChange={(e) => setLimitEth(e.target.value)} disabled={busy} />
          </label>
          <label className="insurer-field">Số ngày hiệu lực
            <input className="insurer-input" placeholder="Ví dụ 30" value={days} onChange={(e) => setDays(e.target.value)} disabled={busy} />
          </label>
        </div>
        <div className="insurer-row">
          <label>PDF điều khoản: <input key={fileKey} type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0] || null)} disabled={busy} /></label>
        </div>
        <div className="insurer-row">
          <button type="submit" className="insurer-btn" disabled={busy}>Tạo gói</button>
        </div>
      </form>
      <TxToast status={toast.status} hash={toast.hash} message={toast.message} />

      <h3>Danh sách gói</h3>
      {plans.length === 0 ? (
        <p className="insurer-muted">Chưa có gói bảo hiểm nào.</p>
      ) : (
        <div className="insurer-table-wrap">
          <table className="insurer-table">
            <thead>
              <tr>
                <th>Mã</th><th>Tên</th><th>Giá</th><th>Hạn mức</th>
                <th>Số ngày</th><th>Điều khoản</th><th>Trạng thái</th><th></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={String(p.id)}>
                  <td>#{String(p.id)}</td>
                  <td>{p.name}</td>
                  <td>{formatEth(p.price)}</td>
                  <td>{formatEth(p.coverageLimit)}</td>
                  <td>{String(p.durationDays)}</td>
                  <td>
                    <a className="insurer-link" href={ipfsService.gatewayUrl(p.policyDocCID)} target="_blank" rel="noreferrer">Xem PDF</a>
                  </td>
                  <td>
                    <span className={p.active ? "insurer-badge insurer-badge-on" : "insurer-badge insurer-badge-off"}>
                      {p.active ? "Đang mở bán" : "Đã tắt"}
                    </span>
                  </td>
                  <td>
                    <button className="insurer-btn insurer-btn-secondary insurer-btn-sm" onClick={() => handleToggle(p)} disabled={busy}>
                      {p.active ? "Tắt gói" : "Bật gói"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
