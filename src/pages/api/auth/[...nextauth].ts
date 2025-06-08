// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { User } from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    backendUser?: any;
  }
  interface Session {
    user: {
      id?: string;
      username?: string;
      backendUser?: any;
      posts?: any[];
      followersCount?: number;
      followingCount?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendUser?: {
      userId: string;
      username: string;
      posts?: any[];
      followersCount?: number;
      followingCount?: number;
    };
    accessToken?: string;
  }
}

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) return false;

      if (account.provider === "google") {
        try {
          console.log("Attempting to sign in with backend:", {
            googleId: account.providerAccountId,
            email: user.email,
            name: user.name,
            image: user.image,
          });

          // Send user data to Express backend
          const response = await axios.post(
            `${BACKEND_URL}/auth/signin-google`,
            {
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image,
            },
            {
              timeout: 10000, // 10 second timeout
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Backend response:", response.data);

          if (response.data.success && response.data.user) {
            // Store backend user data
            user.backendUser = response.data.user;
            return true;
          } else {
            console.error("Backend did not return success or user data");
            return false;
          }
        } catch (error) {
          console.error("Error signing in with backend:", error);
          if (axios.isAxiosError(error)) {
            console.error("Axios error details:", {
              message: error.message,
              code: error.code,
              response: error.response?.data,
              status: error.response?.status,
            });
          }
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        console.log("JWT callback - initial sign in", {
          user: user.backendUser,
        });
        token.backendUser = user.backendUser;

        // Generate JWT token from backend for future API calls
        if (user.backendUser) {
          try {
            const tokenResponse = await axios.post(
              `${BACKEND_URL}/auth/verify-token`,
              {
                token: JSON.stringify(user.backendUser), // Send user data instead of token for now
              }
            );

            if (tokenResponse.data.valid) {
              token.accessToken = JSON.stringify(user.backendUser);
              // Ensure posts are included in the token
              token.backendUser = {
                ...tokenResponse.data.user,
                posts: tokenResponse.data.user.posts || [],
              };
            }
          } catch (error) {
            console.error("Error generating backend token:", error);
          }
        }
      }

      // Return previous token if it exists and is valid
      if (token.backendUser) {
        return token;
      }

      // Try to refresh the token if needed
      if (token.accessToken) {
        try {
          const response = await axios.post(
            `${BACKEND_URL}/auth/verify-token`,
            {
              token: token.accessToken,
            }
          );

          if (response.data.valid) {
            token.backendUser = {
              ...response.data.user,
              posts: response.data.user.posts || [],
            };
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          // Clear invalid token
          delete token.accessToken;
          delete token.backendUser;
        }
      }

      return token;
    },

    async session({ session, token }) {
      console.log("Session callback", { token: token.backendUser });

      // Send properties to the client
      if (token.backendUser && session.user) {
        session.user.id = token.backendUser.userId;
        session.user.username = token.backendUser.username;
        session.user.backendUser = token.backendUser;
        session.user.posts = token.backendUser.posts || [];
        session.user.followersCount = token.backendUser.followersCount || 0;
        session.user.followingCount = token.backendUser.followingCount || 0;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
});
