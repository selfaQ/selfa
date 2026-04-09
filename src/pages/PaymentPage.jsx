// الشاشة الثالثة — عرض بطاقة ki Card وتأكيد الدفع (تجريبي)

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
    // إضافة السلفة للمخزن (تجريبي)
    addSalfa({ id: Date.now(), amount, duration, priority, inst });
    resetBuilder();
    navigate('/tracking');
  }

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter p-3 gap-3 pb-6">
      {/* رأس */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate('/priority')}
          className="w-8 h-8 rounded-full flex items-center justify-center border cursor-pointer"
          style={{ background: '#1a2820', borderColor: 'rgba(63,255,162,0.2)', color: '#8ab8a0' }}>
          ›
        </button>
        <div>
          <div className="text-[18px] font-bold text-t1">الدفع</div>
          <div className="text-[10px] text-t3 mt-0.5">مرة واحدة — لا خصومات بعد هذا</div>
        </div>
      </div>

      {/* بطاقة الدفع */}
      <div className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: '#1f3028', border: '1px solid rgba(63,255,162,0.12)' }}>
        <div className="text-[11px] text-t3">بطاقة ki Card المرتبطة</div>
        <KiCardDisplay
          accountNumber={user.accountNumber}
          name={user.name}
          accountType={user.accountType}
        />

        {/* تفاصيل الفاتورة */}
        <div className="flex flex-col gap-0">
          {[
            { label: `رسوم الاشتراك (${duration} شهر)`, value: formatIQD(subFee) },
            ...(priorityFee > 0
              ? [{ label: `رسوم ${priorityLabel}`, value: formatIQD(priorityFee), color: '#f5c842' }]
              : []),
          ].map(row => (
            <div key={row.label} className="flex justify-between py-2 border-b"
              style={{ borderColor: 'rgba(63,255,162,0.1)' }}>
              <span className="text-[11px] text-t3">{row.label}</span>
              <span className="text-[12px] font-bold" style={{ color: row.color ?? '#e8fff5' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* الإجمالي */}
        <div className="rounded-xl p-3 flex justify-between items-center"
          style={{ background: 'rgba(63,255,162,0.07)', border: '1px solid rgba(63,255,162,0.25)' }}>
          <span className="text-[12px] text-t2">إجمالي الدفع الآن</span>
          <span className="text-[16px] font-bold text-mint"
            style={{ textShadow: '0 0 10px rgba(63,255,162,0.3)' }}>
            {formatIQD(total)}
          </span>
        </div>
      </div>

      {/* تنبيه الاستقطاع الشهري */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(63,255,162,0.04)', border: '1px solid rgba(63,255,162,0.12)' }}>
        <div className="text-[10px] text-t3 leading-relaxed">
          الأقساط الشهرية ({formatIQD(inst)}) تُستقطع تلقائياً من راتبك عبر ki Card — لا يلزم أي إجراء شهري.
        </div>
      </div>

      {/* أزرار */}
      <div className="flex flex-col gap-2 mt-auto">
        <button onClick={handlePay}
          className="rounded-xl py-3.5 text-center text-[14px] font-bold cursor-pointer"
          style={{ background: '#1db874', color: '#fff', boxShadow: '0 0 18px rgba(29,184,116,0.35)' }}>
          ادفع {formatIQD(total)} عبر ki Card
        </button>
        <div className="text-center text-[10px] text-t3">الدفع مؤمّن — تشفير ki Card</div>
      </div>
    </div>
  );
}
