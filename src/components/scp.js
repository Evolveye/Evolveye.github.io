import React from "react"

import styles from "./scp.module.css"

import Link from "./link"

import * as scp_gifCreator from "../scp/gif_creator"
import * as scp_bresenham from "../scp/bresenham"
import * as scp_quadtree from "../scp/quadtree"
import * as scp_quadtreeTemplate from "../scp/quadtree_template"

const scpPackage = [
  { name:`gif_creator`, scp:scp_gifCreator },
  { name:`bresenham`,   scp:scp_bresenham },
  { name:`quadtree`,    scp:scp_quadtree },
  { name:`quadtree_template`,   scp:scp_quadtreeTemplate },
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
              {/* <img className={styles.thumbnail} /> */}
              <Link langKey={langKey} to={`/scp/${name}`}>{title[ langKey ]}</Link>
            </h3>
            <p>{description[ langKey ]}</p>
          </article>
        )
      }
    </div>
  </section>