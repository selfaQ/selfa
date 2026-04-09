// عرض بطاقة ki Card الافتراضية — بصري فقط بدون تفاعل

export default function KiCardDisplay({ accountNumber, name, accountType }) {
  const typeLabel = { government: 'حكومي', private: 'خاص', personal: 'شخصي' };

  return (
    <div className="rounded-xl p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a3a2a, #0d2018)', border: '1px solid #0d8a52' }}>
      {/* شعار ki */}
      <div className="absolute left-4 top-4 text-[11px] font-bold"
        style={{ color: '#3fffa2', textShadow: '0 0 8px rgba(63,255,162,0.4)', fontFamily: 'Tajawal' }}>
        ki
      </div>

      {/* شريحة ذهبية */}
      <div className="w-[22px] h-[16px] rounded-[3px] mb-3"
        style={{ background: '#d4a017', boxShadow: '0 0 6px rgba(245,200,66,0.3)' }} />

      {/* رقم البطاقة */}
      <div className="text-[12px] tracking-wider mb-2"
        style={{ color: '#e8fff5', fontFamily: '"Courier New", monospace', letterSpacing: '0.12em' }}
        dir="ltr">
        {accountNumber ?? 'KI-2271 •••• •••• 9904'}
      </div>

      {/* الاسم + النوع */}
      <div className="flex items-end justify-between">
        <div className="text-[10px]" style={{ color: '#8ab8a0', fontFamily: 'Tajawal' }}>
          {name ?? 'أحمد محمد علي'} — {typeLabel[accountType] ?? 'حكومي'}
        </div>
      </div>
    </div>
  );
}
