// شريط التنقل السفلي — ثيم داكن — 4 تبويبات

import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  {
    path: '/',
    label: 'الرئيسية',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1.5" fill={active ? '#3fffa2' : '#4a7a60'} />
        <rect x="9" y="2" width="5" height="5" rx="1.5" fill={active ? '#3fffa2' : '#4a7a60'} opacity={active ? 0.5 : 1} />
        <rect x="2" y="9" width="5" height="5" rx="1.5" fill={active ? '#3fffa2' : '#4a7a60'} opacity={active ? 0.5 : 1} />
        <rect x="9" y="9" width="5" height="5" rx="1.5" fill={active ? '#3fffa2' : '#4a7a60'} opacity={active ? 0.5 : 1} />
      </svg>
    ),
  },
  {
    path: '/browse',
    label: 'استعرض',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="4.5" stroke={active ? '#3fffa2' : '#4a7a60'} strokeWidth="1.5" />
        <line x1="10.5" y1="10.5" x2="14" y2="14" stroke={active ? '#3fffa2' : '#4a7a60'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    path: '/dashboard',
    label: 'سلفاتي',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke={active ? '#3fffa2' : '#4a7a60'} strokeWidth="1.5" />
        <path d="M8 5v3l2 2" stroke={active ? '#3fffa2' : '#4a7a60'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'حسابي',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d="M8 2a4 4 0 100 8A4 4 0 008 2zM2 14c0-2.2 2.7-4 6-4s6 1.8 6 4"
          stroke={active ? '#3fffa2' : '#4a7a60'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav({ active }) {
  const navigate       = useNavigate();
  const { pathname }   = useLocation();
  const current        = active ?? pathname;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30">
      <div className="mx-2 mb-2 rounded-2xl border px-2 py-2.5 flex justify-around"
        style={{ background: '#111a15', borderColor: 'rgba(63,255,162,0.2)' }}>
        {TABS.map((tab) => {
          const isActive = current === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 px-3 bg-transparent border-none cursor-pointer"
            >
              {tab.icon(isActive)}
              <span className="text-[9px] font-medium"
                style={{ color: isActive ? '#3fffa2' : '#4a7a60' }}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full"
                  style={{ background: '#3fffa2', boxShadow: '0 0 4px #3fffa2' }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
