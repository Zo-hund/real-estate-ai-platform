import { NextResponse } from 'next/server';
import { AgentSystem } from '@/lib/agents';

const agentSystem = new AgentSystem();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const result = await agentSystem.orchestrateWorkflow(data);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Agent workflow error:', error);
    return NextResponse.json(
      { error: 'Failed to orchestrate agent workflow' },
      { status: 500 }
    );
  }
}
