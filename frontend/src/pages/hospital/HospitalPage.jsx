import { useState } from "react";
import KeySetup from "./KeySetup.jsx";
import VerifyCard from "./VerifyCard.jsx";
import "./hospital.css";

export default function HospitalPage() {
  const [verified, setVerified] = useState(null); // { patient, tokenId, remainingLimit, expiryDate } | null
  return (
    <div className="hospital-page">
      <h1>Bệnh viện</h1>
      <KeySetup />
      <VerifyCard onVerified={setVerified} />
      {verified && <p className="hospital-ok">Đã chọn bệnh nhân có thẻ #{String(verified.tokenId)}. (Form gửi yêu cầu bồi thường sẽ thêm ở chặng A11.)</p>}
    </div>
  );
}
