import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

import Link from "./link"

import styles from "./nav.module.css"

 /**
 * @typedef {Object} QueryFlow
 * @property {Object} childImageSharp
 * @property {Object} childImageSharp.fluid
 */

/**
 * @typedef {Object} QueryData
 * @property {QueryFlow} avatar
 */

const query = graphql`
  query Nav {
    avatar: file( relativePath:{ eq:"evolveye_avatar.png" } ) {
      childImageSharp {
        fluid( maxWidth:100 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    quote: file( relativePath:{ eq:"quote.png" } ) {
      childImageSharp {
        fluid( maxWidth:100 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    pl: file( relativePath:{ eq:"flag_pl.png" } ) {
      childImageSharp {
        fluid( maxWidth:100 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    en: file( relativePath:{ eq:"flag_en.png" } ) {
      childImageSharp {
        fluid( maxWidth:100 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

const projectsData = [
  {
    title: {
      pl: `Strona domowa`,
      en: `Homepage`,
    },
    fluidName: `avatar`,
    address: `/`,
  },
  {
    title: {
      pl: `Blog`,
      en: `Blog (polish only)`,
    },
    onlyLangKey: `pl`,
    fluidName: `quote`,
    address: `/blog/`,
  },
]

const languages = [
  {
    title: {
      en: `Homepage (polish)`,
    },
    onlyLangKey: `en`,
    fluidName: `pl`,
    lKey: `pl`
  },
  {
    title: {
      pl: `Strona domowa (angielska)`,
    },
    onlyLangKey: `pl`,
    fluidName: `en`,
    lKey: `en`
  },
]

export default ({ langKey, className }) => {
  /** @type {QueryData} */
  const queryData = useStaticQuery( query )

  return <nav className={`${className} ${styles.nav}`}>
    <ul className={styles.itemList}>
      {
        [ ...projectsData, ...languages ].map( ({ title, fluidName, address=`/`, lKey=langKey, onlyLangKey }) => onlyLangKey && onlyLangKey !== langKey ? null :
          <li key={fluidName} className={styles.item}>
            <Link langKey={lKey} className={`neumorphizm-white is-hoverable is-not-decorative ${styles.link}`} to={address}>
              <Img fluid={queryData[ fluidName ].childImageSharp.fluid} alt={`${title[ langKey ]} icon`} className={styles.icon} />
            </Link>
            <div className={styles.title}>{title[ langKey ]}</div>
          </li>
        )
      }
    </ul>
  </nav>
}