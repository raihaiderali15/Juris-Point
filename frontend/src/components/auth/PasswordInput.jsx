import { useState } from "react";
import { Input } from "../ui/Input";
export function PasswordInput({ label = 'Password', placeholder = 'Enter your password', error , ...props }) {
 

 
  const [passShow, setPassShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs text-text-muted tracking-widest uppercase">
        {label}
      </label>
      <div className="relative">

        <Input
          type={passShow ? "text" : "password"}
          placeholder={placeholder}
          error={error}
          className="w-full bg-dark border border-border text-text px-4 py-3.5 pr-16 font-sans text-sm outline-none focus:border-gold focus:bg-dark3 transition-colors placeholder:text-text-muted/50"
          {...props}
        />
        <button
         onMouseDown={(e) => e.preventDefault()}
        onClick={()=>{setPassShow((prev)=>!prev)}}
          type="button"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-muted tracking-wide uppercase hover:text-gold transition-colors"
        >
          {passShow?"Hide":"Show"}
        </button>
      </div>
    </div>
  );
}
