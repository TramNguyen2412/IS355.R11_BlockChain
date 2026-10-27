import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BrowserProvider } from 'ethers';
import { toVietnameseError } from './errors.js';

const WalletContext = createContext(null);

const MOCK_WALLETS = [
  {
    role: 'ADMIN',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  },
  {
    role: 'HOSPITAL',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  },
  {
    role: 'PATIENT',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  },
  {
    role: 'OUTSIDER',
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  },
];

const EXPECTED_CHAIN_ID = Number(
  import.meta.env.VITE_CHAIN_ID ?? '31337',
);

const MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

const NETWORK_ERROR = 'Vui lòng chuyển MetaMask sang mạng Sepolia.';

export function WalletProvider({ children }) {
  const [mockRole, setMockRole] = useState('ADMIN');

  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);

  const syncWallet = useCallback(async (accountsOverride = null) => {
    if (!window.ethereum) {
      setAddress(null);
      setSigner(null);
      setProvider(null);
      setChainId(null);
      setError('Không tìm thấy MetaMask. Vui lòng cài đặt hoặc bật tiện ích.');
      return;
    }

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const network = await browserProvider.getNetwork();
      const currentChainId = Number(network.chainId);

      setProvider(browserProvider);
      setChainId(currentChainId);

      if (currentChainId !== EXPECTED_CHAIN_ID) {
        setAddress(null);
        setSigner(null);
        setError(NETWORK_ERROR);
        return;
      }

      const accounts = accountsOverride ?? await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (!accounts || accounts.length === 0) {
        setAddress(null);
        setSigner(null);
        setError(null);
        return;
      }

      const selectedAddress = accounts[0];
      const walletSigner = await browserProvider.getSigner(selectedAddress);

      setAddress(selectedAddress);
      setSigner(walletSigner);
      setError(null);
    } catch (err) {
      setAddress(null);
      setSigner(null);
      setError(toVietnameseError(err));
    }
  }, []);

  const connect = useCallback(async () => {
    if (MOCK_MODE) {
      setError(null);
      return;
    }

    if (!window.ethereum) {
      setError('Không tìm thấy MetaMask. Vui lòng cài đặt hoặc bật tiện ích.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      await syncWallet(accounts);
    } catch (err) {
      setError(toVietnameseError(err));
    }
  }, [syncWallet]);

  useEffect(() => {
    if (MOCK_MODE) {
      const selectedWallet = MOCK_WALLETS.find(
        (wallet) => wallet.role === mockRole,
      );

      setAddress(selectedWallet?.address ?? null);
      setSigner(null);
      setProvider(null);
      setChainId(EXPECTED_CHAIN_ID);
      setError(null);
      return undefined;
    }

    // Check an existing connection without opening the MetaMask prompt.
    void syncWallet();

    if (!window.ethereum?.on) {
      return undefined;
    }

    const handleAccountsChanged = (accounts) => {
      void syncWallet(accounts);
    };

    const handleChainChanged = () => {
      void syncWallet();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener?.(
        'accountsChanged',
        handleAccountsChanged,
      );
      window.ethereum.removeListener?.(
        'chainChanged',
        handleChainChanged,
      );
    };
  }, [mockRole, syncWallet]);

  const value = useMemo(
    () => ({
      address: MOCK_MODE
        ? MOCK_WALLETS.find((wallet) => wallet.role === mockRole)?.address ?? null
        : address,
      signer: MOCK_MODE ? null : signer,
      provider: MOCK_MODE ? null : provider,
      chainId,
      connect,
      error,
    }),
    [address, signer, provider, chainId, connect, error, mockRole],
  );

  return (
    <WalletContext.Provider value={value}>
      {MOCK_MODE && (
        <div className="wallet-mock-control">
          <label htmlFor="mock-wallet-select">
            Ví mô phỏng:
          </label>{' '}
          <select
            id="mock-wallet-select"
            value={mockRole}
            onChange={(event) => setMockRole(event.target.value)}
          >
            {MOCK_WALLETS.map((wallet) => (
              <option key={wallet.role} value={wallet.role}>
                {wallet.role}
              </option>
            ))}
          </select>
          <p>
            Địa chỉ hiện tại:{' '}
            {MOCK_WALLETS.find((wallet) => wallet.role === mockRole)?.address}
          </p>
        </div>
      )}

      {error && (
        <div className="wallet-error" role="alert">
          {error}
        </div>
      )}

      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWallet phải được sử dụng bên trong WalletProvider.');
  }

  return context;
}