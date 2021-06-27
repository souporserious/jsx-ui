import React from 'react'
import { Link as GatsbyLink, graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import { MDXRenderer } from 'gatsby-plugin-mdx'

export default function Doc({ data }) {
  const { mdx } = data
  return <MDXRenderer>{mdx.body}</MDXRenderer>
}

// import { slug } from 'github-slugger'
// import {
//   Box,
//   Divider,
//   GridView,
//   Heading,
//   Icon,
//   Link,
//   HeadingUppercase,
//   StackView,
//   Text,
// } from '@planning-center/ui-kit'

// import PropsTable from '../components/PropsTable'
// import Layout from '../layout/components'
// import { markdownToReact } from '../markdown-to-react'

// export default function ComponentTemplate({ data, ...props }) {
//   const { componentMetadata, mdx, previous, next } = data
//   const filePath = componentMetadata
//     ? componentMetadata.parent.dir.split('packages')[1]
//     : ''
//   const hasComplexTypes = componentMetadata
//     ? componentMetadata.props.some((meta) => meta.flowType || meta.tsType)
//     : false
//   const filteredProps = componentMetadata
//     ? componentMetadata.props.filter((meta) =>
//         hasComplexTypes ? meta.flowType || meta.tsType : true
//       )
//     : []
//   const headings = [...mdx.headings]
//   if (filteredProps.length > 0) {
//     headings.push({ value: 'Props', depth: 1 })
//   }
//   return (
//     <Layout {...props}>
//       <Helmet>
//         <title>
//           UI kit |{' '}
//           {componentMetadata
//             ? componentMetadata.displayName
//             : mdx.frontmatter.title}
//         </title>
//       </Helmet>

//       <StackView
//         axis="horizontal"
//         alignment="start"
//         grow={1}
//         shrink={1}
//         spacing={6}
//       >
//         <StackView
//           grow={1}
//           shrink={1}
//           paddingTop={3}
//           paddingHorizontal={3}
//           mediaQueries={{
//             md: {
//               paddingTop: '4vw',
//               paddingHorizontal: 0,
//             },
//           }}
//           css={{
//             'p + p': {
//               marginTop: 2,
//             },
//             '[data-live-code]': {
//               marginTop: 2,
//               'p + p': {
//                 marginTop: 0,
//               },
//             },
//           }}
//         >
//           <StackView
//             as="header"
//             distribution="space-between"
//             marginBottom={2}
//             spacing={1}
//             mediaQueries={{
//               md: {
//                 marginBottom: 3,
//                 spacing: 2,
//               },
//               lg: {
//                 marginBottom: 6,
//               },
//             }}
//           >
//             <StackView
//               axis="horizontal"
//               distribution="space-between"
//               spacing={2}
//             >
//               <Heading
//                 level={1}
//                 lineHeight="1"
//                 mediaQueries={{ md: { fontSize: '40px' } }}
//               >
//                 {mdx.frontmatter.title}
//               </Heading>
//               <Link
//                 alignSelf="start"
//                 shrink={0}
//                 to={`https://github.com/ministrycentered/ui-kit/tree/master/packages${filePath}`}
//                 external
//                 visible={false}
//                 mediaQueries={{ md: { visible: true } }}
//               >
//                 <StackView axis="horizontal" alignment="center" spacing={1}>
//                   <Text>View Source</Text>
//                   <Icon name="external" size="sm" />
//                 </StackView>
//               </Link>
//             </StackView>
//             {mdx.frontmatter.summary && (
//               <Box
//                 css={{
//                   p: {
//                     maxWidth: 88,
//                     margin: 0,
//                     fontSize: 2,
//                     lineHeight: '1.4',
//                     color: 'foregroundSecondary',
//                   },
//                 }}
//                 mediaQueries={{
//                   md: {
//                     css: {
//                       p: {
//                         fontSize: 1,
//                         lineHeight: '1.5',
//                       },
//                     },
//                   },
//                 }}
//               >
//                 {markdownToReact(mdx.frontmatter.summary)}
//               </Box>
//             )}
//           </StackView>

//           <MDXRenderer>{mdx.body}</MDXRenderer>

//           {filteredProps.length > 0 && <PropsTable props={filteredProps} />}
//         </StackView>

//         {headings.length > 0 && (
//           <StackView
//             as="ul"
//             basis="256px"
//             paddingTop="calc(4vw - 8px)"
//             position="sticky"
//             top="-3vw"
//             visible={false}
//             mediaQueries={{ xl: { visible: true } }}
//           >
//             {headings.map((heading) => (
//               <StackView key={heading.value} as="li">
//                 <Link
//                   to={`#${slug(heading.value)}`}
//                   fontSize={4}
//                   lineHeight="1.4"
//                   padding={1}
//                   paddingLeft={
//                     heading.depth > 2 ? heading.depth * 1 : undefined
//                   }
//                 >
//                   {heading.value}
//                 </Link>
//               </StackView>
//             ))}
//           </StackView>
//         )}
//       </StackView>

//       {(previous || next) && (
//         <GridView
//           rows="auto 1fr"
//           columns="repeat(3, 1fr)"
//           backgroundColor="surface"
//           position="sticky"
//           bottom={0}
//           zIndex={100}
//         >
//           <Divider columnStart={1} columnEnd={-1} row={1} />
//           {previous && (
//             <Box
//               as={GatsbyLink}
//               to={previous.fields.slug}
//               padding={2}
//               column={1}
//               row={2}
//               textAlign="left"
//               cursor="pointer"
//             >
//               <HeadingUppercase as="span" color="foreground" cursor="pointer">
//                 Previous
//               </HeadingUppercase>
//               <Link as="span">{previous.frontmatter.title}</Link>
//             </Box>
//           )}
//           {next && (
//             <Box
//               as={GatsbyLink}
//               to={next.fields.slug}
//               padding={2}
//               column={3}
//               row={2}
//               textAlign="right"
//               cursor="pointer"
//             >
//               <HeadingUppercase as="span" color="foreground" cursor="pointer">
//                 Next
//               </HeadingUppercase>
//               <Link as="span">{next.frontmatter.title}</Link>
//             </Box>
//           )}
//         </GridView>
//       )}
//     </Layout>
//   )
// }

export const query = graphql`
  query ComponentData(
    $id: String! # $previousId: String
  ) # $nextId: String
  # $title: String!
  {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
        # summary
      }
      headings {
        value
        depth
      }
    }
    # previous: mdx(id: { eq: $previousId }) {
    #   frontmatter {
    #     title
    #   }
    #   fields {
    #     slug
    #   }
    # }
    # next: mdx(id: { eq: $nextId }) {
    #   frontmatter {
    #     title
    #   }
    #   fields {
    #     slug
    #   }
    # }
  }
`
