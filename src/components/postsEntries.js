import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import styles from "./posts.module.css"

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

export default () => {
  /** @type {PostData} */
  const postsData = useStaticQuery( graphql`query Posts {
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
  }` )

  const { nodes } = postsData.allMdx
  const excerpts = []

  for (const { id, excerpt, frontmatter, fields } of nodes) {
    const { date, author, categories, title } = frontmatter

    excerpts.push( <article key={id} className={styles.post}>
      <aside className={styles.meta} />
      <article className={styles.content}>
        <h3 className="h1"><Link to={fields.slug}>{title}</Link></h3>
        <aside className={`${styles.meta}`}>
          <span className={styles.author}>{author}</span>
          <time className={styles.date} dateTime={date}>{date.replace( /-/g, `.` )}</time>
          <article className={styles.categories}>
            {categories.split( /, /g ).map( category => <Link key={category} className={styles.category} to="/">{category}</Link> )}
          </article>
        </aside>
        <p>{excerpt}</p>
      </article>
      <aside className={styles.tableOfContent} />
    </article> )
  }

  return <section className="posts_entries">{excerpts}</section>
}