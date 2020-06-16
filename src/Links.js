import React from "react"

import logoOfGithub from "./Links/github.png"
import logoOfLinkedIn from "./Links/linkedin.png"
import iconOfMail from "./Links/mail.png"

import "./Links/Links.css"

export default class Links extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {}
    this.data = [
      { name: `GitHub`,
        logo: logoOfGithub,
        links: [
          { text:`Profile`, link:`https://github.com/Evolveye` },
          { text:`Repositiories`, link:`https://github.com/Evolveye?tab=repositories` },
        ],
      },
      { name: `LinkedIn`,
        logo: logoOfLinkedIn,
        links: [
          { text:`Profile (polish)`, link:`https://www.linkedin.com/in/paweł-stolarski/` },
        ],
      },
      { name: `Mail`,
        logo: iconOfMail,
        reversedMail: `moc.liamg@wap.iksralots`
      },
    ]

    for (const { reversedMail } of this.data) {
      if (reversedMail && !(reversedMail in this.state)) this.state[ reversedMail ] = false
    }

  }
  render = () => {
    const items = []

    for (const { name, logo, links, reversedMail } of this.data) {
      const linksItems = []

      if (links) {
        for (const { text, link } of links) {
          linksItems.push( <a key={link} className="links-link" href={link}>{text}</a> )
        }

        items.push( <div key={name} className="links-item">
          <img className="links-logo" src={logo} alt={`Logo of ${name}`} />
          <div className="links-wrapper">{linksItems}</div>
        </div> )
      } else if (reversedMail) {
        const showMail = () => this.setState( { [reversedMail]:true } )

        items.push( <div key={name} className="links-item">
          <img className="links-logo" src={logo} alt={`Logo of ${name}`} />
          <div className="links-wrapper">
            {
              this.state[ reversedMail ]
              ? <span
                  className="links-mail"
                  style={{ unicodeBidi:`bidi-override`, direction:`rtl` }}
                >{reversedMail}</span>
              : <button className="links-mail-button" onClick={showMail}>Click to see mail</button>
            }
          </div>
        </div> )
      }

    }

    return <article className="links">{items}</article>
  }
}