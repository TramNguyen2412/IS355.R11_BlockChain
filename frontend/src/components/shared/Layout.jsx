import { NavLink } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>MediChain</h1>
          <p>Hệ thống quản lý bảo hiểm y tế phi tập trung</p>
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