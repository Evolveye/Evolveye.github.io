import React from "react"
import { graphql, useStaticQuery } from "gatsby"

import styles from "./lastBlogposts.module.css"

import { BlogpostEntry } from "./post"

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

const query = graphql`query Posts {
  allMdx(
    sort: { fields:frontmatter___date, order:DESC },
    filter: { frontmatter:{ published:{ eq:true } } },
    limit: 4,
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
  // const { tags, categories } = posts.reduce( (obj, { frontmatter:{ tags, categories } }) => {
  //   tags && tags.forEach( tag => obj.tags.add( tag ) )
  //   categories.forEach( category => obj.categories.add( category ) )

  //   return obj
  // }, {
  //   tags: new Set(),
  //   categories: new Set()
  // } )

  return <section>
    <h2 className={`box ${styles.sectionTitle}`}>Moje ostatnie wpisy</h2>

    {
      posts.map( ({ id, excerpt, frontmatter:{ tags, sneakPeek, ...fm}, fields }) => <BlogpostEntry
        key={id}
        titleLinkAddress={`/post${fields.slug}`}
        frontmatter={fm}
        body={sneakPeek || excerpt}
      /> )
    }
  </section>
}