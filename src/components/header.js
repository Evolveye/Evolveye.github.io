import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import styles from "./header.module.css"

 /**
 * @typedef {Object} QueryFlow
 * @property {Object} childImageSharp
 * @property {Object} childImageSharp.fluid
 */

/**
 * @typedef {Object} QueryData
 * @property {QueryFlow} photo
 */

const query = graphql`
  query Banner {
    photo: file( relativePath:{ eq:"photo.png" } ) {
      childImageSharp {
        fluid( maxWidth:400 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

const translation = {
  en: <>
    <p>
      I'm type of scientist, programmer experimenter.<br />
      I like to play with code and know what, how, and why it works.
    </p>
    <p>
      If I need something related to software, I just do it.<br />
      If is it a challenge or something new -- it only encourages me.
    </p>
  </>,
  pl: <>
    <p>
      Jestem typem naukowca, programistą eksperymentatorem.<br />
      Lubię bawić się kodem i wiedzieć co, jak, i dlaczego działa.
    </p>
    <p>
      Jeśli czegoś związnego z oprogramowaniem potrzebuję, to zwyczajnie to robię.<br />
      Jeśli jest to wyzwanie, lub coś nowego -- tylko mnie to zachęca.
    </p>
  </>,
}

export default ({ langKey }) => {
  /** @type {QueryData} */
  const queryData = useStaticQuery( query )

  return <header className={styles.banner}>
    <div className={styles.wrapper}>
      <Img className={`neumorphizm-white ${styles.photo}`} fluid={queryData.photo.childImageSharp.fluid} />

      <article className={styles.description}>
        <h1 className={`boxed-title is-green ${styles.title}`}>Paweł Stolarski</h1>

        <div className={styles.content}>
          {translation[ langKey ]}
        </div>
      </article>
    </div>
  </header>
}