import { NextResponse } from 'next/server';

// In-memory log storage (replace with database in production)
const logs: any[] = [];

export async function GET() {
  // Mock logs data
  const mockLogs = [
    {
      id: '1',
      type: 'error',
      message: 'Failed to process payment for user #123',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      source: 'Payment Gateway',
    },
    {
      id: '2',
      type: 'warning',
      message: 'High memory usage detected',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      source: 'System Monitor',
    },
    {
      id: '3',
      type: 'info',
      message: 'Backup completed successfully',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      source: 'Backup Service',
    },
    {
      id: '4',
      type: 'error',
      message: 'Database connection timeout',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      source: 'Database',
    },
    ...logs.slice(-10), // Include recent logged errors
  ];

  return NextResponse.json({ logs: mockLogs });
}

export async function POST(request: Request) {
  try {
    const log = await request.json();
    
    // Add to in-memory storage
    logs.push({
      ...log,
      id: String(logs.length + 1),
      timestamp: log.timestamp || new Date().toISOString(),
    });

    // In production, save to database
    console.log('Log received:', log);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
