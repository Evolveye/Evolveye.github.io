import React from "react"

import SEO from "../components/seo"

import Header from "../components/header"
import Aside from "../components/aside"
import { PostsEntries } from "../components/posts"
import Footer from "../components/footer"

import "./normalize.css"
import "./index.css"

export default () => <div className="homepage">
  <SEO title="Home" />
  <Header />
  <Aside />
  <main className="main">
    <PostsEntries />
  </main>
  <Footer />
</div>