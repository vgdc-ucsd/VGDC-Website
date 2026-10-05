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
            hostname: '**', // Allows any hostname
          },
        ],
      },
};

export default nextConfig;
