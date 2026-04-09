// الشاشة الرابعة — متابعة السلفة النشطة مع المخطط الزمني

import BottomNav from '../components/BottomNav';
import TimelineTracker from '../components/TimelineTracker';
import { MOCK_ACTIVE_SALFA, formatIQD } from '../data/mock';

export default function TrackingPage() {
  const { amount, duration, mySlot, paidCount, nextDeduction } = MOCK_ACTIVE_SALFA;

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter">
      <div className="flex-1 overflow-y-auto p-3 pb-24 flex flex-col gap-3">

        {/* رأس */}
        <div className="pt-2">
          <div className="text-[17px] font-bold text-t1">سلفتي الجارية</div>
          <div className="text-[10px] text-t3 mt-0.5">
            {(amount / 1_000_000).toFixed(0)}M د.ع — {duration} شهراً
          </div>
        </div>

        {/* إحصاءات سريعة */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'دوري (الشهر)', value: mySlot },
            { label: 'أقساط مدفوعة', value: paidCount },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 border"
              style={{ background: '#1a2820', borderColor: 'rgba(63,255,162,0.12)' }}>
              <div className="text-[16px] font-bold text-mint">{s.value}</div>
              <div className="text-[9px] text-t3 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* عنوان المخطط */}
        <div className="text-[11px] text-t3">ترتيب الاستلام</div>

        {/* المخطط الزمني */}
        <TimelineTracker />

        {/* تنبيه الاستقطاع القادم */}
        <div className="rounded-xl p-3 flex items-center gap-3 mt-auto"
          style={{ background: '#1a2820', border: '1px solid rgba(63,255,162,0.12)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(63,255,162,0.1)' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#3fffa2" strokeWidth="1.5" />
              <path d="M8 5v3l2 2" stroke="#3fffa2" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-bold text-t1">استقطاع قادم</div>
            <div className="text-[10px] text-t2 mt-0.5">
              {formatIQD(nextDeduction.amount)} — {nextDeduction.date}
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="/tracking" />
    </div>
  );
}
