import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// POST /api/votes
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { value, receiverId, jobId } = body;

    // Validate input
    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: 'Invalid vote value' },
        { status: 400 }
      );
    }

    if (!receiverId) {
      return NextResponse.json(
        { error: 'Receiver ID is required' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Prevent self-voting
    if (userId === receiverId) {
      return NextResponse.json(
        { error: 'Cannot vote for yourself' },
        { status: 400 }
      );
    }

    // Check if job exists if jobId is provided
    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
      });

      if (!job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }
    }

    // Update or create vote
    const vote = await prisma.vote.upsert({
      where: {
        giverId_receiverId: {
          giverId: userId,
          receiverId,
        },
      },
      update: {
        value,
      },
      create: {
        value,
        giverId: userId,
        receiverId,
        jobId,
      },
      include: {
        giver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(vote);
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}

// GET /api/votes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');

    if (!userId && !jobId) {
      return NextResponse.json(
        { error: 'Either userId or jobId is required' },
        { status: 400 }
      );
    }

    const votes = await prisma.vote.findMany({
      where: {
        ...(userId ? { receiverId: userId } : {}),
        ...(jobId ? { jobId } : {}),
      },
      include: {
        giver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const score = votes.reduce((acc, vote) => acc + vote.value, 0);

    return NextResponse.json({
      votes,
      score,
      totalVotes: votes.length,
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
} 