function resolveNextAuthUrl() {
    const configured = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
    const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

    if (process.env.VERCEL_ENV === "production" && productionHost) {
        const productionUrl = `https://${productionHost}`;
        const isDeploymentPreviewUrl =
            configured?.includes(".vercel.app") &&
            configured !== productionUrl;

        if (!configured || isDeploymentPreviewUrl) {
            return productionUrl;
        }
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
