// قائمة أعضاء الجمعية — صور مجهولة مع شارات نوع الحساب

// ألوان شارات نوع الحساب
const TYPE_STYLES = {
  government: 'bg-blue-100 text-blue-700',
  private:    'bg-violet-100 text-violet-700',
  personal:   'bg-slate-100 text-slate-600',
};
const TYPE_LABELS = {
  government: 'حكومي',
  private:    'خاص',
  personal:   'شخصي',
};

// توليد أعضاء وهميين بناءً على عدد المنضمين
function generateMembers(count) {
  const types = ['government', 'private', 'personal', 'government', 'private'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[i % types.length],
    isMe: i === 0, // أول عضو "أنا" للعرض
  }));
}

export default function MemberList({ filled, duration }) {
  const members = generateMembers(filled);
  const empty   = duration - filled;

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700 mb-3">
        الأعضاء ({filled}/{duration})
      </p>

      {/* شبكة الأعضاء */}
      <div className="flex flex-wrap gap-2">
        {members.map(m => (
          <div key={m.id} className="flex flex-col items-center gap-1">
            {/* أفاتار مجهول */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
              ${m.isMe
                ? 'bg-gradient-to-br from-blue-500 to-violet-600 text-white ring-2 ring-primary ring-offset-1'
                : 'bg-slate-200 text-slate-600'
              }
            `}>
              {m.isMe ? 'أنا' : '👤'}
            </div>
            {/* شارة النوع */}
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${TYPE_STYLES[m.type]}`}>
              {TYPE_LABELS[m.type]}
            </span>
          </div>
        ))}

        {/* المقاعد الفارغة */}
        {Array.from({ length: empty }, (_, i) => (
          <div key={`empty-${i}`} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
              <span className="text-slate-300 text-lg">+</span>
            </div>
            <span className="text-[9px] text-slate-300">متاح</span>
          </div>
        ))}
      </div>
    </div>
  );
}
