
import { lazy, Suspense, useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import Layout from '../components/shared/Layout.jsx';
import Loading from '../components/shared/Loading.jsx';
import ErrorBox from '../components/shared/ErrorBox.jsx';
import { WalletProvider, useWallet } from './WalletProvider.jsx';
import { detectRole } from './roleDetection.js';

const PatientPage = lazy(() => import('../pages/patient/PatientPage.jsx'));
const HospitalPage = lazy(() => import('../pages/hospital/HospitalPage.jsx'));
const InsurerPage = lazy(() => import('../pages/insurer/InsurerPage.jsx'));

function PageFallback() {
  return <Loading message="Đang tải trang..." />;
}

function RoleRedirect() {
  const { address } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function redirectForRole() {
      if (!address) return;

      try {
        const role = await detectRole(address);

        if (cancelled) return;

        const routeByRole = {
          insurer: '/insurer',
          hospital: '/hospital',
          patient: '/patient',
        };

        navigate(routeByRole[role] ?? '/patient', { replace: true });
      } catch {
        // Dịch vụ hợp đồng thật chưa được triển khai:
        // giữ nguyên trang hiện tại.
      }
    }

    void redirectForRole();

    return () => {
      cancelled = true;
    };
  }, [address, navigate]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <RoleRedirect />

      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/patient" replace />} />
            <Route path="/patient" element={<PatientPage />} />
            <Route path="/hospital" element={<HospitalPage />} />
            <Route path="/insurer" element={<InsurerPage />} />
            <Route
              path="*"
              element={<ErrorBox message="Không tìm thấy trang yêu cầu." />}
            />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
