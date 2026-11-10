import { useState } from "react";
import KeySetup from "./KeySetup.jsx";
import VerifyCard from "./VerifyCard.jsx";
import SubmitClaimForm from "./SubmitClaimForm.jsx";
import "./hospital.css";

export default function HospitalPage() {
  const [verified, setVerified] = useState(null);
  return (
    <div className="hospital-page">
      <h1>Bệnh viện</h1>
      <KeySetup />
      <VerifyCard onVerified={setVerified} />
      {verified ? (
        <SubmitClaimForm key={String(verified.tokenId)} verified={verified} />
      ) : (
        <p className="hospital-warn">Hãy kiểm tra thẻ bảo hiểm hợp lệ trước khi gửi yêu cầu bồi thường.</p>
      )}
    </div>
  );
}
