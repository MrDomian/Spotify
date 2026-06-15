import { resolveNextAuthUrl } from "../../../lib/authUrl";

export default function handler(req, res) {
    const clientSecret =
        process.env.SPOTIFY_CLIENT_SECRET ||
        process.env.NEXT_PUBLIC_CLIENT_SECRET;

    const authSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    const nextAuthUrl = resolveNextAuthUrl();
    const configuredUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
    const callbackUrl = nextAuthUrl
        ? `${nextAuthUrl}/api/auth/callback/spotify`
        : null;

    const usingWrongPreviewUrl =
        Boolean(configuredUrl) &&
        Boolean(process.env.VERCEL_PROJECT_PRODUCTION_URL) &&
        configuredUrl !== nextAuthUrl;

    res.status(200).json({
        ok: Boolean(
            process.env.NEXT_PUBLIC_CLIENT_ID &&
                clientSecret &&
                authSecret &&
                nextAuthUrl
        ),
        hasClientId: Boolean(process.env.NEXT_PUBLIC_CLIENT_ID),
        hasClientSecret: Boolean(clientSecret),
        hasAuthSecret: Boolean(authSecret),
        hasNextAuthUrl: Boolean(nextAuthUrl),
        configuredNextAuthUrl: configuredUrl ?? null,
        nextAuthUrl,
        callbackUrl,
        usingWrongPreviewUrl,
        hint: usingWrongPreviewUrl
            ? "NEXTAUTH_URL w Vercel wskazuje na preview — ustaw https://spotify4fun.vercel.app"
            : "Dodaj callbackUrl dokładnie w Spotify Dashboard → Redirect URIs",
    });
}
