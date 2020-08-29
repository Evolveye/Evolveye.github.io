import React from "react"

import SEO from "./seo"
import Header from "./header"
import Footer from "./footer"

import "./sanitize.css"
import styles from "./layout.module.css"

export default ({ className, children }) => <div className={styles.layout}>
  <SEO title="Home" />
  <Header />
  <main className={`${styles.main} ${className}`}>{children}</main>
  <Footer />
</div>