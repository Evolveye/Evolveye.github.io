import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import Post from "../components/post"

/**
 * @typedef {Object} Node
 * @property {string} id
 * @property {string} excerpt
 * @property {Object} frontmatter
 * @property {string} frontmatter.date
 * @property {string} frontmatter.title
 * @property {string} frontmatter.author
 * @property {string} frontmatter.categories
 * @property {Object} fields
 * @property {string} fields.slug
 */

/**
 * @typedef {Object} PostData
 * @property {Object} allMdx
 * @property {Node[]} allMdx.nodes
 */

const query = graphql`query Posts {
  allMdx(
    sort: { fields:frontmatter___date, order:DESC },
    filter: { frontmatter:{ published:{ eq:true } } }
  ) {
    nodes {
      id
      excerpt( pruneLength:255 )
      frontmatter {
        title
        author
        date( formatString:"DD-MM-YYYY" )
        categories
      }
      fields {
        slug
      }
    }
  }
}`

export default () => {
  /** @type {PostData} */
  const postsData = useStaticQuery( query )

  return <Layout className="homepage">
    {postsData.allMdx.nodes.map( ({ id, excerpt, frontmatter, fields }) => <Post
      key={id}
      titleLinkAddress={fields.slug}
      frontmatter={frontmatter}
      body={excerpt}
      isEntry={true}
    /> )}
  </Layout>
}