// ثوابت التطبيق — جميع البيانات الثابتة والتجريبية وDوال المساعدة

// ─── المبالغ المتاحة (بالدينار العراقي) ───────────────────────────────────────
export const AMOUNTS = [500_000, 1_000_000, 5_000_000, 10_000_000, 15_000_000, 20_000_000, 25_000_000];

// ─── مدد السداد (بالأشهر = عدد الأعضاء) ─────────────────────────────────────
export const DURATIONS = [10, 18, 24];

// ─── رسوم الاشتراك الشهرية حسب مدة الجمعية ──────────────────────────────────
export const SUBSCRIPTION_FEES = { 10: 13_000, 18: 32_500, 24: 65_000 };

// ─── رسوم المقاعد ذات الأولوية [مقعد1, مقعد2, مقعد3] حسب المبلغ ─────────────
export const PRIORITY_FEES = {
  500_000:    [50_000,  35_000,  25_000],
  1_000_000:  [75_000,  50_000,  35_000],
  5_000_000:  [250_000, 150_000, 100_000],
  10_000_000: [250_000, 150_000, 100_000],
  15_000_000: [250_000, 150_000, 100_000],
  20_000_000: [250_000, 150_000, 100_000],
  25_000_000: [300_000, 250_000, 200_000],
};

// ─── حسابات ki Card التجريبية ─────────────────────────────────────────────────
export const MOCK_ACCOUNTS = [
  {
    id: 1,
    name: 'أحمد محمد السعدي',
    initials: 'أس',
    type: 'government',
    typeLabel: 'موظف حكومي',
    typeColor: 'bg-blue-100 text-blue-700',
    salary: 1_500_000,
    kiCard: '7701-8892-3341',
    bank: 'مصرف الرافدين',
    department: 'وزارة الصحة',
  },
  {
    id: 2,
    name: 'سارة خالد الربيعي',
    initials: 'سر',
    type: 'private',
    typeLabel: 'موظف قطاع خاص',
    typeColor: 'bg-violet-100 text-violet-700',
    salary: 2_000_000,
    kiCard: '7702-5531-9982',
    bank: 'بنك بغداد',
    department: 'شركة الإتصالات العراقية',
  },
  {
    id: 3,
    name: 'محمد طارق الجميلي',
    initials: 'مج',
    type: 'personal',
    typeLabel: 'حساب شخصي',
    typeColor: 'bg-slate-100 text-slate-600',
    salary: 0,
    kiCard: '7703-2210-6654',
    bank: 'مصرف التجارة العراقي',
    department: null,
  },
];

// ─── بيانات الجمعيات المتاحة ──────────────────────────────────────
// الحالات: 'open' (مفتوحة) | 'completed' (مكتملة مع مؤقت 24 ساعة)
export const MOCK_SALAFAT = [
  // 🟢 مجموعات مفتوحة — تظهر في Browse
  {
    id: 1,  amount: 5_000_000,  duration: 10, filled: 7,
    priorityTaken: [true, true, false], startDate: '2025-05-01',
    status: 'open', completedAt: null,
  },
  {
    id: 3,  amount: 1_000_000,  duration: 10, filled: 9,
    priorityTaken: [true, true, true],  startDate: '2025-04-15',
    status: 'open', completedAt: null,
  },
  {
    id: 4,  amount: 500_000,    duration: 10, filled: 5,
    priorityTaken: [false, false, false], startDate: '2025-05-15',
    status: 'open', completedAt: null,
  },
  {
    id: 5,  amount: 20_000_000, duration: 24, filled: 8,
    priorityTaken: [true, true, false], startDate: '2025-06-01',
    status: 'open', completedAt: null,
  },

  // 🔵 مجموعات مكتملة — تختفي من Browse، يظهر مؤقت 24 ساعة
  {
    id: 2,  amount: 10_000_000, duration: 18, filled: 18,
    priorityTaken: [true, true, true], startDate: '2025-05-01',
    status: 'completed', completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 9,  amount: 5_000_000, duration: 10, filled: 10,
    priorityTaken: [true, true, true], startDate: '2025-04-01',
    status: 'completed', completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },

  // 🟢 مجموعات مفتوحة — تظهر في Browse (تابع)
  {
    id: 6,  amount: 15_000_000, duration: 18, filled: 14,
    priorityTaken: [true, true, true],  startDate: '2025-04-01',
    status: 'open', completedAt: null,
  },
  {
    id: 7,  amount: 5_000_000,  duration: 18, filled: 16,
    priorityTaken: [true, false, false], startDate: '2025-05-01',
    status: 'open', completedAt: null,
  },
  {
    id: 8,  amount: 25_000_000, duration: 24, filled: 2,
    priorityTaken: [false, false, false], startDate: '2025-07-01',
    status: 'open', completedAt: null,
  },
  {
    id: 10, amount: 1_000_000,  duration: 18, filled: 10,
    priorityTaken: [true, false, false], startDate: '2025-05-01',
    status: 'open', completedAt: null,
  },
  {
    id: 11, amount: 5_000_000,  duration: 24, filled: 20,
    priorityTaken: [true, true, true],  startDate: '2025-03-01',
    status: 'open', completedAt: null,
  },
  {
    id: 12, amount: 15_000_000, duration: 24, filled: 18,
    priorityTaken: [true, true, false], startDate: '2025-04-01',
    status: 'open', completedAt: null,
  },
];

