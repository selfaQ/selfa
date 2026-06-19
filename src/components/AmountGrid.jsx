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

        const fullRow = idx === AMOUNTS.length - 1 && AMOUNTS.length % 2 !== 0;

        let borderColor = 'rgba(14,165,114,0.15)';
        if (isOn)   borderColor = '#0d8a52';
        if (isWarn) borderColor = 'rgba(212,146,10,0.40)';

        let bg = '#ffffff';
        if (isOn)   bg = 'rgba(13,138,82,0.08)';
        if (isLock) bg = '#f0f7f3';

        let amtColor = '#0d1f17';
        if (isOn)   amtColor = '#0ea572';
        if (isLock) amtColor = '#6b9b80';

        let subColor = '#6b9b80';
        if (isOn)   subColor = '#0d8a52';
        if (isWarn) subColor = '#d4920a';
        if (isLock) subColor = '#e03535';

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
              opacity:     isLock ? 0.45 : 1,
              cursor:      isLock ? 'not-allowed' : 'pointer',
              gridColumn:  fullRow ? 'span 2' : undefined,
              boxShadow:   isOn ? '0 2px 8px rgba(13,138,82,0.12)' : 'none',
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
