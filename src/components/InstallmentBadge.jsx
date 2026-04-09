// شارة القسط الشهري — تعرض المبلغ مع لون يعكس نسبته من الراتب

import { calcInstallment, formatIQD } from '../data/constants';

export default function InstallmentBadge({ amount, duration, salary }) {
  const inst = calcInstallment(amount, duration);
  const ratio = salary > 0 ? (inst / salary) * 100 : 0;

  // لون الشارة بناءً على النسبة
  let color = 'bg-green-100 text-green-700';
  if (ratio > 40) color = 'bg-red-100 text-red-700';
  else if (ratio > 25) color = 'bg-amber-100 text-amber-700';

  return (
    <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-semibold ${color}`}>
      {formatIQD(inst)} / شهر
      {salary > 0 && <span className="mr-1 opacity-70">({ratio.toFixed(0)}%)</span>}
    </span>
  );
}
