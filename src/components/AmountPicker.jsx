// منتقي المبلغ — شبكة من الأزرار لاختيار مبلغ الجمعية

import { AMOUNTS, formatShort } from '../data/constants';

export default function AmountPicker({ selected, onChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-600 mb-2">مبلغ الجمعية</p>
      <div className="grid grid-cols-4 gap-2">
        {AMOUNTS.map(amount => (
          <button
            key={amount}
            onClick={() => onChange(amount)}
            className={`
              py-2.5 rounded-xl text-sm font-bold border-2 transition-all
              ${selected === amount
                ? 'bg-brand text-white border-transparent shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:border-primary'
              }
            `}
          >
            {formatShort(amount)}
          </button>
        ))}
      </div>
    </div>
  );
}
