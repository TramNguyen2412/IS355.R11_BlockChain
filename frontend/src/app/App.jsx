import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/shared/Layout.jsx';
import Loading from '../components/shared/Loading.jsx';
import ErrorBox from '../components/shared/ErrorBox.jsx';
import { WalletProvider } from './WalletProvider.jsx';

const PatientPage = lazy(() => import('../pages/patient/PatientPage.jsx'));
const HospitalPage = lazy(() => import('../pages/hospital/HospitalPage.jsx'));
const InsurerPage = lazy(() => import('../pages/insurer/InsurerPage.jsx'));

function PageFallback() {
  return <Loading message="Đang tải trang..." />;
}

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;