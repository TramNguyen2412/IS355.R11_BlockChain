import { useWallet } from '../../app/WalletProvider';

function TxToast({ status, hash, message }) {
  const { chainId } = useWallet();

  if (!status) return null;

  const messages = {
    processing: 'Giao dịch đang được xử lý...',
    success: 'Giao dịch đã thành công.',
    error: 'Giao dịch thất bại.',
  };

  const knownStatus = Object.hasOwn(messages, status);

  const isSepolia = chainId === 11155111;

  const etherscanUrl =
    isSepolia && hash
      ? `https://sepolia.etherscan.io/tx/${hash}`
      : null;

  return (
    <div
      className={`tx-toast tx-toast--${knownStatus ? status : 'error'}`}
      role={status === 'error' || !knownStatus ? 'alert' : 'status'}
      aria-live="polite"
    >
      <p>
        {message || messages[status] || 'Trạng thái giao dịch không hợp lệ.'}
      </p>

      {status === 'success' && hash && (
        <div>
          <p>
            Mã giao dịch: <code>{hash}</code>
          </p>

          {etherscanUrl && (
            <p>
              <a
                href={etherscanUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem giao dịch trên Etherscan
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default TxToast;