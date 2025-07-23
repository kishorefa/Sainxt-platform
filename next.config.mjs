/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // ✅ Disable React Strict Mode to prevent findDOMNode error

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
