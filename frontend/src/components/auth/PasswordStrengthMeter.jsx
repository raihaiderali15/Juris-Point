/**
 * PasswordStrengthMeter — 4-segment strength bar + label.
 * Layout only: `filled` (0-4) and `label` are plain props showing a fixed
 * example state. Real strength calculation is logic you'll add later.
 */
export function PasswordStrengthMeter({ filled = 2, level = 'mid', label = 'Medium — add a symbol for a stronger password' }) {
  const fillColor = {
    weak: 'bg-error',
    mid: 'bg-gold',
    strong: 'bg-success',
  }[level];

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 ${i < filled ? fillColor : 'bg-dark4'}`}
          />
        ))}
      </div>
      <div className="text-xs text-text-muted mt-1.5 tracking-wide">{label}</div>
    </div>
  );
}
