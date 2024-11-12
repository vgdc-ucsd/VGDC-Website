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
    }
};

export default nextConfig;
