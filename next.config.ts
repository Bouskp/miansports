import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    minimumCacheTTL: 31622400,
    remotePatterns: [{ protocol: 'https', hostname: 'api.miansports.com' }],
  },
}

export default config
