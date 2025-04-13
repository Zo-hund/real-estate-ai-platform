import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { triggerWorkflow } from '@/lib/automation/n8n';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate payment data
    if (!data.amount || !data.currency || !data.source) {
      return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
    }

    // Trigger payment workflow
    const workflowResult = await triggerWorkflow('payment-integration', data);

    // Record payment transaction
    await prisma.paymentTransaction.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        source: data.source,
        status: workflowResult.success ? 'COMPLETED' : 'FAILED',
        transactionId: workflowResult.transactionId,
        timestamp: new Date()
      }
    });

    return NextResponse.json(workflowResult);
  } catch (error) {
    console.error('Payment Integration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}