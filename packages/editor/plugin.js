const { createSextantPlugin } = require('@sextant-tools/core')
const {
  buildBaseTypeFiles,
} = require('@sextant-tools/plugin-javascript-operations')
const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

const plugin = createSextantPlugin(
  (
    context,
    { expressFileName = 'sextant-express.generated', typescriptFileName }
  ) => {
    // console.log(context, expressFileName, typescriptFileName)
    const files = buildBaseTypeFiles(context.database, typescriptFileName)

    files.forEach((file) => {
      context.writeFileSync(file.filename, file.content)
    })

    const declarationFileTemplate = Handlebars.compile(
      fs
        .readFileSync(path.resolve(__dirname, './express-plugin.d.ts.hbs'))
        .toString()
    )

    context.writeFileSync(
      expressFileName + '.d.ts',
      declarationFileTemplate({})
    )

    const jsFileTemplate = fs
      .readFileSync(path.resolve(__dirname, './express-plugin.js'))
      .toString()

    context.writeFileSync(expressFileName + '.js', jsFileTemplate)
  }
)

module.exports = plugin
