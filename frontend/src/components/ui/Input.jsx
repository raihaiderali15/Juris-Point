/**
 * Input — maps to .form-input + .form-label in the mockup's admin panel.
 * Reused for every text/email/password field across auth pages and admin forms.
 */
export function Input({ label, error, className = '', ...props }) {
  console.log(error)
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs text-text-muted tracking-widest uppercase">
          {label}
        </label>
      )}
      <input
        className={`bg-dark border ${error ? 'border-red-500' : 'border-border'} text-text px-3.5 py-2.5 font-sans text-sm outline-none focus:border-gold transition-colors placeholder:text-text-muted/60 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
