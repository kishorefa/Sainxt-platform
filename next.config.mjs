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
  // Disable font optimization for Docker build
  optimizeFonts: false,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Disable static optimization
  output: 'standalone',
  experimental: {
    // Disable server components external packages
    serverComponentsExternalPackages: [],
    // Disable font optimization
    optimizeCss: false,
  },
  // Disable static optimization
  staticPageGenerationTimeout: 1000,
  // Disable image optimization
  images: {
    unoptimized: true,
    disableStaticImages: true,
  },
};

export default nextConfig;
