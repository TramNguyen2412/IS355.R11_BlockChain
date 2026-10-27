import { formatEther } from 'ethers';

export function formatEth(value) {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value !== 'bigint') {
    throw new TypeError('formatEth yêu cầu giá trị wei kiểu bigint.');
  }

  return `${formatEther(value)} ETH`;
}

export function formatDate(value) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function shortAddress(address) {
  if (typeof address !== 'string' || address.length === 0) {
    return '—';
  }

  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}