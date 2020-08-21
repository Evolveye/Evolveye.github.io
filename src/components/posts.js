import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

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

export function PostsEntries() {
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

  console.log( nodes )

  for (const { id, excerpt, frontmatter, fields } of nodes) {
    const { date, author, categories, title } = frontmatter

    console.log( fields )

    excerpts.push( <article key={id} className="posts_entries-entry">
      <article className="posts_entries-main">
        <h3 className="posts_entries-title"><Link to={fields.slug}>{title}</Link></h3>
        <div className="posts_entries-content">{excerpt}</div>
      </article>
      <aside className="posts_entries-aside" >
        <span className="posts_entries-author">{author}</span>
        <time className="posts_entries-date" dateTime={date}>{date.replace( /-/g, `.` )}</time>
        <span className="posts_entries-categories">{categories.split( /, /g ).join( `  •  ` )}</span>
      </aside>
    </article> )
  }

  return <section className="posts_entries">{excerpts}</section>
}