import React from "react"
import Scp from "../components/scp"

import Layout from "../components/layout"

import styles from "./scp.module.css"

export default class ScpPage extends React.Component {
  state = {
    project: null
  }

  componentDidMount() {
    import( `../scp/${this.props.pageContext.scp}/index.js` ).then( project => {
      this.setState( ({ project }) )
    } )
  }

  render = () => {
    const { langKey, scp } = this.props.pageContext

    return <Layout title={scp} langKey={langKey}>
      <article>
        <h1 className="boxed-title is-red">{langKey === `pl` ? `Projekt jednokomponentowy` : `Single component project`}</h1>
        <p style={{ textAlign:`center` }}>
          {
            langKey === `pl` ?
              `Projekty te mogą nie być dostosowane do ekranu na którym przeglądasz tę stronę`
            :
              `That project cannot be adjusted for the screen on wchich you are viewing this page`
          }
        </p>
        <div className={styles.wrapper}>
          {this.state.project && <this.state.project.Component canvasClass={styles.canvas} uiClass={styles.ui} />}
        </div>
      </article>
      <Scp langKey={langKey} />
    </Layout>
  }
}
