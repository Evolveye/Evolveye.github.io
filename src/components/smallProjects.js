import React from "react"

import styles from "./smallProjects.module.css"

import LoadingBox from "./loadingBox"

export default class SimpleProjects  extends React.Component {
  state = {
    projects: []
  }

  componentDidMount() {
    import( `../small_projects/gif_creator/index.js` ).then( project => {
      this.setState( old => ({ projects:[ ...old.projects, project ] }) )
    } )
  }
  render = () => {
    const { langKey } = this.props
    const { projects } = this.state
    const iteratorLimit = projects.length < 3 ? 3 : projects.length
    const sections = {}
    const content = []
    const className = `neumorphizm ${styles.item}`

    for (let i = 1; i <= iteratorLimit; i++) {
      if (projects.length < i) content.push( <LoadingBox key={i} className={className} title /> )
      else {
        const { title, description } = projects[ i - 1 ]
        const section = `@default`

        if (!(section in sections)) sections[ section ] = []

        sections[ section ].push(
          <article className={className} key={title[ langKey ]}>
            <h3>{title[ langKey ]}</h3>
            <p>{description[ langKey ]}</p>
          </article>
        )
      }
    }

    console.log()

    return <section>
      <h2 className={`h2 boxed-title is-blue`}>
        {this.props.langKey === `pl` ? `Małe i proste różności` : `Small and trivial miscellaneous`}
      </h2>
      <div className={styles.wrapper}>
        {[ ...content, ...(sections[ `@default` ] || [])]}
      </div>
    </section>
  }
}