// منتقي الأولوية — 3 بطاقات ذهبية + قرعة مجانية + مربع الإجمالي الحي

import useStore from '../store/useStore';
import { PRIORITY_FEES, SUBSCRIPTION_FEE, formatIQD } from '../data/mock';

const SEATS = [
  { seat: 1, label: 'الأول',  opacity: 1.0 },
  { seat: 2, label: 'الثاني', opacity: 0.65 },
  { seat: 3, label: 'الثالث', opacity: 0.4  },
];

export default function PrioritySelector() {
  const { builder, setPriority } = useStore();
  const { amount, duration, priority: sel } = builder;

  if (!amount) return null;

  const fees   = PRIORITY_FEES[amount] ?? {};
  const subFee = SUBSCRIPTION_FEE[duration] ?? 0;
  const prioFee = sel && sel !== 'raffle' ? (fees[sel] ?? 0) : 0;
  const total   = subFee + prioFee;

  return (
    <div className="flex flex-col gap-2.5">
      {/* ثلاثة مقاعد أولوية */}
      <div className="flex gap-1.5">
        {SEATS.map(({ seat, label, opacity }) => {
          const fee  = fees[seat] ?? 0;
          const isOn = sel === seat;
          return (
            <button key={seat} onClick={() => setPriority(seat)}
              className="flex-1 border rounded-xl py-2.5 text-center cursor-pointer transition-all"
              style={{
                background:  isOn ? 'rgba(245,200,66,0.08)' : '#1a2820',
                borderColor: isOn ? '#f5c842' : `rgba(245,200,66,${opacity * 0.35})`,
                boxShadow:   isOn ? '0 0 10px rgba(245,200,66,0.18)' : 'none',
              }}>
              <div className="text-[20px] font-bold leading-none"
                style={{ color: `rgba(245,200,66,${isOn ? 1 : opacity * 0.8})` }}>
                {seat}
              </div>
              <div className="text-[9px] mt-1 font-medium"
                style={{ color: isOn ? '#d4a017' : '#4a7a60' }}>
                +{formatIQD(fee).replace(' د.ع', '')}
              </div>
            </button>
          );
        })}
      </div>

      {/* قرعة مجانية */}
      <button onClick={() => setPriority('raffle')}
        className="border rounded-xl py-3 text-center cursor-pointer transition-all"
        style={{
          background:  sel === 'raffle' ? 'rgba(63,255,162,0.06)' : '#1a2820',
          borderColor: sel === 'raffle' ? 'rgba(63,255,162,0.4)' : 'rgba(63,255,162,0.12)',
        }}>
        <div className="text-[12px] font-bold text-t2">قرعة عشوائية</div>
        <div className="text-[10px] mt-0.5 text-t3">بدون رسوم حجز إضافية</div>
      </button>

      {/* مربع الإجمالي الحي */}
      {sel !== null && (
        <div className="rounded-xl p-3 border"
          style={{ background: 'rgba(245,200,66,0.06)', borderColor: 'rgba(245,200,66,0.2)' }}>
          <div className="text-[11px] font-bold text-gold mb-2">
            {sel === 'raffle' ? 'اخترت: القرعة العشوائية' : `اخترت: الأولوية ${SEATS[sel - 1]?.label}`}
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[11px] text-t3">رسوم الاشتراك</span>
            <span className="text-[11px] font-bold text-t1">{formatIQD(subFee)}</span>
          </div>
          {prioFee > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-[11px] text-t3">رسوم الأولوية</span>
              <span className="text-[11px] font-bold text-gold">{formatIQD(prioFee)}</span>
            </div>
          )}
          <div className="border-t mt-1 pt-2 flex justify-between"
            style={{ borderColor: 'rgba(245,200,66,0.2)' }}>
            <span className="text-[12px] font-bold text-t1">المجموع</span>
            <span className="text-[15px] font-bold text-gold"
              style={{ textShadow: '0 0 8px rgba(245,200,66,0.3)' }}>
              {formatIQD(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
