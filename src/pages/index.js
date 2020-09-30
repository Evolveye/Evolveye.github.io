import React from "react"

import Layuout from "../components/layout"
import Banner from "../components/banner"
import Projects from "../components/projects"
import LastBlogpostsEntries from "../components/lastBlogposts"

export default () =>
  <Layuout title="Homepage">
    <Banner />
    <Projects />
    <LastBlogpostsEntries />
  </Layuout>
