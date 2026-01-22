import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com", // Notion hosted images
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Unsplash images (often used for covers)
      },
      {
        protocol: "https",
        hostname: "www.notion.so", // Fallback for Notion assets
      },
    ],
  },
};

export default nextConfig;
