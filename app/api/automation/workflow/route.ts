import { NextResponse } from 'next/server';
import { AutomationAgent } from '@/lib/agents/automation-agent';

const automationAgent = new AutomationAgent();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const result = await automationAgent.execute({
      action: 'create-workflow',
      workflow: data.workflow,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Workflow creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    const result = await automationAgent.execute({
      action: 'update-workflow',
      workflowId: data.workflowId,
      workflow: data.workflow,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Workflow update error:', error);
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('id');

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }

    const result = await automationAgent.execute({
      action: 'delete-workflow',
      workflowId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Workflow deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    );
  }
}
