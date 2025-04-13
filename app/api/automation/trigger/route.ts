import { NextResponse } from 'next/server';
import { AutomationAgent } from '@/lib/agents/automation-agent';

const automationAgent = new AutomationAgent();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const result = await automationAgent.execute({
      action: 'trigger-workflow',
      workflowId: data.workflowId,
      payload: data.payload,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Workflow trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger workflow' },
      { status: 500 }
    );
  }
}
