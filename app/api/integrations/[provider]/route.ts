import { NextResponse } from 'next/server';
import { dataProviders, apiConfig } from '@/lib/api-integrations';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = dataProviders[params.provider];
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Check rate limit
    const limiter = await rateLimit(request);
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Get provider configuration and status
    const config = {
      name: provider.name,
      endpoints: provider.endpoints,
      webhooks: provider.webhooks,
      status: 'active',
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching provider config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider configuration' },
      { status: 500 }
    );
  }
}
