import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { detail: 'Verification token is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { detail: error.detail || 'Email verification failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { detail: 'An error occurred during email verification' },
      { status: 500 }
    );
  }
} 