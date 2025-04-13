import { NextResponse } from 'next/server';
import { AgentSystem } from '@/lib/agents';

const agentSystem = new AgentSystem();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const result = await agentSystem.processTask(data);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Agent task error:', error);
    return NextResponse.json(
      { error: 'Failed to process agent task' },
      { status: 500 }
    );
  }
}
