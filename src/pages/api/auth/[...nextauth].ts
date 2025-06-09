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
      jwtToken?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendUser?: {
      userId: string;
      username: string;
      email: string;
      posts?: any[];
      followersCount?: number;
      followingCount?: number;
    };
    jwtToken?: string;
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

          const response = await axios.post(
            `${BACKEND_URL}/auth/signin-google`,
            {
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image,
            },
            {
              timeout: 10000,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Backend response:", response.data);

          if (response.data.success && response.data.user) {
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
      if (account && user) {
        console.log("JWT callback - initial sign in", {
          user: user.backendUser,
        });
        token.backendUser = user.backendUser;

        // Generate JWT token from Express backend after successful Google login
        if (user.backendUser) {
          try {
            // Create a session in Express backend to get JWT token
            const sessionResponse = await axios.post(
              `${BACKEND_URL}/auth/create-session`,
              {
                userId: user.backendUser.userId,
                email: user.backendUser.email,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (sessionResponse.data.success && sessionResponse.data.token) {
              token.jwtToken = sessionResponse.data.token;
              console.log("JWT token generated and stored in NextAuth session");
            }
          } catch (error) {
            console.error("Error generating JWT token:", error);
          }
        }
      }

      // Verify and refresh JWT token if needed
      if (token.jwtToken) {
        try {
          const verifyResponse = await axios.post(
            `${BACKEND_URL}/auth/verify-token`,
            {
              token: token.jwtToken,
            }
          );

          if (verifyResponse.data.valid) {
            token.backendUser = {
              ...verifyResponse.data.user,
              posts: verifyResponse.data.user.posts || [],
            };
          } else {
            // Token expired, try to refresh
            if (token.backendUser) {
              try {
                const refreshResponse = await axios.post(
                  `${BACKEND_URL}/auth/create-session`,
                  {
                    userId: token.backendUser.userId,
                    email: token.backendUser.email,
                  }
                );

                if (
                  refreshResponse.data.success &&
                  refreshResponse.data.token
                ) {
                  token.jwtToken = refreshResponse.data.token;
                }
              } catch (refreshError) {
                console.error("Error refreshing JWT token:", refreshError);
                delete token.jwtToken;
                delete token.backendUser;
              }
            }
          }
        } catch (error) {
          console.error("Error verifying JWT token:", error);
          delete token.jwtToken;
          delete token.backendUser;
        }
      }

      return token;
    },

    async session({ session, token }) {
      console.log("Session callback", {
        token: token.backendUser,
        jwtToken: token.jwtToken ? "present" : "missing",
      });

      if (token.backendUser && session.user) {
        session.user.id = token.backendUser.userId;
        session.user.username = token.backendUser.username;
        session.user.backendUser = token.backendUser;
        session.user.posts = token.backendUser.posts || [];
        session.user.followersCount = token.backendUser.followersCount || 0;
        session.user.followingCount = token.backendUser.followingCount || 0;
        session.user.jwtToken = token.jwtToken;
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
