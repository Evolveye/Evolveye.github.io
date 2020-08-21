import React from "react"

import SEO from "../components/seo"

import MainHeader from "../components/main_header"
import Nav from "../components/nav"
import { PostsEntries } from "../components/posts"
import Footer from "../components/footer"

import "./normalize.css"
import "./index.css"

export default () => <div className="homepage">
  <SEO title="Home" />
  <MainHeader />
  <Nav />
  <main className="main">
    <PostsEntries />
  </main>
  <div className="empty" />
  <Footer />
</div>