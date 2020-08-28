import React from "react"

import SEO from "./seo"
// import Aside from "./aside"
import Footer from "./footer"

import "./sanitize.css"
import styles from "./layout.module.css"

export default ({ className, children }) => <div className={styles.layout}>
  <SEO title="Home" />
  {/* <Aside /> */}
  <main className={`${styles.main} ${className}`}>{children}</main>
  <Footer />
</div>