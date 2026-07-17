/**
 * Button — maps to .btn-gold / .btn-outline / .cta-primary in the mockup.
 *
 * variant: "gold" | "outline"
 * size:    "sm" (nav/admin buttons) | "md" (default) | "lg" (hero CTA)
 */
export function Button({ variant = 'gold', size = 'md', className = '', children, ...props }) {
  const base = "font-sans font-semibold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";

  const variants = {
    gold: "bg-gradient-to-br from-gold to-gold-light text-dark border-none hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,76,0.3)]",
    outline: "bg-transparent text-gold border border-border hover:bg-gold/10 hover:border-gold",
  };

  const sizes = {
    sm: "px-5 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-9 py-3.5 text-sm",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
