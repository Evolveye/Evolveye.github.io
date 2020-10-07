import React from "react"

import styles from "./scp.module.css"

import Link from "./link"

import * as scp_gifCreator from "../scp/gif_creator"

const scpPackage = [
  scp_gifCreator
]

export default ({ langKey }) =>
  <section>
    <h2 className={`h2 boxed-title is-blue`}>
      {langKey === `pl` ? `Małe i proste różności` : `Small and trivial miscellaneous`}
    </h2>
    <div className={styles.wrapper}>
      {
        scpPackage.map( ({ title, description }) =>
          <article className={`neumorphizm ${styles.item} is-hoverable`} key={title[ langKey ]}>
            <h3 className={styles.title}>
              <Link langKey={langKey} to={`/scp/${title.en.replace( / /g, `_` ).toLowerCase()}`}>{title[ langKey ]}</Link>
            </h3>
            <p>{description[ langKey ]}</p>
          </article>
        )
      }
    </div>
  </section>