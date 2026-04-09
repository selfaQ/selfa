// Lottery result notification — shows winner month and celebration or standard result

import { useState } from "react";
import { formatFull, installment, MONTHS, PRIORITIES } from "../data/data";
import { COLORS, GRADIENTS } from "../styles/colors";

export default function NotifScreen({ amount, priority, onGoToMySalfa }) {
  const [winnerMonth] = useState(() => Math.floor(Math.random() * 10) + 1);

  const isWinner = winnerMonth <= 3;
  const inst = installment(amount);
  const priorityLabel = PRIORITIES[priority]?.label || "قرعة عادية";
  const monthName = MONTHS[winnerMonth - 1] || `الشهر ${winnerMonth}`;

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
      {/* Icon */}
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 28,
        background: isWinner
          ? "linear-gradient(135deg, #1E7A4A, #2ECC71)"
          : GRADIENTS.button,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
        marginBottom: 24,
        boxShadow: isWinner
          ? "0 8px 30px rgba(30,122,74,0.3)"
          : "0 8px 30px rgba(200,120,58,0.3)",
      }}>
        {isWinner ? "🎉" : "🎲"}
      </div>

      {/* Title */}
      <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.textPrimary, marginBottom: 8 }}>
        {isWinner ? "مبروك! فزت 🏆" : "اكتملت المجموعة"}
      </div>
      <div style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 32, lineHeight: 1.7 }}>
        {isWinner
          ? `ستستلم مبلغ السلفة في شهر ${monthName}`
          : `تم تحديد موعد استلامك في شهر ${monthName}`}
      </div>

      {/* Details card */}
      <div style={{
        width: "100%",
        background: COLORS.cardBg,
        borderRadius: 20,
        padding: 20,
        border: `1px solid ${COLORS.border}`,
        marginBottom: 28,
        textAlign: "right",
      }}>
        {[
          { label: "مبلغ السلفة",      value: formatFull(amount),  color: COLORS.goldMid },
          { label: "ستستلم",           value: formatFull(amount),  color: COLORS.success },
          { label: "شهر الاستلام",     value: `${monthName} (الشهر ${winnerMonth})`, color: COLORS.info },
          { label: "القسط الشهري",     value: formatFull(inst),    color: COLORS.textPrimary },
          { label: "أولوية التسجيل",   value: priorityLabel,       color: COLORS.textPrimary },
        ].map((row) => (
          <div key={row.label} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <div style={{ fontSize: 13, color: COLORS.textSecondary }}>{row.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: row.color }}>{row.value}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onGoToMySalfa}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: 16,
          border: "none",
          background: GRADIENTS.button,
          color: COLORS.darkSurface,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "Cairo, sans-serif",
          cursor: "pointer",
        }}
      >
        عرض سلفاتي
      </button>
    </div>
  );
}
