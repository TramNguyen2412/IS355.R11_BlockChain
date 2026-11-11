import { useEffect, useState } from 'react';
import { formatEth } from '../../app/format';
import { ipfsService } from '../../services/index.js';

function PlanList({ plans = [] }) {
  const [documentUrls, setDocumentUrls] = useState({});

  useEffect(() => {
    const urls = {};

    for (const plan of plans) {
      if (plan.policyDocCID) {
        urls[plan.id] = ipfsService.gatewayUrl(plan.policyDocCID);
      }
    }

    setDocumentUrls(urls);
  }, [plans]);

  if (plans.length === 0) {
    return <p>Hiện chưa có gói bảo hiểm nào.</p>;
  }

  return (
    <div className="patient-plan-list">
      {plans.map((plan) => (
        <article
          key={plan.id}
          className="patient-plan-card"
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <h4>{plan.name}</h4>

          <p>
            <strong>Mã gói:</strong> {plan.id}
          </p>

          <p>
            <strong>Phí bảo hiểm:</strong> {formatEth(plan.price)}
          </p>

          <p>
            <strong>Hạn mức bảo hiểm:</strong>{' '}
            {formatEth(plan.coverageLimit)}
          </p>

          <p>
            <strong>Thời hạn:</strong> {plan.durationDays} ngày
          </p>

          <p>
            <strong>Trạng thái:</strong>{' '}
            {plan.active ? 'Đang mở bán' : 'Ngừng bán'}
          </p>

          {documentUrls[plan.id] && (
            <a
              href={documentUrls[plan.id]}
              target="_blank"
              rel="noreferrer"
            >
              Xem PDF điều khoản bảo hiểm
            </a>
          )}
        </article>
      ))}
    </div>
  );
}

export default PlanList;