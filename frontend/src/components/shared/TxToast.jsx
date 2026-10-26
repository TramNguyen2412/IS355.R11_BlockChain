function TxToast({ status, hash, message }) {
  if (!status) return null;

  const messages = {
    processing: 'Giao dịch đang được xử lý...',
    success: 'Giao dịch đã thành công.',
    error: 'Giao dịch thất bại.',
  };

  const knownStatus = Object.hasOwn(messages, status);

  return (
    <div
      className={`tx-toast tx-toast--${knownStatus ? status : 'error'}`}
      role={status === 'error' || !knownStatus ? 'alert' : 'status'}
      aria-live="polite"
    >
      <p>{message || messages[status] || 'Trạng thái giao dịch không hợp lệ.'}</p>

      {status === 'success' && hash && (
        <p>
          Mã giao dịch: <code>{hash}</code>
        </p>
      )}
    </div>
  );
}

export default TxToast;