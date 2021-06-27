const path = require('path')
// const fetch = require('node-fetch')
// const { groupBy, sortBy } = require('lodash')

// const CATEGORY_ORDER = [
//   'Introduction',
//   'Primitives',
//   'Layout',
//   'General',
//   'Images',
//   'Indicators',
//   'Overlays',
//   'Forms',
// ]

// const getSortedCategories = (categories) => {
//   const groupedCategories = groupBy(
//     categories,
//     (categories) => categories.category
//   )
//   return CATEGORY_ORDER.map((key) => ({
//     category: key,
//     components: sortBy(
//       sortBy(groupedCategories[key], [(component) => component.title]),
//       [(component) => (component.order === undefined ? 0 : component.order)]
//     ),
//   }))
// }

// const getPreviousNextItems = (collection, index) => {
//   return [
//     index > 0 ? collection[index - 1] : null,
//     index < collection.length - 1 ? collection[index + 1] : null,
//   ]
// }

exports.onCreateNode = async ({ actions, node }) => {
  if (node.internal.type === 'Mdx') {
    // console.log(node)
    // actions.createNodeField({
    //   node,
    //   name: `slug`,
    //   value: `/${node.frontmatter.title.toLowerCase().replace(/\s/g, '-')}`,
    // })
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const result = await graphql(`
    {
      allMdx {
        nodes {
          id
          slug
          frontmatter {
            title
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panic(`🚨 ERROR: Loading "createPages" query`, result.errors)
  }

  actions.createRedirect({
    fromPath: '/docs',
    toPath: '/docs/getting-started',
    redirectInBrowser: true,
  })

  result.data.allMdx.nodes.forEach((node) => {
    const slug = `/docs/${node.slug}`
    actions.createPage({
      path: slug,
      component: path.resolve(`src/templates/doc.js`),
      context: {
        id: node.id,
        title: node.frontmatter.title,
        slug,
      },
    })
  })

  //   const categories = getSortedCategories(
  //     result.data.allMdx.nodes
  //       .filter((node) => node.frontmatter.title !== 'Table')
  //       .map((node) => ({
  //         id: node.id,
  //         title: node.frontmatter.title,
  //         category: node.frontmatter.category,
  //         order: node.frontmatter.order,
  //         slug: node.fields.slug,
  //       }))
  //   )
  //   categories.forEach(({ components }, categoryIndex) => {
  //     const [previousCategory, nextCategory] = getPreviousNextItems(
  //       categories,
  //       categoryIndex
  //     )
  //     components.forEach((component, componentIndex) => {
  //       const [previousComponent, nextComponent] = getPreviousNextItems(
  //         components,
  //         componentIndex
  //       )
  //       let previousCategoryId = null
  //       let nextCategoryId = null
  //       if (previousCategory) {
  //         previousCategoryId =
  //           previousCategory.components[previousCategory.components.length - 1].id
  //       }
  //       if (nextCategory) {
  //         nextCategoryId = nextCategory.components[0].id
  //       }
  //       actions.createPage({
  //         path: component.slug,
  //         component: path.resolve(`src/templates/component.js`),
  //         context: {
  //           id: component.id,
  //           previousId: previousComponent
  //             ? previousComponent.id
  //             : previousCategoryId,
  //           nextId: nextComponent ? nextComponent.id : nextCategoryId,
  //           title: component.title,
  //         },
  //       })
  //     })
  //   })
}
