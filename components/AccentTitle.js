// Renders a { pre, accent, post } title with the gradient on the accent part.
export default function AccentTitle({ t }) {
  return (
    <>
      {t.pre}
      <span className="gradient-text">{t.accent}</span>
      {t.post}
    </>
  );
}
