// متتبع المخطط الزمني — شريط تقدم + قائمة أعضاء مع تظليل دوري

import { MOCK_ACTIVE_SALFA, MONTHS_AR } from '../data/mock';

export default function TimelineTracker() {
  const { duration, paidCount, mySlot, members, startMonth } = MOCK_ACTIVE_SALFA;

  // بداية الشهر (يناير 2025 = شهر 0 سنة 2025)
  const startYear  = 2025;
  const startMonthIdx = 0; // يناير

  function getMonthLabel(slot) {
    const idx  = (startMonthIdx + slot - 1) % 12;
    const year = startYear + Math.floor((startMonthIdx + slot - 1) / 12);
    return `${MONTHS_AR[idx]} ${year}`;
  }

  const fillPct   = (paidCount / duration) * 100;
  const markerPct = (mySlot   / duration) * 100;

  return (
    <div className="flex flex-col gap-3">
      {/* شريط التقدم */}
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px] text-t3">{startMonth}</span>
          <span className="text-[10px] text-t3">{getMonthLabel(duration)}</span>
        </div>
        <div className="h-2 rounded-full overflow-visible relative"
          style={{ background: '#162019' }}>
          {/* شريط الأشهر المدفوعة */}
          <div className="h-full rounded-full absolute right-0 top-0 transition-all"
            style={{
              width: `${fillPct}%`,
              background: '#1db874',
              boxShadow: '0 0 8px rgba(29,184,116,0.4)',
            }} />
          {/* علامة دوري */}
          <div className="absolute top-0 w-0.5 h-2"
            style={{
              right: `${markerPct}%`,
              background: '#f5c842',
              boxShadow: '0 0 4px #f5c842',
            }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-jade">الآن: شهر {paidCount}</span>
          <span className="text-[10px] text-gold">دوري: شهر {mySlot}</span>
        </div>
      </div>

      {/* قائمة الأعضاء */}
      <div className="flex flex-col">
        {members.slice(0, 2).map((m, i) => (
          <MemberRow key={m.slot} member={m} monthLabel={getMonthLabel(m.slot)} isLast={false} />
        ))}

        {/* طي الأعضاء المتوسطين */}
        {mySlot > 4 && (
          <div className="flex gap-2 items-start">
            <div className="flex flex-col items-center w-3.5 shrink-0">
              <div className="w-2 h-2 rounded-full mt-1" style={{ background: '#162019' }} />
              <div className="w-px flex-1 min-h-[18px]" style={{ background: 'rgba(63,255,162,0.12)' }} />
            </div>
            <div className="pb-2.5">
              <div className="text-[10px] text-t3">... شهر 3 إلى {mySlot - 1}</div>
            </div>
          </div>
        )}

        {/* دوري */}
        <MemberRow
          member={members.find(m => m.isMe) ?? { slot: mySlot, account: 'KI-2271-9904', isMe: true }}
          monthLabel={getMonthLabel(mySlot)}
          isMe
          isLast={false}
        />

        {/* التالي بعدي */}
        {members.filter(m => m.slot > mySlot).slice(0, 1).map(m => (
          <MemberRow key={m.slot} member={m} monthLabel={getMonthLabel(m.slot)} isLast />
        ))}
      </div>
    </div>
  );
}

function MemberRow({ member, monthLabel, isMe, isLast }) {
  const dotColor = isMe ? '#f5c842' : member.paid ? '#1db874' : '#162019';
  const dotGlow  = isMe ? '0 0 8px rgba(245,200,66,0.5)' : member.paid ? '0 0 4px rgba(29,184,116,0.3)' : 'none';

  return (
    <div className="flex gap-2.5 items-start">
      {/* خط الجدول الزمني */}
      <div className="flex flex-col items-center w-3.5 shrink-0">
        <div className="rounded-full mt-1"
          style={{
            width: isMe ? 11 : 9, height: isMe ? 11 : 9,
            background: dotColor, boxShadow: dotGlow, flexShrink: 0,
          }} />
        {!isLast && (
          <div className="w-px flex-1 min-h-[18px]"
            style={{ background: member.paid ? '#1db874' : 'rgba(63,255,162,0.12)' }} />
        )}
      </div>

      {/* محتوى السطر */}
      <div className="pb-2.5 flex-1">
        <div className="text-[10px] text-t3">{monthLabel} — شهر {member.slot}</div>
        <div className="text-[11px] font-medium mt-0.5"
          style={{ color: '#8ab8a0', fontFamily: '"Courier New", monospace' }}>
          {member.account}
        </div>
        {isMe && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full mt-0.5 inline-block"
            style={{ background: 'rgba(245,200,66,0.15)', color: '#f5c842' }}>
            أنت
          </span>
        )}
      </div>
    </div>
  );
}
