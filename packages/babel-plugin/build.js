const { build } = require('esbuild')
const { peerDependencies, dependencies } = require('./package.json')

build({
  entryPoints: [
    'src/index.ts',
    'src/compiler.ts',
    'src/config.ts',
    'src/fetch-images.ts',
  ],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  target: 'es2015',
  external: Object.keys(peerDependencies).concat(Object.keys(dependencies)),
  watch: process.argv.includes('--watch'),
})
