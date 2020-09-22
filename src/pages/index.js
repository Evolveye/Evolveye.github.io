import React from "react"

import"../components/sanitize.css"

import Banner from "../components/banner"
import Projects from "../components/projects"
import LastBlogpostsEntries from "../components/lastBlogposts"


export default () => {

  return <>
    <Banner />
    <Projects />
    <LastBlogpostsEntries />
  </>
}