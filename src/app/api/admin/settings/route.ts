import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const settings = await request.json();
  
  // Mock save logic
  console.log('Saving settings:', settings);
  
  return NextResponse.json({ success: true });
}
