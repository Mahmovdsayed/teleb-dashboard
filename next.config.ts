import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,
  compiler: {
    // removeConsole: true,
  },
  experimental: {
    optimizeCss: true,
    inlineCss: true,
    // turbopackGc: true,
    // turbopackLazyDynamicImports: true,
    turbopackRustReactCompiler: true,
    // turbopackPluginRuntimeStrategy: "workerThreads",
  },
}

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")
export default withNextIntl(nextConfig)
