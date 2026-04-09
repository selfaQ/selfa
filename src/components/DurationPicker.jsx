// منتقي مدة الجمعية — 10 أو 18 أو 24 شهراً

import { DURATIONS, SUBSCRIPTION_FEES, formatIQD } from '../data/constants';

export default function DurationPicker({ selected, onChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-600 mb-2">مدة الجمعية</p>
      <div className="flex gap-2">
        {DURATIONS.map(d => (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`
              flex-1 py-3 rounded-xl border-2 text-center transition-all
              ${selected === d
                ? 'bg-brand text-white border-transparent shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:border-primary'
              }
            `}
          >
            <div className="text-base font-bold">{d}</div>
            <div className={`text-xs mt-0.5 ${selected === d ? 'text-blue-100' : 'text-slate-400'}`}>
              شهراً
            </div>
            <div className={`text-xs mt-1 font-medium ${selected === d ? 'text-blue-100' : 'text-slate-500'}`}>
              {formatIQD(SUBSCRIPTION_FEES[d])}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
