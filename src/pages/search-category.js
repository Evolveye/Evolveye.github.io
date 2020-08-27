import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Post from "../components/post"

export default ({ data, pageContext }) => <Layout>
  Przeszukiwanie po kategorii {pageContext.category}: {data.allMdx.nodes.length}
  {
    data.allMdx.nodes.map( ({ id, excerpt, frontmatter, fields }) => <Post
      key={id}
      titleLinkAddress={`/post/${fields.slug}`}
      frontmatter={frontmatter}
      body={excerpt}
      isEntry={true}
    /> )
  }
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