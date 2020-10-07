import React from "react"

import styles from "./scp.module.css"

import Link from "./link"

import * as scp_gifCreator from "../scp/gif_creator"
import * as scp_bresenham from "../scp/bresenham"

const scpPackage = [
  { name:`gif_creator`, scp:scp_gifCreator },
  { name:`bresenham`,   scp:scp_bresenham },
]

export default ({ langKey }) =>
  <section>
    <h2 className={`h2 boxed-title is-blue`}>
      {langKey === `pl` ? `Małe i proste różności` : `Small and trivial miscellaneous`}
    </h2>
    <div className={styles.wrapper}>
      {
        scpPackage.map( ({ name, scp:{ title, description } }) =>
          <article className={`neumorphizm ${styles.item} is-hoverable`} key={name}>
            <h3 className={styles.title}>
              <Link langKey={langKey} to={`/scp/${name}`}>{title[ langKey ]}</Link>
            </h3>
            <p>{description[ langKey ]}</p>
          </article>
        )
      }
    </div>
  </section>