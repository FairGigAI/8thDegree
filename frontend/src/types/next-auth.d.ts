import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'client' | 'freelancer' | 'admin';
      accessToken?: string;
    };
  }

  interface User {
    id: string;
    role: 'client' | 'freelancer' | 'admin';
    accessToken?: string;
    email: string;
    name?: string;
    image?: string;
  }

  interface JWT {
    id: string;
    role: 'client' | 'freelancer' | 'admin';
    accessToken?: string;
  }
} 