import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'api.miansports.com' }],
  },
}
export default config
