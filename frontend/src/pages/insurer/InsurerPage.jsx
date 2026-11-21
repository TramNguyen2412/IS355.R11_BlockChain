import { useEffect, useState } from "react";
import { useWallet } from "../../app/WalletProvider.jsx";
import * as contractService from "../../app/contractService.js";
import KeySetup from "./KeySetup.jsx";
import PlansAdmin from "./PlansAdmin.jsx";
import HospitalAdmin from "./HospitalAdmin.jsx";
import FundPanel from "./FundPanel.jsx";
import ClaimsTable from "./ClaimsTable.jsx";
import Monitor from "./Monitor.jsx";
import "./insurer.css";

export default function InsurerPage() {
  const { address } = useWallet();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (!address) { setAllowed(null); return; }
    setAllowed(null);
    contractService
      .getRoles(address)
      .then((r) => setAllowed(r.isInsurer))
      .catch(() => setAllowed(false));
  }, [address]);

  if (!address) {
    return (
      <div className="insurer-page">
        <h1>Công ty bảo hiểm</h1>
        <p className="insurer-warn">
          ⚠️ Hãy bấm nút <strong>"Kết nối ví MetaMask"</strong> ở góc trên trang web trước để bắt đầu.
        </p>
      </div>
    );
  }
  if (allowed === null) {
    return (
      <div className="insurer-page">
        <h1>Công ty bảo hiểm</h1>
        <p className="insurer-muted">Đang kiểm tra quyền...</p>
      </div>
    );
  }
  if (!allowed) {
    return (
      <div className="insurer-page">
        <h1>Công ty bảo hiểm</h1>
        <section className="insurer-card">
          <p className="insurer-bad">⛔ Ví của bạn không có quyền truy cập trang này. Hãy dùng ví công ty bảo hiểm (Admin).</p>
        </section>
      </div>
    );
  }

  return (
    <div className="insurer-page">
      <h1>Công ty bảo hiểm</h1>
      <KeySetup />
      <PlansAdmin />
      <HospitalAdmin />
      <FundPanel />
      <ClaimsTable />
      <Monitor />
    </div>
  );
}
