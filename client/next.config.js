module.exports = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    swcMinify: true,
    experimental: {
      forceSwcTransforms: true,
    },
    transpilePackages: ['mapbox-gl']
  }
