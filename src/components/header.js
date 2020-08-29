import React from "react"
import { Link } from "gatsby"

import Avatar from "./avatar"

import styles from "./header.module.css"

export default () => <header className={styles.header}>
  <Link to="/" className="is-noDecorative"><Avatar className={styles.avatar}/></Link>
  <nav className={styles.nav}>
    <Link to="/" className={styles.link}>Dostępność (accessibility)</Link>
    <Link to="/" className={styles.link}>Polityka prywatności</Link>
    <Link to="/" className={styles.link}>O blogu</Link>
    <Link to="/" className={styles.link}>O autorze</Link>
  </nav>
  <aside className={styles.empty} />
</header>