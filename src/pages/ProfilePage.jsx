// الشاشة السادسة — الحساب والإشعارات والرسائل

import BottomNav from '../components/BottomNav';
import useStore from '../store/useStore';
import { MOCK_NOTIFICATIONS, MOCK_MESSAGES } from '../data/mock';

// أيقونات الإشعارات
function NotifIcon({ type }) {
  if (type === 'success') return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M4 8l3 3 5-5" stroke="#3fffa2" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8h12" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ProfilePage() {
  const { user, activeSalfas } = useStore();

  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => n.unread).length;
  const unreadMsgs   = MOCK_MESSAGES.filter(m => m.unread).length;

  return (
    <div className="bg-bg min-h-screen flex flex-col page-enter">
      <div className="flex-1 overflow-y-auto p-3 pb-24 flex flex-col gap-3">

        {/* بطاقة الملف الشخصي */}
        <div className="rounded-2xl p-4 flex items-center gap-3 border"
          style={{ background: '#1f3028', borderColor: 'rgba(63,255,162,0.12)' }}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-[15px] text-mint"
            style={{
              background: 'rgba(63,255,162,0.12)',
              border:     '2px solid #1db874',
              boxShadow:  '0 0 10px rgba(63,255,162,0.18)',
            }}>
            أم
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold text-t1">{user.name}</div>
            <div className="text-[10px] mt-0.5 text-t3"
              style={{ fontFamily: '"Courier New", monospace' }}>
              {user.accountNumber}
            </div>
            <span className="inline-block text-[9px] px-2 py-0.5 rounded-full mt-1"
              style={{ background: 'rgba(63,255,162,0.1)', color: '#3fffa2' }}>
              {user.typeLabel}
            </span>
          </div>
        </div>

        {/* إحصاءات */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: activeSalfas.length + 1, label: 'سلف نشطة'    },
            { value: 17,                       label: 'قسط مدفوع'   },
            { value: 0,                         label: 'تعثر'        },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 border text-center"
              style={{ background: '#1a2820', borderColor: 'rgba(63,255,162,0.12)' }}>
              <div className="text-[16px] font-bold text-mint">{s.value}</div>
              <div className="text-[9px] text-t3 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* فاصل */}
        <div className="h-px" style={{ background: 'rgba(63,255,162,0.12)' }} />

        {/* الإشعارات */}
        <div className="flex justify-between items-center">
          <span className="text-[12px] font-bold text-t1">الإشعارات</span>
          {unreadNotifs > 0 && (
            <span className="text-[9px] px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(63,255,162,0.12)', color: '#3fffa2' }}>
              {unreadNotifs} جديد
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {MOCK_NOTIFICATIONS.map(n => (
            <div key={n.id} className="rounded-xl p-3 flex items-start gap-2 border"
              style={{ background: '#1a2820', borderColor: 'rgba(63,255,162,0.12)' }}>
              <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(63,255,162,0.1)', boxShadow: '0 0 6px rgba(63,255,162,0.12)' }}>
                <NotifIcon type={n.type} />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-t1">{n.title}</div>
                <div className="text-[10px] text-t2 mt-0.5">{n.body}</div>
                <div className="text-[9px] text-t3 mt-0.5">{n.time}</div>
              </div>
              {n.unread && (
                <div className="w-1.5 h-1.5 rounded-full bg-mint mt-1 shrink-0"
                  style={{ boxShadow: '0 0 5px #3fffa2' }} />
              )}
            </div>
          ))}
        </div>

        {/* فاصل */}
        <div className="h-px" style={{ background: 'rgba(63,255,162,0.12)' }} />

        {/* الرسائل */}
        <div className="flex justify-between items-center">
          <span className="text-[12px] font-bold text-t1">الرسائل</span>
          {unreadMsgs > 0 && (
            <span className="text-[9px] px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(245,200,66,0.15)', color: '#f5c842' }}>
              {unreadMsgs} جديد
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {MOCK_MESSAGES.map(msg => (
            <div key={msg.id} className="flex gap-2 items-start">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                style={{
                  background:  msg.fromId === 'Q' ? 'transparent' : '#1f3028',
                  border:      '1px solid rgba(63,255,162,0.2)',
                  color:       msg.fromId === 'Q' ? '#3fffa2' : '#8ab8a0',
                  fontFamily:  '"Courier New", monospace',
                }}>
                {msg.fromId === 'Q' ? 'Q' : msg.fromId[3]}
              </div>
              <div className="flex-1 rounded-xl p-2.5 border"
                style={{ background: '#1a2820', borderColor: 'rgba(63,255,162,0.12)' }}>
                <div className="text-[10px] text-t3">{msg.from}</div>
                <div className="text-[11px] text-t2 mt-1">{msg.text}</div>
                <div className="text-[9px] text-t3 mt-1">{msg.time}</div>
              </div>
              {msg.unread && (
                <div className="w-1.5 h-1.5 rounded-full bg-mint mt-2 shrink-0"
                  style={{ boxShadow: '0 0 5px #3fffa2' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="/profile" />
    </div>
  );
}
