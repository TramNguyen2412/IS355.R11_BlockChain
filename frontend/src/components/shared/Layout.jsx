
import { NavLink } from 'react-router-dom';
import { useWallet } from '../../app/WalletProvider.jsx';

function Layout({ children }) {
  const { address, connect } = useWallet();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>MediChain</h1>
          <p>Hệ thống quản lý bảo hiểm y tế phi tập trung</p>

          <div className="wallet-actions">
            {address ? (
              <span className="wallet-status">
                Đã kết nối: {address.slice(0, 6)}...
                {address.slice(-4)}
              </span>
            ) : (
              <button
                type="button"
                className="wallet-connect-button"
                onClick={() => void connect()}
              >
                Kết nối ví MetaMask
              </button>
            )}
          </div>
        </div>

        <nav className="main-nav" aria-label="Điều hướng chính">
          <NavLink to="/patient">Bệnh nhân</NavLink>
          <NavLink to="/hospital">Bệnh viện</NavLink>
          <NavLink to="/insurer">Công ty bảo hiểm</NavLink>
        </nav>
      </header>

      <main className="main-content">{children}</main>

      <footer className="app-footer">
        MediChain — IS355
      </footer>
    </div>
  );
}

export default Layout;
