// My active salfas screen — timeline dots + waiting salfas list

import { formatFull, PRIORITIES } from "../data/data";
import { COLORS, GRADIENTS } from "../styles/colors";

function SalfaTimeline({ salfa }) {
  const { amount, myMonth, currentMonth, paid, priority, type } = salfa;
  const inst = amount / 10;

  return (
    <div style={{
      background: COLORS.cardBg,
      borderRadius: 20,
      padding: 18,
      border: `1px solid ${COLORS.border}`,
      borderRight: `4px solid ${COLORS.success}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary }}>
            {formatFull(amount)}
          </div>
          <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>
            قسط {formatFull(inst)} &middot; {type === "employee" ? "موظف" : "غير موظف"}
          </div>
        </div>
        <span style={{
          background: "rgba(30,122,74,0.1)",
          color: COLORS.success,
          borderRadius: 12,
          padding: "4px 12px",
          fontSize: 12,
          fontWeight: 600,
          height: "fit-content",
        }}>
          نشطة ✓
        </span>
      </div>

      {/* Timeline dots */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 10 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const month = i + 1;
          const isPaid   = paid.includes(month);
          const isMyMonth = month === myMonth;
          const isFuture = !isPaid && !isMyMonth;

          const dotColor = isPaid ? COLORS.success
            : isMyMonth ? COLORS.goldMid
            : COLORS.border;

          const lineColor = paid.includes(month) && paid.includes(month + 1)
            ? COLORS.success
            : COLORS.border;

          return (
            <div key={month} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                width: isMyMonth ? 20 : 14,
                height: isMyMonth ? 20 : 14,
                borderRadius: "50%",
                background: dotColor,
                border: isMyMonth ? `3px solid ${COLORS.goldBright}` : "none",
                flexShrink: 0,
                boxShadow: isMyMonth ? `0 0 10px rgba(200,120,58,0.5)` : "none",
                transition: "all 0.2s",
              }} />
              {month < 10 && (
                <div style={{
                  flex: 1,
                  height: 3,
                  background: isPaid ? COLORS.success : COLORS.border,
                  borderRadius: 2,
                }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 16, fontSize: 11, color: COLORS.textHint }}>
        <span>● مدفوع ({paid.length})</span>
        <span style={{ color: COLORS.goldMid }}>● شهري ({myMonth})</span>
        <span>○ قادم</span>
      </div>
    </div>
  );
}

export default function MySalfaScreen({ mySalfas, waiting }) {
  const waitingEntries = Object.entries(waiting);

  return (
    <div style={{ padding: "24px 18px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.textPrimary, marginBottom: 20 }}>
        سلفاتي
      </div>

      {/* Waiting salfas */}
      {waitingEntries.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 10 }}>
            قيد الانتظار
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {waitingEntries.map(([amountStr, data]) => {
              const amount = Number(amountStr);
              const inst = amount / 10;
              const priorityLabel = PRIORITIES[data.priority]?.label || "قرعة عادية";
              return (
                <div key={amountStr} style={{
                  background: COLORS.cardBg,
                  borderRadius: 20,
                  padding: 18,
                  border: `1px solid ${COLORS.border}`,
                  borderRight: `4px solid ${COLORS.info}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700 }}>{formatFull(amount)}</div>
                      <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 3 }}>
                        {priorityLabel} &middot; قسط {formatFull(inst)}
                      </div>
                    </div>
                    <span style={{
                      background: "rgba(26,94,173,0.1)",
                      color: COLORS.info,
                      borderRadius: 12,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      height: "fit-content",
                    }}>
                      انتظار
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active salfas */}
      {mySalfas.length > 0 && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 10 }}>
            السلفات النشطة
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mySalfas.map((s) => <SalfaTimeline key={s.id} salfa={s} />)}
          </div>
        </div>
      )}

      {/* Empty state */}
      {mySalfas.length === 0 && waitingEntries.length === 0 && (
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>
            لا توجد سلفات حالياً
          </div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 6 }}>
            اذهب للرئيسية لاختيار سلفة جديدة
          </div>
        </div>
      )}
    </div>
  );
}