// ─── إشعارات تجريبية ──────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'deduction',
    title: 'تذكير: خصم القسط',
    body: 'سيتم خصم 500,000 د.ع من راتبك في 2025/05/01',
    time: 'منذ ساعتين',
    read: false,
  },
  {
    id: 2,
    type: 'turn',
    title: 'تأكيد دورك',
    body: 'تهانينا! دورك في الجمعية 5M هو الشهر الثالث (مارس 2025)',
    time: 'أمس',
    read: false,
  },
  {
    id: 3,
    type: 'complete',
    title: 'اكتملت الجمعية',
    body: 'جمعية 1M / 10 أشهر اكتملت جميع أقساطها بنجاح',
    time: 'منذ 3 أيام',
    read: true,
  },
];

// ─── إحصائيات لوحة الإدارة ───────────────────────────────────────────────────
export const ADMIN_STATS = {
  activeGroups:  47,
  totalMembers:  620,
  monthlyRevenue: 21_800_000,
  defaultRate:   '1.2%',
  emergencyFund: 3_540_000,
  pendingSwaps:  5,
};

// ─── الشهور بالعربية ─────────────────────────────────────────────────────────
export const MONTHS_AR = [
  'يناير','فبراير','مارس','أبريل','مايو','يونيو',
  'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر',
];

// ─── دوال مساعدة ─────────────────────────────────────────────────────────────

/** تنسيق المبلغ بالدينار العراقي */
export function formatIQD(n) {
  return n.toLocaleString('ar-IQ') + ' د.ع';
}

/** اختصار المبلغ: 5,000,000 → 5M */
export function formatShort(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M';
  return (n / 1_000).toFixed(0) + 'K';
}

/** حساب القسط الشهري */
export function calcInstallment(amount, duration) {
  return amount / duration;
}

/** التحقق من قاعدة الـ 40% (هل القسط يتجاوز 40% من الراتب؟) */
export function isLocked(amount, duration, salary) {
  if (!salary || salary <= 0) return false;
  return calcInstallment(amount, duration) > salary * 0.4;
}

/** حساب إجمالي الأقساط الشهرية للمستخدم */
export function totalInstallments(activeSalafat) {
  return activeSalafat.reduce((sum, s) => sum + calcInstallment(s.amount, s.duration), 0);
}

/** الحد الأقصى المتاح للانضمام (40% من الراتب - الأقساط الحالية) */
export function remainingCapacity(salary, activeSalafat) {
  return (salary * 0.4) - totalInstallments(activeSalafat);
}

/** عدد المقاعد المتبقية في الجمعية */
export function seatsLeft(salafa) {
  return salafa.duration - salafa.filled;
}

/** المقاعد ذات الأولوية المتاحة */
export function availablePrioritySeats(salafa) {
  return salafa.priorityTaken.map((taken, i) => ({ seat: i + 1, taken })).filter(s => !s.taken);
}

// ─── دوال دورة حياة المجموعة ─────────────────────────────────────────────────

/** حساب الوقت المتبقي للمؤقت 24 ساعة (بالدقائق) */
export function getTimerRemaining(completedAt) {
  if (!completedAt) return 0;
  const elapsed = Date.now() - new Date(completedAt).getTime();
  const remaining = (24 * 60 * 60 * 1000) - elapsed;
  return Math.max(0, Math.round(remaining / 60000)); // بالدقائق
}

/** تنسيق الوقت المتبقي: 1440 دقيقة → "24 ساعة" / "12 س و 30 د" */
export function formatTimeRemaining(mins) {
  if (mins <= 0) return 'انتهى';
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  if (hours > 0 && minutes > 0) return `${hours} س و ${minutes} د`;
  if (hours > 0) return `${hours} ساعة`;
  return `${minutes} دقيقة`;
}

/** التحقق إذا تجاوزت 24 ساعة (انتقال لحالة جديدة) */
export function isTimeoutExpired(completedAt) {
  if (!completedAt) return false;
  const elapsed = Date.now() - new Date(completedAt).getTime();
  return elapsed > 24 * 60 * 60 * 1000;
}

/** تصفية الجمعيات حسب الحالة */
export function filterByStatus(salafat, status) {
  return salafat.filter(s => s.status === status);
}

/** الجمعيات المفتوحة والجديدة فقط (لصفحة Browse) */
export function getDisplaySalafat(salafat) {
  return salafat.filter(s => s.status === 'open' || s.status === 'new');
}
