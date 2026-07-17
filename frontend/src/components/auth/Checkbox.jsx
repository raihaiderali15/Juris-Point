/**
 * Checkbox — labeled checkbox row ("Keep me signed in", "I agree to Terms").
 * Layout only: uncontrolled, no checked/onChange wired.
 */
export function Checkbox({ id, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <input
        type="checkbox"
        id={id}
        className="w-[15px] h-[15px] accent-gold bg-dark cursor-pointer"
      />
      <label htmlFor={id} className="text-sm text-text-muted cursor-pointer">
        {label}
      </label>
    </div>
  );
}
