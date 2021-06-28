import * as t from '@babel/types'
import { createSyncFn } from 'synckit'

const fetchImages = createSyncFn(require.resolve('./fetch-images'))

export function transformGraphic(path, state) {
  const props = Object.fromEntries(
    path.node.attributes.map((attribute) => [
      attribute.name.name,
      attribute.value.value,
    ])
  )
  const base64source = fetchImages(props)
  path.node.name.name = 'img'
  path.node.attributes = [
    t.jsxAttribute(t.jsxIdentifier('src'), t.stringLiteral(base64source)),
  ]
}
