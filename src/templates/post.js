import React from "react"
import { graphql } from "gatsby"

import Nav from "../components/nav"
import Footer from "../components/footer"
import Post from "../components/post"

export default ({ data, pageContext }) => <>
  {/* <Header /> */}
  <Nav />
  <Post
    frontmatter={data.mdx.frontmatter}
    body={data.mdx.body}
    previous={pageContext.previous}
    next={pageContext.next}
  />
  <Footer />
</>

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