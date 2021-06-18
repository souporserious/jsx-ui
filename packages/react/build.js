const { build } = require('esbuild')
const { Generator } = require('npm-dts')
const { peerDependencies, dependencies } = require('./package.json')
const watch = process.argv.includes('--watch')

const generateTypeDefs = () => {
  new Generator({
    entry: 'src/index.ts',
    output: 'dist/index.d.ts',
  }).generate()
}

const shared = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  external: Object.keys(peerDependencies).concat(Object.keys(dependencies)),
}

build({
  ...shared,
  outfile: 'dist/index.esm.js',
  format: 'esm',
  watch: watch ? { onRebuild: generateTypeDefs } : undefined,
})

if (!watch) {
  build({
    ...shared,
    outfile: 'dist/index.js',
  })
}

generateTypeDefs()
