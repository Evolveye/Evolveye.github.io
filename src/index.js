import React from "react"
import ReactDOM from "react-dom"

import DynamicBackground from "./DynamicBackground.js"
import EvolveyeAvatar from "./EvolveyeAvatar.js"
import GithubRepos from "./GithubRepos.js"
import FavTechs from "./FavTechs.js"

import "./normalize.css"
import "./index.css"

ReactDOM.render(
  <React.StrictMode>
    <DynamicBackground />
    <div className="fav_techs-wrapper">
      <FavTechs
        JavaScript="because is simple and is everywhere"
        Java="because is awful and popular in job ofers"
        Rust="because is overthinked and fast"
      />
      <small  className="fav_techs-addition">
        Other technologies are not a problem.
        All of them are easy for me,
        but they are not intuitive as technologies above,
        or they are not giving me much fun.
      </small>
    </div>
    <GithubRepos />
    <EvolveyeAvatar />
  </React.StrictMode>,
  document.getElementById( `content` )
)
