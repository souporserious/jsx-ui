const { build } = require('esbuild')
const { dependencies } = require('./package.json')

build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  target: 'es2018',
  external: Object.keys(dependencies),
  watch: process.argv.includes('--watch'),
})
