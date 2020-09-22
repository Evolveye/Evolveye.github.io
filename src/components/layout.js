import React from "react"

import ".//sanitize.css"
import styles from "./layout.module.css"

import SEO from "./seo"
import Header from "./header"
import Banner from "./banner"
import Projects from "./projects"
import Footer from "./footer"

export default class Layout extends React.Component {
  state = {
    theme: localStorage.getItem( `theme` ) === `dark` ? styles.isDark : ``,
  }

  changeTheme = isDark => {
    const theme = isDark ? `dark` : ``
    this.setState( { theme:(theme === `dark` ? styles.isDark : ``) } )

    localStorage.setItem( `theme`, theme )
  }

  render = () => <div className={`${styles.layout} ${this.state.theme}`}>
    <SEO title="Home" />
    {/* <Header /> */}
    <Banner />
    <Projects />
    <main className={`${styles.main} ${this.props.className}`}>{this.props.children}</main>
    <Footer themeChanger={this.changeTheme} />
  </div>
}