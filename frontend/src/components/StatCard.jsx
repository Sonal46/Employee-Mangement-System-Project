const StatCard = ({ title, value, caption, accent = "bg-mint" }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/80">
    <div className={`mb-4 h-1.5 w-12 rounded-full ${accent}`} />
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    {caption && <p className="mt-1 text-sm text-slate-500">{caption}</p>}
  </div>
);

export default StatCard;
