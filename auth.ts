import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google({
    clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
  })],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin" },
  callbacks: {
    signIn({ user, profile }) {
      const ownerEmail = process.env.PORTFOLIO_OWNER_EMAIL?.trim().toLowerCase();
      return Boolean(ownerEmail && user.email?.trim().toLowerCase() === ownerEmail && profile?.email_verified === true);
    },
  },
});
