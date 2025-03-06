import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Helper function to get embeddings for text
async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid query' },
        { status: 400 }
      );
    }

    // Get embedding for the search query
    const queryEmbedding = await getEmbedding(query);

    // Fetch jobs and freelancers
    const jobs = await prisma.$queryRaw<{
      id: string;
      title: string;
      description: string;
      budget: number;
      skills: string[];
      category: string;
    }[]>`
      SELECT id, title, description, budget, skills, category
      FROM "Job"
      WHERE status = 'open'
      LIMIT 50
    `;

    const freelancers = await prisma.$queryRaw<{
      id: string;
      name: string;
      image: string | null;
      role: string;
    }[]>`
      SELECT u.id, u.name, u.image, u.role
      FROM "User" u
      WHERE u.role = 'freelancer'
      LIMIT 50
    `;

    // Calculate similarity scores for jobs
    const jobScores = await Promise.all(
      jobs.map(async (job: any) => {
        const jobText = `${job.title} ${job.description} ${job.skills.join(' ')} ${job.category}`;
        const jobEmbedding = await getEmbedding(jobText);
        const similarity = cosineSimilarity(queryEmbedding, jobEmbedding);
        return { ...job, similarity };
      })
    );

    // Calculate similarity scores for freelancers
    const freelancerScores = await Promise.all(
      freelancers.map(async (freelancer: any) => {
        const freelancerText = `${freelancer.name} ${freelancer.role}`;
        const freelancerEmbedding = await getEmbedding(freelancerText);
        const similarity = cosineSimilarity(queryEmbedding, freelancerEmbedding);
        return { ...freelancer, similarity };
      })
    );

    // Sort by similarity and take top results
    const topJobs = jobScores
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .slice(0, 5)
      .map(({ similarity, ...job }) => job);

    const topFreelancers = freelancerScores
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .slice(0, 5)
      .map(({ similarity, ...freelancer }) => freelancer);

    return NextResponse.json({
      jobs: topJobs,
      freelancers: topFreelancers,
    });
  } catch (error) {
    console.error('Error generating search suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
} 