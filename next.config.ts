import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com", // Google profile pictures
      "googleusercontent.com", // Other Google image domains
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
