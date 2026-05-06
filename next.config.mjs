/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'vm-7usbryhh8m1xfblmvurge36m.vusercontent.net',
    '*.vusercontent.net',
  ],
}

export default nextConfig
