// الشاشة الخامسة — إنشاء سلفة ذاتية (مجموعة خاصة)

import { useState, useRef } from 'react';
import MemberRow from '../components/MemberRow';
import BottomNav from '../components/BottomNav';
import { MOCK_SELF_MEMBERS, formatIQD } from '../data/mock';

const AMOUNTS_OPT = [1_000_000, 2_000_000, 5_000_000, 10_000_000];
const COUNTS_OPT  = [6, 8, 10, 12, 18, 24];

export default function SelfSalfaPage() {
  const [amount,    setAmount]    = useState(5_000_000);
  const [count,     setCount]     = useState(10);
  const [drawType,  setDrawType]  = useState('smart_raffle');
  const [members,   setMembers]   = useState(MOCK_SELF_MEMBERS);
  const [newAcc,    setNewAcc]    = useState('');
  const [turnOrder, setTurnOrder] = useState(() =>
    MOCK_SELF_MEMBERS.filter(m => m.status === 'creator' || m.status === 'accepted').map(m => m.id)
  );
  const dragIdx = useRef(null);
  const overIdx = useRef(null);

  const inst     = Math.round(amount / count);
  const accepted = members.filter(m => m.status === 'accepted' || m.status === 'creator').length;
  const canStart = accepted >= 3;

  function addMember() {
    if (!newAcc.trim()) return;
    const newMember = {
      id: Date.now(), account: newAcc.trim(),
      initial: newAcc[3]?.toUpperCase() ?? 'K', status: 'pending',
    };
    setMembers(prev => [...prev, newMember]);
    setNewAcc('');
  }

  const activeMembers = members.filter(m => m.status === 'creator' || m.status === 'accepted');
  const ordered = turnOrder
    .map(id => activeMembers.find(m => m.id === id))
    .filter(Boolean)
    .concat(activeMembers.filter(m => !turnOrder.includes(m.id)));

  function onDragStart(i) { dragIdx.current = i; }
  function onDragOver(e, i) { e.preventDefault(); overIdx.current = i; }
  function onDrop() {
    const from = dragIdx.current;
    const to   = overIdx.current;
    if (from === null || to === null || from === to) return;
    const next = [...ordered.map(m => m.id)];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setTurnOrder(next);
    dragIdx.current = null;
    overIdx.current = null;
  }

  const rowStyle = {
    background: '#ffffff', border: '1px solid rgba(14,165,114,0.15)',
    borderRadius: 9, padding: '9px 11px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  };

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter">
      <div className="flex-1 overflow-y-auto p-3 pb-24 flex flex-col gap-3">
      <div className="pt-2">
        <div className="text-[17px] font-bold text-t1">سلفة ذاتية</div>
        <div className="text-[10px] text-jade mt-0.5">أنشئ مجموعتك الخاصة</div>
      </div>

      <div className="flex flex-col gap-2">
        <div style={rowStyle}>
          <span className="text-[11px] text-t3">المبلغ الكلي</span>
          <select value={amount} onChange={e => setAmount(Number(e.target.value))}
            className="text-[12px] font-bold border-none cursor-pointer"
            style={{ background: 'transparent', color: '#0d1f17', fontFamily: 'Tajawal' }}>
            {AMOUNTS_OPT.map(a => (
              <option key={a} value={a}>{formatIQD(a)}</option>
            ))}
          </select>
        </div>

        <div style={rowStyle}>
          <span className="text-[11px] text-t3">عدد الأعضاء</span>
          <select value={count} onChange={e => setCount(Number(e.target.value))}
            className="text-[12px] font-bold border-none cursor-pointer"
            style={{ background: 'transparent', color: '#0d1f17', fontFamily: 'Tajawal' }}>
            {COUNTS_OPT.map(c => (
              <option key={c} value={c}>{c} أعضاء</option>
            ))}
          </select>
        </div>

        <div style={rowStyle}>
          <span className="text-[11px] text-t3">القسط لكل عضو</span>
          <span className="text-[12px] font-bold text-mint">{formatIQD(inst)}</span>
        </div>

        <div style={rowStyle}>
          <span className="text-[11px] text-t3">ترتيب الاستلام</span>
          <select value={drawType} onChange={e => setDrawType(e.target.value)}
            className="text-[12px] font-bold border-none cursor-pointer"
            style={{ background: 'transparent', color: '#d4920a', fontFamily: 'Tajawal' }}>
            <option value="smart_raffle">قرعة ذكية</option>
            <option value="manual">يدوي</option>
          </select>
        </div>
      </div>

      <div className="h-px" style={{ background: 'rgba(14,165,114,0.15)' }} />

      <div className="text-[11px] text-t3">
        الأعضاء المضافون ({members.length}/{count})
      </div>
      <div className="flex flex-col gap-2">
        {members.map(m => <MemberRow key={m.id} member={m} />)}
      </div>

      {/* ─ ترتيب الأدوار يدوياً ─ */}
      {drawType === 'manual' && ordered.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-t1">ترتيب الأدوار</span>
            <span className="text-[9px] text-t3">اسحب لتغيير الترتيب</span>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(14,165,114,0.15)' }}>
            {/* رأس */}
            <div className="grid px-3 py-2"
              style={{ gridTemplateColumns: '24px 28px 1fr', gap: '8px',
                       background: 'rgba(14,165,114,0.06)', borderBottom: '1px solid rgba(14,165,114,0.10)' }}>
              <span />
              <span className="text-[9px] font-bold text-t3">الدور</span>
              <span className="text-[9px] font-bold text-t3">رقم الحساب</span>
            </div>

            {ordered.map((m, i) => (
              <div key={m.id}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={e => onDragOver(e, i)}
                onDrop={onDrop}
                className="grid items-center px-3 py-2.5 cursor-grab active:cursor-grabbing select-none"
                style={{
                  gridTemplateColumns: '24px 28px 1fr',
                  gap: '8px',
                  background: m.status === 'creator' ? 'rgba(14,165,114,0.04)' : '#ffffff',
                  borderBottom: '1px solid rgba(14,165,114,0.07)',
                  transition: 'background 0.15s',
                }}>

                {/* مقبض السحب */}
                <div className="flex flex-col items-center gap-[3px]">
                  {[0,1,2].map(k => (
                    <div key={k} className="w-3.5 h-[2px] rounded-full"
                      style={{ background: 'rgba(14,165,114,0.30)' }} />
                  ))}
                </div>

                {/* رقم الدور */}
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
                  style={{ background: i === 0 ? '#0d8a52' : 'rgba(14,165,114,0.10)',
                           color: i === 0 ? '#fff' : '#0d8a52' }}>
                  {i + 1}
                </div>

                {/* رقم الحساب */}
                <div>
                  <div className="text-[10px] font-mono font-medium" style={{ color: '#2e5c43' }} dir="ltr">
                    {m.account}
                  </div>
                  {m.status === 'creator' && (
                    <div className="text-[8px]" style={{ color: '#0ea572' }}>أنت</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[9px] text-t3 text-center">
            الشخص الأول يستلم المبلغ في الشهر الأول
          </div>
        </div>
      )}

      <div className="rounded-xl p-2.5 flex gap-2"
        style={{ border: '1px dashed rgba(14,165,114,0.30)', background: '#ffffff' }}>
        <input
          value={newAcc}
          onChange={e => setNewAcc(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addMember()}
          placeholder="أضف عضواً برقم حساب Qi Card"
          className="flex-1 bg-transparent text-[11px] outline-none placeholder:text-t3"
          style={{ color: '#0d1f17', fontFamily: 'Tajawal', direction: 'ltr' }}
        />
        <button onClick={addMember}
          className="text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer"
          style={{ background: 'rgba(14,165,114,0.10)', color: '#0ea572' }}>
          إضافة
        </button>
      </div>

      <button
        disabled={!canStart}
        className="rounded-xl py-3.5 text-center text-[14px] font-bold cursor-pointer transition-all"
        style={{
          background: canStart ? '#0d8a52' : '#f0f7f3',
          color:      canStart ? '#fff'    : '#6b9b80',
          boxShadow:  canStart ? '0 2px 12px rgba(13,138,82,0.3)' : 'none',
          cursor:     canStart ? 'pointer' : 'not-allowed',
        }}>
        ابدأ السلفة — {accepted} من {count}
      </button>
      </div>
      <BottomNav active="/self-salfa" />
    </div>
  );
}
