import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "./models/User";
import connectMongoDB from "./utils/mongoDB";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
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
    async session({ session }) {
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
