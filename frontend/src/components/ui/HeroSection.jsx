/**
 * Hero.jsx
 * Presentational-only component (no logic, no handlers, no data).
 * Matches lexnotes-design1.html exactly — 1:1 port of the hero section.
 *
 * ASSUMPTIONS ABOUT tailwind.config.js TOKENS
 * (rename these in the className strings below if yours differ):
 *   gold        -> #C9A84C
 *   gold-light  -> #E8C97A
 *   dark        -> #0A0A0F   (page background)
 *   dark-2      -> #12121A
 *   dark-3      -> #1C1C28
 *   dark-4      -> #252535
 *   border      -> rgba(201,168,76,0.2)   (used as border-border/20 or a solid token)
 *   text-muted  -> #8B8A99
 *
 * FONTS
 * Requires 'Playfair Display' (display/serif) and 'DM Sans' (body) loaded
 * globally, e.g. in index.html:
 *   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
 * and mapped in tailwind.config.js:
 *   fontFamily: { serif: ['"Playfair Display"', 'serif'], sans: ['"DM Sans"', 'sans-serif'] }
 *
 * The two CTA buttons here are plain <button>/<a> markup so you can freely
 * swap in your existing components/ui/Button.jsx once logic is wired up.
 */

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center px-6 md:px-12 pt-32 pb-16 bg-dark">
      {/* Decorative radial glow, top-right (::before) */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[60%] h-full"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(201,168,76,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Giant § watermark (::after) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-12 md:right-24 -translate-y-1/2 select-none font-serif font-black leading-none text-gold/[0.04]"
        style={{ fontSize: "28rem" }}
      >
        §
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[680px]">
        {/* Eyebrow tag */}
        <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-1.5 border border-gold/20 text-gold text-xs tracking-[0.15em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          Trusted by 12,000+ Law Students
        </div>

        {/* Headline */}
        <h1 className="font-serif font-black leading-[1.1] mb-6 text-[clamp(3rem,5vw,5rem)] text-text">
          Master the <em className="italic text-gold">Law</em>,
          <br />
          One Note at a Time
        </h1>

        {/* Subcopy */}
        <p className="text-lg text-text-muted leading-[1.8] mb-12 max-w-[480px]">
          Premium case summaries, lecture notes, and legal insights curated by
          top barristers and professors. Your complete legal education
          companion.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="px-9 py-3.5 bg-gradient-to-br from-gold to-gold-light text-dark font-sans font-semibold text-sm tracking-[0.08em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,76,0.3)]"
          >
            Explore Notes →
          </button>
          <a
            href="#services"
            className="flex items-center gap-2 text-text-muted text-sm tracking-[0.05em] transition-colors duration-300 hover:text-gold"
          >
            ▶ Watch Overview
          </a>
        </div>

        {/* Stats row */}
        <div className="flex gap-16 mt-16 pt-12 border-t border-gold/20">
          <div>
            <div className="font-serif font-bold text-4xl text-gold">
              8,400+
            </div>
            <div className="text-xs text-text-muted tracking-[0.1em] uppercase mt-1">
              Law Notes
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-4xl text-gold">
              1,200+
            </div>
            <div className="text-xs text-text-muted tracking-[0.1em] uppercase mt-1">
              Case Summaries
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-4xl text-gold">
              340+
            </div>
            <div className="text-xs text-text-muted tracking-[0.1em] uppercase mt-1">
              Lectures
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}