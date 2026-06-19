// نموذج الكفيل — للحسابات الشخصية فقط (غير الموظفين)

import { useState } from 'react';

export default function GuarantorForm({ onConfirm }) {
  const [qicard, setqicard]     = useState('');
  const [status, setStatus]     = useState('idle'); // idle | searching | found | rejected
  const [guarantor, setGuarantor] = useState(null);

  // محاكاة البحث عن الكفيل
  function handleSearch() {
    if (!qicard.trim()) return;
    setStatus('searching');

    setTimeout(() => {
      if (qicard.startsWith('770')) {
        // محاكاة: وجد كفيلاً حكومياً
        setGuarantor({ name: 'علي حسن الموسوي', type: 'موظف حكومي', salary: '1,800,000 د.ع' });
        setStatus('found');
      } else {
        setStatus('rejected');
      }
    }, 1500);
  }

  function handleConfirm() {
    if (guarantor) onConfirm(guarantor);
  }

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-amber-500 text-lg">🔐</span>
        <p className="text-sm font-bold text-amber-800">مطلوب كفيل حكومي</p>
      </div>
      <p className="text-xs text-amber-700 mb-3">
        بما أن حسابك شخصي، يلزمك كفيل موظف حكومي. أدخل رقم بطاقته Qi Card:
      </p>

      {/* حقل الإدخال */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="مثال: 7701-XXXX-XXXX"
          value={qicard}
          onChange={e => setqicard(e.target.value)}
          disabled={status === 'searching' || status === 'found'}
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
          dir="ltr"
        />
        <button
          onClick={handleSearch}
          disabled={status === 'searching' || status === 'found' || !qicard}
          className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg disabled:opacity-50 hover:bg-amber-600 transition"
        >
          {status === 'searching' ? '...' : 'بحث'}
        </button>
      </div>

      {/* نتيجة البحث */}
      {status === 'found' && guarantor && (
        <div className="bg-white rounded-lg p-3 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-500">✓</span>
            <p className="text-sm font-bold text-slate-800">{guarantor.name}</p>
          </div>
          <p className="text-xs text-slate-500">{guarantor.type} · راتب {guarantor.salary}</p>
          <p className="text-xs text-slate-400 mt-1">
            سيصله إشعار للموافقة. في حال التخلف عن الدفع، سيُخصم من راتبه تلقائياً.
          </p>
          <button
            onClick={handleConfirm}
            className="mt-3 w-full py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition"
          >
            تأكيد الكفيل ✓
          </button>
        </div>
      )}

      {status === 'rejected' && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
          ⚠️ الرقم غير صحيح أو الحساب لا يقبل الكفالة. جرّب رقماً يبدأ بـ 770
        </p>
      )}
    </div>
  );
}
