import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { SPOTIFY_SCOPES } from "../../../lib/spotify";

const authSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
const useSecureCookies =
    process.env.NEXTAUTH_URL?.startsWith("https://") ??
    process.env.VERCEL === "1";

async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        console.error("Token refresh failed:", error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export default NextAuth({
    trustHost: true,
    secret: authSecret,
    useSecureCookies,
    debug: process.env.NEXTAUTH_DEBUG === "true",
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret:
                process.env.SPOTIFY_CLIENT_SECRET ||
                process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: SPOTIFY_SCOPES,
                },
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at
                        ? account.expires_at * 1000
                        : Date.now() + (account.expires_in ?? 3600) * 1000,
                };
            }

            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.accessToken = token.accessToken;
                session.user.refreshToken = token.refreshToken;
                session.user.username = token.username;
            }
            session.error = token.error;

            return session;
        },
    },
});
