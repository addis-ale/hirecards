// Background elements for Hero section

interface StaticOrbProps {
  size: number;
  initialX: number;
  initialY: number;
}

export const StaticOrb = ({ size, initialX, initialY }: StaticOrbProps) => (
  <div
    className="absolute rounded-full blur-3xl opacity-30 pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${initialX}%`,
      top: `${initialY}%`,
      background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%)",
    }}
  />
);

export const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(#0f172a 1.5px, transparent 1.5px), linear-gradient(90deg, #0f172a 1.5px, transparent 1.5px)`,
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);

export const StaticBeam = () => (
  <div
    className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
    style={{ width: "100%", top: "50%" }}
  />
);
