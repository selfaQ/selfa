// الشاشة الخامسة — إنشاء سلفة ذاتية (مجموعة خاصة)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberRow from '../components/MemberRow';
import { MOCK_SELF_MEMBERS, formatIQD } from '../data/mock';

const AMOUNTS_OPT = [1_000_000, 2_000_000, 5_000_000, 10_000_000];
const COUNTS_OPT  = [6, 8, 10, 12, 18, 24];

export default function SelfSalfaPage() {
  const navigate = useNavigate();
  const [amount,  setAmount]  = useState(5_000_000);
  const [count,   setCount]   = useState(10);
  const [drawType, setDrawType] = useState('smart_raffle');
  const [members, setMembers] = useState(MOCK_SELF_MEMBERS);
  const [newAcc,  setNewAcc]  = useState('');

  const inst     = Math.round(amount / count);
  const accepted = members.filter(m => m.status === 'accepted' || m.status === 'creator').length;
  const canStart = accepted >= 3;

  function addMember() {
    if (!newAcc.trim()) return;
    setMembers(prev => [...prev, {
      id: Date.now(), account: newAcc.trim(),
      initial: newAcc[3]?.toUpperCase() ?? 'K', status: 'pending',
    }]);
    setNewAcc('');
  }

  const rowStyle = {
    background: '#1a2820', border: '1px solid rgba(63,255,162,0.12)',
    borderRadius: 9, padding: '9px 11px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  };

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter p-3 gap-3 pb-6">
      {/* رأس */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center border cursor-pointer"
          style={{ background: '#1a2820', borderColor: 'rgba(63,255,162,0.2)', color: '#8ab8a0' }}>
          ›
        </button>
        <div>
          <div className="text-[17px] font-bold text-t1">سلفة ذاتية</div>
          <div className="text-[10px] text-jade mt-0.5">أنت المنشئ</div>
        </div>
      </div>

      {/* إعدادات السلفة */}
      <div className="flex flex-col gap-2">
        {/* المبلغ */}
        <div style={rowStyle}>
          <span className="text-[11px] text-t3">المبلغ الكلي</span>
          <select value={amount} onChange={e => setAmount(Number(e.target.value))}
            className="text-[12px] font-bold border-none cursor-pointer"
            style={{ background: 'transparent', color: '#e8fff5', fontFamily: 'Tajawal' }}>
            {AMOUNTS_OPT.map(a => (
              <option key={a} value={a}>{formatIQD(a)}</option>
            ))}
          </select>
        </div>

        {/* عدد الأعضاء */}
        <div style={rowStyle}>
          <span className="text-[11px] text-t3">عدد الأعضاء</span>
          <select value={count} onChange={e => setCount(Number(e.target.value))}
            className="text-[12px] font-bold border-none cursor-pointer"
            style={{ background: 'transparent', color: '#e8fff5', fontFamily: 'Tajawal' }}>
            {COUNTS_OPT.map(c => (
              <option key={c} value={c}>{c} أعضاء</option>
            ))}
          </select>
        </div>

        {/* القسط — محسوب تلقائياً */}
        <div style={rowStyle}>
          <span className="text-[11px] text-t3">القسط لكل عضو</span>
          <span className="text-[12px] font-bold text-mint">{formatIQD(inst)}</span>
        </div>

        {/* نوع القرعة */}
        <div style={rowStyle}>
          <span className="text-[11px] text-t3">ترتيب الاستلام</span>
          <select value={drawType} onChange={e => setDrawType(e.target.value)}
            className="text-[12px] font-bold border-none cursor-pointer"
            style={{ background: 'transparent', color: '#f5c842', fontFamily: 'Tajawal' }}>
            <option value="smart_raffle">قرعة ذكية</option>
            <option value="manual">يدوي</option>
          </select>
        </div>
      </div>

      {/* فاصل */}
      <div className="h-px" style={{ background: 'rgba(63,255,162,0.12)' }} />

      {/* قائمة الأعضاء */}
      <div className="text-[11px] text-t3">
        الأعضاء المضافون ({members.length}/{count})
      </div>
      <div className="flex flex-col gap-2">
        {members.map(m => <MemberRow key={m.id} member={m} />)}
      </div>

      {/* إضافة عضو */}
      <div className="rounded-xl p-2.5 flex gap-2"
        style={{ border: '1px dashed rgba(63,255,162,0.25)' }}>
        <input
          value={newAcc}
          onChange={e => setNewAcc(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addMember()}
          placeholder="أضف عضواً برقم حساب ki Card"
          className="flex-1 bg-transparent text-[11px] outline-none placeholder:text-t3"
          style={{ color: '#e8fff5', fontFamily: 'Tajawal', direction: 'ltr' }}
        />
        <button onClick={addMember}
          className="text-[11px] font-bold px-3 py-1 rounded-lg cursor-pointer"
          style={{ background: 'rgba(63,255,162,0.12)', color: '#3fffa2' }}>
          إضافة
        </button>
      </div>

      {/* زر البدء */}
      <button
        disabled={!canStart}
        className="rounded-xl py-3.5 text-center text-[14px] font-bold mt-auto cursor-pointer transition-all"
        style={{
          background: canStart ? '#1db874' : '#1a2820',
          color:      canStart ? '#fff'    : '#4a7a60',
          boxShadow:  canStart ? '0 0 14px rgba(29,184,116,0.3)' : 'none',
          cursor:     canStart ? 'pointer' : 'not-allowed',
        }}>
        ابدأ السلفة — {accepted} من {count}
      </button>
    </div>
  );
}
