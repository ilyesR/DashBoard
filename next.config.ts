import type { NextConfig } from "next";

// GitHub Pages serves this repo at /DashBoard/, not at a domain root. The CI
// workflow sets NEXT_PUBLIC_BASE_PATH; locally it is empty so dev stays at /.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Pages is a static file host — no Node server, so every route is exported.
  output: "export",
  // Emits projects/index.html rather than projects.html, which is what Pages
  // needs to serve /projects/ without a 404.
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  // The dev overlay badge sits over the sidebar's bottom corner and lands in
  // every review screenshot.
  devIndicators: false,
};

export default nextConfig;
