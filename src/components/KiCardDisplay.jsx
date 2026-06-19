// عرض بطاقة Qi Card الافتراضية — بصري فقط بدون تفاعل

export default function KiCardDisplay({ accountNumber, name, accountType }) {
  const typeLabel = { government: 'حكومي', private: 'خاص', personal: 'شخصي' };

  return (
    <div className="rounded-xl p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d8a52, #096b41)', border: '1px solid #096b41' }}>
      <div className="absolute left-4 top-4 text-[11px] font-bold"
        style={{ color: '#e8fff5', fontFamily: 'Tajawal' }}>
        Qi
      </div>

      <div className="w-[22px] h-[16px] rounded-[3px] mb-3"
        style={{ background: '#d4920a', boxShadow: '0 0 6px rgba(212,146,10,0.35)' }} />

      <div className="text-[12px] tracking-wider mb-2"
        style={{ color: '#e8fff5', fontFamily: '"Courier New", monospace', letterSpacing: '0.12em' }}
        dir="ltr">
        {accountNumber ?? 'KI-2271 •••• •••• 9904'}
      </div>

      <div className="flex items-end justify-between">
        <div className="text-[10px]" style={{ color: 'rgba(232,255,245,0.75)', fontFamily: 'Tajawal' }}>
          {name ?? 'أحمد محمد علي'} — {typeLabel[accountType] ?? 'حكومي'}
        </div>
      </div>
    </div>
  );
}
