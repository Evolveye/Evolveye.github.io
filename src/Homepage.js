import React from "react"

import DynamicBackground from "./DynamicBackground.js"
import EvolveyeAvatar from "./EvolveyeAvatar.js"
import FavTechs from "./FavTechs.js"
import Links from "./Links.js"

import "./Homepage.css"

export default () => <div className="homepage">
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
  <EvolveyeAvatar />
  <Links />
</div>