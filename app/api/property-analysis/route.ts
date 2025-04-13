import { NextResponse } from 'next/server';
import { analyzePropertyPreferences } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { description } = await request.json();
    
    if (!description) {
      return NextResponse.json(
        { error: 'Property description is required' },
        { status: 400 }
      );
    }

    const analysis = await analyzePropertyPreferences(description);
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Property analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze property preferences' },
      { status: 500 }
    );
  }
}
