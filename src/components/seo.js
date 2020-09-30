import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

 /**
  * @typedef {Object} QueryData
  * @property {Object} site
  * @property {Object} site.siteMetadata
  * @property {string} site.siteMetadata.title
  * @property {string} site.siteMetadata.description
  * @property {string} site.siteMetadata.author
  */

const query = graphql`
  query Seo {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`

export default function Seo({ description, lang, meta, title }) {
  /** @type {QueryData} */
  const queryData = useStaticQuery( query )

  const { site } = queryData
  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat( meta )}
    />
  )
}

Seo.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}