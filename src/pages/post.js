import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../components/layout"

export default ({ data }) => {
  const { frontmatter, body } = data.mdx

  return <Layout>
    <h1>{frontmatter.title}</h1>
    <p>{frontmatter.date}</p>
    <MDXRenderer>{body}</MDXRenderer>
  </Layout>
}

export const query = graphql`
  query PostsBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      frontmatter {
        title
        date(formatString: "YYYY MMMM Do")
      }
    }
  }
`