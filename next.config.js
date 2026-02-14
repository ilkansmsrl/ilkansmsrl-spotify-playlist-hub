/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-fa.spotifycdn.com',
      },
      {
        protocol: 'https',
        hostname: 'seed-mix-image.spotifycdn.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'wrapped-images.spotifycdn.com',
      },
      {
        protocol: 'https',
        hostname: 'lineup-images.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'newjams-images.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'dailymix-images.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'thisis-images.spotifycdn.com',
      },
      {
        protocol: 'https',
        hostname: 'pickasso.spotifycdn.com',
      },
    ],
  },
};

module.exports = nextConfig;
