import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});


interface Review {
  rating: number;
  comment: string;
  jobId: string;
  giverId: string;
  receiverId: string;
  isBiased: boolean;
  biasReason: string | null;
  giver: {
    id: string;
    name: string;
    image: string;
  };
  job: {
    id: string;
    title: string;
  };
}

interface Vote {
  value: number;
  giverId: string;
  receiverId: string;
  jobId?: string;
  giver: {
    id: string;
    name: string;
  };
}

interface Job {
  status: string;
  posterId: string;
  applicantId: string;
}

// Helper function to detect bias in reviews using OpenAI
async function detectBias(review: string): Promise<{ isBiased: boolean; reason: string | null }> {
  try {
    const prompt = `Analyze this review for bias, prejudice, or unfair criticism. Consider factors like racial, gender, or nationality-based bias, personal attacks, or unreasonable expectations. Review: "${review}"`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.5,
    });

    const analysis = response.choices[0].message.content?.toLowerCase() || '';
    const isBiased = analysis.includes('bias') || analysis.includes('prejudice') || analysis.includes('unfair');
    
    return {
      isBiased,
      reason: isBiased ? analysis.trim() : null
    };
  } catch (error) {
    console.error('Error detecting bias:', error);
    return { isBiased: false, reason: null };
  }
}

// GET /api/reviews/[user_id]
export async function GET(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  try {
    const reviews = await prisma.$queryRaw<Review[]>`
      SELECT r.*, 
        json_build_object('id', g.id, 'name', g.name, 'image', g.image) as giver,
        json_build_object('id', j.id, 'title', j.title) as job
      FROM "Review" r
      JOIN "User" g ON r."giverId" = g.id
      JOIN "Job" j ON r."jobId" = j.id
      WHERE r."receiverId" = ${params.user_id}
      ORDER BY r."createdAt" DESC
    `;

    const votes = await prisma.$queryRaw<Vote[]>`
      SELECT v.*, 
        json_build_object('id', g.id, 'name', g.name) as giver
      FROM "Vote" v
      JOIN "User" g ON v."giverId" = g.id
      WHERE v."receiverId" = ${params.user_id}
    `;

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / reviews.length
      : 0;

    // Calculate vote score
    const voteScore = votes.reduce((acc: number, vote: Vote) => acc + vote.value, 0);

    return NextResponse.json({
      reviews,
      votes,
      stats: {
        averageRating,
        totalReviews: reviews.length,
        voteScore,
        totalVotes: votes.length,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews/[user_id]
export async function POST(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rating, comment, jobId } = body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating' },
        { status: 400 }
      );
    }

    // Check if job exists and is completed
    const [job] = await prisma.$queryRaw<Job[]>`
      SELECT status, "posterId", "applicantId"
      FROM "Job"
      WHERE id = ${jobId}
    `;

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only review completed jobs' },
        { status: 400 }
      );
    }

    // Verify user is involved in the job
    const userId = session.user.id;
    if (userId !== job.posterId && userId !== job.applicantId) {
      return NextResponse.json(
        { error: 'Not authorized to review this job' },
        { status: 403 }
      );
    }

    // Check for existing review
    const [existingReview] = await prisma.$queryRaw<Review[]>`
      SELECT * FROM "Review"
      WHERE "jobId" = ${jobId}
      AND "giverId" = ${userId}
      AND "receiverId" = ${params.user_id}
    `;

    if (existingReview) {
      return NextResponse.json(
        { error: 'Already reviewed this job' },
        { status: 400 }
      );
    }

    // Detect bias in the comment
    const biasAnalysis = await detectBias(comment);

    // Create the review
    const [review] = await prisma.$queryRaw<Review[]>`
      INSERT INTO "Review" (
        rating, comment, "jobId", "giverId", "receiverId", "isBiased", "biasReason"
      )
      VALUES (
        ${rating}, ${comment}, ${jobId}, ${userId}, ${params.user_id}, 
        ${biasAnalysis.isBiased}, ${biasAnalysis.reason}
      )
      RETURNING *,
        json_build_object('id', g.id, 'name', g.name, 'image', g.image) as giver
      FROM "User" g
      WHERE g.id = ${userId}
    `;

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
} 