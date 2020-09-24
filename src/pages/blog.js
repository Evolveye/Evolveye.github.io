import React from "react"
import { graphql, useStaticQuery } from "gatsby"

import"../components/sanitize.css"

import Layout from "../components/layout"
import { BlogpostEntry } from "../components/post"

/**
 * @typedef {Object} QueryData
 * @property {Object} data
 * @property {Object} data.allMdx
 * @property {Object[]} data.allMdx.nodes
 * @property {string} data.allMdx.nodes.id
 * @property {string} data.allMdx.nodes.excerpt
 * @property {Object} data.allMdx.nodes.frontmatter
 * @property {string} data.allMdx.nodes.frontmatter.date
 * @property {string} data.allMdx.nodes.frontmatter.title
 * @property {string} data.allMdx.nodes.frontmatter.author
 * @property {string} data.allMdx.nodes.frontmatter.categories
 * @property {string} data.allMdx.nodes.frontmatter.tags
 * @property {Object} data.allMdx.nodes.fields
 * @property {string} data.allMdx.nodes.fields.slug
 */

const query = graphql`query BlogHome {
  allMdx(
    sort: { fields:frontmatter___date, order:DESC },
    filter: { frontmatter:{ published:{ eq:true } } },
  ) {
    nodes {
      id
      excerpt( pruneLength:255 )
      frontmatter {
        title
        author
        date( formatString:"DD-MM-YYYY" )
        sneakPeek
        categories
        tags
      }
      fields {
        slug
      }
    }
  }
}`

export default () => {
  /** @type {QueryData} */
  const queryData = useStaticQuery( query )


  const posts = queryData.allMdx.nodes

  return <Layout>
    <h1 className="boxed-title is-green">Ostatnio dodane wpisy</h1>
    <section>
      {
        posts.map( ({ id, excerpt, frontmatter:{ tags, sneakPeek, ...fm}, fields }) => <BlogpostEntry
          key={id}
          titleLinkAddress={`/post${fields.slug}`}
          frontmatter={fm}
          body={sneakPeek || excerpt}
        /> )
      }
    </section>
  </Layout>
}