import { App } from '@tinyhttp/app'
import cors from 'cors'
import * as fs from 'fs/promises'
import * as prettier from 'prettier'
import * as codemod from '@codemod/core'

const app = new App()

const plugin = () => {
  return {
    visitor: {
      JSXText(path, state) {
        if (path.parent.openingElement) {
          const location = path.parent.openingElement.loc
          if (
            state.opts.source.lineNumber === location.start.line &&
            state.opts.source.columnNumber === location.start.column + 1
          ) {
            path.node.value = path.node.value.replace(
              path.node.value.trim(),
              state.opts.value.trim()
            )
          }
        }
      },
    },
  }
}

type ComponentData = {
  source: {
    fileName: string
    lineNumber: number
    columnNumber: number
  }
  value: any
}

// TODO: add option for specifying origin
app.use(cors({ origin: true }))

app.post(`/props/update`, (request, response) => {
  let bodyBuffer = []
  request
    .on('error', (err) => {
      console.error(err)
    })
    .on('data', (chunk) => {
      bodyBuffer.push(chunk)
    })
    .on('end', async () => {
      const body: ComponentData = JSON.parse(
        Buffer.concat(bodyBuffer).toString()
      )
      const fileBuffer = await fs.readFile(body.source.fileName)
      const prettierOptions = await prettier.resolveConfig(body.source.fileName)
      const transformedFile = codemod.transform(fileBuffer.toString(), {
        plugins: [[plugin, body]],
      })
      const formattedCode = prettier.format(
        transformedFile.code,
        prettierOptions
      )
      try {
        await fs.writeFile(body.source.fileName, formattedCode)
        response.sendStatus(200)
      } catch (err) {
        response.sendStatus(500)
      }
    })
})

app.listen(4000)
