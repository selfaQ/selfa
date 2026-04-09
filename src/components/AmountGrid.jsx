// شبكة اختيار المبلغ — 7 خيارات مع مؤشر الحالة (متاح / يحتاج مدة أطول / مقفول)

import useStore from '../store/useStore';
import { AMOUNTS, formatShort, calcInstallment, getAmountStatus } from '../data/mock';

export default function AmountGrid() {
  const { builder, user, setAmount, setDuration } = useStore();
  const { duration, amount: selected } = builder;
  const { maxInstallment } = user;

  function handleClick(amt) {
    const { status, minDuration } = getAmountStatus(amt, maxInstallment);
    if (status === 'locked') return;
    // إذا احتاج مدة أطول → بدّل المدة تلقائياً
    if (status === 'needs_longer' && minDuration > duration) {
      setDuration(minDuration);
    }
    setAmount(amt);
  }

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {AMOUNTS.map((amt, idx) => {
        const { status, minDuration } = getAmountStatus(amt, maxInstallment);
        const inst    = calcInstallment(amt, duration);
        const isOn    = selected === amt;
        const isLock  = status === 'locked';
        const isWarn  = status === 'needs_longer' && minDuration > duration;

        // آخر عنصر يأخذ العرض الكامل إذا كان العدد فردياً
        const fullRow = idx === AMOUNTS.length - 1 && AMOUNTS.length % 2 !== 0;

        let borderColor = 'rgba(63,255,162,0.12)';
        if (isOn)   borderColor = '#1db874';
        if (isWarn) borderColor = 'rgba(245,200,66,0.35)';

        let bg = '#1a2820';
        if (isOn)   bg = 'rgba(29,184,116,0.09)';
        if (isLock) bg = '#1a2820';

        let amtColor = '#e8fff5';
        if (isOn)   amtColor = '#3fffa2';
        if (isLock) amtColor = '#4a7a60';

        let subColor = '#4a7a60';
        if (isOn)   subColor = '#1db874';
        if (isWarn) subColor = '#f5c842';
        if (isLock) subColor = '#ff5a5a';

        let subText;
        if (isLock)  subText = 'مقفول 🔒';
        else if (isWarn) subText = `${formatShort(inst)} → يحتاج ${minDuration}م`;
        else subText = `${formatShort(inst)} / شهر`;

        return (
          <div
            key={amt}
            onClick={() => handleClick(amt)}
            className="border rounded-xl px-3 py-2.5 flex justify-between items-center transition-all"
            style={{
              background:  bg,
              borderColor,
              opacity:     isLock ? 0.35 : 1,
              cursor:      isLock ? 'not-allowed' : 'pointer',
              gridColumn:  fullRow ? 'span 2' : undefined,
              boxShadow:   isOn ? '0 0 8px rgba(29,184,116,0.12)' : 'none',
            }}
          >
            <div className="font-bold text-[14px]" style={{ color: amtColor }}>
              {formatShort(amt)}
            </div>
            <div className="text-[10px]" style={{ color: subColor }}>
              {subText}
            </div>
          </div>
        );
      })}
    </div>
  );
}
