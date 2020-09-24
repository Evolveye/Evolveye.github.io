import React from "react"
import { graphql, Link, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

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
  { title: `Strona domowa`,
    fluidName: `avatar`,
    address: `/`,
  },
  { title: `Blog`,
    fluidName: `quote`,
    address: `/blog/`,
  },
]

export default () => {
  /** @type {QueryData} */
  const queryData = useStaticQuery( query )

  return <nav className={styles.nav}>
    <ul className={styles.itemList}>
      {
        projectsData.map( ({ title, fluidName, address }) => (
          <li key={title} className={styles.item}>
            <Link to={address} className={`neumorphizm-white is-hoverable is-not-decorative ${styles.link}`}>
              <Img fluid={queryData[ fluidName ].childImageSharp.fluid} alt={`${title} icon`} />
            </Link>
            <div className={styles.title}>{title}</div>
          </li>
        ) )
      }
    </ul>
  </nav>
}