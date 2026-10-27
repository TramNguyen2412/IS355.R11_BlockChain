import { useState } from 'react';

function Address({ address }) {
  const [copied, setCopied] = useState(false);

  if (!address) {
    return <span>Chưa có địa chỉ</span>;
  }

  const shortenedAddress =
    address.length > 12
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span className="address">
      <code title={address}>{shortenedAddress}</code>
      <button type="button" onClick={handleCopy}>
        {copied ? 'Đã sao chép' : 'Sao chép'}
      </button>
    </span>
  );
}

export default Address;