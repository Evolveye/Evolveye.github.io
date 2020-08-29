import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Post from "../components/post"

import styles from "./search.module.css"

export default ({ data, pageContext }) => <Layout className={styles.searchPage}>
  <section className={styles.info}>
    <h2 className={styles.title}>O wynikach</h2>
    <ul>
      <li>Przeszukiwana kategoria: <Link to={`/category/${pageContext.category}`}>{pageContext.category}</Link></li>
      <li>Ilość wyników: {data.allMdx.nodes.length}</li>
    </ul>
  </section>
  <section className={styles.posts}>
    {
      data.allMdx.nodes.map( ({ id, excerpt, frontmatter, fields }) => <Post
        key={id}
        titleLinkAddress={`/post/${fields.slug}`}
        frontmatter={frontmatter}
        body={excerpt}
        isEntry={true}
      /> )
    }
  </section>
  <aside className={styles.empty} />
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