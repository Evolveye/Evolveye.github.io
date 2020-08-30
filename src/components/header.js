import React from "react"
import { Link } from "gatsby"

import Avatar from "./avatar"

import styles from "./header.module.css"


export default ({ themeChanger }) => {
  // const theme = localStorage.getItem( `theme` )

  return <header className={styles.header}>
    <h1 className={styles.title}>
      <Link to="/" className="is-noDecorative"><Avatar className={styles.avatar} /></Link>
    </h1>
    <nav className={styles.nav}>
      <Link to="/" className={styles.link}>O blogu</Link>
      <Link to="/" className={styles.link}>O autorze</Link>
      <Link to="/" className={styles.link}>Dostępność (accessibility)</Link>
      <Link to="/" className={styles.link}>Polityka prywatności</Link>
    </nav>
    <aside className={styles.aside}>
      {/* <label>
        <input type="checkbox" checked={theme === `dark`} onChange={e => themeChanger( e.target.checked )} />
        Ciemny motyw
      </label> */}
    </aside>
  </header>
}