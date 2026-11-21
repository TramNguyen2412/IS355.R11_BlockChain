import { useEffect, useState } from "react";
import { useWallet } from "../../app/WalletProvider.jsx";
import * as contractService from "../../app/contractService.js";
import { cryptoService } from "../../services/index.js";
import { toVietnameseError } from "../../app/errors.js";
import TxToast from "../../components/shared/TxToast.jsx";

export default function KeySetup() {
  const { address } = useWallet();
  const [hasLocalKey, setHasLocalKey] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ status: null, hash: null, message: "" });
  const [importText, setImportText] = useState("");

  async function refresh() {
    if (!address) return;
    setHasLocalKey(Boolean(await cryptoService.loadKeyPair(address)));
    const onChainKey = await contractService.getEncryptionKey(address);
    setRegistered(onChainKey !== "");
  }

  useEffect(() => {
    refresh().catch((e) =>
      setToast({ status: "error", hash: null, message: toVietnameseError(e) })
    );
  }, [address]);

  async function handleCreateAndRegister() {
    setBusy(true);
    setToast({ status: "processing", hash: null, message: "" });
    try {
      let pair = await cryptoService.loadKeyPair(address);
      if (!pair) {
        pair = await cryptoService.generateRsaKeyPair();
        await cryptoService.saveKeyPair(address, pair);
      }
      await contractService.registerEncryptionKey(pair.publicKeyPem, { dryRun: true });
      const tx = await contractService.registerEncryptionKey(pair.publicKeyPem);
      setToast({ status: "success", hash: tx.hash, message: "Đăng ký khóa thành công." });
      await refresh();
    } catch (e) {
      setToast({ status: "error", hash: null, message: e.message || toVietnameseError(e) });
    } finally {
      setBusy(false);
    }
  }

  async function handleExport() {
    try {
      const text = await cryptoService.exportKeyPair(address);
      const blob = new Blob([text], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "khoa-rsa-" + address.toLowerCase() + ".json";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      setToast({ status: "error", hash: null, message: e.message || toVietnameseError(e) });
    }
  }

  async function handleImport() {
    try {
      await cryptoService.importKeyPair(address, importText);
      setImportText("");
      setHasLocalKey(true);
      setToast({ status: "success", hash: null, message: "Đã nhập khóa thành công." });
    } catch (e) {
      setToast({ status: "error", hash: null, message: "Nhập khóa thất bại: " + e.message });
    }
  }

  return (
    <section className="insurer-card">
      <h2>1. Khóa mã hóa của công ty bảo hiểm</h2>
      <div className="insurer-row">
        <span className={hasLocalKey ? "insurer-badge insurer-badge-on" : "insurer-badge insurer-badge-off"}>
          Khóa trong trình duyệt: {hasLocalKey ? "Đã có" : "Chưa có"}
        </span>
        <span className={registered ? "insurer-badge insurer-badge-on" : "insurer-badge insurer-badge-off"}>
          Khóa trên blockchain: {registered ? "Đã đăng ký" : "Chưa đăng ký"}
        </span>
      </div>
      {!registered && (
        <p className="insurer-warn">Phải đăng ký khóa trước khi bệnh nhân mua bảo hiểm.</p>
      )}
      {registered && !hasLocalKey && (
        <p className="insurer-warn">
          Khóa đã đăng ký nhưng trình duyệt này chưa có khóa riêng. Hãy nhập khóa đã sao lưu bên dưới. Đừng tạo khóa mới, vì sẽ ghi đè khóa cũ.
        </p>
      )}
      <div className="insurer-row">
        <button className="insurer-btn" onClick={handleCreateAndRegister} disabled={busy || !address || (registered && !hasLocalKey)}>
          {hasLocalKey ? "Đăng ký khóa lên blockchain" : "Tạo khóa và đăng ký"}
        </button>
        <button className="insurer-btn insurer-btn-secondary" onClick={handleExport} disabled={!hasLocalKey}>
          Xuất khóa để sao lưu
        </button>
      </div>
      <p className="insurer-muted">Giữ file khóa an toàn, không đưa lên Git. Mất khóa thì không giải mã được hồ sơ.</p>
      <details>
        <summary>Nhập khóa từ file sao lưu</summary>
        <textarea
          className="insurer-input"
          rows={4}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Dán nội dung file khóa (JSON) vào đây"
        />
        <div className="insurer-row">
          <button className="insurer-btn" onClick={handleImport} disabled={!importText.trim()}>Nhập khóa</button>
        </div>
      </details>
      <TxToast status={toast.status} hash={toast.hash} message={toast.message} />
    </section>
  );
}
