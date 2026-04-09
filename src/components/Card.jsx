// مكون البطاقة العامة — يُلف أي محتوى بتصميم موحد

export default function Card({ children, className = '', onClick, locked = false }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-card shadow-sm border border-slate-100
        ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.99] transition-all' : ''}
        ${locked ? 'locked-card' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
