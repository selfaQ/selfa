// Guarantor (kafeel) form for non-employee users — phone + confirmation flow

import { useState } from "react";
import { COLORS, GRADIENTS } from "../styles/colors";

export default function KafeelForm({ onConfirm }) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle | pending | confirmed

  const handleSend = () => {
    if (!phone || phone.length < 7) return;
    setStatus("pending");
    setTimeout(() => {
      setStatus("confirmed");
      onConfirm();
    }, 2000);
  };

  return (
    <div style={{
      background: COLORS.cardBg,
      borderRadius: 20,
      padding: 18,
      border: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 6 }}>
        بيانات الكفيل
      </div>
      <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 14 }}>
        بما أنك غير موظف، يُرجى إدخال رقم هاتف الكفيل لإتمام الطلب.
      </div>

      {status === "confirmed" ? (
        <div style={{
          background: "rgba(30,122,74,0.1)",
          border: `1px solid ${COLORS.success}`,
          borderRadius: 12,
          padding: "12px 16px",
          color: COLORS.success,
          fontWeight: 600,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>✓</span>
          تم تأكيد الكفيل بنجاح
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="tel"
            placeholder="07XX XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={status === "pending"}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              border: `1.5px solid ${COLORS.border}`,
              fontSize: 15,
              fontFamily: "Cairo, sans-serif",
              direction: "ltr",
              textAlign: "right",
              outline: "none",
              background: status === "pending" ? "#f5f5f5" : "#fff",
            }}
          />
          <button
            onClick={handleSend}
            disabled={status === "pending" || !phone}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              border: "none",
              background: status === "pending" ? COLORS.border : GRADIENTS.button,
              color: status === "pending" ? COLORS.textHint : COLORS.darkSurface,
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "Cairo, sans-serif",
              cursor: status === "pending" ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {status === "pending" ? "جاري..." : "إرسال"}
          </button>
        </div>
      )}
    </div>
  );
}
