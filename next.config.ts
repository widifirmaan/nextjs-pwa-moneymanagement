import type { NextConfig } from "next";

const isStaticExport =
  process.env.STATIC_EXPORT === "1" ||
  process.env.CF_PAGES === "1" ||
  process.env.WORKERS_CI === "1";

const config: NextConfig = {
  ...(isStaticExport ? { output: "export" as const, pageExtensions: ["tsx", "jsx"] } : {}),
  serverExternalPackages: ["@libsql/client"],
  images: {
    unoptimized: true,
  },

  // Reduce bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  // Experimental features for faster builds
  experimental: {
    optimizePackageImports: ['framer-motion', 'date-fns'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default config;
