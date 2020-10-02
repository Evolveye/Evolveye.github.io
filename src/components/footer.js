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

export default ({ langKey, theme, themeChanger }) => {
  /** @type {QueryData} */
  const dataFromQuery = useStaticQuery( queryForLightTheme )
  const { author } = dataFromQuery.site.siteMetadata

  const [ showMail, setMailVisibility ] = useState( false )
  const columns = []

  const classname = `neumorphizm-white ${styles.icon}`
  const links = [
    { name: `GitHub`,
      data: {
        fluid: `githubLogo`,
        links: [
          { address:`https://github.com/Evolveye`, name: langKey === `pl` ? `Profil` : `Profile` },
          { address:`https://github.com/Evolveye?tab=repositories`, name: langKey === `pl` ? `Repozytoria` : `Repositories` },
        ],
      },
    },
    { name: `LinkedIn`,
      data: {
        fluid: `linkedinLogo`,
        links: [
          { address:`https://github.com/Evolveye`, name: langKey === `pl` ? `Profil` : `Profile` }
        ],
      },
    },
    { name: `Mail`,
      type: `content`,
      data: {
        fluid: `envelopeIcon`,
        content: <>{
          showMail ?
            <span
              className={styles.text}
              style={{ unicodeBidi:`bidi-override`, direction:`rtl`, textAlign:`left` }}
            >
              moc.liamg@wap.iksralots
            </span>
          :
            <button className={`neumorphizm-white is-hoverable`} style={{ margin:0 }}onClick={() => setMailVisibility( true )}>
              {langKey === `pl` ? `Kliknij aby zobaczyć mail` : `Click to show the mail`}
            </button>
        }</>,
      }
    },
    { name: langKey === `pl` ? `Kliknij aby zmienić motyw strony` : `Click to change color theme`,
      type: `checkbox`,
      data: {
        checked: theme === `dark`,
        onChange: e => themeChanger( e.target.checked ),
      }
    },
  ]

  for (const { name, type=`links`, data } of links) {
    const anchors = []

    if (type === `links`) {
      const { fluid, links } = data

      links.forEach( ({ address, name }) => anchors.push( <li key={name}><a className={styles.link} href={address}>{name}</a></li> ) )

      columns.push(
        <div className={styles.column} key={name}>
          <div className={classname}>
            <Img fluid={dataFromQuery[ fluid ].childImageSharp.fluid} alt={name} />
          </div>
          <ul className={`ul ${styles.links}`}>
            {anchors}
          </ul>
        </div>
      )
    } else if (type === `content`) {
      const { fluid, content } = data

      columns.push(
        <div className={styles.column} key={name}>
          <div className={classname}>
            <Img fluid={dataFromQuery[ fluid ].childImageSharp.fluid} alt={name} />
          </div>
          <div className={styles.text}>
            {content}
          </div>
        </div>
      )
    } else if (type === `checkbox`) {
      const { checked, onChange } = data

      columns.push(
        <label className={styles.column} key={name}>
          <input type="checkbox" checked={checked} onChange={onChange} className={classname} />
          <div className={styles.text}>
            {name}
          </div>
        </label>
      )
    }
  }

  return <footer className={styles.footer}>
    <address className={styles.columns}>
      {columns}
    </address>

    <p className={styles.copyright}>
      Copyright {new Date().getFullYear()} © {` Evolveye • ${author} `}
    </p>
  </footer>
}