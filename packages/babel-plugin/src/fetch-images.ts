const { runAsWorker } = require('synckit')
const { fetchImages } = require('figma-tools')
const { config } = require('dotenv')
const svg64 = require('svg64')

config()

runAsWorker(async ({ file, page, name, format }) =>
  fetchImages({
    fileId: file,
    format,
    filter: (component) =>
      component.pageName === page && component.name === name,
  }).then(async (svgs) => {
    const [image] = await Promise.all(
      svgs.map((svg) => svg64(svg.buffer.toString()))
    )
    return image
  })
)
