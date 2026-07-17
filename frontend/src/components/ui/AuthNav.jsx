import { useNavigate } from "react-router-dom";

/**
 * AuthNav — the stripped-down nav used only on auth screens.
 * NOT the main site Navbar (that one has full links + Sign In/Get Access).
 * Layout only: no routing, no real logo link behavior.
 */
export function AuthNav() {
  const navigate=useNavigate()
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 h-[80px] bg-dark/90 backdrop-blur-xl border-b border-border">
      <span onClick={()=>{navigate("/")}} className="font-serif text-2xl font-bold text-gold tracking-wide cursor-default">
        JURIS<span className="text-text italic">POINT</span>
      </span>
    </nav>
  );
}
