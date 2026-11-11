import { useEffect, useState } from 'react';
import { useWallet } from '../../app/WalletProvider';
import { registerEncryptionKey } from '../../app/contractService';
import { cryptoService } from '../../services/index.js';
import TxToast from '../../components/shared/TxToast';

function KeySetup() {
  const { address } = useWallet();

  const [keyPair, setKeyPair] = useState(null);
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [tx, setTx] = useState({
    status: '',
    hash: '',
    message: '',
  });

  useEffect(() => {
    if (!address) {
      setKeyPair(null);
      return;
    }

    try {
      setKeyPair(cryptoService.loadKeyPair(address));
    } catch (err) {
      setMessage(err.message || 'Không thể tải khóa đã lưu.');
    }
  }, [address]);

  async function handleGenerate() {
    if (!address) {
      setMessage('Vui lòng chọn ví bệnh nhân trước.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const pair = await cryptoService.generateRsaKeyPair();
      cryptoService.saveKeyPair(address, pair);
      setKeyPair(pair);
      setMessage('Đã tạo và lưu cặp khóa RSA trên thiết bị này.');
    } catch (err) {
      setMessage(err.message || 'Không thể tạo cặp khóa RSA.');
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister() {
    if (!keyPair?.publicKeyPem) {
      setMessage('Hãy tạo hoặc nhập cặp khóa RSA trước.');
      return;
    }

    setBusy(true);
    setMessage('');
    setTx({
      status: 'processing',
      hash: '',
      message: 'Đang kiểm tra đăng ký khóa mã hóa...',
    });

    try {
      await registerEncryptionKey(keyPair.publicKeyPem, {
        dryRun: true,
      });

      const result = await registerEncryptionKey(keyPair.publicKeyPem);

      setTx({
        status: 'success',
        hash: result.hash,
        message: 'Đăng ký khóa mã hóa thành công.',
      });
    } catch (err) {
      setTx({
        status: 'error',
        hash: '',
        message: err.message || 'Không thể đăng ký khóa mã hóa.',
      });
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    if (!address) {
      setMessage('Vui lòng chọn ví trước khi xuất khóa.');
      return;
    }

    try {
      const content = cryptoService.exportKeyPair(address);
      const blob = new Blob([content], {
        type: 'application/json;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `medichain-key-${address.slice(2, 8)}.json`;
      link.click();

      URL.revokeObjectURL(url);
      setMessage('Đã xuất khóa. Hãy lưu file ở nơi an toàn.');
    } catch (err) {
      setMessage(err.message || 'Không thể xuất cặp khóa.');
    }
  }

  function handleImport() {
    if (!address) {
      setMessage('Vui lòng chọn ví trước khi nhập khóa.');
      return;
    }

    if (!importText.trim()) {
      setMessage('Hãy dán nội dung JSON của cặp khóa cần nhập.');
      return;
    }

    try {
      cryptoService.importKeyPair(address, importText);
      setKeyPair(cryptoService.loadKeyPair(address));
      setImportText('');
      setMessage('Đã nhập và lưu cặp khóa cho địa chỉ ví hiện tại.');
    } catch (err) {
      setMessage(err.message || 'Không thể nhập cặp khóa.');
    }
  }

  return (
    <div className="patient-key-setup">
      <p>
        Khóa riêng được lưu trên thiết bị hiện tại. Không chia sẻ khóa riêng
        cho người khác.
      </p>

      <p>
        <strong>Trạng thái:</strong>{' '}
        {keyPair ? 'Đã có cặp khóa RSA' : 'Chưa có cặp khóa RSA'}
      </p>

      <div className="patient-actions">
        <button type="button" onClick={handleGenerate} disabled={busy || !address}>
          Tạo cặp khóa RSA
        </button>

        <button
          type="button"
          onClick={handleRegister}
          disabled={busy || !keyPair}
        >
          Đăng ký khóa công khai
        </button>

        <button
          type="button"
          onClick={handleExport}
          disabled={!keyPair || !address}
        >
          Export key
        </button>
      </div>

      <div>
        <label htmlFor="patient-key-import">
          Nội dung JSON của cặp khóa cần Import
        </label>
        <textarea
          id="patient-key-import"
          rows={4}
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder="Dán nội dung file khóa JSON tại đây..."
        />

        <button
          type="button"
          onClick={handleImport}
          disabled={!address || !importText.trim()}
        >
          Import key
        </button>
      </div>

      {message && <p role="status">{message}</p>}

      <TxToast
        status={tx.status}
        hash={tx.hash}
        message={tx.message}
      />
    </div>
  );
}

export default KeySetup;