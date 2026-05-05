import Anthropic from '@anthropic-ai/sdk';
import { TokenData } from './bags';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface CosmicNarrative {
  missionTitle: string;
  statusLine: string;
  briefing: string;
  threat: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
  cosmicEvent: string;
}

export async function generateCosmicNarrative(
  token: TokenData
): Promise<CosmicNarrative> {
  const prompt = `You are the BAGS COSMOS AI — an ancient cosmic intelligence that analyzes creator tokens on Solana as if they were planets and civilizations in the universe.

Token Data:
- Name: ${token.name} (${token.symbol})
- Price Change 24h: ${token.priceChange24h > 0 ? '+' : ''}${token.priceChange24h.toFixed(2)}%
- Market Cap: $${token.marketCap.toLocaleString()}
- Volume 24h: $${token.volume24h.toLocaleString()}
- Holders (Civilization Size): ${token.holders}
- Claimable Fees (Energy Crystals): ${token.claimableFees.toFixed(4)} SOL
- Lifetime Fees: ${token.lifetimeFees.toFixed(4)} SOL
- Top Holder %: ${token.topHolders[0]?.percentage?.toFixed(2) || 0}%

Generate a space-themed mission briefing as a JSON object with EXACTLY these fields:
{
  "missionTitle": "OPERATION [dramatic codename based on token name]",
  "statusLine": "one line planet status - is civilization thriving or under threat?",
  "briefing": "2-3 sentences dramatic space narrative about this token's current situation. Use: planet = token, civilization = holders, energy crystals = fees, cosmic storm = price drop, solar flare = price pump",
  "threat": "LOW or MEDIUM or HIGH or CRITICAL based on price change and holder concentration",
  "recommendation": "One bold action sentence for the creator. Start with a verb.",
  "cosmicEvent": "Name of current cosmic event (e.g. METEOR SHOWER, SOLAR FLARE, NEBULA DRIFT, BLACK HOLE PROXIMITY)"
}

Return ONLY valid JSON. No markdown. No explanation.`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean) as CosmicNarrative;
  } catch (error) {
    // Fallback narrative if AI fails
    return {
      missionTitle: `OPERATION ${token.symbol}`,
      statusLine:
        token.priceChange24h > 0
          ? 'Planet thriving — civilization expanding'
          : 'Planet under cosmic pressure',
      briefing: `The ${token.name} planet has ${token.holders} civilizations inhabiting its surface. Current cosmic energy reads ${token.priceChange24h > 0 ? 'positive' : 'negative'}. Your energy crystals await harvesting.`,
      threat:
        token.priceChange24h < -20
          ? 'CRITICAL'
          : token.priceChange24h < -5
          ? 'HIGH'
          : token.priceChange24h < 0
          ? 'MEDIUM'
          : 'LOW',
      recommendation:
        token.claimableFees > 0
          ? `Harvest your ${token.claimableFees.toFixed(4)} SOL energy crystals immediately.`
          : 'Strengthen your civilization by engaging your top holders.',
      cosmicEvent:
        token.priceChange24h > 5
          ? 'SOLAR FLARE'
          : token.priceChange24h < -10
          ? 'METEOR SHOWER'
          : 'NEBULA DRIFT',
    };
  }
}
