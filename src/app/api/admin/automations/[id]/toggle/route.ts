import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  // Mock toggle logic
  console.log(`Toggling automation ${id}`);
  
  return NextResponse.json({ success: true });
}
