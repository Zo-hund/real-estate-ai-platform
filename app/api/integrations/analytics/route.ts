import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { triggerWorkflow } from '@/lib/automation/n8n';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate analytics data
    if (!data.metrics || !data.dimensions) {
      return NextResponse.json({ error: 'Invalid analytics data' }, { status: 400 });
    }

    // Trigger analytics workflow
    const workflowResult = await triggerWorkflow('analytics-integration', data);

    // Store analytics results
    await prisma.analyticsData.create({
      data: {
        metrics: data.metrics,
        dimensions: data.dimensions,
        results: workflowResult.data,
        timestamp: new Date()
      }
    });

    return NextResponse.json(workflowResult);
  } catch (error) {
    console.error('Analytics Integration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}