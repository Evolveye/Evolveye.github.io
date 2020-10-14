import React from "react"

import Layout from "../components/layout"
import Header from "../components/header"
import Scp from "../components/scp"
import Projects from "../components/projects"
import LastBlogpostsEntries from "../components/lastBlogposts"

export default ({ pageContext:{ langKey=`en` }={} }) =>
  <Layout title={langKey === `pl` ? `Strona domowa` : `Homepage`} langKey={langKey}>
    <Header langKey={langKey} />
    <Scp langKey={langKey} />
    <Projects langKey={langKey} />
    <LastBlogpostsEntries langKey={langKey} />
  </Layout>