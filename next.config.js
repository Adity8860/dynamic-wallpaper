module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pixabay.com',
        pathname: '/**',
      },
    ],
  },
};
