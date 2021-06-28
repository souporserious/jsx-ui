import * as t from '@babel/types'
import path from 'path'
import { createSyncFn } from 'synckit'

const fetchImages = createSyncFn(path.resolve(__dirname, './fetch-images'))

export function transformGraphic(path) {
  const props = Object.fromEntries(
    path.node.attributes
      .filter((attribute) => Boolean(attribute.name))
      .map((attribute) => [attribute.name.name, attribute.value.value])
  )
  if (props.file && props.name) {
    const base64source = fetchImages(props)
    path.node.name.name = 'img'
    path.node.attributes = [
      t.jsxAttribute(t.jsxIdentifier('src'), t.stringLiteral(base64source)),
    ]
  }
}
