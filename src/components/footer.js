import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import styles from "./footer.module.css"

 /**
 * @typedef {Object} QueryFlow
 * @property {Object} childImageSharp
 * @property {Object} childImageSharp.fluid
 */

/**
 * @typedef {Object} QueryData
 * @property {Object} site
 * @property {Object} site.siteMetadata
 * @property {string} site.siteMetadata.author
 * @property {QueryFlow} githubLogo
 * @property {QueryFlow} linkedinLogo
 * @property {QueryFlow} envelopeIcon
 */
const queryForLightTheme = graphql`
  query FooterDght {
    site {
      siteMetadata {
        author
      }
    }
    githubLogo: file( relativePath:{ eq:"logo-github.png" } ) {
      childImageSharp {
        fluid( maxWidth:32 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    linkedinLogo: file( relativePath:{ eq:"logo-linkedin.png" } ) {
      childImageSharp {
        fluid( maxWidth:32 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    envelopeIcon: file( relativePath:{ eq:"icon-mail.png" } ) {
      childImageSharp {
        fluid( maxWidth:32 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

export default () => {
  /** @type {QueryData} */
  const dataFromQuery = useStaticQuery( queryForLightTheme )
  const { author } = dataFromQuery.site.siteMetadata

  const [ showMail, setMailVisibility ] = useState( false )
  const columns = []
  const links = [
    { name: `GitHub`,
      fluid: dataFromQuery.githubLogo.childImageSharp.fluid,
      addresses: [
        { address:`https://github.com/Evolveye`, name:`Profile` },
        { address:`https://github.com/Evolveye?tab=repositories`, name:`Repositories` },
      ]
    },
    { name: `LinkedIn`,
      fluid: dataFromQuery.linkedinLogo.childImageSharp.fluid,
      addresses: [ { address:`https://github.com/Evolveye`, name:`Profile` }, ]
    },
  ]

  for (const { name, fluid, addresses } of links) {
    const anchors = []

    addresses.forEach( ({ address, name }) => anchors.push( <a key={name} className={styles.link} href={address}>{name}</a> ) )

    columns.push( <div className={styles.column} key={name}>
      <Img fluid={fluid} className={styles.logo} alt={name} />
      <div className={styles.links}>{anchors}</div>
    </div> )
  }

  return <footer className={styles.footer}>
    <div className={styles.columns}>
      {columns}
      <div className={styles.column}>
        <Img fluid={dataFromQuery.envelopeIcon.childImageSharp.fluid} className={styles.logo} />
        {
          showMail
          ? <span
              className={styles.text}
              style={{ unicodeBidi:`bidi-override`, direction:`rtl` }}
            >moc.liamg@wap.iksralots</span>
          : <button className={styles.text} onClick={() => setMailVisibility( true )}>Click to see mail</button>
        }
      </div>
    </div>
    <p className={styles.copyright}>
      Copyright {new Date().getFullYear()} ©
      {` Evolveye • ${author} `}
      {/* <a href="https://www.gatsbyjs.org">Gatsby</a> */}
    </p>
  </footer>
}