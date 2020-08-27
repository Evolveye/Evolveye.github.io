import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Post from "../components/post"

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

  console.log( tags, categories )

  return <Layout className="homepage">
    <section>
      <article>{categories}</article>
      <article>{tags}</article>
    </section>
    <section>
      {posts.map( ({ id, excerpt, frontmatter:{ tags, ...fm}, fields }) => <Post
        key={id}
        titleLinkAddress={`/post/${fields.slug}`}
        frontmatter={fm}
        body={excerpt}
        isEntry={true}
      /> )}
    </section>
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
        categories
        tags
      }
      fields {
        slug
      }
    }
  }
}`