import React from "react"
import { graphql, useStaticQuery } from "gatsby"

import"../components/sanitize.css"

import Layout from "../components/layout"
import { BlogpostEntry } from "../components/post"

/**
 * @typedef {Object} QueryData
 * @property {Object} allMdx
 * @property {Object[]} allMdx.nodes
 * @property {string} allMdx.nodes.id
 * @property {string} allMdx.nodes.excerpt
 * @property {Object} allMdx.nodes.frontmatter
 * @property {string} allMdx.nodes.frontmatter.date
 * @property {string} allMdx.nodes.frontmatter.title
 * @property {string} allMdx.nodes.frontmatter.author
 * @property {string} allMdx.nodes.frontmatter.categories
 * @property {string} allMdx.nodes.frontmatter.tags
 * @property {Object} allMdx.nodes.fields
 * @property {string} allMdx.nodes.fields.slug
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

export default ({ pageContext:{ langKey=`en` }={} }) =>
  <Layout title="Blog" langKey={langKey}>
    <h1 className="boxed-title is-green">Ostatnio dodane wpisy</h1>
    <section>
      {
        /** @type {QueryData} */ (useStaticQuery( query )).allMdx.nodes.map( ({ id, excerpt, frontmatter:{ tags, sneakPeek, ...fm}, fields }) =>
          <BlogpostEntry
            key={id}
            langKey={langKey}
            titleLinkAddress={`/post${fields.slug}`}
            frontmatter={fm}
            body={sneakPeek || excerpt}
          />
        )
      }
    </section>
  </Layout>