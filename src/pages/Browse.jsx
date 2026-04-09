// صفحة استعراض الجمعيات المتاحة مع فلترة وقفل الجمعيات المجاوزة للـ40%

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  MOCK_SALAFAT, AMOUNTS, DURATIONS,
  formatIQD, formatShort, calcInstallment, isLocked, seatsLeft, availablePrioritySeats,
} from '../data/constants';
import Card from '../components/Card';

// ─── بطاقة جمعية في قائمة الاستعراض ─────────────────────────────────────────
function SalfaBrowseCard({ salafa, locked }) {
  const inst     = calcInstallment(salafa.amount, salafa.duration);
  const left     = seatsLeft(salafa);
  const priSeats = availablePrioritySeats(salafa);
  const full     = left === 0;

  return (
    <Link to={full ? '#' : `/salafa/${salafa.id}`}>
      <Card
        locked={locked || full}
        className="p-4 relative overflow-hidden"
      >
        {/* شارة مقفولة */}
        {locked && (
          <div className="absolute top-3 left-3 bg-slate-700/80 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            🔒 يتجاوز 40%
          </div>
        )}
        {full && !locked && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            مكتملة
          </div>
        )}

        {/* المبلغ والمدة */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xl font-black text-navy">{formatShort(salafa.amount)}</p>
            <p className="text-xs text-slate-500">د.ع · {salafa.duration} شهراً</p>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-primary">{formatIQD(inst)}</p>
            <p className="text-[10px] text-slate-400">/ شهر</p>
          </div>
        </div>

        {/* شريط الأعضاء */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>الأعضاء: {salafa.filled}/{salafa.duration}</span>
            <span className="text-green-600 font-medium">{left} مقعد متاح</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-600"
              style={{ width: `${(salafa.filled / salafa.duration) * 100}%` }}
            />
          </div>
        </div>

        {/* المقاعد ذات الأولوية المتاحة */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {priSeats.length > 0
            ? priSeats.map(s => (
              <span key={s.seat} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                أولوية #{s.seat} متاح
              </span>
            ))
            : <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">مقاعد أولوية ممتلئة</span>
          }
          <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
            قرعة متاحة
          </span>
        </div>

        {/* تاريخ البدء */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-400">البداية: {salafa.startDate}</span>
          {!locked && !full && (
            <span className="text-primary font-semibold">عرض التفاصيل ←</span>
          )}
        </div>
      </Card>
    </Link>
  );
}

export default function Browse() {
  const { user } = useAuth();
  const [filterAmount,   setFilterAmount]   = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [filterSeat,     setFilterSeat]     = useState(''); // priority | lottery | ''

  // تصفية وفرز الجمعيات
  const filtered = useMemo(() => {
    return MOCK_SALAFAT.filter(s => {
      if (filterAmount   && s.amount   !== Number(filterAmount))   return false;
      if (filterDuration && s.duration !== Number(filterDuration)) return false;
      if (filterSeat === 'priority' && !availablePrioritySeats(s).length) return false;
      if (filterSeat === 'lottery'  && seatsLeft(s) === 0) return false;
      return true;
    });
  }, [filterAmount, filterDuration, filterSeat]);

  return (
    <div className="px-4 py-5 page-enter">

      {/* رأس الصفحة */}
      <h1 className="text-xl font-black text-navy mb-4">استعرض الجمعيات</h1>

      {/* ─── أدوات التصفية ─── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 space-y-3">
        <p className="text-xs font-semibold text-slate-500">تصفية النتائج</p>

        {/* المبلغ */}
        <select
          value={filterAmount}
          onChange={e => setFilterAmount(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
        >
          <option value="">كل المبالغ</option>
          {AMOUNTS.map(a => <option key={a} value={a}>{formatIQD(a)}</option>)}
        </select>

        {/* المدة + نوع المقعد */}
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filterDuration}
            onChange={e => setFilterDuration(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
          >
            <option value="">كل المدد</option>
            {DURATIONS.map(d => <option key={d} value={d}>{d} شهراً</option>)}
          </select>

          <select
            value={filterSeat}
            onChange={e => setFilterSeat(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
          >
            <option value="">كل المقاعد</option>
            <option value="priority">أولوية متاحة</option>
            <option value="lottery">قرعة فقط</option>
          </select>
        </div>

        {/* زر إعادة الضبط */}
        {(filterAmount || filterDuration || filterSeat) && (
          <button
            onClick={() => { setFilterAmount(''); setFilterDuration(''); setFilterSeat(''); }}
            className="text-xs text-red-500 hover:underline"
          >
            مسح التصفية ✕
          </button>
        )}
      </div>

      {/* تنبيه قاعدة 40% */}
      {user?.salary > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex gap-2">
          <span className="text-blue-500 text-lg shrink-0">ℹ️</span>
          <p className="text-xs text-blue-700">
            الجمعيات الرمادية تتجاوز حد 40% من راتبك ({formatIQD(user.salary * 0.4)}) ولا يمكنك الانضمام إليها.
          </p>
        </div>
      )}

      {/* قائمة الجمعيات */}
      <p className="text-xs text-slate-500 mb-3">{filtered.length} جمعية متاحة</p>

      <div className="space-y-3">
        {filtered.map(s => (
          <SalfaBrowseCard
            key={s.id}
            salafa={s}
            locked={user ? isLocked(s.amount, s.duration, user.salary) : false}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <span className="text-4xl block mb-3">🔍</span>
          <p>لا توجد نتائج لهذه التصفية</p>
        </div>
      )}
    </div>
  );
}
