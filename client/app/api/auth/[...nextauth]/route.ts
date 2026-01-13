import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { type JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.refreshToken}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error("Failed to refresh access token");
    }

    const newAccessToken = data.data.accessToken;
    const newRefreshToken = data.data.refreshToken;
    const decodedToken: { exp: number } = jwtDecode(newAccessToken);

    return {
      ...token,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires: decodedToken.exp * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) return false;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/oauth`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              profile: user.image,
              provider: account.provider,
            }),
          }
        );

        if (!res.ok) {
          console.error("Backend sign-in failed");
          return false;
        }

        const backendRes = await res.json();

        user.accessToken = backendRes.data.accessToken;
        user.refreshToken = backendRes.data.refreshToken;
        user.onBoarded = backendRes.data.onBoarded;
        user.user = backendRes.data.user;

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        if (session?.onBoarded) {
          token.onBoarded = session.onBoarded;
        }
        if (session?.user) {
          token.user = session.user;
        }
        return token;
      }
      if (user) {
        const decodedToken: { exp: number } = jwtDecode(user.accessToken!);
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.onBoarded = user.onBoarded;
        token.accessTokenExpires = decodedToken.exp * 1000;
        token.user = user.user;
        return token;
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.onBoarded = token.onBoarded;
        session.error = token.error;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
});

export { handler as GET, handler as POST };
