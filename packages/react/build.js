const { build } = require('esbuild')
const { Generator } = require('npm-dts')
const { peerDependencies, dependencies } = require('./package.json')

const generateTypeDefs = () => {
  new Generator({
    entry: 'src/index.ts',
    output: 'dist/index.d.ts',
  }).generate()
}

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  external: Object.keys(peerDependencies).concat(Object.keys(dependencies)),
  outfile: 'dist/index.js',
  format: 'esm',
  watch: process.argv.includes('--watch')
    ? { onRebuild: generateTypeDefs }
    : undefined,
})

generateTypeDefs()
