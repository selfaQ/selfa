// إنشاء جمعية ذاتية — معالج 5 خطوات

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSalafa } from '../contexts/SalafaContext';
import { formatIQD, calcInstallment, SUBSCRIPTION_FEES } from '../data/constants';
import AmountPicker   from '../components/AmountPicker';
import DurationPicker from '../components/DurationPicker';

const STEP_LABELS = ['المبلغ والمدة', 'إضافة الأعضاء', 'ترتيب الأدوار', 'الملخص', 'الإطلاق'];

// ─── شريط الخطوات ──────────────────────────────────────────────────────────
function StepBar({ current, total }) {
  return (
    <div className="flex items-center gap-1 px-5 py-4">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
            ${i < current ? 'bg-green-500 text-white'
              : i === current ? 'bg-brand text-white'
              : 'bg-slate-200 text-slate-400'}`}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`flex-1 h-0.5 mx-1 ${i < current ? 'bg-green-500' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── الخطوة 1: اختيار المبلغ والمدة ─────────────────────────────────────────
function Step1({ data, setData }) {
  return (
    <div className="space-y-5">
      <AmountPicker selected={data.amount} onChange={v => setData(d => ({ ...d, amount: v }))} />
      <DurationPicker selected={data.duration} onChange={v => setData(d => ({ ...d, duration: v }))} />
      {data.amount && data.duration && (
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500">القسط على كل عضو</p>
          <p className="text-2xl font-black text-gradient">{formatIQD(calcInstallment(data.amount, data.duration))}</p>
          <p className="text-xs text-slate-400 mt-1">
            + {formatIQD(SUBSCRIPTION_FEES[data.duration])} رسوم اشتراك شهرية
          </p>
        </div>
      )}
    </div>
  );
}

// ─── الخطوة 2: إضافة الأعضاء ─────────────────────────────────────────────────
function Step2({ data, setData }) {
  const [input, setInput] = useState('');
  const [err,   setErr]   = useState('');

  const maxMembers = data.duration;

  function addMember() {
    if (!input.trim()) return;
    if (data.members.length >= maxMembers - 1) { setErr('وصلت للحد الأقصى من الأعضاء'); return; }
    if (!input.startsWith('770')) { setErr('رقم Qi Card غير صحيح (يجب أن يبدأ بـ 770)'); return; }
    setErr('');
    setData(d => ({
      ...d,
      members: [...d.members, { id: Date.now(), qicard: input, status: 'pending', name: `عضو ${d.members.length + 2}` }],
    }));
    setInput('');
  }

  function removeMember(id) {
    setData(d => ({ ...d, members: d.members.filter(m => m.id !== id) }));
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        تحتاج {maxMembers - 1 - data.members.length} عضو إضافي لاكتمال المجموعة
        ({data.members.length + 1}/{maxMembers} مع حسابك)
      </p>

      {/* حقل إضافة عضو */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="رقم Qi Card"
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
          dir="ltr"
          onKeyDown={e => e.key === 'Enter' && addMember()}
        />
        <button onClick={addMember}
          className="px-4 py-2 bg-brand text-white text-sm font-bold rounded-lg hover:opacity-90">
          + إضافة
        </button>
      </div>
      {err && <p className="text-xs text-red-500">{err}</p>}

      {/* قائمة الأعضاء المضافين */}
      <div className="space-y-2">
        {/* أنا (المنشئ) */}
        <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">أنا</div>
          <div>
            <p className="text-sm font-semibold text-slate-700">أنت (المنشئ)</p>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">منضم</span>
          </div>
        </div>

        {data.members.map(m => (
          <div key={m.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs">👤</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">{m.name}</p>
              <p className="text-xs text-slate-400 font-mono" dir="ltr">{m.qicard}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">في الانتظار</span>
              <button onClick={() => removeMember(m.id)} className="text-red-400 hover:text-red-600 text-lg">×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── الخطوة 3: ترتيب الأدوار ─────────────────────────────────────────────────
function Step3({ data, setData }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">كيف تريد تحديد من يستلم أولاً؟</p>
      <div className="space-y-3">
        {[
          { id: 'random',  label: 'قرعة إلكترونية', desc: 'يتم اختيار الترتيب عشوائياً بشكل عادل وشفاف', icon: '🎲' },
          { id: 'manual',  label: 'تعيين يدوي',      desc: 'أنت تحدد دور كل عضو بالترتيب',                icon: '✏️' },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => setData(d => ({ ...d, orderMethod: opt.id }))}
            className={`w-full p-4 rounded-xl border-2 text-right transition-all
              ${data.orderMethod === opt.id ? 'border-primary bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{opt.icon}</span>
              <div>
                <p className="font-bold text-slate-800 text-sm">{opt.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── الخطوة 4: الملخص ────────────────────────────────────────────────────────
function Step4({ data }) {
  const inst   = calcInstallment(data.amount, data.duration);
  const subFee = SUBSCRIPTION_FEES[data.duration];

  return (
    <div className="space-y-4">
      <h3 className="font-black text-navy">ملخص الجمعية</h3>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {[
          { label: 'المبلغ',            val: formatIQD(data.amount) },
          { label: 'المدة',             val: `${data.duration} شهراً` },
          { label: 'عدد الأعضاء',      val: data.members.length + 1 },
          { label: 'القسط / عضو',      val: formatIQD(inst) },
          { label: 'رسوم الاشتراك',    val: formatIQD(subFee) + ' / شهر' },
          { label: 'إجمالي أول قسط',   val: formatIQD(inst + subFee), bold: true },
          { label: 'طريقة ترتيب الأدوار', val: data.orderMethod === 'random' ? 'قرعة إلكترونية' : 'يدوي' },
        ].map(r => (
          <div key={r.label} className="flex justify-between px-4 py-3 text-sm">
            <span className="text-slate-500">{r.label}</span>
            <span className={`font-semibold ${r.bold ? 'text-primary' : 'text-slate-800'}`}>{r.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── الصفحة الكاملة ──────────────────────────────────────────────────────────
export default function CreateSalafa() {
  const navigate     = useNavigate();
  const { joinSalafa } = useSalafa();

  const [step, setStep]   = useState(0);
  const [launched, setLaunched] = useState(false);
  const [data, setData]   = useState({
    amount:      5_000_000,
    duration:    10,
    members:     [],
    orderMethod: 'random',
  });

  function canProceed() {
    if (step === 0) return data.amount && data.duration;
    if (step === 1) return data.members.length > 0;
    if (step === 2) return !!data.orderMethod;
    return true;
  }

  function launch() {
    joinSalafa({ ...data, seatType: 'priority', prioritySeat: 1, startDate: '2025-06-01' });
    setLaunched(true);
  }

  if (launched) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center page-enter">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-5">🚀</div>
        <h2 className="text-2xl font-black text-navy mb-2">تم إطلاق الجمعية!</h2>
        <p className="text-slate-500 mb-6">تم إرسال الدعوات للأعضاء. ستبدأ الجمعية بعد موافقتهم.</p>
        <button onClick={() => navigate('/dashboard')}
          className="px-8 py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90">
          اذهب للوحتي
        </button>
      </div>
    );
  }

  const STEP_COMPONENTS = [
    <Step1 data={data} setData={setData} />,
    <Step2 data={data} setData={setData} />,
    <Step3 data={data} setData={setData} />,
    <Step4 data={data} />,
  ];

  return (
    <div className="page-enter">
      <div className="px-5 pt-5">
        <h1 className="text-xl font-black text-navy">أنشئ جمعيتك</h1>
        <p className="text-sm text-slate-500 mt-1">{STEP_LABELS[step]}</p>
      </div>

      <StepBar current={step} total={STEP_LABELS.length - 1} />

      <div className="px-5 pb-32">
        {STEP_COMPONENTS[step]}
      </div>

      {/* أزرار التنقل بين الخطوات */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-slate-100 px-5 py-4 flex gap-3 z-20">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
            رجوع
          </button>
        )}
        {step < STEP_COMPONENTS.length - 1 ? (
          <button
            disabled={!canProceed()}
            onClick={() => setStep(s => s + 1)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all
              ${canProceed() ? 'bg-brand text-white hover:opacity-90' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
            التالي ←
          </button>
        ) : (
          <button onClick={launch}
            className="flex-1 py-3 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition">
            🚀 أطلق الجمعية
          </button>
        )}
      </div>
    </div>
  );
}
