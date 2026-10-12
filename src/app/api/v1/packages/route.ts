import { NextResponse } from 'next/server';
import { BMSStore } from '@/lib/store';

export async function GET() {
  const packages = BMSStore.getPackages();
  return NextResponse.json({ success: true, data: packages });
}
