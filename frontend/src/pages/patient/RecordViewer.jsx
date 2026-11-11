import { useState } from 'react';
import { useWallet } from '../../app/WalletProvider';
import { cryptoService, ipfsService } from '../../services/index.js';

function RecordViewer({ claims = [] }) {
  const { address } = useWallet();

  const [claimId, setClaimId] = useState('');
  const [record, setRecord] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleViewRecord(event) {
    event.preventDefault();

    if (!address) {
      setError('Vui lòng chọn ví bệnh nhân trước.');
      return;
    }

    const selectedClaim = claims.find(
      (claim) => String(claim.claimId) === String(claimId),
    );

    if (!selectedClaim) {
      setError('Không tìm thấy yêu cầu bồi thường.');
      return;
    }

    setBusy(true);
    setError('');
    setRecord(null);

    try {
      // Lấy cặp khóa riêng của bệnh nhân trên thiết bị hiện tại.
      const keyPair = cryptoService.loadKeyPair(address);

      if (!keyPair?.privateKeyPem) {
        throw new Error(
          'Không tìm thấy khóa riêng. Hãy Import hoặc tạo cặp khóa đã đăng ký.',
        );
      }

      // Lấy bản ghi đã mã hóa từ IPFS.
      const encryptedRecord = await ipfsService.fetchJSON(
        selectedClaim.recordCID,
      );

      // Chỉ giải mã được nếu bản ghi có keyWrap dành cho ví hiện tại.
      const decryptedRecord = await cryptoService.openEncryptedRecord(
        encryptedRecord,
        address,
        keyPair.privateKeyPem,
      );

      setRecord(decryptedRecord);
    } catch (err) {
      setError(err.message || 'Không thể giải mã hồ sơ y tế.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="patient-record-viewer">
      <form onSubmit={handleViewRecord}>
        <div>
          <label htmlFor="patient-record-claim">
            Chọn yêu cầu bồi thường
          </label>

          <select
            id="patient-record-claim"
            value={claimId}
            onChange={(event) => setClaimId(event.target.value)}
            required
          >
            <option value="">-- Chọn yêu cầu --</option>

            {claims.map((claim) => (
              <option key={claim.claimId} value={claim.claimId}>
                Yêu cầu #{claim.claimId} - {claim.recordCID}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={busy || claims.length === 0}>
          {busy ? 'Đang giải mã...' : 'Xem hồ sơ y tế'}
        </button>
      </form>

      {error && (
        <p role="alert" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}

      {record && (
        <section>
          <h4>Thông tin hồ sơ y tế</h4>

          <p>
            <strong>Ngày khám:</strong> {record.meta?.visitDate || '—'}
          </p>

          <p>
            <strong>Bệnh viện:</strong> {record.meta?.hospitalName || '—'}
          </p>

          <p>
            <strong>Hóa đơn CID:</strong>{' '}
            <code>{record.meta?.billCID || '—'}</code>
          </p>

          <h5>Thông tin bệnh nhân</h5>

          <p>
            <strong>Họ tên:</strong> {record.secret?.patientName || '—'}
          </p>

          <p>
            <strong>Mã số bảo hiểm:</strong> {record.secret?.healthId || '—'}
          </p>

          <p>
            <strong>Chẩn đoán:</strong> {record.secret?.diagnosis || '—'}
          </p>

          <p>
            <strong>Phương pháp điều trị:</strong>{' '}
            {record.secret?.treatment || '—'}
          </p>

          <p>
            <strong>Bác sĩ:</strong> {record.secret?.doctor || '—'}
          </p>

          <p>
            <strong>Tổng chi phí (wei):</strong>{' '}
            {record.secret?.totalCost || '—'}
          </p>

          <h5>Kết quả xét nghiệm</h5>

          {record.secret?.labResults?.length ? (
            <ul>
              {record.secret.labResults.map((item, index) => (
                <li key={`${item.test}-${index}`}>
                  {item.test}: {item.value} {item.unit}
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có dữ liệu xét nghiệm.</p>
          )}
        </section>
      )}
    </div>
  );
}

export default RecordViewer;