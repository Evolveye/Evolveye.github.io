import React from "react"

import Layout from "../components/layout"
import Banner from "../components/banner"
import Projects from "../components/projects"
import LastBlogpostsEntries from "../components/lastBlogposts"

export default ({ pageContext:{ langKey=`en` }={} }) =>
  <Layout title={langKey === `pl` ? `Strona domowa` : `Homepage`} langKey={langKey}>
    <Banner langKey={langKey} />
    <Projects langKey={langKey} />
    <LastBlogpostsEntries langKey={langKey} />
  </Layout>