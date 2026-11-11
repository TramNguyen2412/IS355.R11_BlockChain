import { formatDate, formatEth } from '../../app/format';

function PolicyCard({ policy, plans = [] }) {
  if (!policy) {
    return <p>Bạn chưa có thẻ bảo hiểm. Hãy chọn gói và thực hiện mua bảo hiểm.</p>;
  }

  const plan = plans.find(
    (item) => Number(item.id) === Number(policy.planId),
  );

  const now = Math.floor(Date.now() / 1000);
  const isWithinValidity =
    now >= Number(policy.startDate) &&
    now <= Number(policy.expiryDate);

  const isActive = Boolean(plan?.active) && isWithinValidity;

  return (
    <article
      className="patient-policy-card"
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: 10,
        padding: 18,
        maxWidth: 600,
      }}
    >
      <h4>Health Insurance Card</h4>

      <p>
        <strong>NFT Token ID:</strong> #{policy.tokenId}
      </p>

      <p>
        <strong>Gói bảo hiểm:</strong> {plan?.name || `Gói #${policy.planId}`}
      </p>

      <p>
        <strong>Chủ sở hữu:</strong> {policy.holder}
      </p>

      <p>
        <strong>Hạn mức ban đầu:</strong> {formatEth(policy.coverageLimit)}
      </p>

      <p>
        <strong>Đã sử dụng:</strong> {formatEth(policy.usedAmount)}
      </p>

      <p>
        <strong>Hạn mức còn lại:</strong>{' '}
        <strong>{formatEth(policy.remainingLimit)}</strong>
      </p>

      <p>
        <strong>Ngày bắt đầu:</strong>{' '}
        {formatDate(Number(policy.startDate) * 1000)}
      </p>

      <p>
        <strong>Ngày hết hạn:</strong>{' '}
        {formatDate(Number(policy.expiryDate) * 1000)}
      </p>

      <p>
        <strong>Trạng thái:</strong>{' '}
        <span
          style={{
            color: isActive ? '#15803d' : '#b91c1c',
            fontWeight: 700,
          }}
        >
          {isActive ? 'Còn hiệu lực' : 'Không còn hiệu lực'}
        </span>
      </p>
    </article>
  );
}

export default PolicyCard;