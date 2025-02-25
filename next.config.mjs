/** @type {import('next').NextConfig} */
const nextConfig = {
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
