// تفاصيل السلفة — اختيار المقعد + تأكيد + نجاح — ثيم داكن

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSalafa } from '../contexts/SalafaContext';
import {
  MOCK_SALAFAT, SUBSCRIPTION_FEES,
  formatIQD, formatShort, calcInstallment, seatsLeft, MONTHS_AR,
} from '../data/constants';
import { PRIORITY_FEES } from '../data/mock';
import PrioritySelector from '../components/PrioritySelector';

// ─── نافذة تأكيد ─────────────────────────────────────────────────────────────
function ConfirmModal({ salafa, seat, onConfirm, onCancel }) {
  const inst   = calcInstallment(salafa.amount, salafa.duration);
  const subFee = SUBSCRIPTION_FEES[salafa.duration] ?? 0;
  const priFee = seat?.fee ?? 0;
  const first  = inst + subFee + priFee;

  const start = new Date(salafa.startDate ?? '2025-05-01');
  const turns = Array.from({ length: salafa.duration }, (_, i) => {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    return { month: i + 1, date: `${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}` };
  });
  const myTurn = seat?.type === 'priority' ? seat.seat
    : Math.floor(Math.random() * salafa.duration) + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-[480px] rounded-t-3xl max-h-[90vh] overflow-y-auto"
        style={{ background: '#111a15', border: '1px solid rgba(63,255,162,0.15)' }}>

        {/* شريط السحب */}
        <div className="w-8 h-1 rounded-full mx-auto mt-4 mb-4"
          style={{ background: 'rgba(63,255,162,0.2)' }} />
        <div className="text-center text-[15px] font-bold text-t1 pb-3"
          style={{ borderBottom: '1px solid rgba(63,255,162,0.1)' }}>
          تأكيد الانضمام
        </div>

        <div className="p-4 flex flex-col gap-3">
          {/* ملخص */}
          <div className="rounded-xl p-4 text-center"
            style={{ background: '#1a2820', border: '1px solid rgba(63,255,162,0.12)' }}>
            <div className="text-[26px] font-bold" style={{ color: '#3fffa2' }}>
              {formatIQD(salafa.amount)}
            </div>
            <div className="text-[11px] text-t3 mt-1">{salafa.duration} شهراً</div>
          </div>

          {/* نوع المقعد */}
          <div className="rounded-xl p-3 text-center"
            style={{
              background: seat?.type === 'priority' ? 'rgba(245,200,66,0.07)' : 'rgba(63,255,162,0.06)',
              border: `1px solid ${seat?.type === 'priority' ? 'rgba(245,200,66,0.22)' : 'rgba(63,255,162,0.15)'}`,
            }}>
            <div className="text-[10px] text-t3">نوع مقعدك</div>
            {seat?.type === 'priority' ? (
              <div className="text-[16px] font-bold mt-1" style={{ color: '#f5c842' }}>
                💰 مقعد أولوية #{seat.seat}
              </div>
            ) : (
              <div className="text-[16px] font-bold mt-1 text-mint">🎲 مقعد قرعة</div>
            )}
          </div>

          {/* تفاصيل الدفع */}
          <div className="flex flex-col gap-0 rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(63,255,162,0.1)' }}>
            {[
              { label: 'القسط الشهري',           val: formatIQD(inst) },
              { label: 'رسوم الاشتراك الشهرية',  val: formatIQD(subFee) },
              ...(priFee > 0 ? [{ label: 'رسوم الأولوية (مرة واحدة)', val: formatIQD(priFee), gold: true }] : []),
            ].map(row => (
              <div key={row.label} className="flex justify-between px-4 py-2.5"
                style={{ background: '#1a2820', borderBottom: '1px solid rgba(63,255,162,0.07)' }}>
                <span className="text-[11px] text-t3">{row.label}</span>
                <span className="text-[12px] font-bold"
                  style={{ color: row.gold ? '#f5c842' : '#e8fff5' }}>
                  {row.val}
                </span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3"
              style={{ background: 'rgba(63,255,162,0.07)' }}>
              <span className="text-[12px] font-bold text-t1">أول قسط إجمالي</span>
              <span className="text-[14px] font-bold" style={{ color: '#3fffa2' }}>
                {formatIQD(first)}
              </span>
            </div>
          </div>

          {/* دورك */}
          <div className="rounded-xl p-3 text-center"
            style={{ background: '#1f3028', border: '1px solid rgba(63,255,162,0.15)' }}>
            <div className="text-[10px] text-t3">دورك المتوقع</div>
            <div className="text-[22px] font-bold mt-1" style={{ color: '#3fffa2' }}>
              الشهر {myTurn}
            </div>
            <div className="text-[11px] text-t2 mt-0.5">{turns[myTurn - 1]?.date}</div>
          </div>

          {/* جدول الأقساط */}
          <div>
            <div className="text-[10px] text-t3 mb-2">جميع مواعيد الاستقطاع</div>
            <div className="flex flex-col gap-0.5 max-h-36 overflow-y-auto rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(63,255,162,0.1)' }}>
              {turns.map(t => (
                <div key={t.month}
                  className="flex justify-between px-3 py-1.5 text-[10px]"
                  style={{
                    background: t.month === myTurn ? 'rgba(63,255,162,0.1)' : '#1a2820',
                    borderBottom: '1px solid rgba(63,255,162,0.05)',
                    color: t.month === myTurn ? '#3fffa2' : '#8ab8a0',
                    fontWeight: t.month === myTurn ? 700 : 400,
                  }}>
                  <span>الشهر {t.month}</span>
                  <span>{t.date}</span>
                  {t.month === myTurn && <span>← دورك 🎉</span>}
                </div>
              ))}
            </div>
          </div>

          {/* أزرار */}
          <div className="flex gap-2 pb-2">
            <button onClick={onCancel}
              className="flex-1 py-3 rounded-xl text-[13px] font-bold transition-all"
              style={{ background: '#1a2820', border: '1px solid rgba(63,255,162,0.15)', color: '#8ab8a0' }}>
              إلغاء
            </button>
            <button onClick={() => onConfirm(myTurn)}
              className="flex-1 py-3 rounded-xl text-[13px] font-bold transition-all"
              style={{ background: '#1db874', color: '#fff', boxShadow: '0 0 14px rgba(29,184,116,0.3)' }}>
              تأكيد الانضمام ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── شاشة النجاح ─────────────────────────────────────────────────────────────
function SuccessScreen({ salafa, myTurn, onDone }) {
  const inst = calcInstallment(salafa.amount, salafa.duration);
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-5 text-center page-enter"
      style={{ background: '#0a0f0d' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 text-4xl"
        style={{ background: 'rgba(63,255,162,0.12)', boxShadow: '0 0 24px rgba(63,255,162,0.2)' }}>
        ✅
      </div>
      <div className="text-[26px] font-bold text-mint mb-2">تم الانضمام!</div>
      <div className="text-[13px] text-t2 mb-6 max-w-xs leading-relaxed">
        انضممت لسلفة <span className="font-bold text-t1">{formatShort(salafa.amount)}</span> —
        دورك <span className="font-bold text-mint">الشهر {myTurn}</span>
      </div>

      <div className="w-full rounded-2xl p-4 flex flex-col gap-3 mb-6"
        style={{ background: '#1a2820', border: '1px solid rgba(63,255,162,0.15)' }}>
        {[
          { icon: '✓', text: `سيُخصم ${formatIQD(inst)} شهرياً من راتبك تلقائياً` },
          { icon: '✓', text: `ستستلم ${formatIQD(salafa.amount)} في الشهر ${myTurn}` },
          { icon: '✓', text: 'تابع تقدمك من صفحة سلفتي' },
        ].map(item => (
          <div key={item.text} className="flex items-center gap-3 text-right">
            <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ background: '#1db874', color: '#fff' }}>
              {item.icon}
            </span>
            <span className="text-[12px] text-t2">{item.text}</span>
          </div>
        ))}
      </div>

      <button onClick={onDone}
        className="w-full py-4 rounded-xl text-[14px] font-bold"
        style={{ background: '#1db874', color: '#fff', boxShadow: '0 0 18px rgba(29,184,116,0.35)' }}>
        اذهب لسلفاتي 🚀
      </button>
    </div>
  );
}

// ─── الصفحة الرئيسية ──────────────────────────────────────────────────────────
export default function SalafaDetail() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const { joinSalafa } = useSalafa();

  const salafa = MOCK_SALAFAT.find(s => s.id === Number(id));

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [joinedTurn,   setJoinedTurn]   = useState(null);

  if (!salafa) return (
    <div className="bg-bg min-h-screen flex items-center justify-center">
      <div className="text-t3">سلفة غير موجودة</div>
    </div>
  );

  const inst = calcInstallment(salafa.amount, salafa.duration);
  const left = seatsLeft(salafa);

  const canJoin = !!selectedSeat && left > 0;

  function handleConfirm(myTurn) {
    joinSalafa({ ...salafa, seatType: selectedSeat.type, prioritySeat: selectedSeat.seat, selectedTurn: myTurn });
    setShowConfirm(false);
    setJoinedTurn(myTurn);
  }

  if (joinedTurn) {
    return <SuccessScreen salafa={salafa} myTurn={joinedTurn} onDone={() => navigate('/dashboard')} />;
  }

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter">
      {showConfirm && (
        <ConfirmModal
          salafa={salafa}
          seat={selectedSeat}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto pb-28">
        {/* رأس */}
        <div className="p-4 pb-6" style={{ background: '#111a15' }}>
          <button onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center border mb-4"
            style={{ background: '#1a2820', borderColor: 'rgba(63,255,162,0.2)', color: '#8ab8a0' }}>
            ›
          </button>
          <div className="text-[10px] text-t3">{salafa.duration} شهراً</div>
          <div className="text-[34px] font-bold leading-tight"
            style={{ color: '#3fffa2', textShadow: '0 0 20px rgba(63,255,162,0.3)' }}>
            {formatIQD(salafa.amount)}
          </div>
          <div className="text-[11px] text-t3 mt-1">البداية: {salafa.startDate}</div>
        </div>

        <div className="p-3 flex flex-col gap-3">
          {/* إحصاءات */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'الأعضاء',  val: `${salafa.filled}/${salafa.duration}` },
              { label: 'متاح',     val: `${left} مقعد` },
              { label: 'القسط',    val: formatIQD(inst) },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: '#1a2820', border: '1px solid rgba(63,255,162,0.1)' }}>
                <div className="text-[10px] text-t3">{s.label}</div>
                <div className="text-[12px] font-bold text-t1 mt-0.5">{s.val}</div>
              </div>
            ))}
          </div>

          {/* شريط التقدم */}
          <div className="rounded-xl p-3"
            style={{ background: '#1a2820', border: '1px solid rgba(63,255,162,0.1)' }}>
            <div className="flex justify-between text-[10px] mb-2">
              <span className="text-t3">{salafa.filled} عضو انضم</span>
              <span style={{ color: left === 0 ? '#ff5a5a' : '#3fffa2' }}>
                {left === 0 ? 'مكتملة' : `${left} متاح`}
              </span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(63,255,162,0.08)' }}>
              <div className="h-2 rounded-full transition-all"
                style={{
                  width: `${(salafa.filled / salafa.duration) * 100}%`,
                  background: left === 0 ? '#ff5a5a' : 'linear-gradient(90deg, #3fffa2, #1db874)',
                }} />
            </div>
          </div>

          {/* اختيار المقعد */}
          {left > 0 && (
            <div className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: '#1f3028', border: '1px solid rgba(63,255,162,0.12)' }}>
              <div className="text-[11px] text-t3">مقاعد الأولوية — رسوم حجز لمرة واحدة</div>
              <PrioritySelector
                amount={salafa.amount}
                priorityTaken={salafa.priorityTaken}
                selected={selectedSeat}
                onChange={setSelectedSeat}
              />
            </div>
          )}

          {left === 0 && (
            <div className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(255,90,90,0.07)', border: '1px solid rgba(255,90,90,0.18)' }}>
              <div className="text-[12px] font-bold" style={{ color: '#ff5a5a' }}>
                هذه السلفة مكتملة
              </div>
              <div className="text-[10px] text-t3 mt-1">انتظر فتح سلفة جديدة من نفس النوع</div>
            </div>
          )}
        </div>
      </div>

      {/* زر الانضمام الثابت */}
      {left > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-3 z-20"
          style={{ background: '#0a0f0d', borderTop: '1px solid rgba(63,255,162,0.1)' }}>
          <button
            disabled={!canJoin}
            onClick={() => setShowConfirm(true)}
            className="w-full py-4 rounded-xl text-[14px] font-bold transition-all"
            style={{
              background:  canJoin ? '#1db874' : '#1a2820',
              color:       canJoin ? '#fff' : '#4a7a60',
              boxShadow:   canJoin ? '0 0 18px rgba(29,184,116,0.35)' : 'none',
              cursor:      canJoin ? 'pointer' : 'not-allowed',
            }}>
            {!selectedSeat ? 'اختر نوع المقعد' : 'انضم للسلفة'}
          </button>
        </div>
      )}
    </div>
  );
}
