import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/schemas";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        console.time("[AUTH] Total");
        try {
          console.time("[AUTH] ConnectDB");
          await connectDB();
          console.timeEnd("[AUTH] ConnectDB");
        } catch (err) {
          console.error("DB connection failed:", err);
          console.timeEnd("[AUTH] ConnectDB");
          console.timeEnd("[AUTH] Total");
          throw new Error("Database connection failed. Please try again.");
        }

        // Fetch user with password (select: false by default, must be explicit)
        console.time("[AUTH] FindUser");
        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        }).select("+password");
        console.timeEnd("[AUTH] FindUser");

        if (!user) {
          console.timeEnd("[AUTH] Total");
          throw new Error("No account found with this email address.");
        }

        if (!user.password) {
          console.timeEnd("[AUTH] Total");
          throw new Error("This account uses social login. Please sign in with Google or GitHub.");
        }

        console.time("[AUTH] BcryptCompare");
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        console.timeEnd("[AUTH] BcryptCompare");
        
        console.timeEnd("[AUTH] Total");

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password. Please try again.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || null,
        };
      },
    }),
  ],

  pages: {
    signIn: "/",
  },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.image = token.image;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET || "ventrixa-secret-key-dev-only",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
