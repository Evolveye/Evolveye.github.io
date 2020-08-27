// https://www.gatsbyjs.org/docs/node-apis/

const { createFilePath } = require( `gatsby-source-filesystem` )
const path = require(`path`)

const templates = {
  post: path.resolve( 'src/templates/post.js' ),
  searchTag: path.resolve( 'src/templates/search-tag.js' ),
  searchCategory: path.resolve( 'src/templates/search-category.js' ),
}

/**
 * @typedef {Object} QueryData
 * @property {Error[]} errors
 * @property {Object} data
 * @property {Object} data.allMdx
 * @property {Object[]} data.allMdx.nodes
 * @property {Object} data.allMdx.nodes.fields
 * @property {string} data.allMdx.nodes.fields.slug
 * @property {Object} data.allMdx.nodes.frontmatter
 * @property {string} data.allMdx.nodes.frontmatter.title
 * @property {string[]} data.allMdx.nodes.frontmatter.tags
 * @property {string[]} data.allMdx.nodes.frontmatter.categories
 */

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions
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
          tags
          categories
        }
      }
    }
  }`

  /** @type {QueryData} */
  const queryData = await graphql( query )
  const { errors, data } = queryData

  if (errors) throw errors

  const posts = data.allMdx.nodes

  // Create search pages
  const { tags, categories } = posts.reduce( (obj, { frontmatter:{ tags, categories } }) => {
    tags?.forEach( tag => obj.tags.add( tag ) )
    categories.forEach( category => obj.categories.add( category ) )

    return obj
  }, {
    tags: new Set(),
    categories: new Set()
  } )

  tags.forEach( tag => createPage( {
    path: `/tag/${tag}`,
    component: templates.searchTag,
    context: { tag, tags },
  } ) )

  categories.forEach( category => createPage( {
    path: `/category/${category}`,
    component: templates.searchCategory,
    context: { category, categories },
  } ) )

  // Create post pages
  posts.forEach( (post, index) => {
    const previous = index === posts.length - 1 ? null : posts[ index + 1 ]
    const next = index === 0 ? null : posts[ index - 1 ]

    if (!post.fields.slug) return

    createPage( {
      path: `/post/${post.fields.slug}`,
      component: templates.post,
      context: {
        slug: post.fields.slug,
        previous,
        next,
      },
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