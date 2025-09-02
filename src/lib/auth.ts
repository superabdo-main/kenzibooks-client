// auth.ts
import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

// Define your backend API base URL
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// Login schema validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!BACKEND_API_URL) {
          console.error('BACKEND_API_URL is not defined');
          throw new Error('Authentication service is not properly configured');
        }

        try {
          // Validate input
          const validation = loginSchema.safeParse(credentials);
          if (!validation.success) {
            console.error('Invalid credentials format:', validation.error.format());
            return null;
          }

          const { email, password } = validation.data;
          
          // Call authentication API
          const response = await axios({
            method: 'POST',
            url: `${BACKEND_API_URL}/auth/login`,
            headers: { 'Content-Type': 'application/json' },
            data: { email, password },
            validateStatus: (status) => status < 500, // Don't throw for 4xx errors
          });

          // Handle authentication failure
          if (response.status !== 201 || response.data?.error) {
            console.error('Authentication failed:', {
              status: response.status,
              error: response.data?.error || 'Unknown error'
            });
            return null;
          }

          const { user, accessToken } = response.data;
          
          if (!user || !accessToken) {
            return null;
          }
          return {
            ...user,
            accessToken,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Auth API error:', {
              message: error.message,
              status: error.response?.status,
              data: error.response?.data
            });
          } else {
            console.error('Unexpected auth error:', error);
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // On initial sign in
      if (user && account) {
        return {
          ...token,
          ...user,
          accessToken: user.accessToken,
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: token,
        accessToken: token.accessToken,
        error: token.error,
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.AUTH_SECRET,
});

// // Function to refresh access token
// async function refreshAccessToken(token: any) {
//   try {
//     const response = await fetch(`${BACKEND_API_URL}/auth/refresh`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         refreshToken: token.refreshToken,
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw data;
//     }

//     return {
//       ...token,
//       accessToken: data.accessToken,
//       refreshToken: data.refreshToken ?? token.refreshToken,
//       accessTokenExpires: Date.now() + 15 * 60 * 1000,
//     };
//   } catch (error) {
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }
