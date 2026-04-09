// تفاصيل الجمعية — اختيار المقعد + الانضمام مع نافذة تأكيد

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSalafa } from '../contexts/SalafaContext';
import {
  MOCK_SALAFAT, SUBSCRIPTION_FEES,
  formatIQD, calcInstallment, isLocked, seatsLeft, MONTHS_AR,
} from '../data/constants';
import PrioritySelector from '../components/PrioritySelector';
import MemberList       from '../components/MemberList';
import GuarantorForm    from '../components/GuarantorForm';
import InstallmentBadge from '../components/InstallmentBadge';

// ─── نافذة تأكيد الانضمام ───────────────────────────────────────────────────
function ConfirmModal({ salafa, seat, onConfirm, onCancel }) {
  const inst   = calcInstallment(salafa.amount, salafa.duration);
  const subFee = SUBSCRIPTION_FEES[salafa.duration];
  const priFee = seat?.fee ?? 0;
  const first  = inst + subFee + priFee;

  // توليد جدول الأقساط (10 سطور أول)
  const start = new Date(salafa.startDate ?? '2025-05-01');
  const turns = Array.from({ length: salafa.duration }, (_, i) => {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    return { month: i + 1, date: `${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}` };
  });

  // دور عشوائي في القرعة
  const myTurn = seat?.type === 'priority' ? seat.seat
    : Math.floor(Math.random() * salafa.duration) + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="bg-white w-full max-w-[480px] rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* رأس النافذة */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
          <h2 className="text-lg font-black text-navy text-center">تأكيد الانضمام</h2>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* ملخص الجمعية */}
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-gradient">{formatIQD(salafa.amount)}</p>
            <p className="text-sm text-slate-500 mt-1">{salafa.duration} شهراً</p>
          </div>

          {/* تفاصيل الدفع */}
          <div className="space-y-2">
            {[
              { label: 'القسط الشهري',        val: formatIQD(inst),   color: '' },
              { label: 'رسوم الاشتراك الشهرية', val: formatIQD(subFee), color: 'text-slate-500' },
              priFee > 0
                ? { label: 'رسوم الأولوية (مرة واحدة)', val: formatIQD(priFee), color: 'text-amber-600' }
                : null,
              { label: 'أول قسط إجمالي',       val: formatIQD(first),  color: 'font-bold text-primary', border: true },
            ].filter(Boolean).map(row => (
              <div key={row.label} className={`flex justify-between text-sm py-1 ${row.border ? 'border-t border-slate-200 pt-2 mt-2' : ''}`}>
                <span className="text-slate-500">{row.label}</span>
                <span className={`font-semibold ${row.color}`}>{row.val}</span>
              </div>
            ))}
          </div>

          {/* دورك + تاريخ الاستلام */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500">دورك المتوقع</p>
            <p className="text-xl font-black text-green-600 mt-1">الشهر {myTurn}</p>
            <p className="text-sm text-slate-600">{turns[myTurn - 1]?.date}</p>
          </div>

          {/* جدول الأقساط */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">جميع مواعيد الاستقطاع</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {turns.map(t => (
                <div key={t.month} className={`flex justify-between text-xs px-3 py-1.5 rounded-lg
                  ${t.month === myTurn ? 'bg-green-100 font-bold text-green-700' : 'bg-slate-50 text-slate-600'}`}>
                  <span>الشهر {t.month}</span>
                  <span>{t.date}</span>
                  {t.month === myTurn && <span>← دورك</span>}
                </div>
              ))}
            </div>
          </div>

          {/* تنبيه الخصم التلقائي */}
          <div className="flex gap-2 bg-slate-50 rounded-xl p-3">
            <span className="text-lg shrink-0">✅</span>
            <p className="text-xs text-slate-600">
              يُخصم القسط تلقائياً من راتبك قبل صرفه. لا حاجة لأي إجراء يدوي.
            </p>
          </div>

          {/* أزرار */}
          <div className="flex gap-3 pb-2">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              إلغاء
            </button>
            <button
              onClick={() => onConfirm(myTurn)}
              className="flex-1 py-3 bg-brand text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-md"
            >
              تأكيد الانضمام ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── شاشة نجاح الانضمام ────────────────────────────────────────────────────
function SuccessScreen({ salafa, myTurn, onDone }) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6 text-center page-enter">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5 text-4xl">
        🎉
      </div>
      <h2 className="text-2xl font-black text-navy mb-2">تم الانضمام بنجاح!</h2>
      <p className="text-slate-500 mb-6">
        انضممت لجمعية {formatIQD(salafa.amount)} — دورك الشهر {myTurn}
      </p>
      <button onClick={onDone}
        className="px-8 py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90 transition">
        اذهب للوحتي
      </button>
    </div>
  );
}

