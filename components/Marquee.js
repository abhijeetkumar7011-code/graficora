// Infinite, seamless, CSS-only marquee. Children are rendered twice; the track slides by exactly one copy (-50%).
// Props: speed = seconds per loop (higher = slower), reverse, pauseOnHover, fade (edge mask), gapPx (space between items).
export default function Marquee({
  children,
  speed = 40,
  reverse = false,
  pauseOnHover = true,
  fade = true,
  gapPx = 24,
  className = "",
}) {
  const group = "flex shrink-0 items-stretch";
  const gs = { gap: gapPx, paddingRight: gapPx };
  return (
    <div
      className={`marquee overflow-hidden ${pauseOnHover ? "marquee-pausable" : ""} ${fade ? "marquee-fade" : ""} ${className}`}
    >
      <div
        className="marquee-track flex w-max"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className={group} style={gs}>
          {children}
        </div>
        <div className={group} style={gs} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
