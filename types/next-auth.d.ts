import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string | null;
      isAdmin?: boolean;
      username?: string | null; // Add username here
      image?: string | null; // Add image here
    } & DefaultSession['user'];
  }

  export interface User extends DefaultUser {
    _id?: string;
    isAdmin?: boolean;
    username?: string; // Add username here
    image?: string; // Add image here
  }
}
