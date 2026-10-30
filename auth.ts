import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin" },
  callbacks: {
    signIn({ user }) {
      const ownerEmail = process.env.PORTFOLIO_OWNER_EMAIL?.trim().toLowerCase();
      return Boolean(ownerEmail && user.email?.toLowerCase() === ownerEmail);
    },
  },
});
