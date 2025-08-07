import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'], // Add your Cloudinary domain
  },
};

export default nextConfig;
