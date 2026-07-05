import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tells Next.js to generate static HTML files instead of a server runtime
  output: 'export',
  
  // Optional: Disables image optimization since Surge doesn't run a backend image server
  images: {
    unoptimized: true,
  },
};

export default nextConfig;