import * as path from 'path'
import * as fs from 'fs'
import * as ts from 'typescript'
import { Project, Node, FunctionExpression } from 'ts-morph'
import { useRemoteRefresh } from 'next-remote-refresh/hook'

export default function Component({ codeString, docs }) {
  useRemoteRefresh()
  return <pre>{codeString}</pre>
}

export function getStaticPaths() {
  return {
    paths: [{ params: { slug: 'stack' } }],
    fallback: false,
  }
}

export function getStaticProps() {
  const project = new Project({
    tsConfigFilePath: path.resolve(process.cwd(), '../react/tsconfig.json'),
  })
  const source = project.getSourceFile(
    path.resolve(process.cwd(), '../react/src/Stack.tsx')
  )

  function getProps(declaration: FunctionExpression) {
    const [props] = declaration.getParameters()
    const typeProps = props
      .getType()
      .getProperties()
      .map((prop) => {
        return {
          name: prop.getName(),
          type: prop.getTypeAtLocation(declaration).getText(declaration),
          path: prop.getValueDeclaration().getSourceFile().getFilePath(),
          //   intersection: props.getType(),
          //   test: prop.getValueDeclaration().getParent().getType().getText(),
        }
      })

    return {
      name: declaration.getName(),
      typeProps,
    }
  }

  //   const variables = source
  //     .getVariableStatements()
  //     // .filter((declaration) => declaration.hasExportKeyword())
  //     .map((declaration) => {
  //       // console.log(declaration.)
  //       //   console.log(declaration.getVariableStatement().getText())
  //       //   const initializer = declaration.getInitializer()
  //       //   console.log(initializer.)
  //       return declaration
  //     })
  //   console.log(
  //     source.forEachDescendant((node) => {
  //       console.log(node.getKindName())
  //     })
  //   )

  //   const variables = source
  //     .getVariableDeclarations()
  //     .filter((declaration) => declaration.hasExportKeyword())
  //     .map((declaration) => {
  //       declaration.forEachDescendant((node) => {
  //         console.log(node.getKindName(), node.getText().slice(0, 10))
  //       })
  //       return declaration
  //     })

  // const variables = source
  //   .getVariableDeclarations()
  //   .filter((declaration) => declaration.hasExportKeyword())
  //   .map((declaration) => {
  //     const descendants = declaration.getDescendantsOfKind(
  //       ts.SyntaxKind.FunctionDeclaration
  //     )
  //     //   console.log(descendants)
  //     return declaration
  //   })

  //   const descendants = source
  //     .getDescendantsOfKind(ts.SyntaxKind.ArrowFunction)
  //     .map((node) => node.getText())

  //   const descendants = source
  //     .getDescendants()
  //     .filter(
  //       (d) =>
  //         d.getKind() === ts.SyntaxKind.FunctionDeclaration ||
  //         d.getKind() === ts.SyntaxKind.FunctionExpression ||
  //         d.getKind() === ts.SyntaxKind.ArrowFunction
  //     )
  //     .map((node) => node.getText())

  // const varDeclarations = source
  //   .getVariableDeclarations()
  //   .filter((node) =>
  //     ['ForwardRefExoticComponent', 'MemoExoticComponent'].includes(
  //       node.getInitializer().getType().getSymbol().getName()
  //     )
  //   )
  //   .map(
  //     (node) => {
  //       const declaration = node.getFirstDescendantByKind(
  //         ts.SyntaxKind.FunctionExpression
  //       )
  //       const docs = getProps(declaration)
  //       console.log(docs)
  //     }
  //     // (node) => node.getNameNode().getText()
  //     // .getDeclarations()
  //     // .map((declaration) => declaration.getText())
  //   )
  // // .map((node) => node.getChildren().map((child) => child.getText()))

  //   console.log(varDeclarations)

  //   const t = source
  //     .getVariableStatements()
  //     .map((statement) => statement.getDeclarations().map((d) => d.getText()))

  //   console.log(t)

  //   const variables = source
  //     .getVariableDeclarations()
  //     .filter((declaration) => declaration.hasExportKeyword())
  //     .map((declaration) => {
  //     //   console.log(declaration.getVariableStatement().getText())
  //       //   const initializer = declaration.getInitializer()
  //       //   console.log(initializer.)
  //       return declaration
  //     })
  const components = source.getFunctions().filter((declaration) => {
    const name = declaration.getName()
    const isComponent = name[0] === name[0].toUpperCase()
    // console.log(name)
    return isComponent && declaration.hasExportKeyword()
  })
  const docs = components.map((declaration) => {
    const [props] = declaration.getParameters()
    const type = props.getType()
    const types = type.getProperties().map((prop) => {
      const [node] = prop.getDeclarations()
      const [range] = node.getLeadingCommentRanges()
      return {
        name: prop.getName(),
        type: prop.getTypeAtLocation(declaration).getText(),
        comment: range.getText(),
      }
    })
    return {
      name: declaration.getName(),
      types,
    }
  })
  return {
    props: {
      codeString: source.getFullText(),
      docs,
    },
  }
}
