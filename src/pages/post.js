import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Post from "../components/post"

export default ({ data, pageContext }) => <Layout>
  <Post
    frontmatter={data.mdx.frontmatter}
    body={data.mdx.body}
    previous={pageContext.previous}
    next={pageContext.next}
  />
</Layout>

export const query = graphql`
  query PostsBySlug( $slug:String! ) {
    mdx( fields:{ slug:{ eq:$slug } } ) {
      body
      frontmatter {
        title
        author
        date( formatString:"DD-MM-YYYY" )
        categories
        tags
      }
    }
  }
`