import React from "react"

import PostsEntries from "../components/postsEntries"

import Layout from "../components/layout"

import "./normalize.css"
import "./index.css"

export default () => <Layout className="homepage">
  <PostsEntries />
</Layout>