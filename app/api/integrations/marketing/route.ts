import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { triggerWorkflow } from '@/lib/automation/n8n';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate marketing data
    if (!data.campaign || !data.audience) {
      return NextResponse.json({ error: 'Invalid marketing data' }, { status: 400 });
    }

    // Trigger marketing workflow
    const workflowResult = await triggerWorkflow('marketing-integration', data);

    // Log marketing campaign
    await prisma.marketingCampaign.create({
      data: {
        name: data.campaign,
        audience: data.audience,
        channels: data.channels,
        status: workflowResult.success ? 'ACTIVE' : 'FAILED',
        startDate: new Date()
      }
    });

    return NextResponse.json(workflowResult);
  } catch (error) {
    console.error('Marketing Integration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}