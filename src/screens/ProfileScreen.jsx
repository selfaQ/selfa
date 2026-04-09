// User profile screen — avatar, stats, and settings menu

import { COLORS, GRADIENTS } from "../styles/colors";

const MENU_ITEMS = [
  { icon: "💼", label: "جهة العمل",       sub: "وزارة الداخلية" },
  { icon: "🏦", label: "المصرف",          sub: "مصرف الرافدين" },
  { icon: "📅", label: "الأقساط",          sub: "عرض تفاصيل الأقساط" },
  { icon: "🔔", label: "الإشعارات",       sub: "تفعيل الإشعارات" },
  { icon: "🚪", label: "تسجيل الخروج",    sub: "", isRed: true },
];

function getInitials(name) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : parts[0][0];
}

export default function ProfileScreen({ user, mySalfas }) {
  const initials = getInitials(user.name);
  const totalPaid = mySalfas.reduce((sum, s) => sum + s.paid.length, 0);

  return (
    <div style={{ padding: "24px 18px 100px" }}>
      {/* Avatar + name */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
        <div style={{
          width: 86,
          height: 86,
          borderRadius: 20,
          background: GRADIENTS.avatar,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          fontWeight: 900,
          color: "#fff",
          marginBottom: 14,
          boxShadow: "0 6px 20px rgba(139,96,40,0.3)",
          letterSpacing: 2,
        }}>
          {initials}
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.textPrimary }}>
          {user.name}
        </div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>
          {user.bank}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 28,
      }}>
        {[
          { label: "السلفات النشطة", value: mySalfas.length, icon: "📄" },
          { label: "أقساط مدفوعة",   value: totalPaid,       icon: "✅" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: COLORS.cardBg,
            borderRadius: 20,
            padding: "18px 16px",
            border: `1px solid ${COLORS.border}`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{
              fontSize: 28,
              fontWeight: 900,
              background: GRADIENTS.button,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Menu list */}
      <div style={{
        background: COLORS.cardBg,
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
      }}>
        {MENU_ITEMS.map((item, idx) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 18px",
              borderBottom: idx < MENU_ITEMS.length - 1 ? `1px solid ${COLORS.border}` : "none",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: item.isRed ? COLORS.error : COLORS.textPrimary,
              }}>
                {item.label}
              </div>
              {item.sub && (
                <div style={{ fontSize: 12, color: COLORS.textHint, marginTop: 2 }}>
                  {item.sub}
                </div>
              )}
            </div>
            {!item.isRed && (
              <span style={{ fontSize: 18, color: COLORS.textHint }}>‹</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
