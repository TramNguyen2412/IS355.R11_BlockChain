import { formatDate, formatEth } from '../../app/format';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Đang chờ xử lý',
    color: '#b45309',
    background: '#fef3c7',
  },
  APPROVED: {
    label: 'Đã duyệt',
    color: '#15803d',
    background: '#dcfce7',
  },
  REJECTED: {
    label: 'Đã từ chối',
    color: '#b91c1c',
    background: '#fee2e2',
  },
};

function ClaimList({ claims = [] }) {
  if (claims.length === 0) {
    return <p>Chưa có yêu cầu bồi thường nào.</p>;
  }

  return (
    <div className="patient-claim-list">
      {claims.map((claim) => {
        const status = STATUS_CONFIG[claim.statusLabel] ||
          STATUS_CONFIG.PENDING;

        return (
          <article
            key={claim.claimId}
            className="patient-claim-card"
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '5px 10px',
                borderRadius: 6,
                color: status.color,
                backgroundColor: status.background,
                fontWeight: 700,
              }}
            >
              {status.label}
            </div>

            <h4>Yêu cầu #{claim.claimId}</h4>

            <p>
              <strong>NFT Token ID:</strong> #{claim.tokenId}
            </p>

            <p>
              <strong>Số tiền yêu cầu:</strong> {formatEth(claim.amount)}
            </p>

            <p>
              <strong>Số tiền bệnh viện xác nhận:</strong>{' '}
              {formatEth(claim.confirmedAmount)}
            </p>

            <p>
              <strong>Thời gian gửi:</strong>{' '}
              {formatDate(Number(claim.createdAt) * 1000)}
            </p>

            <p>
              <strong>Bill CID:</strong>{' '}
              <code>{claim.billCID}</code>
            </p>

            <p>
              <strong>Record CID:</strong>{' '}
              <code>{claim.recordCID}</code>
            </p>
          </article>
        );
      })}
    </div>
  );
}

export default ClaimList;