import React from "react"

import DynamicBackground from "./DynamicBackground.js"
import EvolveyeAvatar from "./EvolveyeAvatar.js"
import FavTechs from "./FavTechs.js"
import Links from "./Links.js"

import "./Homepage.css"

export default () => <main className="homepage">
  <DynamicBackground />
  <article className="fav_techs-wrapper">
    <FavTechs
      JavaScript="because is simple and is everywhere"
      Java="because is popular and is create with specific logic"
      Rust="because is overthinked and fast"
    />
    <small  className="fav_techs-addition">
      Other technologies are not a problem.
      All of them are easy for me,
      but they are not intuitive as technologies above,
      or they are not giving me much fun.
    </small>
  </article>
  <EvolveyeAvatar />
  <Links />
</main>