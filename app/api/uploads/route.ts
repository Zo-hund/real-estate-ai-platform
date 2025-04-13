import { NextResponse } from 'next/server';
import { PrintMediaIntegration } from '@/lib/integrations/print-media';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    const printMedia = new PrintMediaIntegration();
    const results = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = file.type.includes('pdf')
        ? await printMedia.extractFromPDF(buffer)
        : await printMedia.extractFromImage(buffer);

      results.push({
        filename: file.name,
        ...result,
      });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error processing uploads:', error);
    return NextResponse.json(
      { error: 'Failed to process uploads' },
      { status: 500 }
    );
  }
}
