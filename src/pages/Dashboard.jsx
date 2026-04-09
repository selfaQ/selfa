// لوحة المستخدم — جمعياته النشطة + جدول الاستقطاعات القادمة

import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSalafa } from '../contexts/SalafaContext';
import { formatIQD, calcInstallment, MONTHS_AR } from '../data/constants';
import ProgressBar from '../components/ProgressBar';
import Card from '../components/Card';

// ─── مكون بطاقة الجمعية النشطة ───────────────────────────────────────────────
function ActiveSalfaCard({ salafa }) {
  const inst = calcInstallment(salafa.amount, salafa.duration);

  // احتساب شهر ويوم الاستلام
  const receiveDate = new Date(salafa.nextDeduction);
  receiveDate.setMonth(receiveDate.getMonth() + (salafa.myTurn - salafa.monthsPaid - 1));
  const receiveMonth = MONTHS_AR[receiveDate.getMonth()];
  const receiveYear  = receiveDate.getFullYear();

  return (
    <Card className="p-4">
      {/* رأس البطاقة */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xl font-black text-navy">{formatIQD(salafa.amount)}</p>
          <p className="text-xs text-slate-500">{salafa.duration} شهراً</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold
          ${salafa.seatType === 'priority' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
          {salafa.seatType === 'priority' ? `مقعد أولوية #${salafa.prioritySeat}` : 'قرعة'}
        </span>
      </div>

      {/* شريط التقدم */}
      <ProgressBar paid={salafa.monthsPaid} total={salafa.duration} />

      {/* معلومات الدور والاستقطاع */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-slate-500">دوري</p>
          <p className="text-sm font-bold text-primary">الشهر {salafa.myTurn}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-slate-500">القسط</p>
          <p className="text-sm font-bold text-slate-800">{formatIQD(inst)}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-slate-500">استلامي</p>
          <p className="text-sm font-bold text-blue-600">{receiveMonth} {receiveYear}</p>
        </div>
      </div>

      {/* تاريخ الاستقطاع القادم */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">الاستقطاع القادم:</span>
        <span className="text-xs font-semibold text-slate-700">{salafa.nextDeduction}</span>
        <span className="mr-auto text-xs text-green-600 font-medium">تلقائي ✓</span>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { user, maxInstallment } = useAuth();
  const { mySalafat } = useSalafa();

  // إجمالي الاستقطاعات الشهرية
  const totalDeductions = mySalafat.reduce(
    (sum, s) => sum + calcInstallment(s.amount, s.duration), 0
  );
  const usedPct = maxInstallment > 0 ? (totalDeductions / maxInstallment) * 100 : 0;

  return (
    <div className="px-4 py-5 space-y-5 page-enter">

      {/* ترحيب */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">مرحباً،</p>
          <h1 className="text-xl font-black text-navy">{user?.name}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user?.typeColor}`}>
            {user?.typeLabel}
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-base">
          {user?.initials}
        </div>
      </div>

      {/* بطاقة ملخص الراتب والاستقطاعات */}
      {user?.salary > 0 && (
        <Card className="p-4">
          <p className="text-xs text-slate-500 mb-1">حد قاعدة الـ 40%</p>
          <div className="flex items-end justify-between mb-2">
            <span className="text-lg font-black text-navy">{formatIQD(maxInstallment)}</span>
            <span className={`text-xs font-semibold ${usedPct > 80 ? 'text-red-600' : 'text-green-600'}`}>
              {usedPct.toFixed(0)}% مستخدم
            </span>
          </div>
          <ProgressBar paid={totalDeductions} total={maxInstallment} showLabel={false} />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>مستقطع: {formatIQD(totalDeductions)}</span>
            <span>متاح: {formatIQD(Math.max(0, maxInstallment - totalDeductions))}</span>
          </div>
        </Card>
      )}

      {/* ─── جمعياتي النشطة ─── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-navy">جمعياتي ({mySalafat.length})</h2>
          <Link to="/browse" className="text-xs text-primary font-semibold hover:underline">
            + انضم لجديدة
          </Link>
        </div>

        {mySalafat.length === 0 ? (
          <Card className="p-8 text-center">
            <span className="text-4xl">📋</span>
            <p className="text-slate-600 font-semibold mt-3">لا توجد جمعيات نشطة</p>
            <p className="text-slate-400 text-sm mt-1">انضم لجمعية أو أنشئ واحدة</p>
            <Link
              to="/browse"
              className="inline-block mt-4 px-5 py-2 bg-brand text-white text-sm font-bold rounded-xl hover:opacity-90"
            >
              استعرض الجمعيات
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {mySalafat.map(s => <ActiveSalfaCard key={s.id} salafa={s} />)}
          </div>
        )}
      </div>

      {/* روابط سريعة */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/browse"
          className="bg-brand text-white rounded-xl p-4 text-center hover:opacity-90 transition">
          <span className="text-2xl block">🔍</span>
          <span className="text-sm font-bold mt-1 block">استعرض الجمعيات</span>
        </Link>
        <Link to="/create"
          className="bg-navy text-white rounded-xl p-4 text-center hover:opacity-90 transition">
          <span className="text-2xl block">✨</span>
          <span className="text-sm font-bold mt-1 block">أنشئ جمعية</span>
        </Link>
      </div>
    </div>
  );
}
