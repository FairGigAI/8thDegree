import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create sample users with different roles
  const users = await Promise.all([
    // Clients
    prisma.user.create({
      data: {
        name: 'John Smith',
        email: 'john@example.com',
        role: 'client',
        image: 'https://ui-avatars.com/api/?name=John+Smith',
        hashedPassword: await hash('password123', 12),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'client',
        image: 'https://ui-avatars.com/api/?name=Sarah+Johnson',
        hashedPassword: await hash('password123', 12),
      },
    }),
    // Freelancers
    prisma.user.create({
      data: {
        name: 'Alex Chen',
        email: 'alex@example.com',
        role: 'freelancer',
        image: 'https://ui-avatars.com/api/?name=Alex+Chen',
        hashedPassword: await hash('password123', 12),
        bio: 'Full-stack developer with 5 years of experience in React, Node.js, and Python.',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maria Garcia',
        email: 'maria@example.com',
        role: 'freelancer',
        image: 'https://ui-avatars.com/api/?name=Maria+Garcia',
        hashedPassword: await hash('password123', 12),
        bio: 'UI/UX designer specializing in mobile apps and web interfaces.',
      },
    }),
    prisma.user.create({
      data: {
        name: 'David Kim',
        email: 'david@example.com',
        role: 'freelancer',
        image: 'https://ui-avatars.com/api/?name=David+Kim',
        hashedPassword: await hash('password123', 12),
        bio: 'Machine learning engineer with expertise in NLP and computer vision.',
      },
    }),
  ]);

  // Create sample jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'React Native Mobile App Development',
        description: 'Looking for an experienced React Native developer to build a social networking app. Must have experience with Redux, Firebase, and real-time features.',
        budget: 5000,
        category: 'Mobile Development',
        skills: ['React Native', 'Redux', 'Firebase', 'TypeScript'],
        status: 'open',
        posterId: users[0].id, // John Smith
      },
    }),
    prisma.job.create({
      data: {
        title: 'E-commerce Website Design',
        description: 'Need a talented UI/UX designer to create a modern, user-friendly e-commerce website. Experience with Shopify themes is a plus.',
        budget: 3000,
        category: 'Web Design',
        skills: ['UI/UX', 'Figma', 'Shopify', 'Web Design'],
        status: 'open',
        posterId: users[1].id, // Sarah Johnson
      },
    }),
    prisma.job.create({
      data: {
        title: 'AI-Powered Chatbot Development',
        description: 'Seeking a machine learning engineer to develop a customer service chatbot using GPT-3. Must have experience with NLP and API integration.',
        budget: 8000,
        category: 'AI & Machine Learning',
        skills: ['Python', 'NLP', 'OpenAI', 'API Development'],
        status: 'open',
        posterId: users[0].id, // John Smith
      },
    }),
    prisma.job.create({
      data: {
        title: 'Full-Stack Web Application',
        description: 'Building a project management tool using Next.js, TypeScript, and PostgreSQL. Looking for a full-stack developer with experience in modern web technologies.',
        budget: 6000,
        category: 'Web Development',
        skills: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
        status: 'completed',
        posterId: users[1].id, // Sarah Johnson
        applicantId: users[2].id, // Alex Chen
      },
    }),
  ]);

  // Create sample reviews
  await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Alex did an amazing job on our web application. Very professional and delivered on time.',
        jobId: jobs[3].id,
        giverId: users[1].id, // Sarah Johnson
        receiverId: users[2].id, // Alex Chen
        isBiased: false,
        biasReason: null,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Great client to work with! Clear requirements and timely communication.',
        jobId: jobs[3].id,
        giverId: users[2].id, // Alex Chen
        receiverId: users[1].id, // Sarah Johnson
        isBiased: false,
        biasReason: null,
      },
    }),
  ]);

  // Create sample votes
  await Promise.all([
    prisma.vote.create({
      data: {
        value: 1,
        giverId: users[0].id, // John Smith
        receiverId: users[2].id, // Alex Chen
      },
    }),
    prisma.vote.create({
      data: {
        value: 1,
        giverId: users[1].id, // Sarah Johnson
        receiverId: users[2].id, // Alex Chen
      },
    }),
  ]);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 