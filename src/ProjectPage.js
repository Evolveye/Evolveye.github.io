import React from "react"
import { Link } from "react-router-dom"

import "./ProjectPage.css"

export default class ProjectPage extends React.Component {
  constructor( props ) {
    super( props )

    // this.props.history.push()

    this.ref = React.createRef()
  }

  loadProject() {
    if (!(`importedProjectClasses` in window)) {
      window.importedProjectClasses = {}
      window.importedProjectInstance = null
    }

    const classes = window.importedProjectClasses
    const { href } = window.location

    if (window.importedProjectInstance) window.importedProjectInstance.destroy()
    if (href in classes) {
      try {
        window.importedProjectInstance = new classes[ href ]()
      } catch(err) {
        console.error( new Error( err ) )
      }
    } else {
      const src = window.location.hash.match( /project\/(.*)/ )[ 1 ]
      const script = document.createElement( `script` )

      script.type = `module`
      script.async = true
      script.src = src

      this.ref.current.appendChild( script )
    }
  }

  componentDidUpdate() {
    this.loadProject()
  }

  componentDidMount() {
    this.loadProject()
  }

  componentWillUnmount() {
    if (window.importedProjectInstance) window.importedProjectInstance.destroy()
  }

  render = () => <main className="project_page" ref={this.ref}>
    <Link className="project_page-homepage_link" to="/">
      &lt;- back to homepage -
    </Link>
    <p className="project_page-description" />
    <div className="project_page-controls" />
    <article id="project_wrapper" />
  </main>
}