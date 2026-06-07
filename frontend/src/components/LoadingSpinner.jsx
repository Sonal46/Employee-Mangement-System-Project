const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="flex min-h-40 items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
    <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-mint dark:border-slate-700" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default LoadingSpinner;
