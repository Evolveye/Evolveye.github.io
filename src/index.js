import React from "react"
import ReactDOM from "react-dom"
import { HashRouter as Router, Switch, Route } from "react-router-dom"

import Homepage from "./Homepage.js"
import GithubRepos from "./GithubRepos.js"
import ProjectPage from "./ProjectPage.js"

import "./normalize.css"
import "./index.css"

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <GithubRepos />
      <Switch>
        <Route exact path="/" component={Homepage}/>
        <Route apath="/project/:src" component={ProjectPage}/>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById( `content` )
)