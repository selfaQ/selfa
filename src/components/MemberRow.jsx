// صف عضو واحد في السلفة الذاتية — رقم حساب + شارة الحالة

export default function MemberRow({ member }) {
  const statusConfig = {
    creator:  { label: 'أنت',    bg: 'rgba(14,165,114,0.10)',  color: '#0ea572' },
    accepted: { label: 'قَبِل',   bg: 'rgba(14,165,114,0.10)',  color: '#0ea572' },
    pending:  { label: 'ينتظر',  bg: 'rgba(212,146,10,0.12)',  color: '#d4920a' },
    rejected: { label: 'رفض',    bg: 'rgba(224,53,53,0.10)',   color: '#e03535' },
  };

  const cfg = statusConfig[member.status] ?? statusConfig.pending;

  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{
          background:  'rgba(14,165,114,0.10)',
          border:      '1px solid rgba(14,165,114,0.15)',
          color:       '#0ea572',
        }}>
        {member.initial}
      </div>

      <div className="flex-1">
        <div className="text-[11px] font-medium" style={{ color: '#2e5c43', fontFamily: '"Courier New", monospace' }}>
          {member.account}
        </div>
        <div className="text-[9px] mt-0.5" style={{ color: '#6b9b80' }}>
          {member.status === 'creator' ? 'المنشئ — نشط' : member.status === 'accepted' ? 'قبل الدعوة' : 'بانتظار الرد'}
        </div>
      </div>

      <span className="text-[9px] px-2 py-0.5 rounded-full font-medium"
        style={{ background: cfg.bg, color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}
