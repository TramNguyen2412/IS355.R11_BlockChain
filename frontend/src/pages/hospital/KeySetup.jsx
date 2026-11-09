import { useCallback, useEffect, useState } from "react";
import { useWallet } from "../../app/WalletProvider.jsx";
import * as contractService from "../../app/contractService.js";
import { cryptoService } from "../../services/index.js";
import ErrorBox from "../../components/shared/ErrorBox.jsx";

export default function KeySetup() {
  const { address } = useWallet();
  const [localPair, setLocalPair] = useState(null);   // khóa lưu trong trình duyệt
  const [onChainKey, setOnChainKey] = useState("");   // khóa công khai đã đăng ký trên blockchain
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [importText, setImportText] = useState("");

  const refresh = useCallback(async () => {
    if (!address) return;
    try {
      setLocalPair((await cryptoService.loadKeyPair(address)) || null);
      setOnChainKey(await contractService.getEncryptionKey(address));
    } catch (e) {
      setError(e.message);
    }
  }, [address]);

  useEffect(() => {
    setError("");
    setInfo("");
    refresh();
  }, [refresh]);

  async function handleCreate() {
    setBusy(true); setError(""); setInfo("");
    try {
      const pair = await cryptoService.generateRsaKeyPair();
      await cryptoService.saveKeyPair(address, pair);
      setInfo("Đã tạo khóa mã hóa. Hãy đăng ký khóa lên blockchain và xuất file khóa để sao lưu.");
      await refresh();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  async function handleRegister() {
    setBusy(true); setError(""); setInfo("");
    try {
      await contractService.registerEncryptionKey(localPair.publicKeyPem, { dryRun: true });
      await contractService.registerEncryptionKey(localPair.publicKeyPem);
      setInfo("Đã đăng ký khóa lên blockchain.");
      await refresh();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  async function handleExport() {
    try {
      const text = await cryptoService.exportKeyPair(address);
      const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "khoa-ma-hoa-benh-vien.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { setError(e.message); }
  }

  async function handleImport() {
    setBusy(true); setError(""); setInfo("");
    try {
      await cryptoService.importKeyPair(address, importText);
      setImportText("");
      setInfo("Đã nhập khóa.");
      await refresh();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  const registeredOk = localPair && onChainKey && onChainKey === localPair.publicKeyPem;

  return (
    <section className="hospital-card">
      <h2>1. Khóa mã hóa của bệnh viện</h2>
      {!localPair && (
        <div className="hospital-row">
          <span className="hospital-warn">Chưa có khóa trong trình duyệt này.</span>
          <button className="hospital-btn" disabled={busy || !address} onClick={handleCreate}>Tạo khóa mã hóa</button>
        </div>
      )}
      {localPair && !registeredOk && (
        <div className="hospital-row">
          <span className="hospital-warn">Khóa chưa được đăng ký (hoặc khác khóa trên blockchain).</span>
          <button className="hospital-btn" disabled={busy} onClick={handleRegister}>Đăng ký khóa lên blockchain</button>
        </div>
      )}
      {registeredOk && <p className="hospital-ok">✅ Khóa đã được đăng ký trên blockchain.</p>}
      {localPair && (
        <div className="hospital-row">
          <button className="hospital-btn" onClick={handleExport}>Xuất khóa để sao lưu</button>
          <span>Giữ file này an toàn. Mất khóa thì không giải mã được hồ sơ.</span>
        </div>
      )}
      <details>
        <summary>Nhập khóa từ file sao lưu</summary>
        <textarea className="hospital-input" rows={4} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Dán nội dung file khóa (JSON) vào đây" />
        <button className="hospital-btn" disabled={busy || !importText.trim()} onClick={handleImport}>Nhập khóa</button>
      </details>
      {info && <p className="hospital-ok">{info}</p>}
      {error && <ErrorBox message={error} />}
    </section>
  );
}
