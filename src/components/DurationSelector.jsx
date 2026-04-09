// منتقي مدة السلفة — 3 تبويبات: 10 / 18 / 24 شهراً

import useStore from '../store/useStore';

const OPTIONS = [
  { value: 10, label: '10', sub: 'أشهر' },
  { value: 18, label: '18', sub: 'شهراً' },
  { value: 24, label: '24', sub: 'شهراً' },
];

export default function DurationSelector() {
  const { builder, setDuration } = useStore();

  return (
    <div className="flex gap-1.5">
      {OPTIONS.map((opt) => {
        const on = builder.duration === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setDuration(opt.value)}
            className="flex-1 border rounded-xl py-2.5 text-center cursor-pointer transition-all"
            style={{
              background:   on ? 'rgba(63,255,162,0.07)' : '#1a2820',
              borderColor:  on ? '#3fffa2' : 'rgba(63,255,162,0.12)',
              boxShadow:    on ? '0 0 10px rgba(63,255,162,0.15)' : 'none',
            }}
          >
            <div className="text-[13px] font-bold" style={{ color: on ? '#3fffa2' : '#8ab8a0' }}>
              {opt.label}
            </div>
            <div className="text-[9px] mt-0.5" style={{ color: '#4a7a60' }}>
              {opt.sub}
            </div>
          </button>
        );
      })}
    </div>
  );
}
