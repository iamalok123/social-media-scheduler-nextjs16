import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
        ],
    },

    // Run command - ngrok http 3000
    // https://presentational-federico-lumberingly.ngrok-free.dev -> http://localhost:3000
    allowedDevOrigins: [
        "presentational-federico-lumberingly.ngrok-free.dev",
    ],
};

export default nextConfig;
