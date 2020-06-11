import React from "react"
import { Link } from "react-router-dom"

import "./ProjectPage.css"

export default class ProjectPage extends React.Component {
  constructor( props ) {
    super( props )

    this.src = this.props.location.search.split( `=` )[ 1 ]
    this.ref = React.createRef()
  }

  async componentDidMount() {
    this.src = `https://evolveye.github.io/random-codes/archive-useful/test2-evolveye.github.io/test.js`
    console.log( await React.lazy( () => import( `${this.src}` ) ) )
    // console.log( await React.lazy( () => import( `${"./module.js"}` ) ) )
    // console.log( `./module.js` )
    // const script = await fetch( this.src, { mode:`cors` } ).then( data => data.text() )
    // const scriptTag = document.createElement( `script` )

    // scriptTag.textContent = `window.projectPageModule = (function() {
    //   ${script};if(this.main===undefined)this.main=null;if(this.clear===undefined)this.clear=null;return{main,clear};
    // })()`

    // this.ref.current.appendChild( scriptTag )

    // if (typeof window.projectPageModule !== `object`) return
    // if (typeof window.projectPageModule.main === `function`) window.projectPageModule.main()
  }

  render() {

    return <div className="project_page" ref={this.ref}>
      <Link className="project_page-homepage_link" to="/">
        &lt;- back to homepage -
      </Link>
      <div id="project_wrapper" />
    </div>
  }
}