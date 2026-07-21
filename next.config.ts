import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",

  // Reduce bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  // Experimental features for faster builds
  experimental: {
    optimizePackageImports: ['framer-motion', 'recharts', 'date-fns'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default config;
