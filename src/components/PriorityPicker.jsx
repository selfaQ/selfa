// Priority selection grid: 1st name, 2nd name, 3rd name, or lottery

import { PRIORITIES } from "../data/data";
import { COLORS } from "../styles/colors";

export default function PriorityPicker({ selected, onSelect }) {
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 10 }}>
        اختر أولوية الاستلام
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
      }}>
        {PRIORITIES.map((p) => {
          const isSelected = selected === p.id;
          return (
            <div
              key={p.id}
              onClick={() => onSelect(p.id)}
              style={{
                background: isSelected ? COLORS.goldLight : COLORS.cardBg,
                border: isSelected ? `2px solid ${COLORS.goldMid}` : `2px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: "14px 12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "right",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>
                {p.label}
              </div>
              <div style={{
                fontSize: 12,
                color: p.fee === 0 ? COLORS.success : COLORS.goldMid,
                marginTop: 4,
                fontWeight: 600,
              }}>
                {p.fee === 0
                  ? "مجاناً"
                  : p.fee.toLocaleString("ar-IQ") + " د.ع رسوم"}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        fontSize: 12,
        color: COLORS.textHint,
        marginTop: 8,
        textAlign: "center",
      }}>
        القرعة العادية مجانية تماماً
      </div>
    </div>
  );
}
