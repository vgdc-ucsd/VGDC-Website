/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['@dicebear/core', '@dicebear/collection', '@dicebear/converter', '@resvg/resvg-js'],
    async redirects() {
        return [
        {
            source: '/discord',
            destination: 'https://discord.com/invite/qFNeWHS',
            permanent: false,
        },
        ]
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**',
          },
        ],
        // Reducing the number of possible image transformations should help lower usage
        deviceSizes: [640, 1080, 1920],
        imageSizes: [192, 256, 384],
        // IDK if we'll ever need AVIF, but we can change this later if we need to
        formats: ['image/webp'],
        minimumCacheTTL: 2678400, // 31 days as recommended by Vercel
      },
};

export default nextConfig;
