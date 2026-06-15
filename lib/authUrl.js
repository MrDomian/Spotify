function resolveNextAuthUrl() {
    const configured = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
    const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

    if (
        process.env.VERCEL_ENV === "production" &&
        productionHost &&
        configured &&
        configured.includes(process.env.VERCEL_URL)
    ) {
        return `https://${productionHost}`;
    }

    if (configured) {
        return configured;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return null;
}

export { resolveNextAuthUrl };
