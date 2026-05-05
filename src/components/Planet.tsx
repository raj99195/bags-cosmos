'use client';
import { TokenData } from '@/lib/bags';

interface PlanetProps {
  token: TokenData;
  size?: number;
}

// Generate deterministic planet colors from token symbol
function getPlanetColors(symbol: string) {
  const hash = symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [
    [200, 240], [120, 160], [280, 320], [30, 60], [170, 200],
  ];
  const [h1, h2] = hues[hash % hues.length];
  return {
    primary: `hsl(${h1 + (hash % 20)}, 70%, 40%)`,
    secondary: `hsl(${h2 + (hash % 15)}, 60%, 55%)`,
    glow: `hsl(${h1}, 80%, 60%)`,
    ring: hash % 3 === 0, // some planets have rings
  };
}

export default function Planet({ token, size = 180 }: PlanetProps) {
  const colors = getPlanetColors(token.symbol);
  const positive = token.priceChange24h >= 0;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Outer glow ring */}
      <div style={{
        position: 'absolute',
        inset: -20,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.glow}22 0%, transparent 70%)`,
        animation: 'planet-pulse 3s ease-in-out infinite',
      }} />

      {/* Planet ring (for some tokens) */}
      {colors.ring && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotateX(75deg)',
          width: size * 1.6,
          height: size * 1.6,
          borderRadius: '50%',
          border: `3px solid ${colors.glow}55`,
          boxShadow: `0 0 15px ${colors.glow}33`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Planet body */}
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `
          radial-gradient(circle at 35% 35%,
            ${colors.secondary} 0%,
            ${colors.primary} 45%,
            #0a0a20 100%
          )
        `,
        boxShadow: `
          inset -${size * 0.15}px -${size * 0.1}px ${size * 0.3}px rgba(0,0,0,0.8),
          inset ${size * 0.05}px ${size * 0.05}px ${size * 0.15}px rgba(255,255,255,0.1),
          0 0 ${size * 0.3}px ${colors.glow}44,
          0 0 ${size * 0.6}px ${colors.glow}22
        `,
        animation: 'rotate-slow 20s linear infinite',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Surface texture bands */}
        {[0.2, 0.4, 0.6, 0.75].map((y, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: 0, right: 0,
            top: `${y * 100}%`,
            height: `${5 + (i % 2) * 5}%`,
            background: `rgba(255,255,255,${0.03 + i * 0.01})`,
            borderRadius: '50%',
          }} />
        ))}

        {/* Token symbol overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 900,
          fontSize: size * 0.18,
          color: 'rgba(255,255,255,0.9)',
          textShadow: '0 0 20px rgba(255,255,255,0.5)',
          letterSpacing: '0.05em',
        }}>
          {token.symbol.length > 4 ? token.symbol.slice(0, 4) : token.symbol}
        </div>
      </div>

      {/* Status indicator */}
      <div style={{
        position: 'absolute',
        bottom: 8, right: 8,
        width: 16, height: 16,
        borderRadius: '50%',
        background: positive ? '#00ff88' : '#ff2d55',
        boxShadow: `0 0 10px ${positive ? '#00ff88' : '#ff2d55'}`,
        animation: 'pulse-glow 1.5s infinite',
      }} />
    </div>
  );
}
