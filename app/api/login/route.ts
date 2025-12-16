// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received login request:', body);

    // For now, simulate a successful login
    const data = {
      token: 'dummy-token',
      email: body.email
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
