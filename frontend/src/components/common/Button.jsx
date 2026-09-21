export const Button = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/20";
  const variantClasses = {
    primary: "bg-[#00ba66] hover:bg-[#00a458] text-white shadow-sm hover:shadow active:scale-[0.99]",
    secondary: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-xs hover:border-slate-300",
    outline: "bg-transparent hover:bg-emerald-50/50 text-[#00ba66] border border-[#00ba66]/40 hover:border-[#00ba66]",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900"
  };
  const sizeClasses = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3 gap-2.5"
  };
  return <button
    className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...props}
  >
      {children}
      {icon && <span className="inline-flex shrink-0 items-center">{icon}</span>}
    </button>;
};
