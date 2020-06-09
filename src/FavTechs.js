import React from "react"

import logoOfJavascript from "./FavTechs/javascript.png"
import logoOfNodeJs from "./FavTechs/node.js.png"
import logoOfReact from "./FavTechs/react.png"
import logoOfJava from "./FavTechs/java.png"
import logoOfKotlin from "./FavTechs/kotlin.png"
import logoOfRust from "./FavTechs/rust.png"

import "./FavTechs/FavTechs.css"

export default class FavTechs extends React.Component {
  render = () => {
    const techs = []
    const createSubTech = (subTechName, logo) => <img
      key={subTechName}
      className="fav_techs-sub_tech fav_techs-logo"
      src={logo}
      alt={`Logo of ${subTechName}`}
    />

    let i = 0
    for (const prop in this.props) {
      const value = this.props[ prop ]
      const subTechs = []
      let logo

      switch (prop.toLowerCase()) {
        case `javascript`:
          subTechs.push( createSubTech( `react`, logoOfReact ), createSubTech( `node.js`, logoOfNodeJs ) )
          logo = logoOfJavascript
          break

        case `java`:
          subTechs.push( createSubTech( `kotlin`, logoOfKotlin ) )
          logo = logoOfJava
          break

        case `rust`:
          logo = logoOfRust
          break

        default: continue
      }

      techs.push( <li key={prop} className="fav_techs-item" style={{ marginLeft:(i++ * 20) }}>
        <div className="fav_techs-logos" style={{ marginRight:(subTechs.length * 20 + 20) }}>
          <img className="fav_techs-tech fav_techs-logo" src={logo} alt={`Logo of ${prop}`}/>
          {subTechs.length ? <div className="fav_techs-sub_techs">{subTechs}</div> : null}
        </div>
        <h3 className="fav_techs-tech_name">{prop}</h3>
        {typeof value === "string" ? <p className="fav_techs-description">{value}</p> : null}
      </li> )
    }

    return <ul className="fav_techs">
      <h2 className="fav_techs-title">My favourite programming languages</h2>
      {techs}
    </ul>
  }
}