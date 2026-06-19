// تفاصيل السلفة — اختيار المقعد + تأكيد + دفع Qi Card + نجاح

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSalafa } from '../contexts/SalafaContext';
import useStore from '../store/useStore';
import { getGroup, joinGroup, mapGroup } from '../api/groups';
import {
  formatIQD, formatShort, calcInstallment, seatsLeft, MONTHS_AR,
} from '../data/constants';
import PrioritySelector from '../components/PrioritySelector';
import KiCardDisplay from '../components/KiCardDisplay';

function ConfirmModal({ salafa, seat, onConfirm, onCancel }) {
  const inst       = calcInstallment(salafa.amount, salafa.duration);
  const subFee     = Math.round(inst * 0.01);
  const priFee     = seat?.fee ?? 0;
  const joinFee    = subFee + priFee;
  const isPriority = seat?.type === 'priority';
  const start      = new Date(salafa.startDate ? salafa.startDate + '-01' : '2026-07-01');
  const turns      = Array.from({ length: salafa.duration }, (_, i) => {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    return { month: i + 1, label: MONTHS_AR[d.getMonth()] + ' ' + d.getFullYear() };
  });
  const confirmedTurn = isPriority ? seat.seat : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-[480px] rounded-t-3xl max-h-[90vh] overflow-y-auto"
        style={{ background: '#f4f9f6', border: '1px solid rgba(14,165,114,0.20)' }}>
        <div className="w-8 h-1 rounded-full mx-auto mt-4 mb-4" style={{ background: 'rgba(14,165,114,0.25)' }} />
        <div className="text-center text-[15px] font-bold text-t1 pb-3"
          style={{ borderBottom: '1px solid rgba(14,165,114,0.10)' }}>تأكيد الانضمام</div>
        <div className="p-4 flex flex-col gap-3">

          {/* المبلغ والمدة */}
          <div className="rounded-xl p-4 text-center" style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.15)' }}>
            <div className="text-[26px] font-bold" style={{ color: '#0ea572' }}>{formatIQD(salafa.amount)}</div>
            <div className="text-[11px] text-t3 mt-1">{salafa.duration} شهراً · {formatIQD(inst)} / شهر</div>
          </div>

          {/* نوع المقعد + الدور */}
          {isPriority ? (
            <div className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(212,146,10,0.07)', border: '1px solid rgba(212,146,10,0.28)' }}>
              <div className="text-[10px] text-t3">مقعد أولوية #{seat.seat} — دورك مؤكد</div>
              <div className="text-[20px] font-bold mt-1" style={{ color: '#d4920a' }}>
                {turns[confirmedTurn - 1]?.label}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: '#a07010' }}>
                الشهر {confirmedTurn} من السلفة — موعد مضمون
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(14,165,114,0.06)', border: '1px solid rgba(14,165,114,0.18)' }}>
              <div className="text-[10px] text-t3">مقعد قرعة</div>
              <div className="text-[15px] font-bold mt-1 text-mint">🎲 يُحدَّد دورك بعد اكتمال المجموعة</div>
              <div className="text-[10px] text-t3 mt-0.5">ستُبلَّغ بموعدك فور إجراء القرعة</div>
            </div>
          )}

          {/* جدول الرسوم */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(14,165,114,0.10)' }}>
            <div className="px-4 py-2" style={{ background: 'rgba(14,165,114,0.05)', borderBottom: '1px solid rgba(14,165,114,0.08)' }}>
              <span className="text-[9px] font-bold text-t3">المدفوعات</span>
            </div>
            {[
              { label: 'رسوم الاشتراك — مرة واحدة عند البدء', val: formatIQD(subFee), note: true },
              ...(priFee > 0 ? [{ label: `رسوم الأولوية — مقعد #${seat?.seat}`, val: formatIQD(priFee), gold: true }] : []),
              { label: 'الاستقطاع الشهري (قسط فقط)', val: formatIQD(inst), monthly: true },
            ].map(row => (
              <div key={row.label} className="flex justify-between px-4 py-2.5"
                style={{ background: '#ffffff', borderBottom: '1px solid rgba(14,165,114,0.07)' }}>
                <span className="text-[10px] text-t3 flex items-center gap-1">
                  {row.monthly && <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(14,165,114,0.10)', color: '#0ea572' }}>شهري</span>}
                  {row.note && <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,146,10,0.10)', color: '#a07010' }}>مرة واحدة</span>}
                  {row.label}
                </span>
                <span className="text-[12px] font-bold" style={{ color: row.gold ? '#d4920a' : row.monthly ? '#0ea572' : '#0d1f17' }}>{row.val}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3" style={{ background: 'rgba(14,165,114,0.07)' }}>
              <span className="text-[12px] font-bold text-t1">المطلوب الآن عند الانضمام</span>
              <span className="text-[14px] font-bold" style={{ color: '#0ea572' }}>{formatIQD(joinFee)}</span>
            </div>
          </div>

          <div className="flex gap-2 pb-2">
            <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-[13px] font-bold"
              style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.20)', color: '#2e5c43' }}>إلغاء</button>
            <button onClick={() => onConfirm(confirmedTurn)} className="flex-1 py-3 rounded-xl text-[13px] font-bold"
              style={{ background: '#0d8a52', color: '#fff' }}>تأكيد — الدفع →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentScreen({ salafa, seat, myTurn, onPaid }) {
  const { user } = useStore();
  const [status,   setStatus]   = useState('idle');
  const [apiError, setApiError] = useState('');
  const inst    = calcInstallment(salafa.amount, salafa.duration);
  const subFee  = Math.round(inst * 0.01);
  const priFee  = seat?.fee ?? 0;
  const joinFee = subFee + priFee;

  async function handlePay() {
    setStatus('processing');
    setApiError('');
    try {
      await joinGroup(salafa.id);
      setStatus('done');
      setTimeout(onPaid, 900);
    } catch (err) {
      setStatus('error');
      setApiError(err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col page-enter" style={{ background: '#f4f9f6' }}>
      <div className="px-4 pt-10 pb-4 text-center" style={{ borderBottom: '1px solid rgba(14,165,114,0.12)' }}>
        <div className="text-[17px] font-bold text-t1">الدفع عبر Qi Card</div>
        <div className="text-[10px] text-t3 mt-1">سيُخصم المبلغ من رصيد بطاقتك المرتبطة</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        <KiCardDisplay accountNumber={user.accountNumber} name={user.name} accountType={user.accountType} />

        {/* رسوم الانضمام — مرة واحدة */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(14,165,114,0.12)' }}>
          <div className="px-4 py-2.5 flex items-center justify-between"
            style={{ background: 'rgba(212,146,10,0.06)', borderBottom: '1px solid rgba(14,165,114,0.08)' }}>
            <span className="text-[10px] font-bold text-t3">رسوم الانضمام — تُخصم مرة واحدة</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,146,10,0.15)', color: '#a07010' }}>الآن</span>
          </div>
          {[
            { label: 'رسوم الاشتراك (1% من القسط)', val: formatIQD(subFee) },
            ...(priFee > 0 ? [{ label: `رسوم الأولوية — مقعد #${seat?.seat}`, val: formatIQD(priFee), gold: true }] : []),
          ].map(row => (
            <div key={row.label} className="flex justify-between px-4 py-3"
              style={{ background: '#ffffff', borderBottom: '1px solid rgba(14,165,114,0.07)' }}>
              <span className="text-[11px] text-t3">{row.label}</span>
              <span className="text-[12px] font-semibold" style={{ color: row.gold ? '#d4920a' : '#0d1f17' }}>{row.val}</span>
            </div>
          ))}
          <div className="flex justify-between items-center px-4 py-3.5" style={{ background: 'rgba(14,165,114,0.08)' }}>
            <span className="text-[13px] font-bold text-t1">الإجمالي المطلوب الآن</span>
            <span className="text-[18px] font-bold" style={{ color: '#0ea572' }}>{formatIQD(joinFee)}</span>
          </div>
        </div>

        {/* الاستقطاع الشهري — القسط فقط */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(14,165,114,0.12)' }}>
          <div className="px-4 py-2.5 flex items-center justify-between"
            style={{ background: 'rgba(14,165,114,0.05)', borderBottom: '1px solid rgba(14,165,114,0.08)' }}>
            <span className="text-[10px] font-bold text-t3">الاستقطاع الشهري — يبدأ مع انطلاق السلفة</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(14,165,114,0.12)', color: '#0ea572' }}>شهري</span>
          </div>
          <div className="flex justify-between px-4 py-3" style={{ background: '#ffffff' }}>
            <span className="text-[11px] text-t3">القسط الشهري فقط</span>
            <span className="text-[14px] font-bold" style={{ color: '#0ea572' }}>{formatIQD(inst)}</span>
          </div>
          <div className="px-4 py-2" style={{ background: '#f4f9f6' }}>
            <span className="text-[9px] text-t3">رسوم الاشتراك لا تُحسب شهرياً — خُصمت مرة واحدة أعلاه</span>
          </div>
        </div>

        {apiError && (
          <div className="rounded-xl px-3 py-2.5 text-[11px] font-semibold text-center"
            style={{ background: 'rgba(224,53,53,0.07)', color: '#e03535', border: '1px solid rgba(224,53,53,0.18)' }}>
            {apiError}
          </div>
        )}
      </div>
      <div className="p-4" style={{ borderTop: '1px solid rgba(14,165,114,0.12)', background: '#f4f9f6' }}>
        <button
          onClick={status === 'error' ? () => { setStatus('idle'); setApiError(''); } : handlePay}
          disabled={status === 'processing' || status === 'done'}
          className="w-full py-4 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2"
          style={{
            background: status === 'done' ? '#096b41' : status === 'error' ? '#e03535' : '#0d8a52',
            color: '#fff',
            cursor: (status === 'processing' || status === 'done') ? 'not-allowed' : 'pointer',
            opacity: status === 'processing' ? 0.85 : 1,
          }}>
          {status === 'idle'       && 'ادفع ' + formatIQD(joinFee) + ' عبر Qi Card'}
          {status === 'processing' && 'جارٍ معالجة الدفع...'}
          {status === 'done'       && 'تم الدفع بنجاح ✓'}
          {status === 'error'      && 'حدث خطأ — اضغط للمحاولة مجدداً'}
        </button>
        <div className="text-center text-[9px] text-t3 mt-2">مؤمَّن بتشفير Qi Card</div>
      </div>
    </div>
  );
}

function SuccessScreen({ salafa, seat, onDone }) {
  const inst       = calcInstallment(salafa.amount, salafa.duration);
  const subFee     = Math.round(inst * 0.01);
  const isPriority = seat?.type === 'priority';
  const start      = new Date(salafa.startDate ? salafa.startDate + '-01' : '2026-07-01');
  const turns      = Array.from({ length: salafa.duration }, (_, i) => {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    return MONTHS_AR[d.getMonth()] + ' ' + d.getFullYear();
  });
  const confirmedDate = isPriority ? turns[seat.seat - 1] : null;

  const items = [
    { icon: '✓', text: 'تم دفع رسوم الانضمام عبر Qi Card', color: '#0d8a52' },
    { icon: '✓', text: `الاستقطاع الشهري: ${formatIQD(inst)} — يبدأ مع انطلاق السلفة`, color: '#0d8a52' },
    { icon: '✓', text: `رسوم الاشتراك: ${formatIQD(subFee)} — خُصمت مرة واحدة`, color: '#0d8a52' },
    isPriority
      ? { icon: '📅', text: `دورك مؤكد: ${confirmedDate} (الشهر ${seat.seat})`, color: '#d4920a' }
      : { icon: '🎲', text: 'ستُجرى القرعة عند اكتمال المجموعة وسيُبلَّغك بدورك', color: '#0ea572' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-5 text-center page-enter"
      style={{ background: '#f4f9f6' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 text-4xl"
        style={{ background: 'rgba(14,165,114,0.12)' }}>✅</div>
      <div className="text-[26px] font-bold text-mint mb-2">تم الانضمام!</div>
      <div className="text-[13px] text-t2 mb-6 max-w-xs leading-relaxed">
        انضممت لسلفة <span className="font-bold text-t1">{formatShort(salafa.amount)}</span>
        {isPriority && <span style={{ color: '#d4920a' }}> — مقعد أولوية #{seat.seat}</span>}
      </div>
      <div className="w-full rounded-2xl p-4 flex flex-col gap-3 mb-6"
        style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.15)' }}>
        {items.map(item => (
          <div key={item.text} className="flex items-center gap-3 text-right">
            <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ background: item.color, color: '#fff' }}>{item.icon}</span>
            <span className="text-[12px] text-t2">{item.text}</span>
          </div>
        ))}
      </div>
      <button onClick={onDone} className="w-full py-4 rounded-xl text-[14px] font-bold"
        style={{ background: '#0d8a52', color: '#fff' }}>اذهب للرئيسية 🚀</button>
    </div>
  );
}

export default function SalafaDetail() {
  const { id }                      = useParams();
  const navigate                    = useNavigate();
  const { mySalafat, refreshLoans } = useSalafa();
  const { user }                    = useStore();

  const [salafa,       setSalafa]       = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [pendingTurn,  setPendingTurn]  = useState(null);
  const [showPayment,  setShowPayment]  = useState(false);
  const [joinSuccess,  setJoinSuccess]  = useState(false);

  useEffect(() => {
    setLoading(true);
    getGroup(id)
      .then(g  => setSalafa(mapGroup(g)))
      .catch(e => setFetchError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="bg-bg min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="spin" width="28" height="28" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="rgba(14,165,114,0.2)" strokeWidth="2" />
          <path d="M8 2a6 6 0 016 6" stroke="#0ea572" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="text-[11px] text-t3">جارٍ تحميل السلفة...</div>
      </div>
    </div>
  );

  if (fetchError) return (
    <div className="bg-bg min-h-screen flex items-center justify-center p-4">
      <div className="rounded-xl p-5 text-center w-full"
        style={{ background: '#ffffff', border: '1px solid rgba(224,53,53,0.18)' }}>
        <div className="text-[13px] font-bold" style={{ color: '#e03535' }}>فشل تحميل السلفة</div>
        <div className="text-[11px] text-t3 mt-1 mb-3">{fetchError}</div>
        <button onClick={() => navigate(-1)} className="text-[12px] font-bold px-4 py-2 rounded-xl"
          style={{ background: '#0d8a52', color: '#fff' }}>رجوع</button>
      </div>
    </div>
  );

  const inst           = calcInstallment(salafa.amount, salafa.duration);
  const left           = seatsLeft(salafa);
  const maxMonthly     = user.maxInstallment;
  const currentMonthly = mySalafat.reduce(
    (sum, s) => sum + calcInstallment(s.amount, s.duration) + Math.round(calcInstallment(s.amount, s.duration) * 0.01), 0);
  const headroom       = maxMonthly - currentMonthly;
  const newMonthlyCost = inst + Math.round(inst * 0.01);
  const overCap        = maxMonthly > 0 && newMonthlyCost > headroom;
  const canJoin        = !!selectedSeat && left > 0 && !overCap;

  function handleConfirm(myTurn) { setPendingTurn(myTurn); setShowConfirm(false); setShowPayment(true); }
  function handlePaid() { refreshLoans(); setShowPayment(false); setJoinSuccess(true); }

  if (joinSuccess) return <SuccessScreen salafa={salafa} seat={selectedSeat} onDone={() => navigate('/')} />;
  if (showPayment) return <PaymentScreen salafa={salafa} seat={selectedSeat} myTurn={pendingTurn} onPaid={handlePaid} />;

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter">
      {showConfirm && <ConfirmModal salafa={salafa} seat={selectedSeat} onConfirm={handleConfirm} onCancel={() => setShowConfirm(false)} />}

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="p-4 pb-6" style={{ background: '#eaf3ee' }}>
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full flex items-center justify-center border mb-4"
            style={{ background: '#ffffff', borderColor: 'rgba(14,165,114,0.25)', color: '#2e5c43' }}>›</button>
          <div className="text-[10px] text-t3">{salafa.duration} شهراً</div>
          <div className="text-[34px] font-bold leading-tight" style={{ color: '#0ea572' }}>{formatIQD(salafa.amount)}</div>
        </div>

        <div className="p-3 flex flex-col gap-3">
          {(() => {
            // إذا لم يُحدَّد تاريخ بعد، نُقدِّر أول الشهر القادم
            let sDate;
            if (salafa.startDate) {
              sDate = new Date(salafa.startDate + '-01');
            } else {
              sDate = new Date();
              sDate.setDate(1);
              sDate.setMonth(sDate.getMonth() + 1);
            }
            const eDate = new Date(sDate);
            eDate.setMonth(eDate.getMonth() + salafa.duration - 1);
            const startLabel = MONTHS_AR[sDate.getMonth()] + ' ' + sDate.getFullYear();
            const endLabel   = MONTHS_AR[eDate.getMonth()] + ' ' + eDate.getFullYear();
            const isEstimated = !salafa.startDate;
            return (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'القسط الشهري', val: formatIQD(inst), sub: null },
                  { label: isEstimated ? 'تبدأ (تقديري)' : 'تبدأ', val: startLabel, green: true },
                  { label: 'تنتهي',        val: endLabel },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center"
                    style={{ background: '#ffffff', border: `1px solid ${s.green ? 'rgba(14,165,114,0.22)' : 'rgba(14,165,114,0.12)'}` }}>
                    <div className="text-[10px] text-t3">{s.label}</div>
                    <div className="text-[11px] font-bold mt-0.5"
                      style={{ color: s.green ? '#0d8a52' : '#0d1f17' }}>{s.val}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          <div className="rounded-xl p-3" style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.12)' }}>
            <div className="flex justify-between text-[10px] mb-2">
              <span className="text-t3">{salafa.filled} عضو انضم</span>
              <span style={{ color: left === 0 ? '#e03535' : '#0ea572' }}>{left === 0 ? 'مكتملة' : left + ' متاح'}</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(14,165,114,0.10)' }}>
              <div className="h-2 rounded-full" style={{ width: (salafa.filled / salafa.duration * 100) + '%', background: left === 0 ? '#e03535' : 'linear-gradient(90deg, #0ea572, #0d8a52)' }} />
            </div>
          </div>


          {left > 0 && (
            <div className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: '#f0f7f3', border: '1px solid rgba(14,165,114,0.15)' }}>
              <div className="text-[11px] text-t3">مقاعد الأولوية — رسوم حجز لمرة واحدة</div>
              <PrioritySelector amount={salafa.amount} priorityTaken={salafa.priorityTaken} selected={selectedSeat} onChange={setSelectedSeat} />
            </div>
          )}

          {left === 0 && (
            <div className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(224,53,53,0.06)', border: '1px solid rgba(224,53,53,0.18)' }}>
              <div className="text-[12px] font-bold" style={{ color: '#e03535' }}>هذه السلفة مكتملة</div>
              <div className="text-[10px] text-t3 mt-1">انتظر فتح سلفة جديدة من نفس النوع</div>
            </div>
          )}
        </div>
      </div>

      {left > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-3 z-20"
          style={{ background: '#f4f9f6', borderTop: '1px solid rgba(14,165,114,0.12)' }}>
          {overCap ? (
            <div className="rounded-xl p-4 flex flex-col gap-2.5"
              style={{ background: 'rgba(224,53,53,0.05)', border: '1px solid rgba(224,53,53,0.22)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[18px]">🚫</span>
                <div>
                  <div className="text-[13px] font-bold" style={{ color: '#e03535' }}>تجاوز سقف الاستقطاع 40%</div>
                  <div className="text-[10px] text-t3 mt-0.5">الاستقطاع الشهري سيتجاوز الحد المسموح</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'الاستقطاع الحالي',  val: formatIQD(currentMonthly),        red: false },
                  { label: 'الحد الأقصى (40%)', val: formatIQD(maxMonthly),            red: false },
                  { label: 'القسط الجديد',       val: formatIQD(newMonthlyCost),        red: true  },
                  { label: 'الهامش المتبقي',     val: formatIQD(Math.max(0, headroom)), red: headroom <= 0 },
                ].map(r => (
                  <div key={r.label} className="rounded-lg px-3 py-2"
                    style={{ background: r.red ? 'rgba(224,53,53,0.07)' : 'rgba(14,165,114,0.05)', border: '1px solid ' + (r.red ? 'rgba(224,53,53,0.15)' : 'rgba(14,165,114,0.10)') }}>
                    <div className="text-[9px] text-t3">{r.label}</div>
                    <div className="text-[12px] font-bold mt-0.5" style={{ color: r.red ? '#e03535' : '#0d1f17' }}>{r.val}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <button disabled={!canJoin} onClick={() => setShowConfirm(true)}
              className="w-full py-4 rounded-xl text-[14px] font-bold transition-all"
              style={{
                background: canJoin ? '#0d8a52' : '#f0f7f3',
                color: canJoin ? '#fff' : '#6b9b80',
                boxShadow: canJoin ? '0 2px 16px rgba(13,138,82,0.30)' : 'none',
                cursor: canJoin ? 'pointer' : 'not-allowed',
              }}>
              {!selectedSeat ? 'اختر نوع المقعد' : 'انضم للسلفة'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
