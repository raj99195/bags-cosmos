import { BagsSDK } from '@bagsfm/bags-sdk';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

function getSDK(): BagsSDK {
  const rpcUrl = process.env.HELIUS_API_KEY
    ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
    : 'https://api.mainnet-beta.solana.com';
  const connection = new Connection(rpcUrl, 'confirmed');
  return new BagsSDK(process.env.BAGS_API_KEY!, connection, 'processed');
}

export interface TokenData {
  mint: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  claimableFees: number;
  lifetimeFees: number;
  topHolders: Array<{ wallet: string; percentage: number; amount: number }>;
  creators: Array<{ wallet: string; share: number; username?: string; pfp?: string }>;
}

const BASE = 'https://public-api-v2.bags.fm/api/v1';

async function bagsGet(path: string) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'x-api-key': process.env.BAGS_API_KEY! },
    });
    const json = await res.json();
    if (!res.ok) return null;
    return json;
  } catch { return null; }
}

export async function getTokenData(mintAddress: string): Promise<TokenData> {
  const sdk = getSDK();
  const mint = new PublicKey(mintAddress);

  // Fetch all in parallel
  const [lifetimeFeesResult, creatorsResult, claimStatsResult] =
    await Promise.allSettled([
      sdk.state.getTokenLifetimeFees(mint),
      sdk.state.getTokenCreators(mint),
      bagsGet(`/token-launch/claim-stats?tokenMint=${mintAddress}`),
    ]);

  const lifetimeFeesLamports =
    lifetimeFeesResult.status === 'fulfilled' ? Number(lifetimeFeesResult.value) : 0;
  const creatorsRaw =
    creatorsResult.status === 'fulfilled' ? (creatorsResult.value || []) : [];
  const claimStats =
    claimStatsResult.status === 'fulfilled' ? claimStatsResult.value : null;

  // Parse creators — name/symbol comes from primary creator's token info
  const creators = (Array.isArray(creatorsRaw) ? creatorsRaw : []).map((c: any) => ({
    wallet: c.wallet || '',
    share: (c.royaltyBps || 0) / 100,
    username: c.providerUsername || c.username || '',
    pfp: c.pfp || '',
  }));

  // Fetch token metadata from Solana via Helius
  let tokenName = 'Unknown Token';
  let tokenSymbol = mintAddress.slice(0, 6).toUpperCase();
  let tokenImage = '';
  let tokenDescription = '';

  try {
    const heliusUrl = process.env.HELIUS_API_KEY
      ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
      : 'https://api.mainnet-beta.solana.com';

    const heliusRes = await fetch(heliusUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 'bags-cosmos',
        method: 'getAsset',
        params: { id: mintAddress },
      }),
    });
    const heliusData = await heliusRes.json();
    const asset = heliusData?.result;
    tokenName = asset?.content?.metadata?.name || asset?.content?.metadata?.symbol || 'Unknown Token';
    tokenSymbol = asset?.content?.metadata?.symbol || mintAddress.slice(0, 6).toUpperCase();
    tokenImage = asset?.content?.links?.image || asset?.content?.files?.[0]?.uri || '';
    tokenDescription = asset?.content?.metadata?.description || '';
    console.log('✅ Helius name:', tokenName, tokenSymbol);
  } catch (e) {
    console.log('Helius fetch failed:', e);
  }

  // Primary creator info
  const primary = (Array.isArray(creatorsRaw) ? creatorsRaw : []).find(
    (c: any) => c.isCreator
  ) || creatorsRaw[0] || {};

  // Claimable = lifetimeFees - totalClaimed
  const statsArr = claimStats?.response || [];
  let totalClaimed = 0;
  for (const stat of statsArr) {
    totalClaimed += Number(stat.totalClaimed || 0);
  }
  const claimableFees = Math.max(0, (lifetimeFeesLamports - totalClaimed) / LAMPORTS_PER_SOL);
  const lifetimeFeesSol = lifetimeFeesLamports / LAMPORTS_PER_SOL;

  // Top holders from creators
  const topHolders = creators.slice(0, 10).map((c) => ({
    wallet: c.wallet,
    percentage: c.share,
    amount: 0,
  }));

  console.log('✅ Token:', tokenName, tokenSymbol);
  console.log('✅ Lifetime fees SOL:', lifetimeFeesSol);
  console.log('✅ Claimable SOL:', claimableFees);

  return {
    mint: mintAddress,
    name: tokenName,
    symbol: tokenSymbol,
    image: tokenImage,
    description: tokenDescription,
    price: 0,
    priceChange24h: 0,
    marketCap: 0,
    volume24h: 0,
    holders: creators.length,
    claimableFees,
    lifetimeFees: lifetimeFeesSol,
    topHolders,
    creators,
  };
}