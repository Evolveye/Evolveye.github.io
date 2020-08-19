import React from "react"
import { useStaticQuery, graphql } from "gatsby"

/**
 * @typedef {Object} Node
 * @property {string} id
 * @property {string} excerpt
 * @property {Object} frontmatter
 * @property {string} frontmatter.title
 * @property {string} frontmatter.date
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
          date( formatString:"DD-MM-YYYY" )
        }
      }
    }
  }` )

  const { nodes } = postsData.allMdx
  const excerpts = []

  console.log( nodes )

  for (const { id, excerpt, frontmatter } of nodes) {
    const { date } = frontmatter

    excerpts.push( <article key={id}>
      <h3>{frontmatter.title}</h3>
      <time dateTime={date}>{date.replace( /-/g, `.` )}</time>
      <p>{excerpt}</p>
    </article> )
  }

  return <section>{excerpts}</section>
}