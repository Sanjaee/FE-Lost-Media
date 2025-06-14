import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "res.cloudinary.com",
      "localhost",
      "localhost:5000",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com", // Google profile pictures
      "googleusercontent.com", // Other Google image domains
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
