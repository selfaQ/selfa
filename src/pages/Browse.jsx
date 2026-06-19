// استعراض السلفات المتاحة — بيانات حقيقية من الـ API

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getGroups, mapGroup } from '../api/groups';
import { formatIQD, formatShort, calcInstallment, seatsLeft, MONTHS_AR } from '../data/constants';

// ─── بطاقة سلفة واحدة ────────────────────────────────────────────────────────
function SalfaCard({ salafa, onSelect }) {
  const inst = calcInstallment(salafa.amount, salafa.duration);
  const left = seatsLeft(salafa);
  const full = left === 0;
  const pct  = Math.round((salafa.filled / salafa.duration) * 100);

  return (
    <div
      onClick={() => !full && onSelect(salafa.id)}
      className="rounded-2xl p-4 flex flex-col gap-3 transition-all active:scale-[0.99]"
      style={{
        background: '#ffffff',
        border: `1px solid ${full ? 'rgba(224,53,53,0.18)' : 'rgba(14,165,114,0.15)'}`,
        cursor: full ? 'default' : 'pointer',
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[22px] font-bold leading-none" style={{ color: '#0d1f17' }}>
            {formatShort(salafa.amount)}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: '#6b9b80' }}>
            {salafa.duration} شهراً · {salafa.duration} عضو
          </div>
        </div>
        <div className="text-left">
          <div className="text-[14px] font-bold" style={{ color: '#0ea572' }}>
            {formatIQD(inst)}
          </div>
          <div className="text-[9px]" style={{ color: '#6b9b80' }}>/ شهر</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[10px] mb-1.5">
          <span style={{ color: '#2e5c43' }}>{salafa.filled} من {salafa.duration} عضو</span>
          <span style={{ color: full ? '#e03535' : pct > 75 ? '#d4920a' : '#0ea572', fontWeight: 600 }}>
            {full ? 'مكتملة' : `${left} مقعد متاح`}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(14,165,114,0.10)' }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: full
                ? '#e03535'
                : pct > 75
                  ? 'linear-gradient(90deg, #d4920a, #e03535)'
                  : 'linear-gradient(90deg, #0ea572, #0d8a52)',
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px]"
        style={{ borderTop: '1px solid rgba(14,165,114,0.08)', paddingTop: '8px' }}>
        <span style={{ color: '#6b9b80' }}>
          {(() => {
            let d;
            if (salafa.startDate) {
              d = new Date(salafa.startDate + '-01');
              return `تبدأ: ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`;
            }
            d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + 1);
            return `تبدأ تقريباً: ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`;
          })()}
        </span>
        {!full && (
          <span style={{ color: '#0ea572', fontWeight: 700 }}>انضم الآن ←</span>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton بطاقة ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3 animate-pulse"
      style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.08)' }}>
      <div className="flex justify-between">
        <div className="h-6 w-24 rounded-lg" style={{ background: 'rgba(14,165,114,0.08)' }} />
        <div className="h-6 w-16 rounded-lg" style={{ background: 'rgba(14,165,114,0.08)' }} />
      </div>
      <div className="h-2 rounded-full" style={{ background: 'rgba(14,165,114,0.08)' }} />
      <div className="h-8 rounded-lg" style={{ background: 'rgba(14,165,114,0.05)' }} />
    </div>
  );
}

// ─── الصفحة ───────────────────────────────────────────────────────────────────
export default function Browse() {
  const navigate = useNavigate();
  const [groups,  setGroups]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getGroups()
      .then(data => setGroups(data.map(mapGroup)))
      .catch(e  => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter">
      <div className="flex-1 overflow-y-auto p-3 pb-24 flex flex-col gap-3">

        <div className="pt-2">
          <div className="text-[17px] font-bold text-t1">استعرض السلفات</div>
          <div className="text-[10px] text-t3 mt-0.5">
            {loading ? 'جارٍ التحميل...' : `${groups.length} سلفة مفتوحة الآن`}
          </div>
        </div>

        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {error && (
          <div className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(224,53,53,0.05)', border: '1px solid rgba(224,53,53,0.18)' }}>
            <div className="text-[12px] font-bold" style={{ color: '#e03535' }}>فشل تحميل السلفات</div>
            <div className="text-[10px] text-t3 mt-1">{error}</div>
            <button onClick={() => { setError(null); setLoading(true); getGroups().then(d => setGroups(d.map(mapGroup))).catch(e => setError(e.message)).finally(() => setLoading(false)); }}
              className="mt-2 text-[11px] font-bold px-3 py-1.5 rounded-lg"
              style={{ background: '#0d8a52', color: '#fff' }}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && groups.length === 0 && (
          <div className="rounded-2xl p-8 text-center"
            style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.10)' }}>
            <div className="text-[40px] mb-3">📋</div>
            <div className="text-[13px] font-bold text-t2">لا توجد سلفات مفتوحة حالياً</div>
            <div className="text-[10px] text-t3 mt-1">تحقق لاحقاً عند فتح مجموعات جديدة</div>
          </div>
        )}

        {groups.map(s => (
          <SalfaCard
            key={s.id}
            salafa={s}
            onSelect={id => navigate(`/salafa/${id}`)}
          />
        ))}

      </div>
      <BottomNav active="/browse" />
    </div>
  );
}
