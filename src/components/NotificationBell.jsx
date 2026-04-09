// جرس الإشعارات — أيقونة مع شارة عدد + لوحة منزلقة من اليمين

import { useState } from 'react';
import { useSalafa } from '../contexts/SalafaContext';

// أيقونة لكل نوع إشعار
const NOTIF_ICONS = { deduction: '💳', turn: '🎉', complete: '✅', default: '🔔' };

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } = useSalafa();

  return (
    <div className="relative">
      {/* زر الجرس */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition"
        aria-label="الإشعارات"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold
            w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* لوحة الإشعارات */}
      {open && (
        <>
          {/* خلفية شبه شفافة للإغلاق */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
            {/* رأس اللوحة */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-bold text-slate-800 text-sm">الإشعارات</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            {/* قائمة الإشعارات */}
            <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-6">لا توجد إشعارات</p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition
                      ${!n.read ? 'bg-blue-50/60' : ''}`}
                  >
                    <span className="text-xl shrink-0">{NOTIF_ICONS[n.type] ?? NOTIF_ICONS.default}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                        {n.title}
                        {!n.read && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block" />}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
