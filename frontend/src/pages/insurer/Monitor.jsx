import { useEffect, useState } from "react";
import { useWallet } from "../../app/WalletProvider.jsx";
import * as contractService from "../../app/contractService.js";
import { toVietnameseError } from "../../app/errors.js";
import { formatEth, formatDate, shortAddress } from "../../app/format.js";
import TxToast from "../../components/shared/TxToast.jsx";

export default function Monitor() {
  const { chainId } = useWallet();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState({ status: null, hash: null, message: "" });

  async function load() {
    try {
      const [ev, st] = await Promise.all([
        contractService.getEvents(),
        contractService.getStats(),
      ]);
      setEvents(ev);
      setStats(st);
    } catch (e) {
      setToast({ status: "error", hash: null, message: e.message || toVietnameseError(e) });
    }
  }

  useEffect(() => { load(); }, []);

  const cards = stats
    ? [
        ["Tổng phí thu", formatEth(stats.totalPremium)],
        ["Tổng đã chi", formatEth(stats.totalPaid)],
        ["Chờ xử lý", String(stats.pending)],
        ["Đã duyệt", String(stats.approved)],
        ["Đã từ chối", String(stats.rejected)],
        ["Số dư quỹ", formatEth(stats.poolBalance)],
      ]
    : [];

  return (
    <section className="insurer-card">
      <h2>6. Giám sát và thống kê on-chain</h2>
      <div className="insurer-row">
        <button className="insurer-btn insurer-btn-secondary" onClick={load}>Làm mới</button>
      </div>
      <TxToast status={toast.status} hash={toast.hash} message={toast.message} />

      {stats && (
        <div className="insurer-stats">
          {cards.map(([label, value]) => (
            <div className="insurer-stat" key={label}>
              <div className="insurer-stat-label">{label}</div>
              <div className="insurer-stat-value">{value}</div>
            </div>
          ))}
        </div>
      )}

      <h3>Lịch sử sự kiện</h3>
      {events.length === 0 ? (
        <p className="insurer-muted">Chưa có sự kiện nào.</p>
      ) : (
        <div className="insurer-table-wrap">
          <table className="insurer-table">
            <thead>
              <tr><th>Thời gian</th><th>Loại sự kiện</th><th>Mã giao dịch</th></tr>
            </thead>
            <tbody>
              {events.map((ev, i) => (
                <tr key={ev.txHash + "-" + i}>
                  <td>{formatDate(Number(ev.timestamp) * 1000)}</td>
                  <td>{ev.name}</td>
                  <td>
                    {chainId === 11155111 ? (
                      <a className="insurer-link" href={"https://sepolia.etherscan.io/tx/" + ev.txHash} target="_blank" rel="noreferrer">
                        {shortAddress(ev.txHash)}
                      </a>
                    ) : (
                      shortAddress(ev.txHash)
                    )}
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
