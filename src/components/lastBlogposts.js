import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Link from "./link"

import { BlogpostEntry } from "./post"

import styles from "./lastBlogposts.module.css"

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

const translation = {
  title: {
    pl: `Moje ostatnie wpisy`,
    en: `My recent entries`,
  }
}

export default ({ langKey }) => {
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

  const postsEntries = posts.map( ({ id, excerpt, frontmatter:{ tags, sneakPeek, ...fm }, fields }) =>
    <BlogpostEntry
      key={id}
      langKey={langKey}
      className={styles.entry}
      titleLinkAddress={`/post${fields.slug}`}
      frontmatter={fm}
      body={sneakPeek || excerpt}
    />
  )

  return <section className={styles.blogposts}>
    <h2 className={`boxed-title is-blue ${styles.sectionTitle}`}>{translation.title[ langKey ]}</h2>
    {langKey === `pl` ? postsEntries :
      <p className={styles.noEnglishEntries}>
        Oops. This content is exclusive for polish readers. If you wanna be one of them, just click <Link langKey="pl" to="/"> that link</Link>.
      </p>
    }
  </section>
}