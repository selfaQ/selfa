// استعراض السلفات المتاحة — ثيم داكن مع دورة الحياة الكاملة

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import {
  MOCK_SALAFAT, AMOUNTS, DURATIONS,
  formatIQD, formatShort, calcInstallment,
  seatsLeft, availablePrioritySeats,
  getTimerRemaining, formatTimeRemaining, getDisplaySalafat,
} from '../data/constants';

// ─── بطاقة سلفة واحدة ────────────────────────────────────────────────────────
function SalfaCard({ salafa, onSelect }) {
  const inst = calcInstallment(salafa.amount, salafa.duration);
  const left = seatsLeft(salafa);
  const full = left === 0;
  const pct  = Math.round((salafa.filled / salafa.duration) * 100);

  return (
    <div
      onClick={() => !full && onSelect(salafa.id)}
      className="rounded-2xl p-4 flex flex-col gap-3 transition-all active:scale-[0.99]"
      style={{
        background: '#1a2820',
        border: `1px solid ${full ? 'rgba(255,90,90,0.18)' : 'rgba(63,255,162,0.12)'}`,
        cursor: full ? 'default' : 'pointer',
      }}
    >
      {/* المبلغ والقسط */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[22px] font-bold leading-none"
            style={{ color: '#e8fff5' }}>
            {formatShort(salafa.amount)}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: '#4a7a60' }}>
            {salafa.duration} شهراً · {salafa.duration} عضو
          </div>
        </div>
        <div className="text-left">
          <div className="text-[14px] font-bold" style={{ color: '#3fffa2' }}>
            {formatIQD(inst)}
          </div>
          <div className="text-[9px]" style={{ color: '#4a7a60' }}>/ شهر</div>
        </div>
      </div>

      {/* شريط تقدم الأعضاء */}
      <div>
        <div className="flex justify-between text-[10px] mb-1.5">
          <span style={{ color: '#8ab8a0' }}>{salafa.filled} من {salafa.duration} عضو</span>
          <span style={{ color: full ? '#ff5a5a' : pct > 75 ? '#f5c842' : '#3fffa2', fontWeight: 600 }}>
            {full ? 'مكتملة' : `${left} مقعد متاح`}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(63,255,162,0.08)' }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: full
                ? '#ff5a5a'
                : pct > 75
                  ? 'linear-gradient(90deg, #f5c842, #ff5a5a)'
                  : 'linear-gradient(90deg, #3fffa2, #1db874)',
            }}
          />
        </div>
      </div>

      {/* مؤشرات المقاعد */}
      <div className="flex gap-1.5">
        {salafa.priorityTaken.map((taken, i) => (
          <div
            key={i}
            className="flex-1 rounded-lg py-2 text-center"
            style={{
              background: taken ? 'rgba(255,90,90,0.07)' : 'rgba(245,200,66,0.09)',
              border: `1px solid ${taken ? 'rgba(255,90,90,0.18)' : 'rgba(245,200,66,0.22)'}`,
            }}
          >
            <div className="text-[13px] font-bold leading-none"
              style={{ color: taken ? '#ff5a5a80' : '#f5c842' }}>
              {i + 1}
            </div>
            <div className="text-[8px] mt-0.5"
              style={{ color: taken ? '#ff5a5a50' : '#f5c84280' }}>
              {taken ? 'محجوز' : 'متاح'}
            </div>
          </div>
        ))}
        {/* قرعة */}
        <div
          className="flex-1 rounded-lg py-2 text-center"
          style={{
            background: full ? 'rgba(255,90,90,0.05)' : 'rgba(63,255,162,0.06)',
            border: `1px solid ${full ? 'rgba(255,90,90,0.1)' : 'rgba(63,255,162,0.15)'}`,
          }}
        >
          <div className="text-[13px] leading-none"
            style={{ color: full ? '#ff5a5a40' : '#3fffa2' }}>
            🎲
          </div>
          <div className="text-[8px] mt-0.5" style={{ color: '#4a7a60' }}>
            {full ? 'محجوز' : 'قرعة'}
          </div>
        </div>
      </div>

      {/* تذييل */}
      <div className="flex items-center justify-between text-[10px]"
        style={{ borderTop: '1px solid rgba(63,255,162,0.06)', paddingTop: '8px' }}>
        <span style={{ color: '#4a7a60' }}>البداية: {salafa.startDate}</span>
        {!full && (
          <span style={{ color: '#3fffa2', fontWeight: 700 }}>انضم الآن ←</span>
        )}
      </div>
    </div>
  );
}

// ─── الصفحة الرئيسية ──────────────────────────────────────────────────────────
export default function Browse() {
  const navigate  = useNavigate();
  const [filter,  setFilter]  = useState('');  // '' | amount | duration
  const [timerKey, setTimerKey] = useState(0);

  // تحديث المؤقت كل دقيقة
  useEffect(() => {
    const id = setInterval(() => setTimerKey(k => k + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const displaySalafat = useMemo(() => getDisplaySalafat(MOCK_SALAFAT), []);

  // السلفات المكتملة ذات المؤقت النشط
  const completedWithTimer = useMemo(() => {
    return MOCK_SALAFAT
      .filter(s => s.status === 'completed' && s.completedAt)
      .map(s => ({ ...s, minsLeft: getTimerRemaining(s.completedAt) }))
      .filter(s => s.minsLeft > 0);
  }, [timerKey]);

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter">
      <div className="flex-1 overflow-y-auto p-3 pb-24 flex flex-col gap-3">

        {/* رأس الصفحة */}
        <div className="pt-2">
          <div className="text-[17px] font-bold text-t1">استعرض السلفات</div>
          <div className="text-[10px] text-t3 mt-0.5">
            {displaySalafat.length} سلفة مفتوحة الآن
          </div>
        </div>

        {/* ─── بانر المؤقت ─── */}
        {completedWithTimer.length > 0 && (
          <div className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: '#1f3028', border: '1px solid rgba(245,200,66,0.25)' }}>
            <div className="flex items-center gap-2">
              <span className="text-[18px]">⏱</span>
              <div>
                <div className="text-[12px] font-bold" style={{ color: '#f5c842' }}>
                  سلفات جديدة قادمة
                </div>
                <div className="text-[9px] text-t3">
                  ستُفتح تلقائياً — سارع لتحجز مقعد الأولوية
                </div>
              </div>
            </div>
            {completedWithTimer.map(s => (
              <div key={s.id}
                className="flex items-center justify-between rounded-xl px-3 py-2"
                style={{ background: 'rgba(245,200,66,0.06)', border: '1px solid rgba(245,200,66,0.12)' }}>
                <div>
                  <span className="text-[11px] font-bold text-t1">
                    {formatShort(s.amount)}
                  </span>
                  <span className="text-[10px] text-t3 mr-1.5">
                    · {s.duration} شهر
                  </span>
                </div>
                <span className="text-[13px] font-bold" style={{ color: '#f5c842' }}>
                  {formatTimeRemaining(s.minsLeft)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ─── قائمة السلفات ─── */}
        {displaySalafat.map(s => (
          <SalfaCard
            key={s.id}
            salafa={s}
            onSelect={id => navigate(`/salafa/${id}`)}
          />
        ))}

      </div>
      <BottomNav active="/browse" />
    </div>
  );
}
