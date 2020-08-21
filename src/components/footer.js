import React  from "react"
import { useStaticQuery, graphql } from "gatsby"

import styles from "./footer.module.css"

/**
 * @typedef {Object} QueryData
 * @property {Object} site
 * @property {Object} site.siteMetadata
 * @property {string} site.siteMetadata.author
 */

const query = graphql`
  query Footer {
    site {
      siteMetadata {
        author
      }
    }
  }
`
export default () => {
  /** @type {QueryData} */
  const dataFromQuery = useStaticQuery( query )
  const { author } = dataFromQuery.site.siteMetadata

  return <footer className={styles.footer}>
    <p className={styles.copyright}>
      Copyright {new Date().getFullYear()} ©
      {` Evolveye • ${author} `}
      {/* <a href="https://www.gatsbyjs.org">Gatsby</a> */}
    </p>
  </footer>
}