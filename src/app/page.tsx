'use client';
import { useState } from 'react';
import StarField from '@/components/StarField';
import Planet from '@/components/Planet';
import Dashboard from '@/components/Dashboard';
import { TokenData } from '@/lib/bags';
import { CosmicNarrative } from '@/lib/claude';

// Demo token for preview when no address entered
const DEMO_TOKEN: TokenData = {
  mint: 'demo',
  name: 'DEMO PLANET',
  symbol: 'DEMO',
  image: '',
  description: '',
  price: 0.0001,
  priceChange24h: 12.5,
  marketCap: 250000,
  volume24h: 45000,
  holders: 1842,
  claimableFees: 2.45,
  lifetimeFees: 12.3,
  topHolders: [],
  creators: [],
};

export default function Home() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    token: TokenData; narrative: CosmicNarrative;
  } | null>(null);

  const analyze = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mintAddress: address.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StarField />

      <div style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        padding: '0 24px',
      }}>

        {/* NAV */}
        <nav style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0', maxWidth: 1200, margin: '0 auto',
          borderBottom: '1px solid rgba(0, 210, 255, 0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #00d2ff, #0a2060)',
              boxShadow: '0 0 15px rgba(0,210,255,0.5)',
            }} />
            <span className="font-orbitron" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              <span className="neon-text-blue">BAGS</span>{' '}
              <span style={{ color: 'var(--star-white)' }}>COSMOS</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="https://bags.fm" target="_blank" rel="noreferrer"
              style={{
                fontFamily: 'Orbitron, sans-serif', fontSize: '0.7rem',
                letterSpacing: '0.15em', color: 'var(--text-dim)',
                textDecoration: 'none', textTransform: 'uppercase',
              }}>
              Bags.fm
            </a>
            <a href="https://docs.bags.fm" target="_blank" rel="noreferrer"
              style={{
                fontFamily: 'Orbitron, sans-serif', fontSize: '0.7rem',
                letterSpacing: '0.15em', color: 'var(--text-dim)',
                textDecoration: 'none', textTransform: 'uppercase',
              }}>
              Docs
            </a>
          </div>
        </nav>

        <main style={{ maxWidth: 1200, margin: '0 auto' }}>

          {!result ? (
            /* LANDING HERO */
            <div style={{
              minHeight: '85vh',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', paddingTop: 40,
            }}>
              {/* Floating planets decoration */}
              <div style={{
                position: 'relative', marginBottom: 48,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 60,
              }}>
                <div style={{ opacity: 0.5, animation: 'float 6s ease-in-out infinite' }}>
                  <Planet token={{ ...DEMO_TOKEN, symbol: 'SOL', priceChange24h: 5 }} size={80} />
                </div>
                <div style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
                  <Planet token={{ ...DEMO_TOKEN, symbol: 'BGS', priceChange24h: -3 }} size={120} />
                </div>
                <div style={{ opacity: 0.5, animation: 'float 7s ease-in-out infinite 0.5s' }}>
                  <Planet token={{ ...DEMO_TOKEN, symbol: 'WIF', priceChange24h: 15 }} size={70} />
                </div>
              </div>

              {/* Headline */}
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.75rem', letterSpacing: '0.3em',
                color: 'var(--neon-blue)', marginBottom: 20,
                textTransform: 'uppercase',
              }}>
                ◈ Bags.fm × Claude AI ◈
              </div>

              <h1 style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                fontWeight: 900, lineHeight: 1.1,
                marginBottom: 16,
              }}>
                YOUR TOKEN.<br />
                <span className="neon-text-blue">YOUR UNIVERSE.</span>
              </h1>

              <p style={{
                color: 'var(--text-dim)', fontSize: '1.05rem',
                maxWidth: 500, lineHeight: 1.7, marginBottom: 48,
              }}>
                Enter any Bags.fm token address and watch Claude AI transform
                your on-chain data into a cinematic cosmic mission briefing.
              </p>

              {/* Input */}
              <div style={{ width: '100%', maxWidth: 600 }}>
                <div style={{
                  display: 'flex', gap: 12,
                  background: 'rgba(0, 20, 60, 0.6)',
                  border: '1px solid var(--cosmos-border)',
                  borderRadius: 10, padding: 8,
                  backdropFilter: 'blur(20px)',
                }}>
                  <input
                    className="cosmos-input"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      fontSize: '0.9rem',
                    }}
                    placeholder="Enter token mint address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && analyze()}
                  />
                  <button
                    className="btn-cosmos btn-primary"
                    style={{ whiteSpace: 'nowrap', padding: '12px 28px' }}
                    onClick={analyze}
                    disabled={loading || !address.trim()}
                  >
                    {loading ? '...' : '🚀 SCAN'}
                  </button>
                </div>

                {error && (
                  <div style={{
                    marginTop: 12, padding: '10px 16px',
                    background: 'rgba(255, 45, 85, 0.1)',
                    border: '1px solid rgba(255, 45, 85, 0.3)',
                    borderRadius: 6, color: 'var(--neon-red)',
                    fontSize: '0.85rem',
                  }}>
                    ⚠ {error}
                  </div>
                )}
              </div>

              {/* Loading state */}
              {loading && (
                <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div className="spinner" />
                  <div className="font-orbitron" style={{
                    fontSize: '0.7rem', color: 'var(--neon-blue)',
                    letterSpacing: '0.2em', animation: 'pulse-glow 1s infinite',
                  }}>
                    SCANNING COSMOS...
                  </div>
                </div>
              )}

              {/* Features */}
              {!loading && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 20, marginTop: 64, maxWidth: 700,
                }}>
                  {[
                    { icon: '🤖', title: 'Claude AI', desc: 'Dramatic narrative from your token data' },
                    { icon: '🌍', title: 'Live Data', desc: 'Real-time from Bags.fm API' },
                    { icon: '⚡', title: 'Fee Tracker', desc: 'See your claimable SOL instantly' },
                  ].map((f) => (
                    <div key={f.title} className="cosmos-panel" style={{ padding: 20 }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{f.icon}</div>
                      <div className="font-orbitron" style={{ fontSize: '0.75rem', marginBottom: 6 }}>{f.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{f.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* DASHBOARD */
            <div style={{ paddingTop: 32, paddingBottom: 60 }}>
              {/* Back button + new scan */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32,
              }}>
                <button
                  className="btn-cosmos"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--cosmos-border)',
                    color: 'var(--text-dim)', padding: '8px 20px', fontSize: '0.7rem',
                  }}
                  onClick={() => { setResult(null); setAddress(''); }}
                >
                  ← SCAN NEW TOKEN
                </button>
                <input
                  className="cosmos-input"
                  style={{ maxWidth: 400, fontSize: '0.85rem', padding: '8px 16px' }}
                  placeholder="Scan another token..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && analyze()}
                />
                <button
                  className="btn-cosmos btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.7rem' }}
                  onClick={analyze}
                  disabled={loading}
                >
                  {loading ? '...' : 'SCAN'}
                </button>
              </div>

              <Dashboard token={result.token} narrative={result.narrative} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
