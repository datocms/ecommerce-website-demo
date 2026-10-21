import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Only the 404 photo goes through next/image; DatoCMS images use react-datocms
    // (components/DatoImage)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
