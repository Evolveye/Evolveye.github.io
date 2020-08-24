// https://www.gatsbyjs.org/docs/node-apis/

const { createFilePath } = require( `gatsby-source-filesystem` )
const path = require(`path`)

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  const template = path.resolve( 'src/pages/post.js' )
  const query = `query {
    allMdx(
      sort:{ fields:frontmatter___date, order:DESC }
      filter:{ frontmatter:{ published:{ eq:true } } }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
  }`

  return graphql( query ).then( ({ errors, data }) => {
    if (errors) throw errors

    const posts = data.allMdx.nodes

    posts.forEach( (post, index) => {
      const previous = index === posts.length - 1 ? null : posts[ index + 1 ];
      const next = index === 0 ? null : posts[ index - 1 ];

      createPage( {
        path: post.fields.slug,
        component: template,
        context: {
          slug: post.fields.slug,
          previous,
          next,
        }
      } )
    } )
  } )
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type === `Mdx`) {
    const { createNodeField } = actions
    const value = createFilePath({ node, getNode })

    createNodeField( { name:`slug`, node, value } )
  }
}