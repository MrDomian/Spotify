export default function handler(req, res) {
    const clientSecret =
        process.env.SPOTIFY_CLIENT_SECRET ||
        process.env.NEXT_PUBLIC_CLIENT_SECRET;

    const authSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    const nextAuthUrl =
        process.env.NEXTAUTH_URL ||
        (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : null);

    const callbackUrl = nextAuthUrl
        ? `${nextAuthUrl}/api/auth/callback/spotify`
        : null;

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
        nextAuthUrl,
        callbackUrl,
        hint: "Dodaj callbackUrl dokładnie w Spotify Dashboard → Redirect URIs",
    });
}
