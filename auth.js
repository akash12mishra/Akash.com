import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "./models/User";
import connectMongoDB from "./utils/mongoDB";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/calendar openid email profile",
          access_type: "offline",
          prompt: "consent",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Add this for debugging
  callbacks: {
    // auth.js
    async jwt({ token, account }) {
      // Initial sign-in: save all tokens
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = Date.now() + account.expires_in * 1000;
        return token;
      }

      // If token hasn't expired, return it
      if (Date.now() < token.expiresAt) {
        return token;
      }

      try {
        // Token has expired, try to refresh it
        const response = await fetch("https://oauth2.googleapis.com/token", {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken,
          }),
          method: "POST",
        });

        const tokens = await response.json();

        if (!response.ok) {
          console.error("Failed to refresh token:", tokens);
          return { ...token, error: "RefreshAccessTokenError" };
        }

        return {
          ...token,
          accessToken: tokens.access_token,
          expiresAt: Date.now() + tokens.expires_in * 1000,
        };
      } catch (error) {
        console.error("Error refreshing token:", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    async signIn({ user }) {
      await connectMongoDB();
      const existingUser = await User.findOne({ email: user.email });

      if (existingUser) {
        existingUser.name = user.name;
        existingUser.image = user.image;
        await existingUser.save();
      } else {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          isOnboarded: false,
        });
      }
      return true;
    },
    async session({ session, token }) {
      console.log("Session Callback:", { token });
      session.accessToken = token.accessToken;
      session.error = token.error;

      await connectMongoDB();
      const existingUser = await User.findOne({ email: session.user.email });

      if (existingUser) {
        session.user.id = existingUser._id.toString();
        session.user.name = existingUser.name;
        session.user.image = existingUser.image;
        session.user.isOnboarded = existingUser.isOnboarded;
      }

      return session;
    },
  },
});
