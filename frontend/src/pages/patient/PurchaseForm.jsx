import { useState } from 'react';
import { useWallet } from '../../app/WalletProvider';
import {
  getEncryptionKey,
  getInsurerAddress,
  getPolicyOf,
  purchasePolicy,
} from '../../app/contractService';
import { cryptoService } from '../../services/index.js';
import { formatEth } from '../../app/format';
import TxToast from '../../components/shared/TxToast';

function PurchaseForm({ plans = [], onPurchased }) {
  const { address } = useWallet();

  const [planId, setPlanId] = useState('');
  const [healthId, setHealthId] = useState('');
  const [busy, setBusy] = useState(false);
  const [tx, setTx] = useState({
    status: '',
    hash: '',
    message: '',
  });

  const availablePlans = plans.filter((plan) => plan.active);
  const selectedPlan = availablePlans.find(
    (plan) => String(plan.id) === String(planId),
  );

  async function handlePurchase(event) {
    event.preventDefault();

    if (!address) {
      setTx({
        status: 'error',
        hash: '',
        message: 'Vui lòng chọn ví bệnh nhân trước.',
      });
      return;
    }

    if (!selectedPlan) {
      setTx({
        status: 'error',
        hash: '',
        message: 'Vui lòng chọn gói bảo hiểm.',
      });
      return;
    }

    if (!healthId.trim()) {
      setTx({
        status: 'error',
        hash: '',
        message: 'Vui lòng nhập mã số bảo hiểm.',
      });
      return;
    }

    setBusy(true);
    setTx({
      status: 'processing',
      hash: '',
      message: 'Đang mã hóa mã số bảo hiểm và kiểm tra giao dịch...',
    });

    try {
      const insurerAddress = await getInsurerAddress();
      const insurerPublicKey = await getEncryptionKey(insurerAddress);

      if (!insurerPublicKey) {
        throw new Error('Cong ty bao hiem chua dang ky khoa ma hoa');
      }

      const encryptedHealthId = await cryptoService.rsaEncrypt(
        insurerPublicKey,
        healthId.trim(),
      );

      await purchasePolicy(
        selectedPlan.id,
        encryptedHealthId,
        selectedPlan.price,
        { dryRun: true, from: address },
      );

      const result = await purchasePolicy(
        selectedPlan.id,
        encryptedHealthId,
        selectedPlan.price,
        { from: address }
      );

      const purchasedPolicy = await getPolicyOf(address);

      setTx({
        status: 'success',
        hash: result.hash,
        message: purchasedPolicy?.tokenId != null
          ? `Mua gói bảo hiểm thành công. Token ID: ${purchasedPolicy.tokenId}`
          : 'Mua gói bảo hiểm thành công nhưng chưa lấy được Token ID.',
      });

      /*setTx({
        status: 'success',
        hash: result.hash,
        message: 'Mua gói bảo hiểm thành công.',
      });*/

      setHealthId('');

      if (onPurchased) {
        await onPurchased();
      }
    } catch (err) {
      setTx({
        status: 'error',
        hash: '',
        message: err.message || 'Không thể mua gói bảo hiểm.',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handlePurchase} className="patient-purchase-form">
      <div>
        <label htmlFor="patient-plan">Chọn gói bảo hiểm</label>
        <select
          id="patient-plan"
          value={planId}
          onChange={(event) => setPlanId(event.target.value)}
          required
        >
          <option value="">-- Chọn gói --</option>
          {availablePlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} - {formatEth(plan.price)}
            </option>
          ))}
        </select>
      </div>

      {selectedPlan && (
        <p>
          Phí cần thanh toán: <strong>{formatEth(selectedPlan.price)}</strong>
        </p>
      )}

      <div>
        <label htmlFor="patient-health-id">Mã số bảo hiểm y tế</label>
        <input
          id="patient-health-id"
          type="text"
          value={healthId}
          onChange={(event) => setHealthId(event.target.value)}
          placeholder="Nhập mã số bảo hiểm"
          maxLength={190}
          required
        />
      </div>

      <button type="submit" disabled={busy || !availablePlans.length}>
        {busy ? 'Đang xử lý...' : 'Mua gói bảo hiểm'}
      </button>

      <TxToast
        status={tx.status}
        hash={tx.hash}
        message={tx.message}
      />
    </form>
  );
}

export default PurchaseForm;