// Single salfa amount selection card with status badge

import { useState } from "react";
import { formatShort, formatFull, installment } from "../data/data";
import { COLORS, GRADIENTS } from "../styles/colors";

export default function SalfaCard({ amount, isLocked, isWaiting, isActive, onClick }) {
  const [pressed, setPressed] = useState(false);

  const inst = installment(amount);

  const getBadge = () => {
    if (isLocked)   return { label: "غير متاح", bg: COLORS.textHint,  color: "#fff" };
    if (isActive)   return { label: "نشطة ✓",   bg: COLORS.success,   color: "#fff" };
    if (isWaiting)  return { label: "انتظار",    bg: COLORS.info,      color: "#fff" };
    return null;
  };

  const badge = getBadge();

  const cardStyle = {
    background: COLORS.cardBg,
    borderRadius: 20,
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: isLocked ? "not-allowed" : "pointer",
    opacity: isLocked ? 0.3 : 1,
    transform: pressed && !isLocked ? "scale(0.99)" : "scale(1)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    boxShadow: pressed && !isLocked
      ? "0 2px 8px rgba(200,120,58,0.15)"
      : "0 1px 4px rgba(0,0,0,0.06)",
    borderRight: isActive || isWaiting
      ? `4px solid ${isActive ? COLORS.success : COLORS.info}`
      : "4px solid transparent",
    position: "relative",
    overflow: "hidden",
  };

  const accentLine = {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    background: GRADIENTS.cardAccent,
    opacity: isActive || isWaiting ? 0 : pressed ? 1 : 0,
    transition: "opacity 0.15s ease",
  };

  return (
    <div
      style={cardStyle}
      onClick={() => !isLocked && onClick && onClick()}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      <div style={accentLine} />

      {/* Right side: amount + subtitle */}
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.textPrimary }}>
          {formatShort(amount)} <span style={{ fontSize: 14, fontWeight: 400, color: COLORS.textSecondary }}>د.ع</span>
        </div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 3 }}>
          قسط {formatShort(inst)} د.ع &middot; 10 أشهر
        </div>
      </div>

      {/* Left side: badge or arrow */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {badge ? (
          <span style={{
            background: badge.bg,
            color: badge.color,
            borderRadius: 12,
            padding: "4px 12px",
            fontSize: 12,
            fontWeight: 600,
          }}>
            {badge.label}
          </span>
        ) : (
          <span style={{ fontSize: 22, color: COLORS.textHint, lineHeight: 1 }}>›</span>
        )}
      </div>
    </div>
  );
}
