import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Next 16 only allows q75 by default, which visibly softens full-bleed photos.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
    // include 2K/4K widths so full-screen photos are served sharp on retina / 1440p+ displays
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3200],
  },
};

export default nextConfig;
