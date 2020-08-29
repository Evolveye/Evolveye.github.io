import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Post from "../components/post"

import styles from "./index.module.css"

/**
 * @module
 * @param {Object} param0
 * @param {Object} param0.data
 * @param {Object} param0.data.allMdx
 * @param {Object[]} param0.data.allMdx.nodes
 * @param {string} param0.data.allMdx.nodes.id
 * @param {string} param0.data.allMdx.nodes.excerpt
 * @param {Object} param0.data.allMdx.nodes.frontmatter
 * @param {string} param0.data.allMdx.nodes.frontmatter.date
 * @param {string} param0.data.allMdx.nodes.frontmatter.title
 * @param {string} param0.data.allMdx.nodes.frontmatter.author
 * @param {string} param0.data.allMdx.nodes.frontmatter.categories
 * @param {string} param0.data.allMdx.nodes.frontmatter.tags
 * @param {Object} param0.data.allMdx.nodes.fields
 * @param {string} param0.data.allMdx.nodes.fields.slug
 */
export default ({ data }) => {
  const posts = data.allMdx.nodes
  const { tags, categories } = posts.reduce( (obj, { frontmatter:{ tags, categories } }) => {
    tags && tags.forEach( tag => obj.tags.add( tag ) )
    categories.forEach( category => obj.categories.add( category ) )

    return obj
  }, {
    tags: new Set(),
    categories: new Set()
  } )

  return <Layout className={styles.homepage}>
    <section className={styles.collections}>
      <article className={styles.collection}>
        <h2 className={styles.title}>Kategorie</h2>
        {[ ...categories ].map( category => <Link key={category}className={styles.item} to={`/category/${category}`}> {category}</Link> )}
      </article>
      <article className={styles.collection}>
        <h2 className={styles.title}>Tagi</h2>
        {[ ...tags ].map( tag => <Link key={tag} className={styles.item} to={`/tag/${tag}`}> {tag}</Link> )}
      </article>
    </section>
    <section className={styles.posts}>
      {posts.map( ({ id, excerpt, frontmatter:{ tags, sneakPeek, ...fm}, fields }) => <Post
        key={id}
        titleLinkAddress={`/post/${fields.slug}`}
        frontmatter={fm}
        body={sneakPeek || excerpt}
        isEntry={true}
      /> )}
    </section>
    <aside className={styles.empty} />
  </Layout>
}

export const query = graphql`query Posts {
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