/**
 * OAuthButton — "Continue with Google" style button.
 * Layout only, no OAuth flow wired.
 */
export function OAuthButton({ icon = '🔒', children = 'Continue with Google' }) {
  return (
    <button
      type="button"
      className="w-full py-3.5 mb-3 bg-transparent border border-border text-text text-sm flex items-center justify-center gap-2.5 transition-all hover:border-gold hover:bg-dark3"
    >
      <span>{icon}</span>
      {children}
    </button>
  );
}
