import React from "react"

import ".//sanitize.css"
import styles from "./layout.module.css"

import SEO from "./seo"
import Nav from "./nav"
import Footer from "./footer"

export default props => <div className={`${styles.page}`}>
    <SEO title="Home" />
    <Nav />
    <main className={`${styles.main} ${props.className}`}>{props.children}</main>
    <Footer />
  </div>