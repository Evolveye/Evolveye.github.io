import React from "react"
import ReactDOM from "react-dom"

import EvolveyeAvatar from "./EvolveyeAvatar.js"
import GithubRepos from "./GithubRepos.js"

import "./index.css"

ReactDOM.render(
  <React.StrictMode>
    <GithubRepos />
    <EvolveyeAvatar />
  </React.StrictMode>,
  document.getElementById( `content` )
)
