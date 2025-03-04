import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryParams = new URLSearchParams();

    // Add query parameters if they exist
    const skip = searchParams.get('skip');
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const minBudget = searchParams.get('min_budget');
    const maxBudget = searchParams.get('max_budget');
    const skills = searchParams.get('skills');

    if (skip) queryParams.append('skip', skip);
    if (limit) queryParams.append('limit', limit);
    if (category) queryParams.append('category', category);
    if (minBudget) queryParams.append('min_budget', minBudget);
    if (maxBudget) queryParams.append('max_budget', maxBudget);
    if (skills) queryParams.append('skills', skills);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { detail: error.detail || 'Failed to fetch jobs' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json(
      { detail: 'An error occurred while fetching jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { detail: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { detail: error.detail || 'Failed to create job' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json(
      { detail: 'An error occurred while creating job' },
      { status: 500 }
    );
  }
} 