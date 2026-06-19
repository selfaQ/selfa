// الصفحة الرئيسية / صفحة التسويق — شرح الفكرة وكيفية الاستخدام

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AMOUNTS, DURATIONS, calcInstallment, formatIQD, formatShort, isLocked } from '../data/constants';

// ─── قسم: كيف يعمل النظام (4 خطوات) ────────────────────────────────────────
const STEPS = [
  { icon: '📱', title: 'افتح التطبيق', desc: 'سجّل دخولك ببطاقة Qi Card الخاصة بك' },
  { icon: '🎯', title: 'اختر جمعيتك',  desc: 'حدد المبلغ والمدة التي تناسب راتبك' },
  { icon: '🪑', title: 'احجز مقعدك',   desc: 'اختر مقعداً بأولوية أو شارك بالقرعة مجاناً' },
  { icon: '💰', title: 'استلم تلقائياً', desc: 'يُخصم قسطك من الراتب ويُضاف مبلغك في موعده' },
];

// ─── أنواع المستخدمين ────────────────────────────────────────────────────────
const USER_TYPES = [
  {
    icon: '🏛️', title: 'موظف حكومي',
    color: 'from-blue-500 to-blue-700',
    points: ['موافقة فورية', 'بدون كفيل', 'خصم تلقائي من الراتب'],
  },
  {
    icon: '🏢', title: 'موظف قطاع خاص',
    color: 'from-violet-500 to-violet-700',
    points: ['موافقة فورية', 'بدون كفيل', 'خصم تلقائي من الراتب'],
  },
  {
    icon: '👤', title: 'حساب شخصي',
    color: 'from-slate-500 to-slate-700',
    points: ['يتطلب كفيلاً حكومياً', 'موافقة الكفيل عبر التطبيق', 'خصم من راتب الكفيل عند التخلف'],
  },
];

export default function Home() {
  // الآلة الحاسبة التفاعلية
  const [calcAmount,   setCalcAmount]   = useState(5_000_000);
  const [calcDuration, setCalcDuration] = useState(10);
  const [calcSalary,   setCalcSalary]   = useState('');

  const inst  = calcInstallment(calcAmount, calcDuration);
  const ratio = calcSalary > 0 ? ((inst / Number(calcSalary)) * 100).toFixed(1) : null;
  const locked = calcSalary > 0 && isLocked(calcAmount, calcDuration, Number(calcSalary));

  return (
    <div className="page-enter">

      {/* ════ HERO ════ */}
      <section className="bg-brand px-5 pt-10 pb-14 text-white text-center relative overflow-hidden">
        {/* دوائر زخرفية */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            🇮🇶 داخل تطبيق Qi Card
          </span>
          <h1 className="text-3xl font-black leading-snug mb-3">
            الجمعية الذكية<br />بدون تعقيد
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
            انضم لجمعية توفير رقمية آمنة، وخصوماتك تلقائية من الراتب — لا متابعة، لا ضغط.
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg"
          >
            ابدأ الآن ←
          </Link>
        </div>
      </section>

      {/* ════ إحصائيات سريعة ════ */}
      <section className="grid grid-cols-4 gap-1 px-4 -mt-6 relative z-20">
        {[
          { n: '7', label: 'مبالغ' },
          { n: '3', label: 'مدد' },
          { n: '40%', label: 'قاعدة ذكية' },
          { n: '0', label: 'دفع يدوي' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-md p-2.5 text-center border border-slate-100">
            <p className="text-gradient font-black text-lg leading-none">{s.n}</p>
            <p className="text-slate-500 text-[10px] mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ════ كيف يعمل ════ */}
      <section className="px-5 py-8">
        <h2 className="text-lg font-black text-navy mb-5 text-center">كيف تعمل سلفة Q؟</h2>
        <div className="grid grid-cols-2 gap-3">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <span className="text-2xl">{s.icon}</span>
              <p className="font-bold text-slate-800 text-sm mt-2">{s.title}</p>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{s.desc}</p>
              <span className="inline-block mt-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                خطوة {i + 1}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ════ الآلة الحاسبة ════ */}
      <section className="px-5 pb-8">
        <h2 className="text-lg font-black text-navy mb-4 text-center">احسب قسطك</h2>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">

          {/* اختيار المبلغ */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">المبلغ</p>
            <div className="flex flex-wrap gap-2">
              {AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => setCalcAmount(a)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all
                    ${calcAmount === a ? 'bg-brand text-white border-transparent' : 'border-slate-200 text-slate-600'}`}
                >
                  {formatShort(a)}
                </button>
              ))}
            </div>
          </div>

          {/* اختيار المدة */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">المدة</p>
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setCalcDuration(d)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all
                    ${calcDuration === d ? 'bg-brand text-white border-transparent' : 'border-slate-200 text-slate-600'}`}
                >
                  {d} شهر
                </button>
              ))}
            </div>
          </div>

          {/* إدخال الراتب */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">راتبك الشهري (اختياري)</p>
            <input
              type="number"
              placeholder="مثال: 1500000"
              value={calcSalary}
              onChange={e => setCalcSalary(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              dir="ltr"
            />
          </div>

          {/* النتيجة */}
          <div className={`rounded-xl p-4 text-center ${locked ? 'bg-red-50' : 'bg-blue-50'}`}>
            <p className="text-xs text-slate-500 mb-1">القسط الشهري</p>
            <p className={`text-2xl font-black ${locked ? 'text-red-600' : 'text-gradient'}`}>
              {formatIQD(inst)}
            </p>
            {ratio && (
              <p className={`text-xs mt-1 font-semibold ${locked ? 'text-red-500' : 'text-green-600'}`}>
                {locked
                  ? `⚠️ ${ratio}% من راتبك — يتجاوز حد الـ 40%`
                  : `✓ ${ratio}% من راتبك — ضمن الحد المسموح`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ════ أنواع المستخدمين ════ */}
      <section className="px-5 pb-8">
        <h2 className="text-lg font-black text-navy mb-4 text-center">من يستطيع الانضمام؟</h2>
        <div className="space-y-3">
          {USER_TYPES.map(t => (
            <div key={t.title} className="bg-white rounded-xl border border-slate-100 overflow-hidden flex">
              <div className={`w-14 bg-gradient-to-b ${t.color} flex items-center justify-center shrink-0`}>
                <span className="text-2xl">{t.icon}</span>
              </div>
              <div className="p-3">
                <p className="font-bold text-slate-800 text-sm">{t.title}</p>
                <ul className="mt-1.5 space-y-0.5">
                  {t.points.map(p => (
                    <li key={p} className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="text-green-500">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section className="px-5 pb-10 text-center">
        <div className="bg-navy rounded-2xl p-6 text-white">
          <p className="text-xl font-black mb-2">جاهز للانضمام؟</p>
          <p className="text-slate-400 text-sm mb-5">اختر حسابك وابدأ في ثوانٍ</p>
          <Link
            to="/login"
            className="inline-block bg-brand text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition"
          >
            سجّل الدخول ببطاقة Qi Card
          </Link>
        </div>
      </section>
    </div>
  );
}
