export function PasswordStrengthMeter({
  filled,
  level,
  label,
}) {
  const fillColor = {
    weak: "bg-red-500",
    mid: "bg-gold",
    strong: "bg-green-500",
  }[level];

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 ${
              i < filled ? fillColor: "bg-dark"
            }`}
          />
        ))}
      </div>

      <div className="mt-1.5 text-xs text-text-muted">
        {label}
      </div>
    </div>
  );
}