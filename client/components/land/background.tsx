export default function Background() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background: `
      radial-gradient(
        circle at center,
        var(--hero-glow-strong) 0%,
        var(--hero-glow-medium) 25%,
        var(--hero-glow-fade) 60%
      )
    `,
      }}
    />
  );
}
