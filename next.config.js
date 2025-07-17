/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'hdbmcwmgolmxmtllaclx.supabase.co' // Add your Supabase storage domain
    ],
    // You also need to specify the dimensions for the Image component
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hdbmcwmgolmxmtllaclx.supabase.co',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  }
};

module.exports = nextConfig;