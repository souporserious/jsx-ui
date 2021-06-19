const { build } = require('esbuild')
const { peerDependencies } = require('./package.json')

build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  target: 'es2016',
  external: Object.keys(peerDependencies),
  watch: process.argv.includes('--watch'),
})
