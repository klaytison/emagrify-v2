import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Mock data - replace with real database queries
    const stats = {
      totalSubscribers: 1247,
      activeSubscribers: 1089,
      mrr: 45890,
      churn: 3.2,
      newSubscribers: 87,
      cancelations: 35,
      revenue: 45890,
      growth: 12.5,
    };

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    // Return fallback data even on error
    return NextResponse.json(
      {
        totalSubscribers: 0,
        activeSubscribers: 0,
        mrr: 0,
        churn: 0,
        newSubscribers: 0,
        cancelations: 0,
        revenue: 0,
        growth: 0,
        error: 'Failed to fetch stats',
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