// ─── الصفحة الرئيسية ────────────────────────────────────────────────────────
export default function SalafaDetail() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { user, isEmployee } = useAuth();
  const { joinSalafa } = useSalafa();

  const salafa = MOCK_SALAFAT.find(s => s.id === Number(id));

  const [selectedSeat,      setSelectedSeat]      = useState(null);
  const [kafeelConfirmed,   setKafeelConfirmed]   = useState(false);
  const [showConfirm,       setShowConfirm]        = useState(false);
  const [joinedTurn,        setJoinedTurn]         = useState(null);

  if (!salafa) return <div className="text-center py-20 text-slate-400">جمعية غير موجودة</div>;

  const inst   = calcInstallment(salafa.amount, salafa.duration);
  const locked = user ? isLocked(salafa.amount, salafa.duration, user.salary) : false;
  const left   = seatsLeft(salafa);

  // شروط تفعيل زر الانضمام
  const needsKafeel = !isEmployee;
  const canJoin = selectedSeat
    && !locked
    && left > 0
    && (!needsKafeel || kafeelConfirmed);

  function handleJoinConfirm(myTurn) {
    joinSalafa({ ...salafa, seatType: selectedSeat.type, prioritySeat: selectedSeat.seat, selectedTurn: myTurn });
    setShowConfirm(false);
    setJoinedTurn(myTurn);
  }

  if (joinedTurn) {
    return <SuccessScreen salafa={salafa} myTurn={joinedTurn} onDone={() => navigate('/dashboard')} />;
  }

  return (
    <div className="page-enter">
      {showConfirm && (
        <ConfirmModal
          salafa={salafa}
          seat={selectedSeat}
          onConfirm={handleJoinConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* رأس الصفحة */}
      <div className="bg-brand px-5 pt-8 pb-10 text-white">
        <button onClick={() => navigate(-1)} className="text-blue-200 text-sm mb-4 flex items-center gap-1">
          → رجوع
        </button>
        <p className="text-blue-200 text-xs mb-1">{salafa.duration} شهراً</p>
        <h1 className="text-3xl font-black">{formatIQD(salafa.amount)}</h1>
        <div className="flex items-center gap-3 mt-3">
          <InstallmentBadge amount={salafa.amount} duration={salafa.duration} salary={user?.salary ?? 0} />
          <span className="text-xs text-blue-200">البداية: {salafa.startDate}</span>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-32">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'الأعضاء', val: `${salafa.filled}/${salafa.duration}` },
            { label: 'متبقٍ',   val: `${left} مقعد` },
            { label: 'القسط',   val: formatIQD(inst) },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="text-sm font-bold text-navy mt-0.5">{s.val}</p>
            </div>
          ))}
        </div>

        {/* تنبيه مقفول */}
        {locked && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
            <span className="text-red-500 text-lg shrink-0">🔒</span>
            <p className="text-xs text-red-700">
              هذه الجمعية تتجاوز حد 40% من راتبك. لا يمكنك الانضمام إليها.
            </p>
          </div>
        )}

        {/* اختيار المقعد */}
        {!locked && left > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <PrioritySelector
              amount={salafa.amount}
              priorityTaken={salafa.priorityTaken}
              selected={selectedSeat}
              onChange={setSelectedSeat}
            />
          </div>
        )}

        {/* نموذج الكفيل للحسابات الشخصية */}
        {!isEmployee && !locked && left > 0 && (
          <GuarantorForm onConfirm={() => setKafeelConfirmed(true)} />
        )}

        {/* قائمة الأعضاء */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <MemberList filled={salafa.filled} duration={salafa.duration} />
        </div>
      </div>

      {/* زر الانضمام الثابت */}
      {!locked && left > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-slate-100 px-4 py-4 z-20">
          <button
            disabled={!canJoin}
            onClick={() => setShowConfirm(true)}
            className={`w-full py-4 rounded-xl text-base font-bold transition-all
              ${canJoin
                ? 'bg-brand text-white shadow-lg hover:opacity-90 active:scale-[0.99]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
          >
            {!user ? 'سجّل الدخول أولاً'
              : !selectedSeat ? 'اختر نوع المقعد'
              : needsKafeel && !kafeelConfirmed ? 'أكّد الكفيل أولاً'
              : 'انضم للجمعية'}
          </button>
        </div>
      )}
    </div>
  );
}
