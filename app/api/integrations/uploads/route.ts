import { NextResponse } from 'next/server';
import { UploadIntegration } from '@/lib/integrations/uploads';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const metadata = JSON.parse(formData.get('metadata') as string || '{}');

    const integration = new UploadIntegration();
    const results = await integration.processUpload(files, metadata);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Upload processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process uploads' },
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

    const integration = new UploadIntegration();
    const results = await integration.searchUploads(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Upload search error:', error);
    return NextResponse.json(
      { error: 'Failed to search uploads' },
      { status: 500 }
    );
  }
}
