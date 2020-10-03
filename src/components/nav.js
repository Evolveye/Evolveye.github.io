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
    fluidName: `quote`,
    address: `/blog/`,
    polishOnly: true,
  },
]

export default ({ langKey, className }) => {
  /** @type {QueryData} */
  const queryData = useStaticQuery( query )

  return <nav className={`${className} ${styles.nav}`}>
    <ul className={styles.itemList}>
      {
        projectsData.map( ({ title, fluidName, address, polishOnly }) => polishOnly && langKey !== `pl` ? null : (
          <li key={title[ langKey ]} className={styles.item}>
            <Link langKey={langKey} to={address} className={`neumorphizm-white is-hoverable is-not-decorative ${styles.link}`}>
              <Img fluid={queryData[ fluidName ].childImageSharp.fluid} alt={`${title[ langKey ]} icon`} />
            </Link>
            <div className={styles.title}>{title[ langKey ]}</div>
          </li>
        ) )
      }
    </ul>
  </nav>
}