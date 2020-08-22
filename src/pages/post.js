import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Post from "../components/post"

export default ({ data }) => <Layout>
  <Post mdxData={data.mdx} />
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
      }
    }
  }
`