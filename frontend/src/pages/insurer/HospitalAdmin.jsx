import { useEffect, useState } from "react";
import { isAddress } from "ethers";
import * as contractService from "../../app/contractService.js";
import { toVietnameseError } from "../../app/errors.js";
import { shortAddress } from "../../app/format.js";
import TxToast from "../../components/shared/TxToast.jsx";

export default function HospitalAdmin() {
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [authorized, setAuthorized] = useState([]);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ status: null, hash: null, message: "" });

  async function loadList() {
    const events = await contractService.getEvents();
    const state = new Map();
    // getEvents trả mới nhất trước, nên đảo lại để xử lý từ cũ đến mới
    [...events].reverse().forEach((ev) => {
      if (ev.name !== "HospitalAuthorized") return;
      const addr = String(ev.args.hospital ?? ev.args[0]);
      const status = Boolean(ev.args.status ?? ev.args[1]);
      state.set(addr.toLowerCase(), { address: addr, status });
    });
    setAuthorized([...state.values()].filter((h) => h.status));
  }

  useEffect(() => {
    loadList().catch((e) =>
      setToast({ status: "error", hash: null, message: toVietnameseError(e) })
    );
  }, []);

  async function change(addr, status) {
    if (!isAddress(addr)) {
      setToast({ status: "error", hash: null, message: "Địa chỉ ví không hợp lệ." });
      return;
    }
    setBusy(true);
    setToast({ status: "processing", hash: null, message: "" });
    try {
      await contractService.authorizeHospital(addr, status, { dryRun: true });
      const tx = await contractService.authorizeHospital(addr, status);
      setToast({
        status: "success",
        hash: tx.hash,
        message: status ? "Đã cấp quyền bệnh viện." : "Đã thu hồi quyền bệnh viện.",
      });
      setHospitalAddress("");
      await loadList();
    } catch (e) {
      setToast({ status: "error", hash: null, message: e.message || toVietnameseError(e) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="insurer-card">
      <h2>3. Quản lý bệnh viện được ủy quyền</h2>
      <div className="insurer-row">
        <input
          className="insurer-input"
          placeholder="Địa chỉ ví bệnh viện (0x...)"
          value={hospitalAddress}
          onChange={(e) => setHospitalAddress(e.target.value.trim())}
          disabled={busy}
        />
        <button className="insurer-btn" onClick={() => change(hospitalAddress, true)} disabled={busy || !hospitalAddress}>
          Cấp quyền
        </button>
        <button className="insurer-btn insurer-btn-danger" onClick={() => change(hospitalAddress, false)} disabled={busy || !hospitalAddress}>
          Thu hồi quyền
        </button>
      </div>
      <TxToast status={toast.status} hash={toast.hash} message={toast.message} />

      <h3>Ví bệnh viện đang được cấp quyền</h3>
      {authorized.length === 0 ? (
        <p className="insurer-muted">Chưa có dữ liệu cấp quyền nào trong lịch sử sự kiện.</p>
      ) : (
        <div className="insurer-table-wrap">
          <table className="insurer-table">
            <thead>
              <tr><th>Địa chỉ ví</th><th>Trạng thái</th><th></th></tr>
            </thead>
            <tbody>
              {authorized.map((h) => (
                <tr key={h.address}>
                  <td title={h.address}>{shortAddress(h.address)}</td>
                  <td><span className="insurer-badge insurer-badge-on">Được cấp quyền</span></td>
                  <td>
                    <button className="insurer-btn insurer-btn-danger insurer-btn-sm" onClick={() => change(h.address, false)} disabled={busy}>
                      Thu hồi
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
