// Main home screen: greeting, salary hero card, list of 10 salfa amounts

import SalfaCard from "../components/SalfaCard";
import { AMOUNTS, formatFull, isLocked } from "../data/data";
import { COLORS, GRADIENTS } from "../styles/colors";

export default function HomeScreen({
  user, userType, onToggleType,
  waiting, mySalfas,
  onSelectAmount,
}) {
  const activeSalfaAmounts = mySalfas.map((s) => s.amount);
  const waitingAmounts = Object.keys(waiting).map(Number);

  return (
    <div style={{ padding: "24px 18px 100px" }}>
      {/* Greeting */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: COLORS.textSecondary }}>مرحباً بك،</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.textPrimary }}>
          {user.name}
        </div>
      </div>

      {/* Hero card */}
      <div style={{
        background: COLORS.darkSurface,
        borderRadius: 24,
        padding: "22px 20px",
        marginBottom: 28,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: GRADIENTS.heroGlow,
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, color: COLORS.textHint, marginBottom: 4 }}>
            راتبك الشهري
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 900,
            background: GRADIENTS.button,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {formatFull(user.salary)}
          </div>

          {/* Type toggle chips */}
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            {["employee", "non-employee"].map((t) => (
              <button
                key={t}
                onClick={() => onToggleType(t)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 12,
                  border: "none",
                  background: userType === t
                    ? GRADIENTS.button
                    : "rgba(255,255,255,0.08)",
                  color: userType === t ? COLORS.darkSurface : COLORS.textHint,
                  fontWeight: 700,
                  fontSize: 13,
                  fontFamily: "Cairo, sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {t === "employee" ? "موظف" : "غير موظف"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section label */}
      <div style={{
        fontSize: 15,
        fontWeight: 700,
        color: COLORS.textPrimary,
        marginBottom: 12,
      }}>
        اختر مبلغ السلفة
      </div>

      {/* Amount cards list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {AMOUNTS.map((amount) => (
          <SalfaCard
            key={amount}
            amount={amount}
            isLocked={isLocked(amount, user.salary)}
            isWaiting={waitingAmounts.includes(amount)}
            isActive={activeSalfaAmounts.includes(amount)}
            onClick={() => onSelectAmount(amount)}
          />
        ))}
      </div>
    </div>
  );
}
