import { NextRequest, NextResponse } from 'next/server';
import { getTokenData } from '@/lib/bags';
import { generateCosmicNarrative } from '@/lib/claude';

export async function POST(req: NextRequest) {
  try {
    const { mintAddress } = await req.json();

    if (!mintAddress || mintAddress.trim().length < 32) {
      return NextResponse.json(
        { error: 'Invalid token address' },
        { status: 400 }
      );
    }

    // Fetch token data from Bags
    const tokenData = await getTokenData(mintAddress.trim());

    // Generate Claude AI cosmic narrative
    const narrative = await generateCosmicNarrative(tokenData);

    return NextResponse.json({ token: tokenData, narrative });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze token' },
      { status: 500 }
    );
  }
}
