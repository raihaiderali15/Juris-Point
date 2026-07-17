/**
 * Divider — "Or continue with" hairline divider between form and OAuth button.
 */
export function Divider({ children = 'Or continue with' }) {
  return (
    <div className="flex items-center gap-4 my-8 text-text-muted text-xs tracking-widest uppercase">
      <span className="flex-1 h-px bg-border" />
      {children}
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}
