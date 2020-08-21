import React from "react"

import SEO from "./seo"
import Header from "./header"
import Aside from "./aside"
import Footer from "./footer"

export default ({ children }) => <div className="homepage">
  <SEO title="Home" />
  <Header />
  <Aside />
  <main className="main">{children}</main>
  <Footer />
</div>