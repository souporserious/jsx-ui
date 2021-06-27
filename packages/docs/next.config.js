const withRemoteRefresh = require('next-remote-refresh')({
  paths: [require('path').resolve(__dirname, '../react/src')],
})
const withMDX = require('@next/mdx')()

module.exports = withRemoteRefresh(
  withMDX({
    pageExtensions: ['ts', 'tsx', 'mdx'],
  })
)
