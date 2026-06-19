import { request } from './http';

export const getGroups       = ()   => request('/api/app/groups');
export const getGroup        = (id) => request(`/api/app/groups/${id}`);
export const joinGroup       = (id) => request(`/api/app/groups/${id}/join`, { method: 'POST' });
export const confirmLottery  = (id) => request(`/api/app/groups/${id}/confirm-lottery`, { method: 'POST' });
export const exitLottery     = (id) => request(`/api/app/groups/${id}/exit-lottery`,    { method: 'POST' });
export const getMyResult     = (id) => request(`/api/app/groups/${id}/my-result`);
export const getMySchedule   = (id) => request(`/api/app/groups/${id}/my-schedule`);

function genAccNum(username) {
  if (!username) return null;
  let h = 0;
  for (let i = 0; i < username.length; i++) h = Math.imul(31, h) + username.charCodeAt(i) | 0;
  const n = String((Math.abs(h) % 9000000000) + 1000000000);
  return n.slice(0, 4) + '-' + n.slice(4, 7) + '-' + n.slice(7);
}

/** تحويل كائن الغروب من الـ API إلى هيكل يفهمه الـ frontend */
export function mapGroup(g) {
  // يحاول استخراج بيانات الأعضاء إن وُجدت في الاستجابة
  const rawMembers = g.members ?? g.loans ?? [];
  const members = rawMembers.map(m => {
    const username = m.username ?? m.user?.username ?? m.userId ?? null;
    return {
      username,
      accountNumber: genAccNum(username),
      lotteryPosition: m.lotteryPosition ?? null,
    };
  }).filter(m => m.lotteryPosition !== null)
    .sort((a, b) => a.lotteryPosition - b.lotteryPosition);

  return {
    id:             g.id,
    groupNumber:    g.groupNumber,
    amount:         g.template.totalAmount,
    duration:       g.template.durationMonths,
    filled:         g.currentMemberCount,
    memberCapacity: g.memberCapacity,
    startDate:      g.startMonth?.slice(0, 7) ?? null,
    status:         g.status,
    priorityTaken:  [false, false, false],
    createdAt:      g.createdAt,
    members,
  };
}
