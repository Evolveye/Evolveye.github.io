import React from "react"
import Scp from "../components/scp"

import Layout from "../components/layout"

export default class ScpPage extends React.Component {
  state = {
    project: null
  }

  componentDidMount() {
    import( `../scp/gif_creator/index.js` ).then( project => {
      this.setState( ({ project }) )
    } )
  }

  render = () => {
    const { langKey, scp } = this.props.pageContext

    return <Layout title={scp} langKey={langKey}>
      <article style={{ minHeight:`500px` }}>
        {this.state.project && this.state.project.getComponent()}
      </article>
      <Scp langKey={langKey} />
    </Layout>
  }
}
