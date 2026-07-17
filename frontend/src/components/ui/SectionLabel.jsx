/**
 * SectionLabel — maps to .section-label in the mockup.
 * The small gold eyebrow with a hairline dash, always placed right above an <h2>.
 * Example: <SectionLabel>Law Notes</SectionLabel><h2>Latest Study Materials</h2>
 */
export function SectionLabel({ children, center = false, className = '' }) {
  return (
    <div
      className={`flex items-center gap-3 text-xs text-gold tracking-widest3 uppercase mb-4 ${center ? 'justify-center' : ''} ${className}`}
    >
      <span className="w-[30px] h-px bg-gold" />
      {children}
    </div>
  );
}
