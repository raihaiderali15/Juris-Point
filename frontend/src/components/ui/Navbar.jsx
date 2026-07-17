import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/Button";

const navLinks = [
  { name: "NOTES", path: "/notes" },
  { name: "CASELAW", path: "/caselaw" },
  { name: "SERVICES", path: "/services" },
  { name: "CONTACT", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-border bg-dark-3/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold text-gold">
          Logo
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.path}>
              { <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `relative transition-colors duration-200 ${
                    isActive
                      ? "text-gold"
                      : "text-text-muted hover:text-gold"
                  }`
                }
              >
                {link.name}
              </NavLink> }
             
            </li>
          ))}
        </ul>

        {/* Desktop Button */}
        <div className="hidden md:block">
          <NavLink to="/login">
            <Button variant="outline">SIGN IN</Button>
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-text-muted"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="bg-dark-3 border-t border-border px-6 py-5 flex flex-col gap-5">

          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-gold"
                    : "text-text-muted hover:text-gold"
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}

          <NavLink
            to="/login"
            onClick={() => setOpen(false)}
          >
            <Button variant="outline" className="w-full">
              SIGN IN
            </Button>
          </NavLink>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;