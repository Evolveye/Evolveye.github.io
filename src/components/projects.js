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
      en: `Cactu`,
    },
    fluidName: `cactu`,
    description: {
      pl: <>
        Rzeczy które tworzę lubię naznaczać konkretnym logiem -- <a href="https://codecactu.github.io/">marką Cactu</a>.
        Być moze kiedyś ktoś będzie chciał tworzyć razem ze mną pod wspólnym znakiem,
        więc sygnowanie projektów znakiem towarowym połączonym niejako z mym nazwiskiem uważam za stosowne.
        Dodatkowo logo zostało przygotowane tak, aby było łatwe do odwzorowania za pomocą grafiki wektorowej
        (bowiem zostało za pomocą niej przygotowane). Sprawia to, że naznaczanie nim tworów
        (przykłądowo porpzez wstawienie do stopki) jest proste, w przeciwieństwie do mojego, niewektorowego, avatara.
      </>,
      en: <>
        I like to mark a things I create with specific logo -- <a href="https://codecactu.github.io/">the Cactu brand</a>.
        Perhaps someday somebody will want to make something with me under common sign,
        so I consider signing the projects with a trademark connected with my name appropriate.
        In addition, the logo has been prepared so that it is easy to reproduce with vector graphics
        (it was made in that graphic). It makes marking creations with it (for example, by inserting into footer)
        very easy, unlike to my non-vector eye-like avatar.
      </>,
    }
  },
  {
    title: {
      pl:`Discordowy bot`,
      en: `Discord bot`,
    },
    fluidName: `discordBot`,
    description: {
      pl: <>
        Zaczęło się od założenia małej społeczności. Z czasem zainteresowałem się API dostarczanym przez
        platformę Discord. Tak powstał framework na bazie biblioteki <a href="https://discord.js.org/#/">discord.js</a>.
        Obecnie z pomocą tego bota automatyzuję wszystko co potrzebuję. Czy to mało ambitne odpowiedzi tekstem na tekst,
        czy to edycja grafiki lub odpytywanie zewnętrznych API.
      </>,
      en: <>
        All have been started from starting small community. Over time I became interested in the API provided by
        Discord platform. This is how the <a href="https://discord.js.org/#/">discord.js</a> based framework was created.
        Currently with the help of that bot I automate everything I need. From unambitious text-to-text responses,
        thought graphic editing, to querying external APIs.
      </>,
    }
  },
  {
    title: {
      pl: `Silnik grafiki trójwymiarowej`,
      en: `3D graphgic engine`,
    },
    fluidName: `webGl`,
    description: {
      pl: <>
        Nie lubię korzystać z bibliotek czy frameworków jeśli nie wiem co kryje się w ich wnętrzu.
        Co sprawia, że dzieje się to co się dzieje.
        Jako, że chciałem nauczyć się biblioteki <a href="https://threejs.org/">Three.js</a> przeznaczonej
        do rysowania rzeczy trójwymairowych, to nie dawał mi spokoju brak umiejętnosci samodzielnego rysowania w 3D.
        Postanowiłem więc w ramach rozgrzewki zrobić swój prymitywny silnik do wyświetlania kształtów 3D.
        Podobnie mam z innymi technologiami -- jeśli nie wiem jak działa, to mam wewnętrzną potrzebę się dowiedzieć.
      </>,
      en: <>
        I don't like to use libraries or framework if I don't know what is inside.
        What makes what is happening. As i wanted to learn <a href="https://threejs.org/">Three.js</a> library for
        drawing three-dimensional things, the lack of the ability to draw in 3D by myself bothered me.
        So, I decided to make my own primitive 3D engine as part of my warm-up.
        The same to others technologies -- if I don't know how it works, I have inner need to find out.
      </>,
    }
  },
  {
    title: {
      pl: `Ta strona`,
      en: `This website`,
    },
    fluidName: `avatar`,
    description: {
      pl: <>
        Programuję w zasadzie codziennie. Pomysłów mam wiele, chęci nauki jeszcze wiecej.
        Wiele małych dzieł przepadło z tej racji że nie miałem kiedys konta github,
        lub nie widziałem sensu we wrzucaniu nań projektów. W końcu do tego,
        że postanowiłem zrobić sobie stronę z której byłbym zadowolony, a na której mógłbym
        prowadzić swojego devloga. Więcej treści na temat strony to niczym treść o tutejszym blogu,
        o którym wiecej napisałem <a href="/">pod tym linkiem</a>.
      </>,
      en: <>
        I program basically everyday. I have many ideas, the willingness to learn even more.
        Many small works have been lost because I didn't have Github account, or saw no point
        to upload projects to it. Finally, I decided to make a website that I would be happy about,
        and where I could run my devlog (polish only, sorry; but maybe in the future...).
        If you know polish, you can look <a href="/">here</a>.
      </>,
    }
  },
]

export default ({ langKey }) => {
  /** @type {QueryData} */
  const queryData = useStaticQuery( query )

  return <section>
    <h2 className={`h2 boxed-title is-red`}>
      {langKey === `pl` ? `Projekty coś o mnie mówiące` : `Project that say something about me`}
    </h2>

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