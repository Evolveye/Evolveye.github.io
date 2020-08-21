import React from "react"
import { Link } from "gatsby"

import Image from "./image"
import { PostsEntries } from "./posts"

import styles from "./content.module.css"

export default () => <>
  <h1>Hi people</h1>
  <p>Welcome to your new Gatsby site.</p>
  <p>Now go build something great.</p>
  <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
    <Image />
  </div>
  <PostsEntries />
  <Link to="/page-2/">Go to page 2</Link> <br/>
</>