import { request } from './http';

export const getMyLoans = ()   => request('/api/app/loans');
export const getLoan    = (id) => request(`/api/app/loans/${id}`);

/** تحويل كائن القرض من الـ API إلى هيكل يفهمه الـ frontend */
export function mapLoan(l) {
  return {
    id:                  l.id,
    groupId:             l.group.id,
    amount:              l.group.template.totalAmount,
    duration:            l.group.template.durationMonths,
    myTurn:              l.lotteryPosition ?? null,
    monthsPaid:          0,          // يحتاج جدول الدفعات
    nextDeduction:       l.group.startMonth?.slice(0, 10) ?? null,
    seatType:            'lottery',  // backend لا يحتوي على أولوية
    prioritySeat:        null,
    joinedAt:            l.joinedAt,
    confirmationStatus:  l.confirmationStatus,  // Pending | Confirmed | Exited
    groupStatus:         l.group.status,
    payoutScheduledMonth: l.payoutScheduledMonth,
    isDefaulted:         l.isDefaulted ?? false,
  };
}
