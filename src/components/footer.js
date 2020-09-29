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

export default ({ themeChanger }) => {
  /** @type {QueryData} */
  const dataFromQuery = useStaticQuery( queryForLightTheme )
  const { author } = dataFromQuery.site.siteMetadata

  const [ showMail, setMailVisibility ] = useState( false )
  const theme = localStorage.getItem( `theme` )
  const columns = []
  const links = [
    { name: `GitHub`,
      fluid: dataFromQuery.githubLogo.childImageSharp.fluid,
      addresses: [
        { address:`https://github.com/Evolveye`, name:`Profil` },
        { address:`https://github.com/Evolveye?tab=repositories`, name:`Repozytoria` },
      ]
    },
    { name: `LinkedIn`,
      fluid: dataFromQuery.linkedinLogo.childImageSharp.fluid,
      addresses: [ { address:`https://github.com/Evolveye`, name:`Profil` }, ]
    },
  ]

  for (const { name, fluid, addresses } of links) {
    const anchors = []

    addresses.forEach( ({ address, name }) => anchors.push( <li key={name}><a className={styles.link} href={address}>{name}</a></li> ) )

    columns.push( <div className={styles.column} key={name}>
      <div className={`neumorphizm-white ${styles.logo}`}><Img fluid={fluid} alt={name} /></div>
      <ul className={`ul ${styles.links}`}>{anchors}</ul>
    </div> )
  }

  return <footer className={styles.footer}>
    <div className={styles.columns}>
      {columns}
      <div className={styles.column}>
      <div className={`neumorphizm-white ${styles.logo}`}><Img fluid={dataFromQuery.envelopeIcon.childImageSharp.fluid} /></div>
        {
          showMail
          ? <span
              className={styles.text}
              style={{ unicodeBidi:`bidi-override`, direction:`rtl` }}
            >moc.liamg@wap.iksralots</span>
          : <div className={styles.text}>
              <button onClick={() => setMailVisibility( true )}>Kliknij aby zobaczyć mail</button>
            </div>
        }
      </div>
      {/* <div className={styles.column}>
        <label className={`${styles.text} ${styles.themeChanger}`}>
          <input type="checkbox" checked={theme === `dark`} onChange={e => themeChanger( e.target.checked )} />
          Ciemny motyw
        </label>
      </div> */}
    </div>
    <p className={styles.copyright}>
      Copyright {new Date().getFullYear()} ©
      {` Evolveye • ${author} `}
      {/* <a href="https://www.gatsbyjs.org">Gatsby</a> */}
    </p>
  </footer>
}