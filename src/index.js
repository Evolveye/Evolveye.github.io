import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Homepage from "./Homepage.js"
import GithubRepos from "./GithubRepos.js"

import "./normalize.css"
import "./index.css"

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <GithubRepos />
      <Switch>
        <Route path="/" exact component={Homepage}/>
        {/* <Route path="/projects/:section/:projectName" component={Project}/> */}
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById( `content` )
)