'use client';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gray-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      {/* Animated lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>
      
      {/* Moving gradient lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-[200%] left-0 animate-gradient-slide"
            style={{
              top: `${20 * (i + 1)}%`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(123, 97, 255, 0.1) 50%, transparent 100%)',
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}