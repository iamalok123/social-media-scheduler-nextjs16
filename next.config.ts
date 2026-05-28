import type { NextConfig } from "next";

const insforgeBaseUrl = process.env.INSFORGE_BASE_URL;
const insforgeImageHost = insforgeBaseUrl
    ? new URL(insforgeBaseUrl).hostname
    : undefined;
const insforgeRemotePatterns = insforgeImageHost
    ? [{ protocol: "https" as const, hostname: insforgeImageHost }]
    : [];

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
            ...insforgeRemotePatterns,
        ],
    },

    // Run command - ngrok http 3000
    // https://presentational-federico-lumberingly.ngrok-free.dev -> http://localhost:3000
    allowedDevOrigins: ["presentational-federico-lumberingly.ngrok-free.dev"],
};

export default nextConfig;
