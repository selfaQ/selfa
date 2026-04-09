// شريط التقدم — يُظهر عدد الأشهر المنجزة من إجمالي مدة الجمعية

export default function ProgressBar({ paid, total, showLabel = true }) {
  const pct = Math.round((paid / total) * 100);

  return (
    <div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-slate-500">
          <span>{paid} شهر مدفوع</span>
          <span>{total - paid} متبقي</span>
        </div>
      )}
    </div>
  );
}
