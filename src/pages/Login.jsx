// صفحة تسجيل الدخول — اختيار حساب ki Card بدون كلمة مرور

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_ACCOUNTS, formatIQD } from '../data/constants';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  function handleSelect(account) {
    login(account);
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col page-enter">

      {/* رأس الصفحة */}
      <div className="bg-brand px-5 pt-8 pb-12 text-white text-center">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-black text-2xl">Q</span>
        </div>
        <h1 className="text-xl font-black">مرحباً بك في سلفة Q</h1>
        <p className="text-blue-200 text-sm mt-2">اختر حسابك للمتابعة</p>
      </div>

      {/* البطاقات */}
      <div className="px-5 -mt-6 space-y-3 relative z-10">

        {MOCK_ACCOUNTS.map(acc => (
          <button
            key={acc.id}
            onClick={() => handleSelect(acc)}
            className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm
              hover:shadow-md hover:border-primary active:scale-[0.99] transition-all text-right"
          >
            <div className="flex items-center gap-3">
              {/* الأفاتار */}
              <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-base shrink-0">
                {acc.initials}
              </div>

              {/* معلومات الحساب */}
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{acc.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{acc.bank}</p>
                {acc.department && (
                  <p className="text-xs text-slate-400">{acc.department}</p>
                )}
              </div>

              {/* نوع الحساب + الراتب */}
              <div className="text-left shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${acc.typeColor}`}>
                  {acc.typeLabel}
                </span>
                {acc.salary > 0 ? (
                  <p className="text-xs text-slate-500 mt-1">{formatIQD(acc.salary)}</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">شخصي</p>
                )}
              </div>
            </div>

            {/* رقم البطاقة */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">ki Card:</span>
              <span className="text-xs font-mono text-slate-600 tracking-wider" dir="ltr">
                {acc.kiCard}
              </span>
            </div>
          </button>
        ))}

        {/* تنبيه للحسابات الشخصية */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-xs text-amber-700">
            ⚠️ الحساب الشخصي يتطلب كفيلاً حكومياً عند الانضمام لأي جمعية
          </p>
        </div>
      </div>
    </div>
  );
}
