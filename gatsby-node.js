// https://www.gatsbyjs.org/docs/node-apis/

const { createFilePath } = require( `gatsby-source-filesystem` )
const path = require(`path`)

const templates = {
  blog: path.resolve( 'src/pages/blog.js' ),
  index: path.resolve( 'src/pages/index.js' ),
  scp: path.resolve( 'src/templates/scp.js' ),
  post: path.resolve( 'src/templates/post.js' ),
  searchTag: path.resolve( 'src/templates/search-tag.js' ),
  searchCategory: path.resolve( 'src/templates/search-category.js' ),
}

/**
 * @typedef {Object} PostsQueryData
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
 * @property {Object} data.allScp
 * @property {Object[]} data.allScp.nodes
 * @property {string} data.allScp.nodes.relativeDirectory
 */
const postsQuery = `query {
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
  allScp: allFile( filter:{ sourceInstanceName:{ eq:"single component projects" } } ) {
    nodes {
      relativeDirectory
    }
  }
}`

exports.createPages = async ({ actions:{ createPage }, graphql }) => {


  //
  // Perform data
  //


  /** @type {PostsQueryData} */
  const postsQueryData = await graphql( postsQuery )
  const { errors, data } = postsQueryData

  if (errors) throw errors

  const posts = data.allMdx.nodes
  const { tags, categories } = posts.reduce( (obj, { frontmatter:{ tags, categories } }) => {
    tags?.forEach( tag => obj.tags.add( tag ) )
    categories.forEach( category => obj.categories.add( category ) )

    return obj
  }, {
    tags: new Set(),
    categories: new Set()
  } )

  //
  // Create pages for every language
  //


  const defaultLangKey = `en`
  for (const langKey of [ `en`, `pl` ]) {
    const urlStart = langKey === defaultLangKey ? `/` : `/${langKey}/`

    tags.forEach( tag => createPage( {
      path: `${urlStart}tag/${tag}`,
      component: templates.searchTag,
      context: { langKey, tag, tags },
    } ) )

    categories.forEach( category => createPage( {
      path: `${urlStart}category/${category}`,
      component: templates.searchCategory,
      context: { langKey, category, categories },
    } ) )

    data.allScp.nodes.forEach( ({ relativeDirectory }) => createPage( {
      path: `${urlStart}scp/${relativeDirectory.replace( / /g, `_` ).toLowerCase()}`,
      component: templates.scp,
      context: { langKey, scp:relativeDirectory },
    } ) )

    posts.forEach( (post, index) => {
      const previous = index === posts.length - 1 ? null : posts[ index + 1 ]
      const next = index === 0 ? null : posts[ index - 1 ]

      if (!post.fields.slug) return

      createPage( {
        path: `${urlStart}post${post.fields.slug}`,
        component: templates.post,
        context: {
          langKey,
          slug: post.fields.slug,
          previous,
          next,
        },
      } )
    } )

    if (langKey !== defaultLangKey) {
      createPage( {
        path: `${urlStart}`,
        component: templates.index,
        context: { langKey },
      } )
      createPage( {
        path: `${urlStart}blog/`,
        component: templates.blog,
        context: { langKey },
      } )
    }
  }
}

exports.onCreatePage = async ({ actions:{ deletePage }, page }) => {
  if (/blog/.test( page.path )) deletePage( page )
}

exports.onCreateNode = async ({ node, actions }) => {
  if (node.internal.type === `Mdx`) {
    const { createNodeField } = actions
    const { date, title } = node.frontmatter
    const performedDate = date.split( `T` )[ 0 ]
    const performedTitle = title.replace( /: *|\|/g, `-` )
      .replace( / /g, `_` )
      .replace( /\\|\/|\*/g, `` )
      .replace( /\?/g, `.` )
      .replace( /</g, `(` )
      .replace( />/g, `)` )

    createNodeField( { name:`slug`, node, value:`/${performedDate}/${performedTitle}` } )
  }
}