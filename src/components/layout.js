import React from "react"

import SEO from "./seo"
import Header from "./header"
import Aside from "./aside"
import Footer from "./footer"

import "./normalize.css"
import styles from "./layout.module.css"

export default ({ children }) => <div className={styles.layout}>
  <SEO title="Home" />
  <Header />
  <Aside />
  <main className={styles.main}>{children}</main>
  <Footer />
</div>