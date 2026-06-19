// متتبع المخطط الزمني — شريط تقدم + قائمة أعضاء مع تظليل دوري

import { MOCK_ACTIVE_SALFA, MONTHS_AR } from '../data/mock';

export default function TimelineTracker() {
  const { duration, paidCount, mySlot, members, startMonth } = MOCK_ACTIVE_SALFA;

  const startYear  = 2025;
  const startMonthIdx = 0;

  function getMonthLabel(slot) {
    const idx  = (startMonthIdx + slot - 1) % 12;
    const year = startYear + Math.floor((startMonthIdx + slot - 1) / 12);
    return `${MONTHS_AR[idx]} ${year}`;
  }

  const fillPct   = (paidCount / duration) * 100;
  const markerPct = (mySlot   / duration) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px] text-t3">{startMonth}</span>
          <span className="text-[10px] text-t3">{getMonthLabel(duration)}</span>
        </div>
        <div className="h-2 rounded-full overflow-visible relative"
          style={{ background: '#ddeee6' }}>
          <div className="h-full rounded-full absolute right-0 top-0 transition-all"
            style={{
              width: `${fillPct}%`,
              background: '#0d8a52',
              boxShadow: '0 1px 6px rgba(13,138,82,0.3)',
            }} />
          <div className="absolute top-0 w-0.5 h-2"
            style={{
              right: `${markerPct}%`,
              background: '#d4920a',
              boxShadow: '0 0 4px rgba(212,146,10,0.5)',
            }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-jade">الآن: شهر {paidCount}</span>
          <span className="text-[10px] text-gold">دوري: شهر {mySlot}</span>
        </div>
      </div>

      <div className="flex flex-col">
        {members.slice(0, 2).map((m, i) => (
          <MemberRow key={m.slot} member={m} monthLabel={getMonthLabel(m.slot)} isLast={false} />
        ))}

        {mySlot > 4 && (
          <div className="flex gap-2 items-start">
            <div className="flex flex-col items-center w-3.5 shrink-0">
              <div className="w-2 h-2 rounded-full mt-1" style={{ background: '#ddeee6' }} />
              <div className="w-px flex-1 min-h-[18px]" style={{ background: 'rgba(14,165,114,0.15)' }} />
            </div>
            <div className="pb-2.5">
              <div className="text-[10px] text-t3">... شهر 3 إلى {mySlot - 1}</div>
            </div>
          </div>
        )}

        <MemberRow
          member={members.find(m => m.isMe) ?? { slot: mySlot, account: 'KI-2271-9904', isMe: true }}
          monthLabel={getMonthLabel(mySlot)}
          isMe
          isLast={false}
        />

        {members.filter(m => m.slot > mySlot).slice(0, 1).map(m => (
          <MemberRow key={m.slot} member={m} monthLabel={getMonthLabel(m.slot)} isLast />
        ))}
      </div>
    </div>
  );
}

function MemberRow({ member, monthLabel, isMe, isLast }) {
  const dotColor = isMe ? '#d4920a' : member.paid ? '#0d8a52' : '#ddeee6';
  const dotGlow  = isMe ? '0 0 6px rgba(212,146,10,0.4)' : member.paid ? '0 0 4px rgba(13,138,82,0.25)' : 'none';

  return (
    <div className="flex gap-2.5 items-start">
      <div className="flex flex-col items-center w-3.5 shrink-0">
        <div className="rounded-full mt-1"
          style={{
            width: isMe ? 11 : 9, height: isMe ? 11 : 9,
            background: dotColor, boxShadow: dotGlow, flexShrink: 0,
          }} />
        {!isLast && (
          <div className="w-px flex-1 min-h-[18px]"
            style={{ background: member.paid ? '#0d8a52' : 'rgba(14,165,114,0.15)' }} />
        )}
      </div>

      <div className="pb-2.5 flex-1">
        <div className="text-[10px] text-t3">{monthLabel} — شهر {member.slot}</div>
        <div className="text-[11px] font-medium mt-0.5"
          style={{ color: '#2e5c43', fontFamily: '"Courier New", monospace' }}>
          {member.account}
        </div>
        {isMe && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full mt-0.5 inline-block"
            style={{ background: 'rgba(212,146,10,0.12)', color: '#d4920a' }}>
            أنت
          </span>
        )}
      </div>
    </div>
  );
}
