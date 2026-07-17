/**
 * LinkGold — inline gold text link used inside sentences
 * ("Already have an account? Sign in", "I agree to the Terms & Privacy Policy").
 */

import { Link } from "react-router-dom";

export function LinkGold({ children, path, className = '', ...props }) {
  return (
    <Link
      to={path}
      className={`text-gold text-sm no-underline border-b border-transparent hover:border-gold transition-colors ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
