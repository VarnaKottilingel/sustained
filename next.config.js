/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.spoonacular.com"],
  },
  env: {
    NEXT_PUBLIC_SPOONACULAR_API_KEY:
      process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
  },
};

module.exports = nextConfig;
