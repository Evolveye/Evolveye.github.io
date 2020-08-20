import React from "react"

import SEO from "../components/seo"

import MainHeader from "../components/main_header"
import Aside from "../components/aside"
import Content from "../components/content"
import Footer from "../components/footer"

import "./index.css"

export default () => <div className="homepage">
  <SEO title="Home" />
  <MainHeader />
  <Aside />
  <Content />
  <Footer />
</div>