'use client';
import { TokenData } from '@/lib/bags';
import { CosmicNarrative } from '@/lib/claude';
import Planet from './Planet';

interface DashboardProps {
  token: TokenData;
  narrative: CosmicNarrative;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function StatCard({
  icon, label, value, sub, color = 'var(--neon-blue)',
}: {
  icon: string; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="cosmos-panel" style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem',
        fontWeight: 700, color, marginBottom: 4,
        textShadow: `0 0 15px ${color}66`,
      }}>{value}</div>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem',
        letterSpacing: '0.15em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard({ token, narrative }: DashboardProps) {
  const positive = token.priceChange24h >= 0;
  const threatColor = {
    LOW: 'var(--neon-green)', MEDIUM: '#ffd60a',
    HIGH: 'var(--neon-orange)', CRITICAL: 'var(--neon-red)',
  }[narrative.threat];

  const handleBuy = () => {
    const partnerKey = process.env.NEXT_PUBLIC_BAGS_PARTNER_KEY || '';
    const url = partnerKey
      ? `https://bags.fm/token/${token.mint}?ref=${partnerKey}`
      : `https://bags.fm/token/${token.mint}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ animation: 'data-stream 0.6s ease forwards' }}>

      {/* Mission Title */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 20px',
          border: `1px solid ${threatColor}`,
          borderRadius: 4,
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          color: threatColor,
          marginBottom: 12,
        }}>
          ◈ {narrative.cosmicEvent} DETECTED ◈
        </div>
        <h2 className="font-orbitron neon-text-blue" style={{ fontSize: '1.6rem', marginBottom: 8 }}>
          {narrative.missionTitle}
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{narrative.statusLine}</p>
      </div>

      {/* Main hero section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 24, marginBottom: 24,
      }}>
        {/* Planet */}
        <div className="cosmos-panel" style={{
          padding: 32,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <Planet token={token} size={160} />
          <div style={{ textAlign: 'center' }}>
            <div className="font-orbitron" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {token.name}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>${token.symbol}</div>
          </div>
          {token.image && (
            <img src={token.image} alt={token.name}
              style={{ width: 48, height: 48, borderRadius: '50%',
                border: '2px solid var(--neon-blue)', display: 'none' }} />
          )}
        </div>

        {/* Mission Briefing */}
        <div className="cosmos-panel" style={{ padding: 28 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
          }}>
            <span style={{ fontSize: '1.2rem' }}>🤖</span>
            <span className="font-orbitron" style={{
              fontSize: '0.7rem', letterSpacing: '0.2em',
              color: 'var(--neon-blue)', textTransform: 'uppercase',
            }}>
              Claude AI — Cosmic Intelligence
            </span>
            <span style={{
              marginLeft: 'auto', padding: '3px 10px',
              border: `1px solid ${threatColor}`, borderRadius: 4,
              fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem',
              color: threatColor, letterSpacing: '0.1em',
            }}>
              THREAT: {narrative.threat}
            </span>
          </div>

          <p style={{
            lineHeight: 1.8, color: 'rgba(200, 230, 255, 0.9)',
            fontSize: '0.95rem', marginBottom: 20,
            borderLeft: `2px solid var(--neon-blue)`,
            paddingLeft: 16,
          }}>
            {narrative.briefing}
          </p>

          <div style={{
            background: 'rgba(0, 210, 255, 0.08)',
            border: '1px solid rgba(0, 210, 255, 0.2)',
            borderRadius: 8, padding: '12px 16px',
          }}>
            <span className="font-orbitron" style={{
              fontSize: '0.65rem', color: 'var(--neon-blue)',
              letterSpacing: '0.15em', display: 'block', marginBottom: 6,
            }}>
              ▶ RECOMMENDED ACTION
            </span>
            <span style={{ color: 'var(--star-white)', fontSize: '0.9rem' }}>
              {narrative.recommendation}
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16, marginBottom: 24,
      }}>
        <StatCard
          icon="🌍" label="Planet Value"
          value={fmt(token.marketCap)}
          color="var(--neon-blue)"
        />
        <StatCard
          icon="👽" label="Civilization"
          value={token.holders.toLocaleString()}
          sub="holders"
          color="var(--neon-cyan)"
        />
        <StatCard
          icon="⚡" label="Energy Crystals"
          value={`${token.claimableFees.toFixed(3)} SOL`}
          sub="claimable fees"
          color="var(--neon-green)"
        />
        <StatCard
          icon={positive ? '🌞' : '☄️'} label="Cosmic Flux"
          value={`${positive ? '+' : ''}${token.priceChange24h.toFixed(2)}%`}
          sub="24h change"
          color={positive ? 'var(--neon-green)' : 'var(--neon-red)'}
        />
      </div>

      {/* Bottom section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Top Soldiers */}
        <div className="cosmos-panel" style={{ padding: 24 }}>
          <div className="font-orbitron" style={{
            fontSize: '0.7rem', letterSpacing: '0.2em',
            color: 'var(--neon-blue)', marginBottom: 16,
          }}>
            // TOP CIVILIZATIONS
          </div>
          {token.topHolders.slice(0, 7).map((h, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              gap: 12, marginBottom: 10,
            }}>
              <span className="font-orbitron" style={{
                fontSize: '0.7rem', color: 'var(--text-dim)', width: 24,
              }}>#{i + 1}</span>
              <span style={{ flex: 1, fontSize: '0.75rem', color: 'var(--star-white)',
                fontFamily: 'monospace',
              }}>
                {h.wallet.slice(0, 4)}...{h.wallet.slice(-4)}
              </span>
              <div style={{ width: 80 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${Math.min(h.percentage, 100)}%`,
                    background: `linear-gradient(90deg, var(--neon-blue), var(--neon-cyan))`,
                  }} />
                </div>
              </div>
              <span style={{
                fontFamily: 'Orbitron, sans-serif', fontSize: '0.7rem',
                color: 'var(--neon-cyan)', width: 48, textAlign: 'right',
              }}>
                {h.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>

        {/* Mission Orders */}
        <div className="cosmos-panel" style={{ padding: 24 }}>
          <div className="font-orbitron" style={{
            fontSize: '0.7rem', letterSpacing: '0.2em',
            color: 'var(--neon-blue)', marginBottom: 20,
          }}>
            // MISSION ORDERS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 6 }}>
                Harvest your energy crystals
              </div>
              <button className="btn-cosmos btn-green" style={{ width: '100%', fontSize: '0.75rem', padding: '12px' }}
                onClick={() => window.open(`https://bags.fm/token/${token.mint}`, '_blank')}>
                ⚡ CLAIM {token.claimableFees.toFixed(3)} SOL
              </button>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 6 }}>
                Expand your civilization
              </div>
              <button className="btn-cosmos btn-primary" style={{ width: '100%', fontSize: '0.75rem', padding: '12px' }}
                onClick={handleBuy}>
                🚀 ACQUIRE TERRITORY
              </button>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 6 }}>
                View on Bags.fm
              </div>
              <button className="btn-cosmos btn-orange" style={{ width: '100%', fontSize: '0.75rem', padding: '12px' }}
                onClick={() => window.open(`https://bags.fm/token/${token.mint}`, '_blank')}>
                🌌 OPEN PLANET HQ
              </button>
            </div>
          </div>

          {/* Volume */}
          <div style={{
            marginTop: 20, paddingTop: 16,
            borderTop: '1px solid var(--cosmos-border)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              24h Battle Activity
            </div>
            <div className="font-orbitron" style={{ fontSize: '0.8rem', color: 'var(--neon-orange)' }}>
              {fmt(token.volume24h)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', marginTop: 32,
        fontSize: '0.72rem', color: 'var(--text-dim)',
        letterSpacing: '0.1em',
      }}>
        POWERED BY{' '}
        <a href="https://bags.fm" target="_blank" rel="noreferrer"
          style={{ color: 'var(--neon-blue)', textDecoration: 'none' }}>BAGS.FM API</a>
        {' '}✦{' '}
        <span style={{ color: 'var(--neon-purple)' }}>CLAUDE AI</span>
        {' '}✦ BAGS COSMOS
      </div>
    </div>
  );
}
