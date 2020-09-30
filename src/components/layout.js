import React from "react"

import "./sanitize.css"
import styles from "./layout.module.css"

import Seo from "./seo"
import Nav from "./nav"
import Footer from "./footer"

export default ({ className, children, title }) =>
  <div className={styles.layout}>
    <Seo title={title} />
    <Nav className={styles.nav} />
    <main className={`${styles.main} ${className}`}>{children}</main>
    <Footer className={styles.footer} />
  </div>