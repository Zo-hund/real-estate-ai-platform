import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiMetrics } from '@/lib/api-integrations/types';

export async function GET() {
  try {
    // Fetch real-time metrics from the database
    const [requests, errors, integrations] = await Promise.all([
      prisma.apiRequest.count(),
      prisma.apiError.count(),
      prisma.integration.count({ where: { status: 'active' } }),
    ]);

    // Calculate average latency
    const latencyData = await prisma.apiRequest.aggregate({
      _avg: {
        latency: true,
      },
    });

    const metrics: ApiMetrics = {
      totalRequests: requests,
      averageLatency: Math.round(latencyData._avg.latency || 0),
      errorRate: requests > 0 ? (errors / requests) * 100 : 0,
      activeIntegrations: integrations,
      requestsByEndpoint: {},
      errorsByType: {},
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching API metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API metrics' },
      { status: 500 }
    );
  }
}
