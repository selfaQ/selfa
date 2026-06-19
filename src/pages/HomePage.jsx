// الرئيسية — معلومات المستخدم + السلفات + نافذة القرعة + تفاصيل السلفة

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import useStore from '../store/useStore';
import { useSalafa } from '../contexts/SalafaContext';
import { formatIQD, formatShort, calcInstallment, MONTHS_AR } from '../data/mock';
import { getGroup, mapGroup } from '../api/groups';

// ─── دوال مساعدة ──────────────────────────────────────────────────────────────

function monthLabel(startDateStr, offset) {
  const d = new Date(startDateStr ? startDateStr + '-01' : '2026-07-01');
  d.setMonth(d.getMonth() + offset);
  return MONTHS_AR[d.getMonth()] + ' ' + d.getFullYear();
}

function monthsElapsed(startDateStr) {
  if (!startDateStr) return 0;
  const start = new Date(startDateStr + '-01');
  const now   = new Date();
  return Math.max(0, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()));
}

// ─── نافذة إشعار نتيجة القرعة (بدون انسحاب) ──────────────────────────────────
function LotteryResultModal({ loan, onClose }) {
  const inst      = calcInstallment(loan.amount, loan.duration);
  const startStr  = loan.nextDeduction?.slice(0, 7) ?? null;
  const turnLabel = loan.myTurn ? monthLabel(startStr, loan.myTurn - 1) : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div className="w-full max-w-[370px] rounded-2xl overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.20)' }}>

        <div className="px-5 pt-5 pb-4 text-center" style={{ borderBottom: '1px solid rgba(14,165,114,0.10)' }}>
          <div className="text-[36px] mb-2">🎲</div>
          <div className="text-[17px] font-bold text-t1">تمت القرعة!</div>
          <div className="text-[11px] text-t3 mt-0.5">سلفة {formatShort(loan.amount)}</div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div className="rounded-xl p-4 text-center"
            style={{ background: 'linear-gradient(135deg,#0ea572,#0d8a52)', color: '#fff' }}>
            <div className="text-[11px] opacity-80">دورك المحدد بالقرعة</div>
            <div className="text-[44px] font-black leading-none mt-1">{loan.myTurn ?? '—'}</div>
            <div className="text-[15px] font-bold mt-1">{turnLabel}</div>
            <div className="text-[10px] opacity-75 mt-1">
              ستستلم {formatIQD(loan.amount)} في هذا الشهر
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(14,165,114,0.10)' }}>
            {[
              { label: 'القسط الشهري',   val: formatIQD(inst) },
              { label: 'مدة السلفة',      val: loan.duration + ' شهراً' },
              { label: 'إجمالي الأقساط', val: formatIQD(inst * loan.duration) },
            ].map(r => (
              <div key={r.label} className="flex justify-between px-4 py-2.5"
                style={{ background: '#ffffff', borderBottom: '1px solid rgba(14,165,114,0.07)' }}>
                <span className="text-[11px] text-t3">{r.label}</span>
                <span className="text-[12px] font-bold text-t1">{r.val}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg px-3 py-2 text-[10px] text-center"
            style={{ background: 'rgba(14,165,114,0.07)', color: '#0d8a52' }}>
            ✓ انضمامك مؤكد — الاستقطاع يبدأ مع انطلاق السلفة
          </div>

          <button onClick={onClose}
            className="w-full py-3 rounded-xl text-[13px] font-bold"
            style={{ background: '#0d8a52', color: '#fff' }}>
            فهمت
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── نافذة تفاصيل السلفة النشطة ──────────────────────────────────────────────
function SalfaSheet({ loan, accountNumber, onClose }) {
  const [group, setGroup] = useState(null);
  const inst     = calcInstallment(loan.amount, loan.duration);
  const startStr = loan.nextDeduction?.slice(0, 7) ?? null;

  useEffect(() => {
    getGroup(loan.groupId).then(g => setGroup(mapGroup(g))).catch(() => {});
  }, [loan.groupId]);

  // جدول الأشهر الكامل
  const months = Array.from({ length: loan.duration }, (_, i) => ({
    num:      i + 1,
    label:    monthLabel(startStr, i),
    isMyTurn: (i + 1) === loan.myTurn,
  }));

  // قائمة الأعضاء من البيانات الحقيقية إن وُجدت
  const members = (group?.members ?? []);
  const hasMembersData = members.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="w-full max-w-[480px] rounded-t-3xl flex flex-col"
        style={{ background: '#f4f9f6', maxHeight: '92vh' }}>

        {/* مقبض + رأس */}
        <div className="shrink-0">
          <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-3"
            style={{ background: 'rgba(14,165,114,0.25)' }} />
          <div className="px-4 pb-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(14,165,114,0.10)' }}>
            <div>
              <div className="text-[20px] font-bold text-t1">{formatShort(loan.amount)}</div>
              <div className="text-[10px] text-t3">
                {loan.duration} شهراً · {formatIQD(inst)} / شهر
                {startStr && ` · ${monthLabel(startStr, 0)} → ${monthLabel(startStr, loan.duration - 1)}`}
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[18px]"
              style={{ background: 'rgba(14,165,114,0.10)', color: '#0ea572' }}>×</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

          {/* ─ دورك ─ */}
          {(() => {
            const lotteryRan = loan.myTurn !== null ||
              loan.confirmationStatus === 'Pending' ||
              loan.confirmationStatus === 'Confirmed';

            if (!lotteryRan) return (
              <div className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(212,146,10,0.08)', border: '1px solid rgba(212,146,10,0.25)' }}>
                <div className="text-[28px] mb-1">🎲</div>
                <div className="text-[14px] font-bold" style={{ color: '#d4920a' }}>بانتظار القرعة</div>
                <div className="text-[10px] text-t3 mt-1">سيُحدَّد دورك بعد اكتمال المجموعة</div>
              </div>
            );

            if (!loan.myTurn) return (
              <div className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(14,165,114,0.08)', border: '1px solid rgba(14,165,114,0.25)' }}>
                <div className="text-[11px] font-bold" style={{ color: '#0d8a52' }}>تمت القرعة</div>
                <div className="text-[10px] text-t3 mt-1">جارٍ تحديد الأدوار...</div>
              </div>
            );

            return (
              <div className="rounded-2xl p-4 text-center"
                style={{ background: 'linear-gradient(135deg,#0ea572,#0d8a52)', color: '#fff' }}>
                <div className="text-[11px] opacity-80 mb-1">دورك في هذه السلفة</div>
                <div className="text-[36px] font-black leading-none">ش {loan.myTurn}</div>
                <div className="text-[16px] font-bold mt-1">{monthLabel(startStr, loan.myTurn - 1)}</div>
                <div className="text-[11px] opacity-75 mt-2">تستلم {formatIQD(loan.amount)} في هذا الشهر</div>
              </div>
            );
          })()}

          {/* ─ الأعضاء ─ */}
          <div>
            <div className="text-[12px] font-bold text-t1 mb-2">
              أعضاء المجموعة
              {hasMembersData && <span className="text-[10px] text-t3 font-normal mr-1">({members.length})</span>}
            </div>

            {hasMembersData ? (
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(14,165,114,0.12)' }}>
                {/* رأس الجدول */}
                <div className="grid grid-cols-3 px-3 py-2"
                  style={{ background: 'rgba(14,165,114,0.07)', borderBottom: '1px solid rgba(14,165,114,0.10)' }}>
                  <span className="text-[9px] font-bold text-t3">رقم الحساب</span>
                  <span className="text-[9px] font-bold text-t3 text-center">الشهر</span>
                  <span className="text-[9px] font-bold text-t3 text-left">التاريخ</span>
                </div>
                {months.map(m => {
                  const member = members.find(mb => mb.lotteryPosition === m.num);
                  const isMe   = m.isMyTurn;
                  return (
                    <div key={m.num}
                      className="grid grid-cols-3 items-center px-3 py-2.5"
                      style={{
                        background: isMe ? 'rgba(14,165,114,0.08)' : '#ffffff',
                        borderBottom: '1px solid rgba(14,165,114,0.06)',
                        border: isMe ? '1.5px solid rgba(14,165,114,0.25)' : undefined,
                      }}>
                      <div className="flex items-center gap-1.5">
                        {isMe && (
                          <span className="text-[8px] px-1 py-0.5 rounded font-bold shrink-0"
                            style={{ background: '#0d8a52', color: '#fff' }}>أنا</span>
                        )}
                        <span className="text-[9px] font-mono text-t2" dir="ltr">
                          {isMe ? accountNumber : (member?.accountNumber ?? `----`)}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-center"
                        style={{ color: isMe ? '#0d8a52' : '#0d1f17' }}>
                        {m.num}
                      </div>
                      <div className="text-[9px] text-t3 text-left">{m.label}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* لا يوجد بيانات أعضاء — اعرض جدول الأشهر فقط */
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(14,165,114,0.12)' }}>
                <div className="grid grid-cols-3 px-3 py-2"
                  style={{ background: 'rgba(14,165,114,0.07)', borderBottom: '1px solid rgba(14,165,114,0.10)' }}>
                  <span className="text-[9px] font-bold text-t3">الشهر</span>
                  <span className="text-[9px] font-bold text-t3 text-center">التاريخ</span>
                  <span className="text-[9px] font-bold text-t3 text-left">العملية</span>
                </div>
                {months.map(m => (
                  <div key={m.num}
                    className="grid grid-cols-3 items-center px-3 py-2.5"
                    style={{
                      background: m.isMyTurn ? 'rgba(14,165,114,0.08)' : '#ffffff',
                      borderBottom: '1px solid rgba(14,165,114,0.06)',
                    }}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: m.isMyTurn ? '#0d8a52' : 'rgba(14,165,114,0.10)',
                                 color: m.isMyTurn ? '#fff' : '#2e5c43' }}>
                        {m.num}
                      </span>
                    </div>
                    <div className="text-[9px] text-t2 text-center">{m.label}</div>
                    <div className="text-[9px] text-left"
                      style={{ color: m.isMyTurn ? '#0d8a52' : '#6b9b80', fontWeight: m.isMyTurn ? 700 : 400 }}>
                      {m.isMyTurn ? `📥 تستلم` : `💳 تدفع`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-[9px] text-t3 text-center pb-1">
            الاستقطاع يتم في اليوم الأول من كل شهر تلقائياً عبر Qi Card
          </div>

          <button onClick={onClose} className="w-full py-3 rounded-xl text-[13px] font-bold"
            style={{ background: '#0d8a52', color: '#fff' }}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}

// ─── بطاقة معلومات المستخدم ───────────────────────────────────────────────────
function UserCard({ user, mySalafat, totalDeduction }) {
  const headroom = user.maxInstallment - totalDeduction;
  const headPct  = user.maxInstallment > 0
    ? Math.max(0, Math.min(100, Math.round((headroom / user.maxInstallment) * 100)))
    : 100;

  const nextDue = mySalafat
    .filter(s => s.nextDeduction)
    .sort((a, b) => a.nextDeduction.localeCompare(b.nextDeduction))[0]?.nextDeduction ?? null;

  const totalMonths = mySalafat.reduce((s, l) => s + l.duration, 0);

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(14,165,114,0.18)', background: '#ffffff' }}>
      <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #0ea572, #0d8a52)' }} />

      <div className="p-4 flex flex-col gap-3">
        {/* أفاتار + اسم + رقم حساب */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-[16px] font-bold"
            style={{ background: 'rgba(14,165,114,0.12)', color: '#0ea572', border: '2px solid rgba(14,165,114,0.25)' }}>
            {(user.name || 'QI').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-t1 truncate">{user.name || 'مستخدم'}</div>
            <div className="text-[10px] text-t3 mt-0.5 font-mono" dir="ltr">{user.accountNumber}</div>
          </div>
          <span className="text-[9px] px-2.5 py-1 rounded-full font-semibold shrink-0"
            style={{ background: 'rgba(14,165,114,0.10)', color: '#0ea572', border: '1px solid rgba(14,165,114,0.15)' }}>
            موظف حكومي
          </span>
        </div>

        <div className="h-px" style={{ background: 'rgba(14,165,114,0.10)' }} />

        {/* إحصاءات الراتب */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl p-2.5" style={{ background: '#f4f9f6' }}>
            <div className="text-[8px] text-t3">الراتب الصافي</div>
            <div className="text-[13px] font-bold text-mint mt-0.5">
              {user.salary > 0 ? formatIQD(user.salary) : '—'}
            </div>
          </div>
          <div className="rounded-xl p-2.5" style={{ background: '#f4f9f6' }}>
            <div className="text-[8px] text-t3">سقف الأقساط (40%)</div>
            <div className="text-[13px] font-bold text-t1 mt-0.5">
              {user.maxInstallment > 0 ? formatIQD(user.maxInstallment) : '—'}
            </div>
          </div>
        </div>

        {/* شريط الطاقة */}
        {user.maxInstallment > 0 && (
          <div>
            <div className="flex justify-between text-[9px] mb-1.5">
              <span className="text-t3">الطاقة المتبقية للأقساط</span>
              <span style={{ color: headroom <= 0 ? '#e03535' : '#0ea572', fontWeight: 600 }}>
                {headroom <= 0 ? 'مكتملة' : formatIQD(headroom)}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(14,165,114,0.10)' }}>
              <div className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${100 - headPct}%`,
                  background: headPct < 20
                    ? 'linear-gradient(90deg, #d4920a, #e03535)'
                    : 'linear-gradient(90deg, #0ea572, #0d8a52)',
                }} />
            </div>
            <div className="flex justify-between text-[9px] mt-1">
              <span className="text-t3">مستخدم: {formatIQD(totalDeduction)}</span>
              <span className="text-t3">{100 - headPct}%</span>
            </div>
          </div>
        )}

        {/* الوقت والأشهر */}
        {mySalafat.length > 0 && (
          <>
            <div className="h-px" style={{ background: 'rgba(14,165,114,0.08)' }} />
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl p-2.5 text-center" style={{ background: '#f4f9f6' }}>
                <div className="text-[8px] text-t3">سلفات نشطة</div>
                <div className="text-[16px] font-bold text-mint mt-0.5">{mySalafat.length}</div>
              </div>
              <div className="rounded-xl p-2.5 text-center" style={{ background: '#f4f9f6' }}>
                <div className="text-[8px] text-t3">إجمالي الأشهر</div>
                <div className="text-[16px] font-bold text-t1 mt-0.5">{totalMonths}</div>
              </div>
              <div className="rounded-xl p-2.5 text-center" style={{ background: '#f4f9f6' }}>
                <div className="text-[8px] text-t3">أقرب استقطاع</div>
                <div className="text-[10px] font-bold text-t1 mt-0.5">{nextDue ?? '—'}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── بطاقة سلفة نشطة ─────────────────────────────────────────────────────────
function SalfaCard({ salafa, onClick }) {
  const inst      = calcInstallment(salafa.amount, salafa.duration);
  const startStr  = salafa.nextDeduction?.slice(0, 7) ?? null;
  const elapsed   = monthsElapsed(startStr);
  const paid      = Math.min(elapsed, salafa.duration);
  const pct       = Math.round((paid / salafa.duration) * 100);
  const received  = salafa.myTurn !== null && paid >= salafa.myTurn;
  const isPending = salafa.confirmationStatus === 'Pending';

  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
      style={{ border: `1px solid ${isPending ? 'rgba(212,146,10,0.40)' : 'rgba(14,165,114,0.15)'}`, background: '#ffffff' }}
      onClick={onClick}>

      {isPending && (
        <div className="px-3 py-1.5 text-[10px] font-bold text-center"
          style={{ background: 'rgba(212,146,10,0.10)', color: '#d4920a', borderBottom: '1px solid rgba(212,146,10,0.20)' }}>
          🎲 تمت القرعة — اضغط لعرض دورك
        </div>
      )}

      <div className="px-4 pt-3.5 pb-3 flex items-start justify-between">
        <div>
          <div className="text-[22px] font-bold leading-none text-t1">{formatShort(salafa.amount)}</div>
          <div className="text-[10px] text-t3 mt-0.5">{salafa.duration} شهراً · {formatIQD(inst)} / شهر</div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
            style={salafa.seatType === 'priority'
              ? { background: 'rgba(212,146,10,0.10)', color: '#d4920a', border: '1px solid rgba(212,146,10,0.20)' }
              : { background: 'rgba(14,165,114,0.08)', color: '#0ea572', border: '1px solid rgba(14,165,114,0.15)' }}>
            {salafa.seatType === 'priority' ? `💰 أولوية #${salafa.prioritySeat}` : '🎲 قرعة'}
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full"
            style={received
              ? { background: 'rgba(14,165,114,0.08)', color: '#0ea572' }
              : { background: 'rgba(14,165,114,0.05)', color: '#6b9b80' }}>
            {received ? '✓ استلمت' : salafa.myTurn ? `دوري: ش${salafa.myTurn}` : isPending ? '🎲 القرعة جاهزة' : '⏳ بانتظار القرعة'}
          </span>
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="px-4 pb-3">
        <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(14,165,114,0.10)' }}>
          <div className="h-1.5 rounded-full transition-all"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0ea572, #0d8a52)' }} />
        </div>
        <div className="flex justify-between text-[9px]">
          <span className="text-t3">الشهر {paid} من {salafa.duration}</span>
          <span className="text-t3">{salafa.duration - paid} شهر متبقٍ · {pct}%</span>
        </div>
      </div>

      {/* تذييل */}
      <div className="px-4 py-2.5 flex items-center justify-between"
        style={{ background: '#f4f9f6', borderTop: '1px solid rgba(14,165,114,0.08)' }}>
        <div className="flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#6b9b80" strokeWidth="1.5" />
            <path d="M8 5v3l2 2" stroke="#6b9b80" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[9px] text-t3">الاستقطاع القادم</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-t2">{salafa.nextDeduction ?? 'تحديد قريباً'}</span>
          <span className="text-[9px] text-t3">← تفاصيل</span>
        </div>
      </div>
    </div>
  );
}

// ─── الصفحة الرئيسية ──────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const { user }                                                   = useStore();
  const { mySalafat, loadingLoans }  = useSalafa();

  const [activeSheet,  setActiveSheet]  = useState(null);
  const [lotteryModal, setLotteryModal] = useState(null);

  const totalDeduction = mySalafat.reduce(
    (sum, s) => sum + calcInstallment(s.amount, s.duration), 0);

  const lotteryRan    = s => s.myTurn !== null || s.confirmationStatus === 'Pending' || s.confirmationStatus === 'Confirmed';
  const activeSalfas  = mySalafat.filter(lotteryRan);
  const waitingSalfas = mySalafat.filter(s => !lotteryRan(s));
  const pendingLoan   = mySalafat.find(s => s.confirmationStatus === 'Pending');

  function handleSalfaClick(loan) {
    if (loan.confirmationStatus === 'Pending') {
      setLotteryModal(loan);
    } else {
      setActiveSheet(loan);
    }
  }

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter">

      {/* بانر القرعة المعلقة */}
      {pendingLoan && !lotteryModal && (
        <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-[430px] px-3 pt-3 pointer-events-auto">
            <button className="w-full rounded-xl px-3 py-2.5 flex items-center gap-2 text-right"
              style={{ background: 'rgba(212,146,10,0.14)', border: '1px solid rgba(212,146,10,0.40)' }}
              onClick={() => setLotteryModal(pendingLoan)}>
              <span className="text-[16px]">🎲</span>
              <div className="flex-1">
                <div className="text-[11px] font-bold" style={{ color: '#d4920a' }}>
                  تمت القرعة — دورك الشهر {pendingLoan.myTurn}
                </div>
                <div className="text-[9px] text-t3">اضغط لعرض تفاصيل دورك</div>
              </div>
              <span style={{ color: '#d4920a', fontSize: 16 }}>›</span>
            </button>
          </div>
        </div>
      )}

      {/* نوافذ */}
      {lotteryModal && (
        <LotteryResultModal loan={lotteryModal} onClose={() => setLotteryModal(null)} />
      )}
      {activeSheet && (
        <SalfaSheet loan={activeSheet} accountNumber={user.accountNumber} onClose={() => setActiveSheet(null)} />
      )}

      {/* المحتوى */}
      <div className="flex-1 overflow-y-auto p-3 pb-24 flex flex-col gap-3"
        style={{ paddingTop: pendingLoan && !lotteryModal ? '64px' : '12px' }}>

        <div className="pt-2 flex items-center justify-between">
          <div>
            <div className="text-[17px] font-bold text-t1">الرئيسية</div>
            <div className="text-[10px] text-t3 mt-0.5">مرحباً، {(user.name || 'مستخدم').split(' ')[0]}</div>
          </div>
          {mySalafat.length > 0 && (
            <div className="text-left">
              <div className="text-[9px] text-t3">إجمالي الاستقطاع</div>
              <div className="text-[13px] font-bold" style={{ color: '#d4920a' }}>
                {formatIQD(totalDeduction)} / شهر
              </div>
            </div>
          )}
        </div>

        <UserCard user={user} mySalafat={mySalafat} totalDeduction={totalDeduction} />

        {loadingLoans ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map(i => (
              <div key={i} className="rounded-2xl p-5 animate-pulse"
                style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.10)' }}>
                <div className="h-4 w-28 rounded mb-3" style={{ background: 'rgba(14,165,114,0.10)' }} />
                <div className="h-3 w-20 rounded" style={{ background: 'rgba(14,165,114,0.07)' }} />
              </div>
            ))}
          </div>
        ) : mySalafat.length > 0 ? (
          <>
            {/* ─ سلفات جرت قرعتها ─ */}
            {activeSalfas.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-t1">سلفاتي الجارية</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(14,165,114,0.10)', color: '#0ea572' }}>
                    {activeSalfas.length} سلفة
                  </span>
                </div>
                {activeSalfas.map(s => (
                  <SalfaCard key={s.id} salafa={s} onClick={() => handleSalfaClick(s)} />
                ))}
              </>
            )}

            {/* ─ سلفات بانتظار القرعة ─ */}
            {waitingSalfas.length > 0 && (
              <>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[12px] font-bold text-t1">بانتظار القرعة</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(212,146,10,0.10)', color: '#d4920a' }}>
                    {waitingSalfas.length} سلفة
                  </span>
                </div>
                {waitingSalfas.map(s => (
                  <SalfaCard key={s.id} salafa={s} onClick={() => handleSalfaClick(s)} />
                ))}
              </>
            )}
          </>
        ) : (
          <div className="rounded-2xl p-8 text-center flex flex-col items-center gap-3"
            style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.10)' }}>
            <div className="text-[40px]">📋</div>
            <div className="text-[14px] font-bold text-t2">لا توجد سلفات نشطة</div>
            <div className="text-[11px] text-t3 mb-1">انضم لسلفة واستفد من النظام</div>
            <button onClick={() => navigate('/browse')}
              className="text-[12px] font-bold px-4 py-2 rounded-xl"
              style={{ background: '#0d8a52', color: '#fff' }}>
              استعرض السلفات
            </button>
          </div>
        )}
      </div>

      <BottomNav active="/" />
    </div>
  );
}
