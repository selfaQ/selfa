// Salfa detail screen: amount info, priority picker, kafeel form, and join button

import { useState } from "react";
import PriorityPicker from "../components/PriorityPicker";
import KafeelForm from "../components/KafeelForm";
import { formatFull, formatShort, installment, PRIORITIES } from "../data/data";
import { COLORS, GRADIENTS } from "../styles/colors";

export default function DetailScreen({
  amount, userType, selectedPriority, onSelectPriority,
  isWaiting, isActive, onJoin, onBack, salary,
}) {
  const [kafeelConfirmed, setKafeelConfirmed] = useState(false);

  const inst = installment(amount);
  const salaryRatio = ((inst / salary) * 100).toFixed(0);
  const ratioColor = salaryRatio <= 25 ? COLORS.success
    : salaryRatio <= 40 ? "#E67E22"
    : COLORS.error;

  const priorityFee = PRIORITIES[selectedPriority]?.fee || 0;

  const canJoin = !isWaiting && !isActive
    && !(userType === "non-employee" && !kafeelConfirmed);

  const terms = [
    "يتم خصم القسط الشهري تلقائياً من الراتب",
    "مدة السلفة 10 أشهر ثابتة",
    "لا يمكن الانسحاب بعد اكتمال المجموعة",
    "الأولوية تُحدد وقت التسجيل",
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.background }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "20px 18px 12px",
        background: COLORS.white,
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <button
          onClick={onBack}
          style={{
            background: COLORS.background,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            width: 38,
            height: 38,
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ‹
        </button>
        <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.textPrimary }}>
          تفاصيل السلفة
        </div>
      </div>

      <div style={{ padding: "18px 18px 120px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Hero amount */}
        <div style={{
          background: COLORS.darkSurface,
          borderRadius: 24,
          padding: "24px 20px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: GRADIENTS.heroGlow,
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 12, color: COLORS.textHint, marginBottom: 6 }}>
              مبلغ السلفة
            </div>
            <div style={{
              fontSize: 36,
              fontWeight: 900,
              background: GRADIENTS.button,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.1,
            }}>
              {formatFull(amount)}
            </div>
            <span style={{
              display: "inline-block",
              marginTop: 10,
              background: "rgba(200,120,58,0.15)",
              color: COLORS.goldBright,
              borderRadius: 8,
              padding: "3px 10px",
              fontSize: 12,
              fontWeight: 600,
            }}>
              خط دائم
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}>
          {[
            {
              label: "القسط الشهري",
              value: formatFull(inst),
              color: COLORS.goldMid,
            },
            {
              label: "نسبة من الراتب",
              value: salaryRatio + "%",
              color: ratioColor,
            },
            {
              label: "مدة السداد",
              value: "10 أشهر",
              color: COLORS.textPrimary,
            },
            {
              label: "طريقة الدفع",
              value: "تلقائي ✓",
              color: COLORS.success,
            },
          ].map((item) => (
            <div key={item.label} style={{
              background: COLORS.cardBg,
              borderRadius: 16,
              padding: "14px 14px",
              border: `1px solid ${COLORS.border}`,
            }}>
              <div style={{ fontSize: 11, color: COLORS.textHint, marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Priority picker — hidden if waiting/active */}
        {!isWaiting && !isActive && (
          <div style={{
            background: COLORS.cardBg,
            borderRadius: 20,
            padding: 16,
            border: `1px solid ${COLORS.border}`,
          }}>
            <PriorityPicker
              selected={selectedPriority}
              onSelect={onSelectPriority}
            />
          </div>
        )}

        {/* Kafeel form — non-employee only, not waiting/active */}
        {userType === "non-employee" && !isWaiting && !isActive && (
          <KafeelForm onConfirm={() => setKafeelConfirmed(true)} />
        )}

        {/* Status banner */}
        {(isWaiting || isActive) && (
          <div style={{
            background: isActive ? "rgba(30,122,74,0.08)" : "rgba(26,94,173,0.08)",
            border: `1px solid ${isActive ? COLORS.success : COLORS.info}`,
            borderRadius: 14,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: isActive ? COLORS.success : COLORS.info,
            fontWeight: 600,
            fontSize: 14,
          }}>
            <span style={{ fontSize: 20 }}>{isActive ? "✓" : "⏳"}</span>
            {isActive ? "هذه السلفة نشطة حالياً" : "طلبك قيد الانتظار"}
          </div>
        )}

        {/* Terms */}
        <div style={{
          background: COLORS.cardBg,
          borderRadius: 20,
          padding: 16,
          border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 10 }}>
            الشروط والأحكام
          </div>
          {terms.map((t) => (
            <div key={t} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              marginBottom: 8,
              fontSize: 13,
              color: COLORS.textSecondary,
            }}>
              <span style={{ color: COLORS.success, fontSize: 14, marginTop: 1 }}>✓</span>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed join button */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        padding: "14px 18px 24px",
        background: COLORS.background,
        borderTop: `1px solid ${COLORS.border}`,
        zIndex: 50,
      }}>
        {priorityFee > 0 && !isWaiting && !isActive && (
          <div style={{
            textAlign: "center",
            fontSize: 12,
            color: COLORS.textHint,
            marginBottom: 8,
          }}>
            رسوم الحجز: {priorityFee.toLocaleString("ar-IQ")} د.ع
          </div>
        )}
        <button
          disabled={!canJoin}
          onClick={onJoin}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 16,
            border: "none",
            background: canJoin ? GRADIENTS.button : COLORS.border,
            color: canJoin ? COLORS.darkSurface : COLORS.textHint,
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "Cairo, sans-serif",
            cursor: canJoin ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          {isActive ? "السلفة نشطة" : isWaiting ? "في قائمة الانتظار" : "انضم الآن"}
        </button>
      </div>
    </div>
  );
}
