import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import styles from "./banner.module.css"

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
        fluid( maxWidth:500 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

export default () => {
  /** @type {QueryData} */
  const queryData = useStaticQuery( query )

  return <article className={styles.banner}>
    <div className={styles.wrapper}>
      <Img className={`neumorphizm-white ${styles.photo}`} fluid={queryData.photo.childImageSharp.fluid} />
      <section className={styles.about}>
        <h1 className={`h3 box ${styles.title}`}>Paweł Stolarski</h1>
        <div className={` ${styles.description}`}>
          <p>
            Jestem typem naukowca, programistą eksperymentatorem.<br />
            Lubię bawić się kodem i wiedzieć co, jak, i dlaczego działa.
          </p>
          <p>
            Jeśli czegoś związnego z oprogramowaniem potrzebuję, to zwyczajnie to robię.<br />
            Jeśli jest to wyzwanie, lub coś nowego -- tylko mnie to zachęca.
          </p>
        </div>
      </section>
    </div>
  </article>
}