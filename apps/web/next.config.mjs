/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compile the workspace packages (they ship raw TS/TSX).
  transpilePackages: ['@repo/ui', '@repo/core'],
};

export default nextConfig;
