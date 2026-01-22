import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com", // Notion hosted files
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Notion cover images from Unsplash
      },
    ],
  },
};

export default nextConfig;
