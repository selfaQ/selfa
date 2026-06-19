// الشاشة السادسة — الحساب والإشعارات والرسائل

import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import useStore from '../store/useStore';
import { useSalafa } from '../contexts/SalafaContext';
import { MOCK_NOTIFICATIONS, MOCK_MESSAGES } from '../data/mock';

function NotifIcon({ type }) {
  if (type === 'success') return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M4 8l3 3 5-5" stroke="#0ea572" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8h12" stroke="#d4920a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ProfilePage() {
  const navigate   = useNavigate();
  const { user, clearAuth } = useStore();
  const { mySalafat }       = useSalafa();

  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => n.unread).length;
  const unreadMsgs   = MOCK_MESSAGES.filter(m => m.unread).length;

  function handleLogout() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter">
      <div className="flex-1 overflow-y-auto p-3 pb-24 flex flex-col gap-3">

        <div className="rounded-2xl p-4 flex items-center gap-3 border"
          style={{ background: '#f0f7f3', borderColor: 'rgba(14,165,114,0.15)' }}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-[15px] text-mint"
            style={{
              background: 'rgba(14,165,114,0.12)',
              border:     '2px solid #0d8a52',
              boxShadow:  '0 2px 10px rgba(14,165,114,0.18)',
            }}>
            {user.name ? user.name.slice(0, 2) : '؟'}
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold text-t1">{user.name}</div>
            <div className="text-[10px] mt-0.5 text-t3"
              style={{ fontFamily: '"Courier New", monospace' }}>
              {user.accountNumber}
            </div>
            <span className="inline-block text-[9px] px-2 py-0.5 rounded-full mt-1"
              style={{ background: 'rgba(14,165,114,0.10)', color: '#0ea572' }}>
              {user.typeLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { value: mySalafat.length, label: 'سلف نشطة'  },
            { value: 0,                label: 'قسط مدفوع'  },
            { value: 0,                label: 'تعثر'       },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 border text-center"
              style={{ background: '#ffffff', borderColor: 'rgba(14,165,114,0.15)' }}>
              <div className="text-[16px] font-bold text-mint">{s.value}</div>
              <div className="text-[9px] text-t3 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="h-px" style={{ background: 'rgba(14,165,114,0.15)' }} />

        <div className="flex justify-between items-center">
          <span className="text-[12px] font-bold text-t1">الإشعارات</span>
          {unreadNotifs > 0 && (
            <span className="text-[9px] px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(14,165,114,0.10)', color: '#0ea572' }}>
              {unreadNotifs} جديد
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {MOCK_NOTIFICATIONS.map(n => (
            <div key={n.id} className="rounded-xl p-3 flex items-start gap-2 border"
              style={{ background: '#ffffff', borderColor: 'rgba(14,165,114,0.12)' }}>
              <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(14,165,114,0.08)' }}>
                <NotifIcon type={n.type} />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-t1">{n.title}</div>
                <div className="text-[10px] text-t2 mt-0.5">{n.body}</div>
                <div className="text-[9px] text-t3 mt-0.5">{n.time}</div>
              </div>
              {n.unread && (
                <div className="w-1.5 h-1.5 rounded-full bg-mint mt-1 shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="h-px" style={{ background: 'rgba(14,165,114,0.15)' }} />

        <div className="flex justify-between items-center">
          <span className="text-[12px] font-bold text-t1">الرسائل</span>
          {unreadMsgs > 0 && (
            <span className="text-[9px] px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(212,146,10,0.12)', color: '#d4920a' }}>
              {unreadMsgs} جديد
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {MOCK_MESSAGES.map(msg => (
            <div key={msg.id} className="flex gap-2 items-start">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                style={{
                  background:  msg.fromId === 'Q' ? 'transparent' : '#f0f7f3',
                  border:      '1px solid rgba(14,165,114,0.20)',
                  color:       msg.fromId === 'Q' ? '#0ea572' : '#2e5c43',
                  fontFamily:  '"Courier New", monospace',
                }}>
                {msg.fromId === 'Q' ? 'Q' : msg.fromId[3]}
              </div>
              <div className="flex-1 rounded-xl p-2.5 border"
                style={{ background: '#ffffff', borderColor: 'rgba(14,165,114,0.12)' }}>
                <div className="text-[10px] text-t3">{msg.from}</div>
                <div className="text-[11px] text-t2 mt-1">{msg.text}</div>
                <div className="text-[9px] text-t3 mt-1">{msg.time}</div>
              </div>
              {msg.unread && (
                <div className="w-1.5 h-1.5 rounded-full bg-mint mt-2 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* تسجيل الخروج */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl text-[13px] font-bold mt-1"
          style={{ background: 'rgba(224,53,53,0.07)', color: '#e03535', border: '1px solid rgba(224,53,53,0.18)' }}>
          تسجيل الخروج
        </button>

      </div>

      <BottomNav active="/profile" />
    </div>
  );
}
