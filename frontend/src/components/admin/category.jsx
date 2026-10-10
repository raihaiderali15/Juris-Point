import { useState } from "react";
import { ChevronDown, Check, Plus, Trash2 } from "lucide-react";

function CategoryField() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="flex flex-col gap-1.5"
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <label className="text-xs tracking-widest uppercase text-text-muted">Category</label>

      <div className="relative">
        {/* Field */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className={`w-full flex items-center justify-between bg-dark border text-left text-text
                      text-[0.95rem] px-4 py-3 outline-none transition-colors
                      ${open ? "border-gold" : "border-border hover:border-gold/60"}`}
        >
          <span className="truncate">Contract Law</span>
          <ChevronDown
            size={16}
            className={`text-text-muted shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <>
            {/* Click-outside catcher */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            {/* Dropdown */}
            <div className="absolute left-0 right-0 top-full mt-2 z-50 isolate bg-dark-3 border border-gold/50
                            shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <ul className="max-h-64 overflow-y-auto">
                {/* Selected */}
                <li
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-[0.95rem] text-gold
                             bg-gold/10 border-b border-border cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Check size={15} className="shrink-0" />
                    <span className="truncate">Contract Law</span>
                  </span>
                  <button
                    type="button"
                    aria-label="Delete Contract Law"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-text-muted hover:text-error transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>

                {/* Others */}
                <li
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-[0.95rem] text-text
                             border-b border-border cursor-pointer hover:bg-dark-4 transition-colors"
                >
                  <span className="truncate pl-[25px]">Criminal Law</span>
                  <button
                    type="button"
                    aria-label="Delete Criminal Law"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-text-muted hover:text-error transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>

                {/* Empty state: render when the list is empty
                <li className="px-4 py-5 text-sm text-text-muted text-center">
                  No categories yet. Add one below.
                </li> */}
              </ul>

              {/* Create new */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2 p-3 bg-dark-2 border-t border-gold/30"
              >
                <input
                  placeholder="New category"
                  className="flex-1 min-w-0 h-10 bg-dark border border-border text-text text-sm px-3.5
                             outline-none focus:border-gold transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Add category"
                  className="w-10 h-10 flex items-center justify-center bg-linear-to-br from-gold to-gold-light
                             text-dark hover:opacity-90 transition"
                >
                  <Plus size={18} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default CategoryField;