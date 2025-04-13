import { NextResponse } from 'next/server';
import { SocialMediaIntegration } from '@/lib/integrations/social';

export async function GET() {
  try {
    const integration = new SocialMediaIntegration();
    const content = await integration.fetchRealEstateContent();
    const analysis = await integration.analyzeContent(content);

    return NextResponse.json({ content, analysis });
  } catch (error) {
    console.error('Social media integration error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media content' },
      { status: 500 }
    );
  }
}
