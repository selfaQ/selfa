import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  {
    path: '/',
    label: 'الرئيسية',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d="M2 7L8 2l6 5v7a1 1 0 01-1 1H9v-4H7v4H3a1 1 0 01-1-1V7z"
          stroke={active ? '#0ea572' : '#6b9b80'} strokeWidth="1.5"
          strokeLinejoin="round" fill={active ? 'rgba(14,165,114,0.12)' : 'none'} />
      </svg>
    ),
  },
  {
    path: '/browse',
    label: 'استعرض',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="4.5" stroke={active ? '#0ea572' : '#6b9b80'} strokeWidth="1.5" />
        <line x1="10.5" y1="10.5" x2="14" y2="14" stroke={active ? '#0ea572' : '#6b9b80'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    path: '/self-salfa',
    label: 'سلفة ذاتية',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <circle cx="5.5" cy="5.5" r="2.5" stroke={active ? '#0ea572' : '#6b9b80'} strokeWidth="1.5" />
        <circle cx="10.5" cy="5.5" r="2.5" stroke={active ? '#0ea572' : '#6b9b80'} strokeWidth="1.5" />
        <path d="M1 13c0-1.9 2-3 4.5-3s4.5 1.1 4.5 3" stroke={active ? '#0ea572' : '#6b9b80'} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 10.5c1.5.3 3 1.2 3 2.5" stroke={active ? '#0ea572' : '#6b9b80'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'حسابي',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d="M8 2a4 4 0 100 8A4 4 0 008 2zM2 14c0-2.2 2.7-4 6-4s6 1.8 6 4"
          stroke={active ? '#0ea572' : '#6b9b80'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav({ active }) {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const current      = active ?? pathname;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30">
      <div className="mx-2 mb-2 rounded-2xl border px-2 py-2.5 flex justify-around"
        style={{ background: '#ffffff', borderColor: 'rgba(14,165,114,0.2)', boxShadow: '0 -2px 12px rgba(14,165,114,0.08)' }}>
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
                style={{ color: isActive ? '#0ea572' : '#6b9b80' }}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full"
                  style={{ background: '#0ea572', boxShadow: '0 0 4px rgba(14,165,114,0.5)' }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
