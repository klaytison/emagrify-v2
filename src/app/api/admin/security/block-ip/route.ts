import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { ip } = await request.json();
  
  // Mock block IP logic
  console.log(`Blocking IP: ${ip}`);
  
  return NextResponse.json({ success: true });
}
