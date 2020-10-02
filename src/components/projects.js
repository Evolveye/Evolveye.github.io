import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

import styles from "./projects.module.css"

 /**
 * @typedef {Object} QueryFlow
 * @property {Object} childImageSharp
 * @property {Object} childImageSharp.fluid
 */

/**
 * @typedef {Object} QueryData
 * @property {QueryFlow} cactu
 * @property {QueryFlow} discordBot
 * @property {QueryFlow} webGl
 * @property {QueryFlow} avatar
 */

const query = graphql`
  query Projects {
    cactu: file( relativePath:{ eq:"cactu.png" } ) {
      childImageSharp {
        fluid( maxWidth:300 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    discordBot: file( relativePath:{ eq:"discord_bot.png" } ) {
      childImageSharp {
        fluid( maxWidth:300 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    webGl: file( relativePath:{ eq:"webgl.png" } ) {
      childImageSharp {
        fluid( maxWidth:300 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    avatar: file( relativePath:{ eq:"evolveye_avatar.png" } ) {
      childImageSharp {
        fluid( maxWidth:300 ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

const projectsData = [
  {
    title: {
      pl: `Cactu`,
      en: `English`,
    },
    fluidName: `cactu`,
    description: {
      pl: <>
        Rzeczy które tworzę lubię naznaczać konkretnym logiem - <a href="https://codecactu.github.io/">marką Cactu</a>.
        Być moze kiedyś ktoś będzie chciał tworzyć razem ze mną pod wspólnym znakiem,
        więc sygnowanie projektów znakiem towarowym zamiast nazwiskiem uważam za stosowne.
        Dodatkowo logo zostało przygotowane tak, aby było łatwe do odwzorowania za pomocą grafiki wektorowej
        (bowiem zostało za pomocą niej przygotowane). Sprawia to, że naznaczanie nim tworów
        (przykłądowo porpzez wstawienie do stopki) jest proste, w przeciwieństwie do mojego, niewektorowego, avatara.
      </>,
      en: <>English</>,
    }
  },
  {
    title: {
      pl:`Bot discordowy`,
      en: `English`,
    },
    fluidName: `discordBot`,
    description: {
      pl: <>
        Zaczęło się od założenia małej społeczności. Z czasem zainteresowałem się API dostarczanym przez
        platformę Discord. Tak powstał framework na bazie biblioteki <a href="https://discord.js.org/#/">discord.js</a>.
        Obecnie z pomocą tego bota automatyzuję wszystko co potrzebuję. Czy to mało ambitne odpowiedzi tekstem na tekst,
        czy to edycja grafiki lub odpytywanie zewnętrznych API.
      </>,
      en: <>English</>,
    }
  },
  {
    title: {
      pl: `Silnik grafiki trójwymiarowej`,
      en: `English`,
    },
    fluidName: `webGl`,
    description: {
      pl: <>
        Nie lubię korzystać z bibliotek czy frameworków jeśli nie wiem co kryje się w ich wnętrzu.
        Co sprawia, że dzieje się to co się dzieje.
        Jako, że chciałem nauczyć się biblioteki <a href="https://threejs.org/">Three.js</a> przeznaczonej
        do tworzenia rysowania elementów trójwymairowych, to nie dawał mi spokoju brak umiejętnosci samodzielnego rysowania w 3D.
        Postanowiłem więc w ramach rozgrzewki zrobić swój prymitywny silnik do wyświetlania kształtów 3D.
        Podobnie mam z innymi technologiami -- jeśli nie wiem jak działa, to mam wewnętrzną potrzebę się dowiedzieć.
      </>,
      en: <>English</>,
    }
  },
  {
    title: {
      pl: `Ta strona`,
      en: `English`,
    },
    fluidName: `avatar`,
    description: {
      pl: <>
        Programuję w zasadzie codziennie. Pomysłów mam wiele, chęci nauki jeszcze wiecej.
        Wiele małych dzieł przepadło z tej racji że nie miałem kiedys konta github,
        lub nie widziałem sensu we wrzucaniu nań projektów. Doszło też w końcu do tego,
        że postanowiłem zrobić sobie stronę z której byłbym zadowolony, a na której mógłbym
        prowadzić swojego devloga. Więcej treści na temat strony to niczym treść o tutejszym blogu,
        o którym wiecej napisałem <a href="/">pod tym linkiem</a>
      </>,
      en: <>English</>,
    }
  },
]

export default ({ langKey }) => {
  /** @type {QueryData} */
  const queryData = useStaticQuery( query )

  return <section>
    <h2 className={`h2 boxed-title is-red`}>{langKey === `pl` ? `Wyróżniona aktywność` : `English`}</h2>

    <div className={styles.projectsWrapper}>
      {
        projectsData.map( ({ title, fluidName, description }) =>
          <article key={title[ langKey ]} className={styles.project}>
            <div className={`neumorphizm-white ${styles.projectIconWrapper}`}>
              <Img className={styles.projectIcon} fluid={queryData[ fluidName ].childImageSharp.fluid} />
            </div>

            <div className={styles.description}>
              <h3>{title[ langKey ]}</h3>
              <p>{description[ langKey ]}</p>
            </div>
          </article>
        )
      }
    </div>
  </section>
}