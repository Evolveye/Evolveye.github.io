import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import { BlogpostEntry } from "../components/post"

import styles from "./search.module.css"

export default ({ data, pageContext:{ langKey, category } }) =>
  <Layout title={`Kategoria ${category}`} langKey={langKey}>
    <h1 className="boxed-title is-blue">Przeszukiwanie kategorii</h1>
    <section className={styles.searchPage}>
      <aside className={styles.empty} />
      <article className={styles.posts}>
        {
          data.allMdx.nodes.map( ({ id, excerpt, frontmatter, fields }) => <BlogpostEntry
            key={id}
            titleLinkAddress={`/post${fields.slug}`}
            frontmatter={frontmatter}
            body={excerpt}
          /> )
        }
      </article>
      <article className={styles.info}>
        <h2 className={styles.title}>O wynikach</h2>
        <ul>
          <li>Przeszukiwana kategoria: <Link to={`/category/${category}`}>{category}</Link></li>
          <li>Ilość wyników: {data.allMdx.nodes.length}</li>
        </ul>
      </article>
    </section>
  </Layout>

export const query = graphql`
  query PostsByCategory( $category:String! ) {
    allMdx(
      sort: { fields:frontmatter___date, order:DESC },
      filter:{ frontmatter:{ categories:{ in:[$category] } } }
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