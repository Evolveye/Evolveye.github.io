import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { BlogpostEntry } from "../components/post"
import Link from "../components/link"

import styles from "./search.module.css"

export default ({ data, pageContext:{ langKey=`en`, tag } }) =>
  <Layout title={`Tag ${tag}`} langKey={langKey}>
    <h1 className="boxed-title is-blue">{langKey === `pl` ? `Przeszukiwanie tagu` : `Searching the tag`}</h1>
    <section className={styles.searchPage}>
      <aside className={styles.empty} />
      <article className={styles.posts}>
        {
          data.allMdx.nodes.map( ({ id, excerpt, frontmatter, fields }) => <BlogpostEntry
            key={id}
            langKey={langKey}
            titleLinkAddress={`/post${fields.slug}`}
            frontmatter={frontmatter}
            body={excerpt}
          /> )
        }
      </article>
      <article className={styles.info}>
        <h2 className={styles.title}>{langKey === `pl` ? `O wynikach` : `About results`}</h2>
        <ul>
          <li>
            {langKey === `pl` ? `Przeszukiwany tag:` : `Search tag:`}
            {` `}
            <Link langKey={langKey} to={`/tag/${tag}`}>{tag}</Link>
          </li>
          <li>
            {langKey === `pl` ? `Ilość wyników:` : `Results count:`}
            {` `}
            {data.allMdx.nodes.length}
          </li>
        </ul>
      </article>
    </section>
  </Layout>

export const query = graphql`
  query PostsByTag( $tag:String! ) {
    allMdx(
      sort: { fields:frontmatter___date, order:DESC },
      filter:{ frontmatter:{
        published:{ eq:true },
        tags:{ in:[$tag] }
      } }
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
  }
`