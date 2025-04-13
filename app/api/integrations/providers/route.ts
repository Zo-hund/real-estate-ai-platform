import { NextResponse } from 'next/server';
import { DataProviderIntegration } from '@/lib/integrations/providers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const location = searchParams.get('location');

    const integration = new DataProviderIntegration();

    if (propertyId) {
      const propertyData = await integration.fetchPropertyData(propertyId);
      return NextResponse.json(propertyData);
    }

    if (location) {
      const marketTrends = await integration.getMarketTrends(location);
      return NextResponse.json(marketTrends);
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Data provider integration error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const integration = new DataProviderIntegration();

    const searchResults = await integration.searchProperties(data);
    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Property search error:', error);
    return NextResponse.json(
      { error: 'Failed to search properties' },
      { status: 500 }
    );
  }
}
