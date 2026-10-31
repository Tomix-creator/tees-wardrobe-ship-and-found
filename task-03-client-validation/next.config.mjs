/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/signup',
        destination: '/account?form=signup',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/account?form=login',
        permanent: true,
      },
      {
        source: '/reset-password',
        destination: '/account?form=reset',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
