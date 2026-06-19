// الشاشة الأولى — الترحيب والمدة والمبالغ

import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import BottomNav from '../components/BottomNav';
import DurationSelector from '../components/DurationSelector';
import AmountGrid from '../components/AmountGrid';
import { formatIQD } from '../data/mock';

function StatusBar() {
  const now  = new Date();
  const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  return (
    <div className="flex justify-between items-center px-1 py-1.5">
      <span className="text-[10px] text-t3" style={{ fontFamily: '"Courier New", monospace' }}>{time}</span>
      <div className="w-1.5 h-1.5 rounded-full bg-mint" style={{ boxShadow: '0 0 4px rgba(14,165,114,0.5)' }} />
    </div>
  );
}

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user, builder } = useStore();

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter">
      <div className="flex-1 overflow-y-auto p-3 pb-24 flex flex-col gap-3">
        <StatusBar />

        <div>
          <div className="text-[32px] font-bold leading-none"
            style={{ color: '#0ea572', fontFamily: 'Tajawal' }}>
            سلفة
          </div>
          <div className="text-[10px] text-t3 tracking-[0.15em] uppercase mt-0.5">salfa q</div>
        </div>

        <div className="rounded-2xl p-4 border" style={{ background: '#ffffff', borderColor: 'rgba(14,165,114,0.15)' }}>
          <div className="text-[10px] text-t3 mb-1">أهلاً بعودتك</div>
          <div className="text-[15px] font-bold text-t1">{user.name}</div>
          <div className="text-[12px] text-mint mt-0.5">الراتب الصافي: {formatIQD(user.salary)}</div>
          <div className="text-[10px] text-t2 mt-0.5">الحد الأقصى للأقساط: {formatIQD(user.maxInstallment)} / شهر</div>
          <span className="inline-block text-[9px] px-2 py-0.5 rounded-full mt-1.5"
            style={{ background: 'rgba(14,165,114,0.10)', color: '#0ea572' }}>
            حساب حكومي — فعّال
          </span>
        </div>

        <div className="text-[11px] text-t3">اختر مدة السلفة</div>
        <DurationSelector />

        <div className="text-[11px] text-t3">
          اختر المبلغ{' '}
          <span className="text-jade text-[9px]">(المدة: {builder.duration} شهراً)</span>
        </div>
        <AmountGrid />

        <div className="h-px" style={{ background: 'rgba(14,165,114,0.15)' }} />

        <div
          onClick={() => navigate('/self-salfa')}
          className="rounded-xl p-3 flex items-center gap-3 cursor-pointer"
          style={{ border: '1px dashed rgba(14,165,114,0.35)', background: 'rgba(14,165,114,0.04)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(14,165,114,0.10)' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="#0ea572" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-bold text-mint">سلفة ذاتية</div>
            <div className="text-[10px] text-t3 mt-0.5">أنشئ مجموعتك الخاصة</div>
          </div>
        </div>

        <button
          onClick={() => builder.amount && navigate('/priority')}
          disabled={!builder.amount}
          className="rounded-xl py-3.5 text-center text-[14px] font-bold transition-all mt-auto"
          style={{
            background:  builder.amount ? '#0d8a52' : '#f0f7f3',
            color:       builder.amount ? '#fff' : '#6b9b80',
            boxShadow:   builder.amount ? '0 2px 12px rgba(13,138,82,0.3)' : 'none',
            cursor:      builder.amount ? 'pointer' : 'not-allowed',
          }}>
          التالي — اختر الأولوية
        </button>
      </div>

      <BottomNav active="/" />
    </div>
  );
}
