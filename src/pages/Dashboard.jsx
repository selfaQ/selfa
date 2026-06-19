// لوحة السلفات النشطة — ثيم فاتح مع تفاصيل الدور والاستقطاع

import BottomNav from '../components/BottomNav';
import { useSalafa } from '../contexts/SalafaContext';
import {
  formatIQD, formatShort, calcInstallment, MONTHS_AR,
} from '../data/constants';

// ─── بطاقة سلفة نشطة ─────────────────────────────────────────────────────────
function ActiveSalfaCard({ salafa }) {
  const inst    = calcInstallment(salafa.amount, salafa.duration);
  const subFee  = Math.round(inst * 0.01);
  const total   = inst + subFee;
  const pct     = Math.round((salafa.monthsPaid / salafa.duration) * 100);
  const received = salafa.monthsPaid >= salafa.myTurn;

  const receiveDate = new Date(salafa.nextDeduction);
  receiveDate.setMonth(receiveDate.getMonth() + (salafa.myTurn - salafa.monthsPaid - 1));
  const receiveMonth = MONTHS_AR[receiveDate.getMonth()];
  const receiveYear  = receiveDate.getFullYear();

  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.15)' }}>

      <div className="flex items-start justify-between">
        <div>
          <div className="text-[20px] font-bold leading-none text-t1">
            {formatShort(salafa.amount)}
          </div>
          <div className="text-[10px] text-t3 mt-0.5">{salafa.duration} شهراً</div>
        </div>
        <span
          className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
          style={salafa.seatType === 'priority'
            ? { background: 'rgba(212,146,10,0.10)', color: '#d4920a', border: '1px solid rgba(212,146,10,0.20)' }
            : { background: 'rgba(14,165,114,0.08)', color: '#0ea572', border: '1px solid rgba(14,165,114,0.18)' }
          }>
          {salafa.seatType === 'priority'
            ? `💰 أولوية #${salafa.prioritySeat}`
            : '🎲 قرعة'}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-[10px] mb-1.5">
          <span className="text-t3">{salafa.monthsPaid} قسط مدفوع</span>
          <span className="text-t3">{salafa.duration - salafa.monthsPaid} متبقٍ</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(14,165,114,0.10)' }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0ea572, #0d8a52)' }}
          />
        </div>
        <div className="text-center text-[9px] text-t3 mt-1">{pct}%</div>
      </div>

      <div className="rounded-xl p-3 flex items-center justify-between"
        style={received
          ? { background: 'rgba(14,165,114,0.07)', border: '1px solid rgba(14,165,114,0.18)' }
          : { background: '#f0f7f3', border: '1px solid rgba(14,165,114,0.10)' }}>
        <div>
          <div className="text-[9px] text-t3">دوري لاستلام المبلغ</div>
          <div className="text-[18px] font-bold mt-0.5"
            style={{ color: received ? '#0ea572' : '#0d1f17' }}>
            {received ? '✓ تم الاستلام' : `الشهر ${salafa.myTurn}`}
          </div>
        </div>
        {!received && (
          <div className="text-left">
            <div className="text-[9px] text-t3">موعد الاستلام</div>
            <div className="text-[12px] font-bold mt-0.5" style={{ color: '#0ea572' }}>
              {receiveMonth} {receiveYear}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(14,165,114,0.10)' }}>
        <div className="px-3 py-1.5"
          style={{ background: 'rgba(14,165,114,0.04)', borderBottom: '1px solid rgba(14,165,114,0.08)' }}>
          <span className="text-[9px] font-bold text-t3">تفاصيل الاستقطاع الشهري</span>
        </div>
        {[
          { label: 'القسط الأساسي',    val: formatIQD(inst) },
          { label: 'رسوم الاشتراك',    val: formatIQD(subFee) },
        ].map(row => (
          <div key={row.label}
            className="flex justify-between px-3 py-2"
            style={{ background: '#ffffff', borderBottom: '1px solid rgba(14,165,114,0.06)' }}>
            <span className="text-[10px] text-t3">{row.label}</span>
            <span className="text-[11px] font-bold text-t2">{row.val}</span>
          </div>
        ))}
        <div className="flex justify-between px-3 py-2.5"
          style={{ background: 'rgba(14,165,114,0.07)' }}>
          <span className="text-[11px] font-bold text-t1">الإجمالي الشهري</span>
          <span className="text-[12px] font-bold" style={{ color: '#0ea572' }}>
            {formatIQD(total)}
          </span>
        </div>
      </div>

      {!received && (
        <div className="flex items-center gap-3 rounded-xl px-3 py-2"
          style={{ background: '#f0f7f3', border: '1px solid rgba(14,165,114,0.10)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(14,165,114,0.10)' }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#0ea572" strokeWidth="1.5" />
              <path d="M8 5v3l2 2" stroke="#0ea572" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-t3">الخصم القادم</div>
            <div className="text-[11px] font-bold text-t1 mt-0.5">{salafa.nextDeduction}</div>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(14,165,114,0.10)', color: '#0ea572' }}>
            تلقائي ✓
          </span>
        </div>
      )}
    </div>
  );
}

// ─── الصفحة الرئيسية ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { mySalafat } = useSalafa();

  const totalMonthly = mySalafat.reduce(
    (sum, s) => { const i = calcInstallment(s.amount, s.duration); return sum + i + Math.round(i * 0.01); },
    0
  );

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter">
      <div className="flex-1 overflow-y-auto p-3 pb-24 flex flex-col gap-3">

        <div className="pt-2 flex items-start justify-between">
          <div>
            <div className="text-[17px] font-bold text-t1">سلفاتي</div>
            <div className="text-[10px] text-t3 mt-0.5">{mySalafat.length} سلفة نشطة</div>
          </div>
          {mySalafat.length > 0 && (
            <div className="text-left">
              <div className="text-[9px] text-t3">إجمالي الاستقطاع / شهر</div>
              <div className="text-[14px] font-bold mt-0.5" style={{ color: '#d4920a' }}>
                {formatIQD(totalMonthly)}
              </div>
            </div>
          )}
        </div>

        {mySalafat.length > 0 ? (
          mySalafat.map(s => <ActiveSalfaCard key={s.id} salafa={s} />)
        ) : (
          <div className="rounded-2xl p-8 text-center flex flex-col items-center gap-3"
            style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.10)' }}>
            <div className="text-[36px]">📋</div>
            <div className="text-[14px] font-bold text-t2">لا توجد سلفات نشطة</div>
            <div className="text-[11px] text-t3">انضم لسلفة من صفحة الاستعراض</div>
          </div>
        )}
      </div>

      <BottomNav active="/dashboard" />
    </div>
  );
}
