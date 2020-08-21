// https://www.gatsbyjs.org/docs/node-apis/

const { createFilePath } = require( `gatsby-source-filesystem` )
const path = require(`path`)

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  const template = path.resolve( 'src/pages/post.js' )
  const query = `{
    allMdx {
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

    data.allMdx.nodes.forEach( post => {
      createPage( {
        path: post.fields.slug,
        component: template,
        context: {
          slug: post.fields.slug,
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