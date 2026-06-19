// الشاشة الثانية — اختيار الأولوية والإجمالي الحي

import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import PrioritySelector from '../components/PrioritySelector';
import { formatIQD, calcInstallment, SUBSCRIPTION_FEE } from '../data/mock';

export default function PriorityPage() {
  const navigate = useNavigate();
  const { builder } = useStore();
  const { amount, duration, priority } = builder;

  const inst   = amount ? calcInstallment(amount, duration) : 0;
  const subFee = SUBSCRIPTION_FEE[duration] ?? 0;

  if (!amount) {
    navigate('/');
    return null;
  }

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter p-3 gap-3 pb-6">
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center border cursor-pointer"
          style={{ background: '#ffffff', borderColor: 'rgba(14,165,114,0.25)', color: '#2e5c43' }}>
          ›
        </button>
        <div>
          <div className="text-[18px] font-bold text-t1">متى تريد تسلّم؟</div>
          <div className="text-[10px] text-t3 mt-0.5">اختر أولويتك للاستلام</div>
        </div>
      </div>

      <div className="rounded-xl p-3 flex flex-col gap-1.5"
        style={{ background: '#f0f7f3', border: '1px solid rgba(14,165,114,0.15)' }}>
        {[
          { label: 'المبلغ',         value: formatIQD(amount),   color: '#0ea572' },
          { label: 'القسط الشهري',   value: formatIQD(inst),     color: '#0ea572' },
          { label: 'المدة',          value: `${duration} شهراً / ${duration} عضو` },
          { label: 'رسوم الاشتراك',  value: formatIQD(subFee),   color: '#d4920a' },
        ].map(row => (
          <div key={row.label} className="flex justify-between items-center">
            <span className="text-[11px] text-t3">{row.label}</span>
            <span className="text-[12px] font-bold" style={{ color: row.color ?? '#0d1f17' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div className="text-[11px] text-t3">مقاعد الأولوية — رسوم حجز لمرة واحدة</div>

      <PrioritySelector />

      <button
        onClick={() => priority && navigate('/payment')}
        disabled={!priority}
        className="rounded-xl py-3.5 text-center text-[14px] font-bold mt-auto transition-all"
        style={{
          background: priority ? '#b07a08' : '#f0f7f3',
          color:      priority ? '#fff' : '#6b9b80',
          boxShadow:  priority ? '0 2px 12px rgba(176,122,8,0.25)' : 'none',
          cursor:     priority ? 'pointer' : 'not-allowed',
        }}>
        التالي — الدفع
      </button>
    </div>
  );
}
