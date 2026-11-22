import { useEffect, useState } from "react";
import { parseEther } from "ethers";
import * as contractService from "../../app/contractService.js";
import { toVietnameseError } from "../../app/errors.js";
import { formatEth } from "../../app/format.js";
import TxToast from "../../components/shared/TxToast.jsx";

export default function FundPanel() {
  const [balance, setBalance] = useState(null);
  const [amountEth, setAmountEth] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ status: null, hash: null, message: "" });

  async function loadBalance() {
    setBalance(await contractService.getPoolBalance());
  }

  useEffect(() => {
    loadBalance().catch((e) =>
      setToast({ status: "error", hash: null, message: toVietnameseError(e) })
    );
  }, []);

  async function handleFund() {
    setBusy(true);
    setToast({ status: "processing", hash: null, message: "" });
    try {
      const wei = parseEther(amountEth.trim());
      await contractService.fundPool(wei, { dryRun: true });
      const tx = await contractService.fundPool(wei);
      setToast({ status: "success", hash: tx.hash, message: "Nạp quỹ thành công." });
      setAmountEth("");
      await loadBalance();
    } catch (e) {
      setToast({ status: "error", hash: null, message: e.message || toVietnameseError(e) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="insurer-card">
      <h2>4. Quỹ chi trả bảo hiểm</h2>
      <div className="insurer-stats">
        <div className="insurer-stat">
          <div className="insurer-stat-label">Số dư quỹ hiện tại</div>
          <div className="insurer-stat-value">{balance === null ? "..." : formatEth(balance)}</div>
        </div>
      </div>
      <div className="insurer-row">
        <input
          className="insurer-input"
          placeholder="Số ETH muốn nạp, ví dụ 0.01"
          value={amountEth}
          onChange={(e) => setAmountEth(e.target.value)}
          disabled={busy}
        />
        <button className="insurer-btn" onClick={handleFund} disabled={busy || !amountEth.trim()}>Nạp quỹ</button>
        <button className="insurer-btn insurer-btn-secondary" onClick={() => loadBalance()} disabled={busy}>Làm mới số dư</button>
      </div>
      <TxToast status={toast.status} hash={toast.hash} message={toast.message} />
    </section>
  );
}
