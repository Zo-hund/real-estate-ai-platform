import { NextResponse } from 'next/server';
import { DocumentIntegration } from '@/lib/integrations/documents';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    const integration = new DocumentIntegration();
    const results = await integration.batchProcessDocuments(files);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Document processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process documents' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const integration = new DocumentIntegration();
    const results = await integration.searchDocuments(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Document search error:', error);
    return NextResponse.json(
      { error: 'Failed to search documents' },
      { status: 500 }
    );
  }
}
