/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/documents/Resume - Aarush Agarwal.pdf',
        destination: 'https://7fzwxvblhjtadxkp.public.blob.vercel-storage.com/documents/Resume%20-%20Aarush%20Agarwal.pdf',
        permanent: true,
      },
      {
        source: '/documents/Resume%20-%20Aarush%20Agarwal.pdf',
        destination: 'https://7fzwxvblhjtadxkp.public.blob.vercel-storage.com/documents/Resume%20-%20Aarush%20Agarwal.pdf',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '7fzwxvblhjtadxkp.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
