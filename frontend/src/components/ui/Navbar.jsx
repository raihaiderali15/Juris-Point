import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/authContext";

const navLinks = [
  { name: "NOTES", path: "/notes" },
  { name: "CASELAW", path: "/caselaw" },
  { name: "SERVICES", path: "/services" },
  { name: "CONTACT", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
   const {isAuthenticated,logoutUser} =useAuth()
    const navigate= useNavigate()
  const handleLogout=()=>{
    logoutUser()
  }

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

            <Button variant="outline"  onClick={()=>{setOpen(false);
            if(isAuthenticated){
              handleLogout();
            }else{
              navigate("/login")
            }
          }}>{isAuthenticated?"Logout":"Login"}</Button>
         
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

          <Button variant="outline" className="w-full" onClick={()=>{setOpen(false);
            if(isAuthenticated){
              handleLogout();
            }else{
              navigate("/login")
            }
          }}>{isAuthenticated?"Logout":"Login"}</Button>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;