// منتقي الأولوية — 3 بطاقات ذهبية + قرعة مجانية
// يعمل بوضعين: props (لـ SalafaDetail) أو useStore (لـ PriorityPage القديمة)

import useStore from '../store/useStore';
import { PRIORITY_FEES, SUBSCRIPTION_FEE, formatIQD } from '../data/mock';
const SUBSCRIPTION_FEES = SUBSCRIPTION_FEE;

const SEATS = [
  { seat: 1, label: 'الأول',  opacity: 1.0 },
  { seat: 2, label: 'الثاني', opacity: 0.65 },
  { seat: 3, label: 'الثالث', opacity: 0.4  },
];

// ─── النسخة القديمة تُستخدم من PriorityPage عبر useStore ─────────────────────
export default function PrioritySelector({ amount: propAmount, priorityTaken, selected: propSelected, onChange }) {
  const { builder, setPriority } = useStore();

  const isPropsMode = propAmount !== undefined;
  const amount  = isPropsMode ? propAmount          : builder.amount;
  const duration = builder.duration;
  const sel     = isPropsMode
    ? (propSelected?.type === 'priority' ? propSelected.seat : propSelected?.type === 'lottery' ? 'raffle' : null)
    : builder.priority;

  const handleSelect = isPropsMode
    ? (val) => {
        if (val === 'raffle') {
          onChange({ type: 'lottery', seat: null, fee: 0 });
        } else {
          const fee = (PRIORITY_FEES[amount] ?? {})[val] ?? 0;
          onChange({ type: 'priority', seat: val, fee });
        }
      }
    : setPriority;

  if (!amount) return null;

  const fees   = PRIORITY_FEES[amount] ?? {};
  const subFee = SUBSCRIPTION_FEES[duration] ?? 0;
  const prioFee = sel && sel !== 'raffle' ? (fees[sel] ?? 0) : 0;
  const total   = subFee + prioFee;

  return (
    <div className="flex flex-col gap-2.5">
      {/* توضيح الترتيب */}
      {isPropsMode && (
        <div className="text-[10px] text-center" style={{ color: '#4a7a60' }}>
          المقاعد تُحجز بالترتيب — من يضغط أول يأخذ الأول
        </div>
      )}

      {/* ثلاثة مقاعد أولوية */}
      <div className="flex gap-1.5">
        {SEATS.map(({ seat, label, opacity }) => {
          const fee    = fees[seat] ?? 0;
          const isOn   = sel === seat;
          const taken  = isPropsMode && priorityTaken ? priorityTaken[seat - 1] : false;

          return (
            <button key={seat} onClick={() => !taken && handleSelect(seat)}
              disabled={taken}
              className="flex-1 border rounded-xl py-2.5 text-center cursor-pointer transition-all"
              style={{
                background:  taken ? 'rgba(255,90,90,0.06)' : isOn ? 'rgba(245,200,66,0.08)' : '#1a2820',
                borderColor: taken ? 'rgba(255,90,90,0.2)' : isOn ? '#f5c842' : `rgba(245,200,66,${opacity * 0.35})`,
                boxShadow:   isOn ? '0 0 10px rgba(245,200,66,0.18)' : 'none',
                cursor:      taken ? 'not-allowed' : 'pointer',
              }}>
              <div className="text-[20px] font-bold leading-none"
                style={{ color: taken ? '#ff5a5a60' : `rgba(245,200,66,${isOn ? 1 : opacity * 0.8})` }}>
                {seat}
              </div>
              <div className="text-[9px] mt-1 font-medium"
                style={{ color: taken ? '#ff5a5a50' : isOn ? '#d4a017' : '#4a7a60' }}>
                {taken ? 'محجوز' : `+${formatIQD(fee).replace(' د.ع', '')}`}
              </div>
            </button>
          );
        })}
      </div>

      {/* قرعة مجانية */}
      <button onClick={() => handleSelect('raffle')}
        className="border rounded-xl py-3 text-center cursor-pointer transition-all"
        style={{
          background:  sel === 'raffle' ? 'rgba(63,255,162,0.06)' : '#1a2820',
          borderColor: sel === 'raffle' ? 'rgba(63,255,162,0.4)' : 'rgba(63,255,162,0.12)',
        }}>
        <div className="text-[12px] font-bold" style={{ color: '#8ab8a0' }}>قرعة عشوائية</div>
        <div className="text-[10px] mt-0.5" style={{ color: '#4a7a60' }}>بدون رسوم حجز إضافية</div>
      </button>

      {/* مربع الإجمالي */}
      {sel !== null && (
        <div className="rounded-xl p-3 border"
          style={{ background: 'rgba(245,200,66,0.06)', borderColor: 'rgba(245,200,66,0.2)' }}>
          <div className="text-[11px] font-bold mb-2" style={{ color: '#f5c842' }}>
            {sel === 'raffle' ? 'اخترت: القرعة العشوائية' : `اخترت: الأولوية ${SEATS[sel - 1]?.label}`}
          </div>
          {!isPropsMode && (
            <div className="flex justify-between py-1">
              <span className="text-[11px]" style={{ color: '#4a7a60' }}>رسوم الاشتراك</span>
              <span className="text-[11px] font-bold text-t1">{formatIQD(subFee)}</span>
            </div>
          )}
          {prioFee > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-[11px]" style={{ color: '#4a7a60' }}>رسوم الأولوية</span>
              <span className="text-[11px] font-bold" style={{ color: '#f5c842' }}>{formatIQD(prioFee)}</span>
            </div>
          )}
          {!isPropsMode && (
            <div className="border-t mt-1 pt-2 flex justify-between"
              style={{ borderColor: 'rgba(245,200,66,0.2)' }}>
              <span className="text-[12px] font-bold text-t1">المجموع</span>
              <span className="text-[15px] font-bold" style={{ color: '#f5c842', textShadow: '0 0 8px rgba(245,200,66,0.3)' }}>
                {formatIQD(total)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
