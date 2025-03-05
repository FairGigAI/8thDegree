import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { detail: error.detail || 'Failed to fetch profile' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { detail: 'An error occurred while fetching profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { detail: error.detail || 'Failed to update profile' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { detail: 'An error occurred while updating profile' },
      { status: 500 }
    );
  }
} 