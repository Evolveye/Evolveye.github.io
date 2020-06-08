import React from "react"

import LoadingBox from "./LoadingBox.js"

export default class GithubRepos extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      loading: true,
    }
  }

  render() {
    let content = <s />

    if (this.state.loading) {
      content = <div>
        <LoadingBox title />
        <LoadingBox />
      </div>
    } else {
      content = <p>Załadowaned</p>
    }

    return content
  }
}