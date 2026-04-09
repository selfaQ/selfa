// صف عضو واحد في السلفة الذاتية — رقم حساب + شارة الحالة

export default function MemberRow({ member }) {
  const statusConfig = {
    creator:  { label: 'أنت',    bg: 'rgba(63,255,162,0.12)',  color: '#3fffa2' },
    accepted: { label: 'قَبِل',   bg: 'rgba(63,255,162,0.12)',  color: '#3fffa2' },
    pending:  { label: 'ينتظر',  bg: 'rgba(245,200,66,0.15)',  color: '#f5c842' },
    rejected: { label: 'رفض',    bg: 'rgba(255,90,90,0.15)',   color: '#ff5a5a' },
  };

  const cfg = statusConfig[member.status] ?? statusConfig.pending;

  return (
    <div className="flex items-center gap-2">
      {/* أفاتار */}
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{
          background:  'rgba(63,255,162,0.1)',
          border:      '1px solid rgba(63,255,162,0.12)',
          color:       '#3fffa2',
        }}>
        {member.initial}
      </div>

      {/* رقم الحساب */}
      <div className="flex-1">
        <div className="text-[11px] font-medium" style={{ color: '#8ab8a0', fontFamily: '"Courier New", monospace' }}>
          {member.account}
        </div>
        <div className="text-[9px] mt-0.5" style={{ color: '#4a7a60' }}>
          {member.status === 'creator' ? 'المنشئ — نشط' : member.status === 'accepted' ? 'قبل الدعوة' : 'بانتظار الرد'}
        </div>
      </div>

      {/* شارة الحالة */}
      <span className="text-[9px] px-2 py-0.5 rounded-full font-medium"
        style={{ background: cfg.bg, color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}
