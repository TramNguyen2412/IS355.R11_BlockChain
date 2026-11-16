import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '../../app/WalletProvider';
import {
  getClaimsByPatient,
  getPlans,
  getPolicyOf,
} from '../../app/contractService';
import KeySetup from './KeySetup';
import PlanList from './PlanList';
import PurchaseForm from './PurchaseForm';
import PolicyCard from './PolicyCard';
import ClaimForm from './ClaimForm';
import ClaimList from './ClaimList';
import RecordViewer from './RecordViewer';
import './patient.css';

function PatientPage() {
  const { address } = useWallet();

  const [plans, setPlans] = useState([]);
  const [policy, setPolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshData = useCallback(async () => {
    if (!address) {
      setPlans([]);
      setPolicy(null);
      setClaims([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [planData, policyData, claimData] = await Promise.all([
        getPlans(),
        getPolicyOf(address),
        getClaimsByPatient(address),
      ]);

      setPlans(planData);
      setPolicy(policyData);
      setClaims(claimData);
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu bệnh nhân.');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  return (
    <main className="patient-page">
      <header>
        <h2>Khu vực bệnh nhân</h2>
        <p>Quản lý khóa mã hóa, gói bảo hiểm, thẻ NFT và yêu cầu bồi thường.</p>
        <p>
          <strong>Địa chỉ ví:</strong> {address || 'Chưa kết nối ví'}
        </p>
      </header>

      {error && (
        <p role="alert" className="patient-error">
          {error}
        </p>
      )}

      <section>
        <h3>1. Khóa mã hóa cá nhân</h3>
        <KeySetup />
      </section>

      <section>
        <h3>2. Danh sách gói bảo hiểm</h3>
        <PlanList plans={plans} onRefresh={refreshData} />
      </section>

      <section>
        <h3>3. Mua gói bảo hiểm</h3>
        <PurchaseForm plans={plans} onPurchased={refreshData} />
      </section>

      <section>
        <h3>4. Thẻ bảo hiểm NFT</h3>
        {loading ? (
          <p>Đang tải thông tin thẻ bảo hiểm...</p>
        ) : (
          <PolicyCard policy={policy} plans={plans} />
        )}
      </section>

      <section>
        <h3>5. Gửi yêu cầu bồi thường</h3>
        <ClaimForm policy={policy} onSubmitted={refreshData} />
      </section>

      <section>
        <h3>6. Lịch sử yêu cầu bồi thường</h3>
        {loading ? (
          <p>Đang tải danh sách yêu cầu...</p>
        ) : (
          <ClaimList claims={claims} />
        )}
      </section>

      <section>
        <h3>7. Xem hồ sơ y tế đã mã hóa</h3>
        <RecordViewer claims={claims} />
      </section>
    </main>
  );
}

export default PatientPage;