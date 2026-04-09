// Waiting screen — spinning animation, shows while group completes, auto-navigates after 3s

import { useEffect } from "react";
import { formatFull, installment, PRIORITIES } from "../data/data";
import { COLORS, GRADIENTS } from "../styles/colors";

const spinnerStyle = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
`;

export default function WaitScreen({ amount, priority, userType, onBack, onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3000);
    return () => clearTimeout(t);
  }, []);

  const inst = installment(amount);
  const priorityLabel = PRIORITIES[priority]?.label || "قرعة عادية";

  const infoRows = [
    { label: "مبلغ السلفة", value: formatFull(amount) },
    { label: "القسط الشهري", value: formatFull(inst) },
    { label: "الأولوية",    value: priorityLabel },
    { label: "نوع المستخدم", value: userType === "employee" ? "موظف" : "غير موظف" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.background,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 18px",
      textAlign: "center",
    }}>
      <style>{spinnerStyle}</style>

      {/* Spinning ring */}
      <div style={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        border: `4px solid ${COLORS.border}`,
        borderTop: `4px solid ${COLORS.goldMid}`,
        animation: "spin 1.2s linear infinite",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,
        position: "relative",
      }}>
        <span style={{ fontSize: 36, animation: "none" }}>⏳</span>
      </div>

      <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.textPrimary, marginBottom: 10 }}>
        طلبك قيد المعالجة
      </div>
      <div style={{ fontSize: 14, color: COLORS.textSecondary, maxWidth: 280, lineHeight: 1.7, marginBottom: 28 }}>
        نقوم الآن بمعالجة طلبك وإتمام تجميع المجموعة. ستُعلَم فور اكتمال العملية.
      </div>

      {/* Info card */}
      <div style={{
        width: "100%",
        background: COLORS.cardBg,
        borderRadius: 20,
        padding: 18,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 24,
        textAlign: "right",
      }}>
        {infoRows.map((row) => (
          <div key={row.label} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <div style={{ fontSize: 13, color: COLORS.textSecondary }}>{row.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>{row.value}</div>
          </div>
        ))}
      </div>

      {/* Ghost back button */}
      <button
        onClick={onBack}
        style={{
          background: "transparent",
          border: `1.5px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: "12px 32px",
          fontSize: 14,
          fontWeight: 600,
          color: COLORS.textSecondary,
          fontFamily: "Cairo, sans-serif",
          cursor: "pointer",
        }}
      >
        العودة إلى الرئيسية
      </button>
    </div>
  );
}
