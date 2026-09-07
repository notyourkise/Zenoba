import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self';
  media-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspHeader,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/learn/switching-vlan-routing",
        destination: "/learn/switching-lan",
        permanent: true,
      },
      {
        source: "/learn/switching-vlan-routing/:path*",
        destination: "/learn/switching-lan/:path*",
        permanent: true,
      },
      {
        source: "/learn/routing-services",
        destination: "/learn/network-services",
        permanent: true,
      },
      {
        source: "/learn/routing-services/:path*",
        destination: "/learn/network-services/:path*",
        permanent: true,
      },
      {
        source: "/learning",
        destination: "/learn",
        permanent: true,
      },
      {
        source: "/learning/:path*",
        destination: "/learn/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
