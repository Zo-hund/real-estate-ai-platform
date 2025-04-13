import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { triggerWorkflow } from '@/lib/automation/n8n';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate CRM integration data
    if (!data.objectType || !data.fields) {
      return NextResponse.json({ error: 'Invalid CRM data' }, { status: 400 });
    }

    // Trigger CRM workflow
    const workflowResult = await triggerWorkflow('crm-integration', data);

    // Log integration event
    await prisma.integrationLog.create({
      data: {
        type: 'CRM',
        status: workflowResult.success ? 'SUCCESS' : 'FAILED',
        data: data,
        error: workflowResult.error || null
      }
    });

    return NextResponse.json(workflowResult);
  } catch (error) {
    console.error('CRM Integration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}