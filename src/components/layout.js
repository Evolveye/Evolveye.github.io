import React from "react"

import "./sanitize.css"
import styles from "./layout.module.css"

import Seo from "./seo"
import Nav from "./nav"
import Footer from "./footer"

const windowExist = typeof window !== `undefined`
const documentExist = typeof document !== `undefined`

export default class Layout extends React.Component {
  state = {
    theme: (windowExist && localStorage.getItem( `theme` ))
      || (windowExist && matchMedia( `(prefers-color-scheme: dark)` ).matches ? `dark` : `light`)
      || `light`
  }

  componentDidMount() {
    this.toggleTheme( this.state.theme === `dark` )
  }

  toggleTheme = isDarkTheme => {
    const theme = (isDarkTheme ? `dark` : `light`)

    if (windowExist) localStorage.setItem( `theme`, theme )
    if (documentExist) {
      if (theme === `dark`) {
        document.body.classList.add( `is-dark` )
        document.body.classList.remove( `is-light` )
      } else {
        document.body.classList.remove( `is-dark` )
        document.body.classList.add( `is-light` )
      }
    }

    this.setState( { theme } )
  }

  render = () =>
    <div className={styles.layout}>
      <Seo title={this.props.title} lang={this.props.langKey} />
      <Nav className={styles.nav} langKey={this.props.langKey} />
      <main className={`${styles.main} ${this.props.className || ``}`}>{this.props.children}</main>
      <Footer
        className={styles.footer}
        langKey={this.props.langKey}
        theme={this.state.theme}
        themeChanger={this.toggleTheme}
      />
    </div>
}