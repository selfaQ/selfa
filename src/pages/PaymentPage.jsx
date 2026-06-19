// الشاشة الثالثة — عرض بطاقة Qi Card وتأكيد الدفع (تجريبي)

import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import KiCardDisplay from '../components/KiCardDisplay';
import { formatIQD, calcCheckout, calcInstallment } from '../data/mock';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user, builder, addSalfa, resetBuilder } = useStore();
  const { amount, duration, priority } = builder;

  if (!amount || !priority) { navigate('/'); return null; }

  const { subFee, priorityFee, total } = calcCheckout(amount, duration, priority);
  const inst = calcInstallment(amount, duration);

  const priorityLabel = priority === 'raffle' ? 'قرعة عشوائية' : `الأولوية ${priority}`;

  function handlePay() {
    addSalfa({ id: Date.now(), amount, duration, priority, inst });
    resetBuilder();
    navigate('/tracking');
  }

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter p-3 gap-3 pb-6">
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate('/priority')}
          className="w-8 h-8 rounded-full flex items-center justify-center border cursor-pointer"
          style={{ background: '#ffffff', borderColor: 'rgba(14,165,114,0.25)', color: '#2e5c43' }}>
          ›
        </button>
        <div>
          <div className="text-[18px] font-bold text-t1">الدفع</div>
          <div className="text-[10px] text-t3 mt-0.5">مرة واحدة — لا خصومات بعد هذا</div>
        </div>
      </div>

      <div className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: '#f0f7f3', border: '1px solid rgba(14,165,114,0.15)' }}>
        <div className="text-[11px] text-t3">بطاقة Qi Card المرتبطة</div>
        <KiCardDisplay
          accountNumber={user.accountNumber}
          name={user.name}
          accountType={user.accountType}
        />

        <div className="flex flex-col gap-0">
          {[
            { label: `رسوم الاشتراك (${duration} شهر)`, value: formatIQD(subFee) },
            ...(priorityFee > 0
              ? [{ label: `رسوم ${priorityLabel}`, value: formatIQD(priorityFee), color: '#d4920a' }]
              : []),
          ].map(row => (
            <div key={row.label} className="flex justify-between py-2 border-b"
              style={{ borderColor: 'rgba(14,165,114,0.12)' }}>
              <span className="text-[11px] text-t3">{row.label}</span>
              <span className="text-[12px] font-bold" style={{ color: row.color ?? '#0d1f17' }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-3 flex justify-between items-center"
          style={{ background: 'rgba(14,165,114,0.07)', border: '1px solid rgba(14,165,114,0.20)' }}>
          <span className="text-[12px] text-t2">إجمالي الدفع الآن</span>
          <span className="text-[16px] font-bold text-mint">
            {formatIQD(total)}
          </span>
        </div>
      </div>

      <div className="rounded-xl p-3" style={{ background: 'rgba(14,165,114,0.04)', border: '1px solid rgba(14,165,114,0.12)' }}>
        <div className="text-[10px] text-t3 leading-relaxed">
          الأقساط الشهرية ({formatIQD(inst)}) تُستقطع تلقائياً من راتبك عبر Qi Card — لا يلزم أي إجراء شهري.
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <button onClick={handlePay}
          className="rounded-xl py-3.5 text-center text-[14px] font-bold cursor-pointer"
          style={{ background: '#0d8a52', color: '#fff', boxShadow: '0 2px 14px rgba(13,138,82,0.30)' }}>
          ادفع {formatIQD(total)} عبر Qi Card
        </button>
        <div className="text-center text-[10px] text-t3">الدفع مؤمّن — تشفير Qi Card</div>
      </div>
    </div>
  );
}
