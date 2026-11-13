
import { useState } from 'react';
import { formatEther, parseEther } from 'ethers';
import { useWallet } from '../../app/WalletProvider';
import {
  getEncryptionKey,
  getInsurerAddress,
  submitClaim,
} from '../../app/contractService';
import { cryptoService, ipfsService } from '../../services/index.js';
import TxToast from '../../components/shared/TxToast';

// Hardhat Account #1: Hospital đã được Admin cấp HOSPITAL_ROLE.
const HOSPITAL_ADDRESS =
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

const emptyLab = () => ({ test: '', value: '', unit: '' });

function ClaimForm({ policy, onSubmitted }) {
  const { address } = useWallet();

  const [amount, setAmount] = useState('0.012');
  const [visitDate, setVisitDate] = useState('2030-01-02');
  const [hospitalName, setHospitalName] = useState('Bệnh viện Mẫu');
  const [patientName, setPatientName] = useState('Nguyễn Văn Mẫu');
  const [healthId, setHealthId] = useState('HS4010123456789');
  const [diagnosis, setDiagnosis] = useState('Viêm ruột thừa cấp');
  const [treatment, setTreatment] = useState(
    'Phẫu thuật nội soi cắt ruột thừa',
  );
  const [doctor, setDoctor] = useState('BS. Trần Mẫu');
  const [labs, setLabs] = useState([
    { test: 'Bạch cầu', value: '13.2', unit: 'G/L' },
    { test: 'CRP', value: '48', unit: 'mg/L' },
  ]);

  const [invoice, setInvoice] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [tx, setTx] = useState({
    status: '',
    hash: '',
    message: '',
  });

  function updateLab(index, field, value) {
    setLabs((previous) =>
      previous.map((lab, i) =>
        i === index ? { ...lab, [field]: value } : lab,
      ),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!address) {
      setTx({
        status: 'error',
        hash: '',
        message: 'Vui lòng kết nối ví bệnh nhân.',
      });
      return;
    }

    if (!policy) {
      setTx({
        status: 'error',
        hash: '',
        message: 'Bạn chưa có thẻ bảo hiểm.',
      });
      return;
    }

    if (!invoice) {
      setTx({
        status: 'error',
        hash: '',
        message: 'Vui lòng chọn hóa đơn kiểm thử.',
      });
      return;
    }

    if (!patientName.trim() || !healthId.trim() ||
        !diagnosis.trim() || !hospitalName.trim() ||
        !doctor.trim() || !visitDate) {
      setTx({
        status: 'error',
        hash: '',
        message: 'Vui lòng nhập đầy đủ thông tin hồ sơ.',
      });
      return;
    }

    let amountWei;

    try {
      amountWei = parseEther(amount.trim());
    } catch {
      setTx({
        status: 'error',
        hash: '',
        message: 'Số tiền không hợp lệ.',
      });
      return;
    }

    if (amountWei <= 0n) {
      setTx({
        status: 'error',
        hash: '',
        message: 'Số tiền phải lớn hơn 0.',
      });
      return;
    }

    if (amountWei > policy.remainingLimit) {
      setTx({
        status: 'error',
        hash: '',
        message: `Vượt hạn mức còn lại: ${formatEther(policy.remainingLimit)} ETH.`,
      });
      return;
    }

    setBusy(true);
    setTx({
      status: 'processing',
      hash: '',
      message: 'Đang kiểm tra điều kiện gửi claim...',
    });

    try {
      // 1. Kiểm tra trước điều kiện contract, chưa gửi giao dịch.
      const claimInput = {
        tokenId: policy.tokenId,
        amount: amountWei,
        billCID: 'dry-run',
        recordCID: 'dry-run',
      };

      await submitClaim(claimInput, {
        dryRun: true,
        from: address,
      });

      // 2. Lấy khóa công khai của ba bên.
      const insurerAddress = await getInsurerAddress();

      const [patientKey, hospitalKey, insurerKey] =
        await Promise.all([
          getEncryptionKey(address),
          getEncryptionKey(HOSPITAL_ADDRESS),
          getEncryptionKey(insurerAddress),
        ]);

      if (!patientKey) {
        throw new Error('Bệnh nhân chưa đăng ký khóa mã hóa.');
      }
      if (!hospitalKey) {
        throw new Error('Bệnh viện chưa đăng ký khóa mã hóa.');
      }
      if (!insurerKey) {
        throw new Error('Công ty bảo hiểm chưa đăng ký khóa mã hóa.');
      }

      // 3. Upload hóa đơn kiểm thử lên IPFS.
      // Chỉ sử dụng file giả, không chứa thông tin cá nhân thật.
      setTx({
        status: 'processing',
        hash: '',
        message: 'Đang upload hóa đơn kiểm thử lên IPFS...',
      });

      const billResult = await ipfsService.uploadFile(invoice);

      // 4. Tạo hồ sơ theo cấu trúc Medical_Record_01.json.
      const record = {
        meta: {
          visitDate,
          hospitalName: hospitalName.trim(),
          billCID: billResult.cid,
        },
        secret: {
          patientName: patientName.trim(),
          healthId: healthId.trim(),
          diagnosis: diagnosis.trim(),
          treatment: treatment.trim(),
          labResults: labs
            .filter((lab) => lab.test.trim())
            .map((lab) => ({
              test: lab.test.trim(),
              value: lab.value.trim(),
              unit: lab.unit.trim(),
            })),
          doctor: doctor.trim(),
          totalCost: amountWei.toString(),
        },
      };

      // 5. Mã hóa AES-256-GCM và bọc khóa AES bằng RSA-OAEP.
      const encryptedRecord =
        await cryptoService.buildEncryptedRecord(record, [
          {
            address,
            publicKeyPem: patientKey,
          },
          {
            address: HOSPITAL_ADDRESS,
            publicKeyPem: hospitalKey,
          },
          {
            address: insurerAddress,
            publicKeyPem: insurerKey,
          },
        ]);

      // 6. Upload JSON đã mã hóa lên IPFS.
      setTx({
        status: 'processing',
        hash: '',
        message: 'Đang upload hồ sơ đã mã hóa lên IPFS...',
      });

      const recordResult = await ipfsService.uploadJSON(
        encryptedRecord,
        `medical-record-${policy.tokenId}`,
      );

      // 7. Gửi giao dịch thật lên Hardhat Local.
      const result = await submitClaim(
        {
          tokenId: policy.tokenId,
          amount: amountWei,
          billCID: billResult.cid,
          recordCID: recordResult.cid,
        },
        { from: address },
      );

      setTx({
        status: 'success',
        hash: result.hash,
        message: `Gửi claim thành công. Bill CID: ${billResult.cid}. Record CID: ${recordResult.cid}. Trạng thái ban đầu: PENDING.`,
      });

      // 8. Làm mới dữ liệu claim trên giao diện.
      setAmount('0.012');
      setInvoice(null);
      setFileKey((key) => key + 1);

      if (onSubmitted) {
        await onSubmitted();
      }
    } catch (error) {
      setTx({
        status: 'error',
        hash: '',
        message: error.message || 'Không thể gửi yêu cầu bồi thường.',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="patient-claim-form">
      {!policy && (
        <p>Chưa có thẻ bảo hiểm nên chưa thể gửi yêu cầu bồi thường.</p>
      )}

      {policy && (
        <>
          <p>
            <strong>Thẻ bảo hiểm:</strong> #{policy.tokenId}
          </p>

          <p>
            <strong>Hạn mức còn lại:</strong>{' '}
            {formatEther(policy.remainingLimit)} ETH
          </p>

          <h4>Thông tin khám chữa bệnh</h4>

          <div>
            <label htmlFor="patient-visit-date">Ngày khám</label>
            <input
              id="patient-visit-date"
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div>
            <label htmlFor="patient-hospital">Bệnh viện</label>
            <input
              id="patient-hospital"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div>
            <label htmlFor="patient-name">Họ tên bệnh nhân</label>
            <input
              id="patient-name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div>
            <label htmlFor="patient-health-id">Mã BHYT kiểm thử</label>
            <input
              id="patient-health-id"
              value={healthId}
              onChange={(e) => setHealthId(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div>
            <label htmlFor="patient-diagnosis">Chẩn đoán</label>
            <input
              id="patient-diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div>
            <label htmlFor="patient-treatment">Phương pháp điều trị</label>
            <input
              id="patient-treatment"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div>
            <label htmlFor="patient-doctor">Bác sĩ</label>
            <input
              id="patient-doctor"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <h4>Kết quả xét nghiệm</h4>

          {labs.map((lab, index) => (
            <div key={index}>
              <input
                aria-label={`Tên xét nghiệm ${index + 1}`}
                placeholder="Tên xét nghiệm"
                value={lab.test}
                onChange={(e) =>
                  updateLab(index, 'test', e.target.value)
                }
                disabled={busy}
              />
              <input
                aria-label={`Giá trị xét nghiệm ${index + 1}`}
                placeholder="Giá trị"
                value={lab.value}
                onChange={(e) =>
                  updateLab(index, 'value', e.target.value)
                }
                disabled={busy}
              />
              <input
                aria-label={`Đơn vị xét nghiệm ${index + 1}`}
                placeholder="Đơn vị"
                value={lab.unit}
                onChange={(e) =>
                  updateLab(index, 'unit', e.target.value)
                }
                disabled={busy}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  setLabs((previous) =>
                    previous.filter((_, i) => i !== index),
                  )
                }
              >
                Xóa dòng
              </button>
            </div>
          ))}

          <button
            type="button"
            disabled={busy}
            onClick={() => setLabs((previous) => [...previous, emptyLab()])}
          >
            + Thêm xét nghiệm
          </button>

          <h4>Thông tin yêu cầu bồi thường</h4>

          <div>
            <label htmlFor="patient-claim-amount">
              Số tiền yêu cầu (ETH)
            </label>
            <input
              id="patient-claim-amount"
              type="number"
              min="0.000000000000000001"
              step="0.000000000000000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div>
            <label htmlFor="patient-invoice">
              Hóa đơn viện phí kiểm thử (PDF/ảnh)
            </label>
            <input
              key={fileKey}
              id="patient-invoice"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,image/*,application/pdf"
              onChange={(e) =>
                setInvoice(e.target.files?.[0] || null)
              }
              required
              disabled={busy}
            />
            <small>
              Chỉ chọn hóa đơn mẫu có ghi rõ DỮ LIỆU GIẢ.
            </small>
          </div>

          <button type="submit" disabled={busy}>
            {busy ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu bồi thường'}
          </button>
        </>
      )}

      <TxToast
        status={tx.status}
        hash={tx.hash}
        message={tx.message}
      />
    </form>
  );
}

export default ClaimForm;