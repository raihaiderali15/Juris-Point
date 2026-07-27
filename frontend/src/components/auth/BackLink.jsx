import { Link } from "react-router-dom";
export function BackLink({ children = 'Back to Sign In' ,to}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-text-muted no-underline text-sm tracking-wide mb-8 hover:text-gold transition-colors"
    >
      ← {children}
    </Link>
  );
}