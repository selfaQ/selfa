// جميع البيانات التجريبية والثوابت والدوال المساعدة

// ─── المبالغ المتاحة ──────────────────────────────────────────────────────────
export const AMOUNTS = [500_000, 1_000_000, 5_000_000, 10_000_000, 15_000_000, 20_000_000, 25_000_000];

// ─── رسوم الاشتراك حسب المدة ─────────────────────────────────────────────────
export const SUBSCRIPTION_FEE = { 10: 13_000, 18: 32_500, 24: 65_000 };

// ─── رسوم مقاعد الأولوية حسب المبلغ ─────────────────────────────────────────
export const PRIORITY_FEES = {
  500_000:    { 1: 50_000,  2: 35_000,  3: 25_000  },
  1_000_000:  { 1: 75_000,  2: 50_000,  3: 35_000  },
  5_000_000:  { 1: 250_000, 2: 150_000, 3: 100_000 },
  10_000_000: { 1: 250_000, 2: 150_000, 3: 100_000 },
  15_000_000: { 1: 250_000, 2: 150_000, 3: 100_000 },
  20_000_000: { 1: 250_000, 2: 150_000, 3: 100_000 },
  25_000_000: { 1: 300_000, 2: 250_000, 3: 200_000 },
};

// ─── جمعية نشطة تجريبية ───────────────────────────────────────────────────────
export const MOCK_ACTIVE_SALFA = {
  id: 'SQ-2025-001',
  amount: 10_000_000,
  duration: 18,
  mySlot: 11,
  paidCount: 4,
  startMonth: 'يناير 2025',
  endMonth: 'يونيو 2026',
  members: [
    { slot: 1,  account: 'KI-4471-2209', paid: true,  isMe: false },
    { slot: 2,  account: 'KI-8830-5541', paid: true,  isMe: false },
    { slot: 3,  account: 'KI-7721-3391', paid: true,  isMe: false },
    { slot: 4,  account: 'KI-9901-4412', paid: true,  isMe: false },
    { slot: 11, account: 'KI-2271-9904', paid: false, isMe: true  },
    { slot: 12, account: 'KI-6612-3380', paid: false, isMe: false },
  ],
  nextDeduction: { amount: 555_556, date: '1 فبراير 2026' },
};

// ─── إشعارات تجريبية ──────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  {
    id: 1, type: 'success',
    title: 'تم الاستقطاع بنجاح',
    body: '555,556 د.ع — سلفة 10M',
    time: 'منذ ساعتين', unread: true,
  },
  {
    id: 3, type: 'success',
    title: 'دورك القادم',
    body: 'تذكير: دورك شهر نوفمبر 2025',
    time: 'أمس', unread: false,
  },
];

// ─── رسائل تجريبية ───────────────────────────────────────────────────────────
export const MOCK_MESSAGES = [
  {
    id: 1, from: 'سلفة Q — النظام', fromId: 'Q',
    text: 'اكتملت مجموعتك — القرعة غداً',
    time: 'أمس 9:00 م', unread: true,
  },
  {
    id: 2, from: 'KI-8830-5541', fromId: 'KI-8830-5541',
    text: 'وافقت على الانضمام للسلفة الذاتية',
    time: 'اليوم 8:14 ص', unread: false,
  },
];

// ─── أعضاء السلفة الذاتية التجريبية ─────────────────────────────────────────
export const MOCK_SELF_MEMBERS = [
  { id: 1, account: 'KI-2271-9904', initial: 'أ', status: 'creator' },
  { id: 2, account: 'KI-4471-2209', initial: 'م', status: 'accepted' },
  { id: 3, account: 'KI-8830-5541', initial: 'س', status: 'pending'  },
];

// ─── الشهور بالعربية ─────────────────────────────────────────────────────────
export const MONTHS_AR = [
  'يناير','فبراير','مارس','أبريل','مايو','يونيو',
  'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر',
];

// ─── دوال مساعدة ─────────────────────────────────────────────────────────────

/** تنسيق المبلغ: 5000000 → "5,000,000 د.ع" */
export function formatIQD(n) {
  return n.toLocaleString('ar-IQ') + ' د.ع';
}

/** اختصار المبلغ: 5000000 → "5M" */
export function formatShort(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M';
  return (n / 1_000).toFixed(0) + 'K';
}

/** حساب القسط الشهري */
export function calcInstallment(amount, duration) {
  return Math.round(amount / duration);
}

/**
 * فحص حالة المبلغ بالنسبة للراتب
 * يُعيد: { status: 'ok'|'needs_longer'|'locked', minDuration }
 */
export function getAmountStatus(amount, maxInstallment) {
  const i10 = calcInstallment(amount, 10);
  const i18 = calcInstallment(amount, 18);
  const i24 = calcInstallment(amount, 24);
  if (i10 <= maxInstallment) return { status: 'ok',           minDuration: 10 };
  if (i18 <= maxInstallment) return { status: 'needs_longer', minDuration: 18 };
  if (i24 <= maxInstallment) return { status: 'needs_longer', minDuration: 24 };
  return { status: 'locked', minDuration: null };
}

/** حساب إجمالي الدفع عند التسجيل */
export function calcCheckout(amount, duration, priority) {
  const subFee      = SUBSCRIPTION_FEE[duration] ?? 0;
  const priorityFee = priority === 'raffle' ? 0 : (PRIORITY_FEES[amount]?.[priority] ?? 0);
  return { subFee, priorityFee, total: subFee + priorityFee };
}
