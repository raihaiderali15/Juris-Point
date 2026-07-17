import { useNavigate } from "react-router-dom";


/**
 * AuthTabs — the segmented Sign In / Create Account switch.
 * Presentational only: `active` is a prop ("login" | "register"), not internal
 * state. The parent page decides which one is active by which screen it is.
 * No onClick/navigation wired here on purpose.
 */
export function AuthTabs({ active = 'login' }) {
  const tabs = [
    { key: 'login', label: 'Sign In' , path:'/login' },
    { key: 'register', label: 'Create Account', path:'/register' },
  ];
  const navigate= useNavigate()
  return (
    <div className="flex border border-border mb-12">
      {tabs.map((tab, i) => (
        <button onClick={()=>{navigate(`${tab.path}`)}}
          key={tab.key}
          type="button"
          className={`flex-1 py-3 text-xs tracking-widest uppercase transition-all
            ${i === 0 ? 'border-r border-border' : ''}
            ${active === tab.key
              ? 'bg-gold/10 text-gold'
              : 'text-text-muted hover:text-text hover:bg-dark3'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
