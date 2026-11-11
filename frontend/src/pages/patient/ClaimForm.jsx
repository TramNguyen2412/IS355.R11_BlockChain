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

// Địa chỉ ví HOSPITAL trong bộ dữ liệu mock của dự án.
// Khi chạy Sepolia, cần thay bằng địa chỉ bệnh viện đã đăng ký khóa.
const MOCK_HOSPITAL_ADDRESS =
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

function ClaimForm({ policy, onSubmitted }) {
  const { address } = useWallet();

  const [amount, setAmount] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [tx, setTx] = useState({
    status: '',
    hash: '',
    message: '',
  });

  async function handleSubmit(event) {
    event.preventDefault();

    if (!address) {
      setTx({
        status: 'error',
        hash: '',
        message: 'Vui lòng chọn ví bệnh nhân trước.',
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
        message: 'Vui lòng chọn hóa đơn viện phí.',
      });
      return;
    }

    let amountWei;

    try {
      amountWei = parseEther(amount);
    } catch {
      setTx({
        status: 'error',
        hash: '',
        message: 'Số tiền không hợp lệ. Hãy nhập số ETH hợp lệ.',
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
        message: 'Số tiền vượt hạn mức bảo hiểm còn lại.',
      });
      return;
    }

    setBusy(true);
    setTx({
      status: 'processing',
      hash: '',
      message: 'Đang tải hóa đơn và mã hóa hồ sơ y tế...',
    });

    try {
      // 1. Tải hóa đơn lên IPFS.
      const billResult = await ipfsService.uploadFile(invoice);

      // 2. Lấy khóa công khai của ba bên nhận hồ sơ.
      const insurerAddress = await getInsurerAddress();

      const [patientPublicKey, hospitalPublicKey, insurerPublicKey] =
        await Promise.all([
          getEncryptionKey(address),
          getEncryptionKey(MOCK_HOSPITAL_ADDRESS),
          getEncryptionKey(insurerAddress),
        ]);

      if (!patientPublicKey) {
        throw new Error('Bệnh nhân chưa đăng ký khóa mã hóa.');
      }

      if (!hospitalPublicKey) {
        throw new Error('Bệnh viện chưa đăng ký khóa mã hóa.');
      }

      if (!insurerPublicKey) {
        throw new Error('Công ty bảo hiểm chưa đăng ký khóa mã hóa.');
      }

      // 3. Tạo bản ghi theo đúng cấu trúc dữ liệu mẫu trong tài liệu dự án.
      const record = {
        meta: {
          visitDate: '2030-01-02',
          hospitalName: 'Bệnh viện Mẫu',
          billCID: billResult.cid,
        },
        secret: {
          patientName: 'Nguyễn Văn Mẫu',
          healthId: 'HS4010123456789',
          diagnosis: 'Viêm ruột thừa cấp',
          treatment: 'Phẫu thuật nội soi cắt ruột thừa',
          labResults: [
            {
              test: 'Bạch cầu',
              value: '13.2',
              unit: 'G/L',
            },
            {
              test: 'CRP',
              value: '48',
              unit: 'mg/L',
            },
          ],
          doctor: 'BS. Trần Mẫu',
          totalCost: amountWei.toString(),
        },
      };

      // 4. Mã hóa hồ sơ cho bệnh nhân, bệnh viện và công ty bảo hiểm.
      const encryptedRecord = await cryptoService.buildEncryptedRecord(
        record,
        [
          {
            address,
            publicKeyPem: patientPublicKey,
          },
          {
            address: MOCK_HOSPITAL_ADDRESS,
            publicKeyPem: hospitalPublicKey,
          },
          {
            address: insurerAddress,
            publicKeyPem: insurerPublicKey,
          },
        ],
      );

      // 5. Tải JSON đã mã hóa lên IPFS.
      const recordResult = await ipfsService.uploadJSON(
        encryptedRecord,
        `medical-record-${policy.tokenId}`,
      );

      // 6. Kiểm tra trước giao dịch, sau đó mới gửi giao dịch thật.
      const claimInput = {
        tokenId: policy.tokenId,
        amount: amountWei,
        billCID: billResult.cid,
        recordCID: recordResult.cid,
      };

      await submitClaim(claimInput, { dryRun: true, from: address });
      const result = await submitClaim(claimInput, { from: address });

      setTx({
        status: 'success',
        hash: result.hash,
        message: 'Gửi yêu cầu bồi thường thành công.',
      });

      setAmount('');
      setInvoice(null);

      const fileInput = document.getElementById('patient-invoice');
      if (fileInput) {
        fileInput.value = '';
      }

      if (onSubmitted) {
        await onSubmitted();
      }
    } catch (err) {
      setTx({
        status: 'error',
        hash: '',
        message: err.message || 'Không thể gửi yêu cầu bồi thường.',
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
            {typeof policy.remainingLimit === 'bigint' &&
            policy.remainingLimit >= 0n
              ? `${formatEther(policy.remainingLimit)} ETH`
              : 'Không xác định'}
          </p>

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
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Ví dụ: 0.003"
              required
            />
          </div>

          <div>
            <label htmlFor="patient-invoice">Hóa đơn viện phí</label>
            <input
              id="patient-invoice"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,image/*,application/pdf"
              onChange={(event) =>
                setInvoice(event.target.files?.[0] || null)
              }
              required
            />
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