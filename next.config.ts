/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/caiwai",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
