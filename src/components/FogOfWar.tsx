export const FogOfWar = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        background: `radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.95) 100%)`,
      }}
    />
  );
};
