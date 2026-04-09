// لوحة الإدارة — إحصائيات + قائمة الجمعيات + صندوق الطوارئ

import {
  MOCK_SALAFAT, ADMIN_STATS,
  formatIQD, formatShort, calcInstallment, seatsLeft,
} from '../data/constants';

// ─── بطاقة إحصاء ─────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color = 'text-navy', bg = 'bg-white' }) {
  return (
    <div className={`${bg} rounded-xl p-4 border border-slate-100 shadow-sm text-center`}>
      <span className="text-2xl">{icon}</span>
      <p className={`text-xl font-black mt-1 ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

// ─── صف جمعية في الجدول ────────────────────────────────────────────────────
function SalfaRow({ salafa }) {
  const inst  = calcInstallment(salafa.amount, salafa.duration);
  const left  = seatsLeft(salafa);
  const isFull = left === 0;

  return (
    <div className="flex items-center gap-3 py-3 px-4 border-b border-slate-50 hover:bg-slate-50 transition">
      {/* المبلغ */}
      <div className="w-14 text-center">
        <p className="text-sm font-black text-navy">{formatShort(salafa.amount)}</p>
        <p className="text-[10px] text-slate-400">{salafa.duration}م</p>
      </div>

      {/* شريط الأعضاء */}
      <div className="flex-1">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{salafa.filled}/{salafa.duration}</span>
          <span>{isFull ? '✓ مكتملة' : `${left} متبقٍ`}</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full">
          <div
            className={`h-1.5 rounded-full ${isFull ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-violet-600'}`}
            style={{ width: `${(salafa.filled / salafa.duration) * 100}%` }}
          />
        </div>
      </div>

      {/* القسط */}
      <div className="text-left w-24">
        <p className="text-xs font-semibold text-slate-700">{formatIQD(inst)}</p>
        <p className="text-[10px] text-slate-400">/شهر</p>
      </div>

      {/* الحالة */}
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0
        ${isFull ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
        {isFull ? 'مكتملة' : 'مفتوحة'}
      </span>
    </div>
  );
}

export default function Admin() {
  const openCount  = MOCK_SALAFAT.filter(s => seatsLeft(s) > 0).length;
  const fullCount  = MOCK_SALAFAT.filter(s => seatsLeft(s) === 0).length;

  return (
    <div className="px-4 py-5 space-y-5 page-enter">

      {/* رأس الصفحة */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
          <span className="text-white">🔧</span>
        </div>
        <div>
          <h1 className="text-xl font-black text-navy">لوحة الإدارة</h1>
          <p className="text-xs text-slate-500">إحصائيات النظام الكاملة</p>
        </div>
      </div>

      {/* ─── الإحصائيات الرئيسية ─── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="👥" label="إجمالي الأعضاء"      value={ADMIN_STATS.totalMembers}   color="text-gradient" />
        <StatCard icon="🏦" label="جمعيات نشطة"         value={ADMIN_STATS.activeGroups}   color="text-blue-600" />
        <StatCard icon="💰" label="إيرادات شهرية"        value={formatIQD(ADMIN_STATS.monthlyRevenue)} color="text-green-600" />
        <StatCard icon="⚠️" label="معدل التعثر"         value={ADMIN_STATS.defaultRate}    color="text-amber-600" />
      </div>

      {/* ─── صندوق الطوارئ ─── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-amber-800 flex items-center gap-2">
            <span>🛡️</span> صندوق الطوارئ
          </p>
          <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">1% من كل قسط</span>
        </div>
        <p className="text-2xl font-black text-amber-700">{formatIQD(ADMIN_STATS.emergencyFund)}</p>
        <p className="text-xs text-amber-600 mt-1">
          يُستخدم لتغطية حالات التعثر وضمان استمرارية الجمعيات
        </p>
        <div className="flex gap-2 mt-3">
          <div className="flex-1 bg-white rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-500">طلبات التبديل المعلقة</p>
            <p className="text-base font-black text-amber-600">{ADMIN_STATS.pendingSwaps}</p>
          </div>
          <div className="flex-1 bg-white rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-500">جمعيات مفتوحة</p>
            <p className="text-base font-black text-blue-600">{openCount}</p>
          </div>
          <div className="flex-1 bg-white rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-500">مكتملة</p>
            <p className="text-base font-black text-green-600">{fullCount}</p>
          </div>
        </div>
      </div>

      {/* ─── تفصيل الإيرادات ─── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="font-bold text-slate-800">تفصيل الإيرادات الشهرية</p>
        </div>
        {[
          { label: 'رسوم الاشتراك الشهرية',  val: formatIQD(8_000_000),  pct: '37%' },
          { label: 'رسوم مقاعد الأولوية',    val: formatIQD(6_500_000),  pct: '30%' },
          { label: 'صندوق الطوارئ (1%)',      val: formatIQD(7_300_000),  pct: '33%' },
        ].map(r => (
          <div key={r.label} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50">
            <div className="flex-1">
              <p className="text-sm text-slate-700">{r.label}</p>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-800">{r.val}</p>
              <p className="text-[10px] text-slate-400">{r.pct}</p>
            </div>
          </div>
        ))}
        <div className="flex justify-between px-4 py-3 bg-slate-50">
          <span className="font-bold text-slate-700 text-sm">الإجمالي</span>
          <span className="font-black text-primary text-sm">{formatIQD(ADMIN_STATS.monthlyRevenue)}</span>
        </div>
      </div>

      {/* ─── جدول الجمعيات ─── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <p className="font-bold text-slate-800">جميع الجمعيات ({MOCK_SALAFAT.length})</p>
          <button className="text-xs text-primary hover:underline font-medium">+ إنشاء يدوي</button>
        </div>
        <div>
          {MOCK_SALAFAT.map(s => <SalfaRow key={s.id} salafa={s} />)}
        </div>
      </div>

      {/* ─── طلبات التبديل ─── */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-slate-800">طلبات تبديل الأدوار</p>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            {ADMIN_STATS.pendingSwaps} معلقة
          </span>
        </div>
        <div className="space-y-2">
          {[
            { from: 'عضو #7',  to: 'عضو #3',  amount: '5M', status: 'معلق' },
            { from: 'عضو #12', to: 'عضو #8',  amount: '10M', status: 'معلق' },
            { from: 'عضو #2',  to: 'عضو #15', amount: '1M', status: 'معلق' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
              <div className="flex-1 text-sm">
                <span className="font-semibold">{r.from}</span>
                <span className="text-slate-400 mx-1">↔</span>
                <span className="font-semibold">{r.to}</span>
                <span className="text-slate-400 mr-2 text-xs">({r.amount})</span>
              </div>
              <div className="flex gap-1">
                <button className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">موافقة</button>
                <button className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200">رفض</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
