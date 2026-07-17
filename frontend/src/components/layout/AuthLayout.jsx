import { AuthNav } from "../ui/AuthNav";

/**
 * AuthLayout — THE canonical wrapper for every auth screen
 * (Login, Register, ForgotPassword, ForgotPasswordSent, ResetPassword,
 * ResetPasswordDone, VerifyEmail).
 *
 * Matches the dedicated auth mockup exactly: 42% editorial left panel on
 * dark2 with a border-right and § watermark, 58% form panel on the right.
 * `quote` is optional — pass it on screens that show the maxim block
 * (Login/Register), omit it on Forgot/Reset/Verify screens.
 *
 * Do not redesign this per page — only pass different content via props.
 */
export function AuthLayout({ tag, heading, subtext, quote, children }) {
  return (
    <div className="min-h-screen bg-dark">
      <AuthNav />

      <div className="flex min-h-screen pt-[70px]">
        {/* LEFT — editorial panel, hidden below lg */}
        <div className="hidden lg:flex flex-col justify-between w-[42%] px-14 py-16 bg-dark2 border-r border-border relative overflow-hidden">
          <div
            className="absolute -left-8 -bottom-16 font-serif font-black text-[22rem] leading-none pointer-events-none select-none"
            style={{ color: "rgba(201,168,76,0.035)" }}
          >
            §
          </div>

          <div className="relative z-10">
            {tag && (
              <div className="inline-flex items-center gap-2.5 mb-10 px-4 py-1.5 border border-border text-gold text-xs tracking-widest2 uppercase">
                {tag}
              </div>
            )}
            <h1 className="font-serif text-4xl md:text-5xl font-black leading-tight mb-6">
              {heading}
            </h1>
            <p className="text-text-muted text-base leading-8 max-w-[420px]">
              {subtext}
            </p>
          </div>

          {quote && (
            <div className="relative z-10 border-t border-border pt-8 mt-8">
              <div className="font-serif italic text-text text-base leading-relaxed mb-3">
                "{quote.text}"
              </div>
              <div className="text-gold text-xs tracking-widest uppercase">
                {quote.author}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — form panel */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 md:px-12 md:py-16">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
